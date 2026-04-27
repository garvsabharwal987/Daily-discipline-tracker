const VocabWord = require('../models/VocabWord');
const { getTodayDate } = require('../utils/helpers');

// @desc    Get words for a specific date
// @route   GET /api/vocab?date=YYYY-MM-DD
exports.getWords = async (req, res, next) => {
  try {
    const date = req.query.date || getTodayDate();
    const words = await VocabWord.find({ user: req.user._id, date })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: words.length, data: words });
  } catch (error) {
    next(error);
  }
};

// @desc    Get word history (paginated)
// @route   GET /api/vocab/history?page=1&limit=20
exports.getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const words = await VocabWord.find({ user: req.user._id })
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await VocabWord.countDocuments({ user: req.user._id });

    res.status(200).json({
      success: true,
      data: words,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new word
// @route   POST /api/vocab
exports.addWord = async (req, res, next) => {
  try {
    const { word, meaning, synonyms, antonyms, date } = req.body;

    if (!word || !meaning) {
      return res.status(400).json({ 
        success: false, 
        message: 'Word and meaning are required' 
      });
    }

    const wordDate = date || getTodayDate();

    const vocabWord = await VocabWord.create({
      user: req.user._id,
      date: wordDate,
      word,
      meaning,
      synonyms: synonyms || [],
      antonyms: antonyms || []
    });

    // Get updated count for the day
    const dayCount = await VocabWord.countDocuments({ 
      user: req.user._id, 
      date: wordDate 
    });

    res.status(201).json({ 
      success: true, 
      data: vocabWord,
      dayCount 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a word
// @route   PUT /api/vocab/:id
exports.updateWord = async (req, res, next) => {
  try {
    let word = await VocabWord.findById(req.params.id);

    if (!word) {
      return res.status(404).json({ success: false, message: 'Word not found' });
    }

    if (word.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    word = await VocabWord.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: word });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a word
// @route   DELETE /api/vocab/:id
exports.deleteWord = async (req, res, next) => {
  try {
    const word = await VocabWord.findById(req.params.id);

    if (!word) {
      return res.status(404).json({ success: false, message: 'Word not found' });
    }

    if (word.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await word.deleteOne();
    res.status(200).json({ success: true, message: 'Word deleted' });
  } catch (error) {
    next(error);
  }
};

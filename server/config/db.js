const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Try connecting to the configured MongoDB URI first
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/daily-discipline-tracker';
    
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.log('⚠️  Could not connect to MongoDB at', uri);
      console.log('📦 Starting in-memory MongoDB server...');
    }

    // Fallback to in-memory MongoDB
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const memUri = mongod.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}`);
    console.log('⚠️  Data will NOT persist after restart. Install MongoDB for persistence.');
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

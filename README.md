# Daily Discipline Tracker

A full-stack productivity web application that helps users plan, track, and improve their daily habits and tasks. Built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **📝 Daily Task Planner** — Create, manage, and track daily tasks with priorities and reminders
- **🔥 Streak System** — LeetCode-style streak tracking with a GitHub contribution heatmap
- **📚 Vocabulary Builder** — Learn 3 new English words daily with synonyms and antonyms
- **📖 Reading Tracker** — Log daily reading with article links and notes
- **📊 Performance Dashboard** — Charts and stats showing your progress over time
- **🌙 Dark Mode** — Beautiful dark/light theme support
- **🔔 Browser Notifications** — Reminders for your tasks
- **🔒 JWT Authentication** — Secure login/signup system

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v3, Recharts, Framer Motion |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT (httpOnly cookies + Bearer tokens) |

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone and Install

```bash
cd daily-discipline-tracker
npm run install-all
```

### 2. Configure Environment

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/daily-discipline-tracker
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d
NODE_ENV=development
```

For **MongoDB Atlas**, replace `MONGO_URI` with your connection string:
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/daily-discipline-tracker
```

### 3. Run Development Server

```bash
npm run dev
```

This starts both:
- Frontend at `http://localhost:5173`
- Backend at `http://localhost:5000`

## Project Structure

```
daily-discipline-tracker/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/   # UI components
│       ├── context/      # Auth & Theme contexts
│       ├── pages/        # Route pages
│       └── services/     # API client
├── server/          # Express backend
│   ├── config/      # DB connection
│   ├── controllers/ # Route handlers
│   ├── middleware/   # Auth & error handling
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API routes
│   └── utils/       # Helpers
└── package.json     # Root scripts
```

## API Endpoints

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/auth` | POST, GET | Register, Login, Logout, Me |
| `/api/tasks` | GET, POST, PUT, DELETE | Task CRUD by date |
| `/api/vocab` | GET, POST, PUT, DELETE | Vocabulary CRUD |
| `/api/reading` | GET, POST | Reading log |
| `/api/streaks` | GET, PUT | Streak data & stats |
| `/api/dashboard` | GET | Aggregated stats |

## License

MIT

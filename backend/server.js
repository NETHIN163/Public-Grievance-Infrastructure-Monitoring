const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDb } = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS — allow localhost (dev), Render, and Vercel domains (production)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'https://grievance-frontend-8jsg.onrender.com',
];
const allowedPatterns = [/\.vercel\.app$/];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., curl, Postman, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (allowedPatterns.some(pattern => pattern.test(origin))) return callback(null, true);
    return callback(new Error(`CORS policy: Origin ${origin} not allowed`));
  },
  credentials: true,
}));

// Body parser middleware
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Map routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'public-grievance-auth-service' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Initialize DB and start server
const startServer = async () => {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`Node Express Server successfully initialized.`);
      console.log(`Hosting Secure Gateway on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
};

// Only start the server when running directly (not when imported by Cloud Functions)
if (require.main === module) {
  startServer();
}

// Export the app for Firebase Cloud Functions (functions/index.js)
module.exports = app;

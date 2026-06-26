// api/index.js
// Vercel Serverless Function — wraps the Express backend.
// All /api/** requests from Vercel are routed here automatically.

const app = require('../backend/server');

module.exports = app;

// functions/index.js
// This file wraps the Express backend as a Firebase Cloud Function.
// All /api/** requests from Firebase Hosting are routed here.

const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// ─────────────────────────────────────────────────────────
// Load environment config from Firebase Functions config
// (set via: firebase functions:config:set ...)
// Falls back to process.env for local emulator use.
// ─────────────────────────────────────────────────────────
const getConfig = () => {
  try {
    const cfg = functions.config();
    return {
      DATABASE_URL: (cfg.db && cfg.db.url) || process.env.DATABASE_URL,
      JWT_SECRET:   (cfg.jwt && cfg.jwt.secret) || process.env.JWT_SECRET,
      SMTP_EMAIL:   (cfg.smtp && cfg.smtp.email) || process.env.SMTP_EMAIL,
      SMTP_PASSWORD:(cfg.smtp && cfg.smtp.password) || process.env.SMTP_PASSWORD,
      SMTP_SERVER:  (cfg.smtp && cfg.smtp.server) || process.env.SMTP_SERVER || "smtp.gmail.com",
      SMTP_PORT:    (cfg.smtp && cfg.smtp.port) || process.env.SMTP_PORT || 587,
    };
  } catch {
    // Running in emulator or locally — use process.env directly
    return {
      DATABASE_URL: process.env.DATABASE_URL,
      JWT_SECRET:   process.env.JWT_SECRET,
      SMTP_EMAIL:   process.env.SMTP_EMAIL,
      SMTP_PASSWORD:process.env.SMTP_PASSWORD,
      SMTP_SERVER:  process.env.SMTP_SERVER || "smtp.gmail.com",
      SMTP_PORT:    process.env.SMTP_PORT || 587,
    };
  }
};

// ─────────────────────────────────────────────────────────
// Import the Express app from the backend.
// server.js must export `app` (not call app.listen).
// ─────────────────────────────────────────────────────────
const app = require("../backend/server");

// ─────────────────────────────────────────────────────────
// Export as a Firebase HTTPS Cloud Function named "api".
// Firebase Hosting rewrites /api/** → this function.
// ─────────────────────────────────────────────────────────
exports.api = functions.https.onRequest(app);

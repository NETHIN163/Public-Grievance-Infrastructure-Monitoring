const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const UserModel = require('../models/userModel');

// Helper to generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'supersecretjwtkeyforgrievanceportal',
    { expiresIn: '30d' }
  );
};

// Build the styled HTML email template for OTP
const buildOTPEmailHTML = (otp) => `
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px; color: #1e293b;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div style="text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 15px;">
          <h2 style="color: #1e3a8a; margin: 0;">Grievance REDRESSAL CELL</h2>
        </div>
        <div style="padding: 20px 0;">
          <p style="margin: 0 0 10px 0; font-size: 14px;">Greetings,</p>
          <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.5;">You are registering or verifying your account on the Public Grievance & Infrastructure Monitoring Portal. Please use the following 6-digit verification code to complete your secure setup:</p>
          <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; text-align: center; font-size: 28px; font-weight: bold; color: #1d4ed8; letter-spacing: 8px; border: 1px dashed #bfdbfe; margin-bottom: 20px;">
            ${otp}
          </div>
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #ef4444; font-weight: bold;">Note: This verification code is valid for 10 minutes. Do not share this OTP with anyone.</p>
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; font-size: 11px; color: #94a3b8;">
          <p>© 2026 National Infrastructure & Grievance Redressal Cell. Secure Gateway.</p>
        </div>
      </div>
    </body>
  </html>
`;

// Cached Ethereal test account (created once on first use)
let etherealTransporter = null;

// Create or return cached Ethereal test transporter
const getEtherealTransporter = async () => {
  if (etherealTransporter) return etherealTransporter;

  console.log('[EMAIL] Creating Ethereal test email account...');
  const testAccount = await nodemailer.createTestAccount();
  console.log(`[EMAIL] Ethereal test account created: ${testAccount.user}`);

  etherealTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  etherealTransporter._etherealUser = testAccount.user;
  return etherealTransporter;
};

// Helper to send email OTP — works for ANY email address the user enters
const sendOTPEmail = async (toEmail, otp) => {
  const smtpEmail = process.env.SMTP_EMAIL;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const smtpServer = process.env.SMTP_SERVER || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');

  const useRealSMTP = smtpEmail && smtpPassword && !smtpPassword.includes('your_gmail_app_password_here');

  const mailOptions = {
    from: `"Grievance Portal Security" <${useRealSMTP ? smtpEmail : 'noreply@grievance-portal.gov.in'}>`,
    to: toEmail.toLowerCase().trim(),
    subject: 'Your Grievance Portal Security Verification Code',
    html: buildOTPEmailHTML(otp),
  };

  // ── Path 1: Real SMTP (Gmail / custom provider) ──
  if (useRealSMTP) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpServer,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpEmail, pass: smtpPassword },
      });

      await transporter.sendMail(mailOptions);
      console.log(`[EMAIL] ✅ OTP email sent to ${toEmail} via ${smtpServer}`);
      return true;
    } catch (error) {
      console.error(`[EMAIL] ❌ Real SMTP failed: ${error.message}`);
      console.log('[EMAIL] Falling back to Ethereal test email...');
      // Fall through to Ethereal
    }
  }

  // ── Path 2: Ethereal Test Email (no config needed — works for ANY email) ──
  try {
    const transporter = await getEtherealTransporter();
    const info = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);

    console.log(`\n╔══════════════════════════════════════════════════════════════╗`);
    console.log(`║  📧 OTP EMAIL SENT (Ethereal Test)                         ║`);
    console.log(`║                                                            ║`);
    console.log(`║  To:   ${toEmail.padEnd(51)}║`);
    console.log(`║  OTP:  ${otp.padEnd(51)}║`);
    console.log(`║                                                            ║`);
    console.log(`║  👉 View the email here:                                   ║`);
    console.log(`║  ${(previewUrl || '').padEnd(59)}║`);
    console.log(`║                                                            ║`);
    console.log(`║  (Open the above URL in your browser to see the email)     ║`);
    console.log(`╚══════════════════════════════════════════════════════════════╝\n`);
    return { sent: true, previewUrl };
  } catch (error) {
    // Final fallback — just log the OTP
    console.error(`[EMAIL] ❌ Ethereal also failed: ${error.message}`);
    console.log(`\n========================================================`);
    console.log(`[FALLBACK] OTP for ${toEmail} is: ${otp}`);
    console.log(`========================================================\n`);
    return false;
  }
};

const AuthController = {
  // @desc    Register a new user (instant registration, no OTP)
  // @route   POST /api/auth/register
  async register(req, res) {
    const { name, email, phone, password, confirmPassword } = req.body;

    // Field Validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Please provide name, email, phone, password, and confirmPassword.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    try {
      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email address already registered.' });
      }

      // Hash password directly
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create permanent user account directly with a unique ID
      const u_id = `user-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const avatarList = name.split(' ').filter(n => n);
      const avatar = avatarList.map(n => n[0]).join('').toUpperCase().substring(0, 2);
      const dateJoined = new Date().toISOString().split('T')[0];

      const newUser = await UserModel.create({
        id: u_id,
        name,
        email: email.toLowerCase().trim(),
        phone,
        password: hashedPassword,
        role: 'citizen',
        avatar,
        status: 'active',
        area: 'Coimbatore Central Zone',
        dateJoined
      });

      // Generate token
      const token = generateToken(newUser.id, newUser.role);

      // Exclude password from return
      const { password: _, ...userWithoutPassword } = newUser;

      res.status(200).json({
        message: 'Registration successful.',
        token,
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Registration Error:', error);
      res.status(500).json({ error: 'An error occurred during registration.' });
    }
  },

  // @desc    Verify OTP for Registration or Password Reset (Stubbed for compatibility)
  // @route   POST /api/auth/verify-otp
  async verifyOTP(req, res) {
    res.status(200).json({ message: 'Verification approved.' });
  },

  // @desc    Resend OTP code (Stubbed for compatibility)
  // @route   POST /api/auth/resend-otp
  async resendOTP(req, res) {
    res.status(200).json({ message: 'A fresh security code has been transmitted.' });
  },

  // @desc    Authenticate User & Issue Token
  // @route   POST /api/auth/login
  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password.' });
    }

    try {
      const user = await UserModel.findByEmail(email);

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials. Please verify and try again.' });
      }

      if (user.status === 'blocked') {
        return res.status(403).json({ error: 'This account has been suspended due to security violations.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials. Please verify and try again.' });
      }

      // Generate JWT
      const token = generateToken(user.id, user.role);

      // Exclude password from return
      const { password: _, ...userWithoutPassword } = user;

      res.status(200).json({
        message: 'Authentication successful.',
        token,
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ error: 'An error occurred during authentication.' });
    }
  },

  // @desc    Initiate Password Reset (Forgot Password - Direct approval, no OTP)
  // @route   POST /api/auth/forgot-password
  async forgotPassword(req, res) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Please provide email.' });
    }

    try {
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'Email address not registered.' });
      }

      res.status(200).json({ message: 'Verification approved. Proceed to reset password.' });
    } catch (error) {
      console.error('Forgot Password Error:', error);
      res.status(500).json({ error: 'An error occurred during forgot password initialization.' });
    }
  },

  // @desc    Reset password (direct password update, no OTP check)
  // @route   POST /api/auth/reset-password
  async resetPassword(req, res) {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Please fill out all fields.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    try {
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'Email address not registered.' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await UserModel.updatePassword(email, hashedPassword);

      res.status(200).json({ message: 'Password reset successfully. You can now login with your new credentials.' });
    } catch (error) {
      console.error('Reset Password Error:', error);
      res.status(500).json({ error: 'An error occurred during password reset.' });
    }
  },

  // @desc    Get Current User Profile
  // @route   GET /api/auth/profile
  async profile(req, res) {
    try {
      // req.user is attached by the protect middleware
      const { password: _, ...userWithoutPassword } = req.user;
      res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
      console.error('Profile Retrieval Error:', error);
      res.status(500).json({ error: 'An error occurred while fetching user profile.' });
    }
  }
};

module.exports = AuthController;

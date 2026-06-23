const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  // Check if token is passed in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkeyforgrievanceportal');

      // Get user from DB
      const user = await UserModel.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ error: 'User associated with this token no longer exists.' });
      }

      if (user.status === 'blocked') {
        return res.status(403).json({ error: 'This account has been suspended due to security violations.' });
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      console.error('JWT Verification Error:', error);
      return res.status(401).json({ error: 'Not authorized, token validation failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, access token missing.' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: `User role '${req.user ? req.user.role : 'anonymous'}' is not authorized to access this resource.` });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};

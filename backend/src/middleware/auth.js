
// backend/src/middleware/auth.js
const { verifyAccessToken } = require('../utils/jwt.js');
const User = require('../models/User.model.js');

/**
 * Main authentication middleware
 * Verifies JWT token and attaches user to request
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer '

    // Verify token
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (error) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: error.message
      });
    }

    // Get user from database
    const user = await User.findById(decoded.userId).select('+password');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'Please register or login again'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        error: 'Account disabled',
        message: 'Your account has been disabled. Contact support.'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(403).json({
        error: 'Account locked',
        message: 'Too many failed login attempts. Try again later.'
      });
    }

    // Check if pending approval
    if (user.role === 'pending_approval') {
      return res.status(403).json({
        error: 'Account pending approval',
        message: 'Your account is awaiting admin verification',
        status: 'pending_approval'
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      error: 'Server error',
      message: 'Authentication failed'
    });
  }
};

/**
 * Optional authentication
 * Attaches user if token is valid, but doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId);
    
    if (user && user.isActive) {
      req.user = user;
      req.userId = user._id;
      req.userRole = user.role;
    }
    
    next();
  } catch (error) {
    // Silently fail for optional auth
    next();
  }
};

/**
 * Require specific role(s)
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    next();
  };
};

/**
 * Require healthcare worker (doctor or nurse)
 */
const requireHealthcareWorker = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }

  if (!['doctor', 'nurse', 'admin'].includes(req.user.role)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Access denied. Healthcare worker access required.'
    });
  }

  next();
};

/**
 * Require patient role
 */
const requirePatient = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'patient') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Access denied. Patient access required.'
    });
  }

  next();
};

/**
 * Check if user can access patient data
 */
const canAccessPatient = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }

  const patientId = req.params.patientId || req.body.patientId;

  // Healthcare workers and admins can access any patient
  if (['doctor', 'nurse', 'admin'].includes(req.user.role)) {
    return next();
  }

  // Patients can only access their own data
  if (req.user.role === 'patient' && req.user._id.toString() === patientId) {
    return next();
  }

  return res.status(403).json({
    error: 'Forbidden',
    message: 'Access denied to this patient record'
  });
};

/**
 * Check if user can modify patient data
 */
const canModifyPatientData = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }

  // Only doctors and admins can modify patient data
  if (!['doctor', 'admin'].includes(req.user.role)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Only doctors can modify patient data'
    });
  }

  next();
};

/**
 * Require email verification
 */
const requireEmailVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }

  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      error: 'Email not verified',
      message: 'Please verify your email address to continue'
    });
  }

  next();
};

module.exports = {
  authenticate,
  optionalAuth,
  requireRole,
  requireHealthcareWorker,
  requirePatient,
  canAccessPatient,
  canModifyPatientData,
  requireEmailVerified
};
















const { errorResponse } = require('../utils/response');

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return errorResponse(res, 'Forbidden: insufficient permissions', 403);
  }

  next();
};

module.exports = authorizeRoles;

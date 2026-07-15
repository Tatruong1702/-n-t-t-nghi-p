const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/response');
const { secret } = require('../config/jwt');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Authentication token missing', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secret);
    const user = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });

    if (!user) {
      return errorResponse(res, 'User not found', 401);
    }

    req.user = user.toJSON();
    next();
  } catch (err) {
    return errorResponse(res, 'Invalid token', 401);
  }
};

module.exports = authMiddleware;

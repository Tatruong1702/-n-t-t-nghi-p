const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/response');
const { secret, expiresIn } = require('../config/jwt');

const generateToken = (user) => {
  return jwt.sign({ id: user.user_id, role: user.role }, secret, { expiresIn });
};

const register = async (req, res) => {
  try {
    const { username, name, email, password, phone, role, full_name, avatar } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return errorResponse(res, 'Email already registered', 400);

    const hashedPassword = await bcrypt.hash(password, 10);
    const generatedUsername = username || `${email.split('@')[0]}_${Date.now().toString().slice(-4)}`;
    const user = await User.create({
      username: generatedUsername,
      email,
      password: hashedPassword,
      full_name: full_name || name,
      phone,
      role: role || 'customer',
      avatar,
    });

    const token = generateToken(user);
    return successResponse(
      res,
      {
        user: {
          id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      },
      'User registered',
      201
    );
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return errorResponse(res, 'Invalid credentials', 401);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return errorResponse(res, 'Invalid credentials', 401);

    const token = generateToken(user);
    return successResponse(
      res,
      {
        user: {
          id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      },
      'Login successful'
    );
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return errorResponse(res, 'Email is required', 400);

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return successResponse(res, { message: 'If the email exists, a reset link has been sent.' }, 'Request processed');
    }

    return successResponse(
      res,
      { message: 'Nếu email tồn tại, chúng tôi đã gửi link đặt lại mật khẩu.' },
      'Password reset initiated'
    );
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const profile = async (req, res) => {
  if (!req.user) return errorResponse(res, 'Authentication required', 401);
  return successResponse(res, { user: req.user }, 'Profile retrieved');
};

module.exports = { register, login, profile, forgotPassword };

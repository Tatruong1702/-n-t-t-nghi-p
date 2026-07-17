const express = require('express');
const { getProfile, updateProfile, getAllUsers, createUser, updateUser, deleteUser, getAdminStats, getAdminDashboard } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/role.middleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/me', getProfile);
router.put('/me', updateProfile);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/stats', authorizeRoles('admin'), getAdminStats);
router.get('/dashboard', authorizeRoles('admin'), getAdminDashboard);
router.get('/', authorizeRoles('admin'), getAllUsers);
router.post('/', authorizeRoles('admin'), createUser);
router.put('/:id', authorizeRoles('admin'), updateUser);
router.delete('/:id', authorizeRoles('admin'), deleteUser);

module.exports = router;

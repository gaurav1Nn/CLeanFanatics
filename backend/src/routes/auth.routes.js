const express = require('express');
const router = express.Router();
const { login, getMe, getDemoUsers, getProviders } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware');

// Public routes
router.post('/login', login);
router.get('/users', getDemoUsers);

// Protected routes
router.get('/me', authenticate, getMe);
router.get('/providers', authenticate, getProviders);

module.exports = router;

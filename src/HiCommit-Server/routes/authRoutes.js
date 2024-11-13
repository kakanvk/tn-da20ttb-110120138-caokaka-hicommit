const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', authController.login);
router.post('/login_for_dev', authController.login_without_access_token);
router.get('/me', authMiddleware.authenticate, authController.me);
router.get('/logout', authController.logout);

module.exports = router;

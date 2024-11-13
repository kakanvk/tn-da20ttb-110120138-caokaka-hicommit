const express = require('express');
const router = express.Router();
const { createUser, getUserById, getUserProfileByUsername, toggleCourseFavourite } = require('../controllers/userController');
const { getRanking } = require('../controllers/analysis');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', createUser);
router.get('/analysis/leaderboard', getRanking);
router.get('/profile/:username', getUserProfileByUsername);
router.get('/:id', getUserById);
router.put('/favourite_course/:id', authMiddleware.authenticate, toggleCourseFavourite);

module.exports = router;

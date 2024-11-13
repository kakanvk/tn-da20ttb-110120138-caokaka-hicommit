const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const { getProblemsForAdmin, updateLevel, updateProblemForAdmin, checkAvailableLanguageChangeByProblemID } = require('../controllers/problemController');
const { getUsers, updateRole, updateStatus } = require('../controllers/userController');
const { getPostsForAdmin, getInActivePosts, togglePublish, activePost, updatePost, deletePostById } = require('../controllers/postController');
const { 
    createContest, 
    getContestsForAdmin, 
    getContestByIDForAdmin, 
    getContests, 
    getContestByID, 
    togglePublishContestByID, 
    togglePinnedContestByID, 
    updatePublicContestByID, 
    updateContestByID,
    updateProblemsByID,
    updateStatusUserContest,
    deleteContestByID,
    deleteProblemInContest
} = require('../controllers/contestController');

const { getAnalysis } = require('../controllers/analysis');

const {
    getCoursesForAdmin
} = require('../controllers/courseController');

// USERS
router.get('/users/list', authMiddleware.authenticate, authMiddleware.isAdmin, getUsers);

router.put('/users/:id/role', authMiddleware.authenticate, authMiddleware.isAdmin, updateRole);
router.put('/users/:id/status', authMiddleware.authenticate, authMiddleware.isAdmin, updateStatus);

// COURSES
router.get('/courses/list', authMiddleware.authenticate, authMiddleware.isAdmin, getCoursesForAdmin);

// POSTS
router.get('/posts/list', authMiddleware.authenticate, authMiddleware.isAdmin, getPostsForAdmin);
router.get('/posts/inactive', authMiddleware.authenticate, authMiddleware.isAdmin, getInActivePosts);
router.put('/posts/:id/publish', authMiddleware.authenticate, authMiddleware.isAdmin, togglePublish);
router.put('/posts/:id/active', authMiddleware.authenticate, authMiddleware.isAdmin, activePost);
router.put('/posts/:id/edit', authMiddleware.authenticate, authMiddleware.isAdmin, updatePost);
router.delete('/posts/:id', authMiddleware.authenticate, authMiddleware.isAdmin, deletePostById);

// PROBLEMS
router.get('/problems/list', authMiddleware.authenticate, authMiddleware.isAdmin, getProblemsForAdmin);
router.get('/problems/:id/check-language', authMiddleware.authenticate, checkAvailableLanguageChangeByProblemID);
router.put('/problems/:id/level', authMiddleware.authenticate, authMiddleware.isAdmin, updateLevel);
router.put('/problems/:id/update', authMiddleware.authenticate, authMiddleware.isAdmin, updateProblemForAdmin);

// CONTESTS
router.get('/contests/list', authMiddleware.authenticate, authMiddleware.isAdmin, getContestsForAdmin);
router.get('/contests/:id', authMiddleware.authenticate, authMiddleware.isAdmin, getContestByIDForAdmin);
router.post('/contests/create', authMiddleware.authenticate, authMiddleware.isAdmin, createContest);

// CONTESTS USERS
router.put('/contests/members/:id/status', authMiddleware.authenticate, authMiddleware.isAdmin, updateStatusUserContest);

router.put('/contests/:id/publish', authMiddleware.authenticate, authMiddleware.isAdmin, togglePublishContestByID);
router.put('/contests/:id/pinned', authMiddleware.authenticate, authMiddleware.isAdmin, togglePinnedContestByID);
router.put('/contests/:id/public', authMiddleware.authenticate, authMiddleware.isAdmin, updatePublicContestByID);
router.put('/contests/:id/problems', authMiddleware.authenticate, authMiddleware.isAdmin, updateProblemsByID);
router.put('/contests/:id/update', authMiddleware.authenticate, authMiddleware.isAdmin, updateContestByID);
router.delete('/contests/:id/problems/:problem_id', authMiddleware.authenticate, authMiddleware.isAdmin, deleteProblemInContest);
router.delete('/contests/:id/delete', authMiddleware.authenticate, authMiddleware.isAdmin, deleteContestByID);

// ANALYSIS
router.get('/analysis/overview', authMiddleware.authenticate, authMiddleware.isAdmin, getAnalysis);

module.exports = router;
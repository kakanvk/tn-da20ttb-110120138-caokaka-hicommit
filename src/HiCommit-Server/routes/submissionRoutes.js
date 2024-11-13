const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
    getMySubmissions,
    getSubmissionsByProblem,
    getMySubmissionsByProblem,
    getSubmissionById,
    getMySubmissionsResult,
    togglePublicCode
} = require('../controllers/submissionController');

router.get('/me', authMiddleware.authenticate, getMySubmissions);
router.get('/me/submited', authMiddleware.authenticate, getMySubmissionsResult);
router.get('/me/:problem_slug', authMiddleware.authenticate, getMySubmissionsByProblem);
router.get('/problem/:problem_slug', getSubmissionsByProblem);
router.get('/:id', getSubmissionById);

router.put('/:id/public', authMiddleware.authenticate, togglePublicCode);

module.exports = router;
const express = require('express');
const router = express.Router();
const { 
    createDiscussion, 
    getDiscussions, 
    getDiscussionById, 
    updateDiscussion,
    updateDiscussionStatus,
    deleteDiscussion 
} = require('../controllers/discussionController');

const {
    createComment,
    getCommentsByDiscussionID,
    toggleLikeComment,
    deleteComment,
    updateComment
} = require('../controllers/commentController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/p/:id/comments', authMiddleware.authenticate, createComment);
router.post('/:problem_slug', authMiddleware.authenticate, createDiscussion);

router.get('/p/:id/comments', authMiddleware.authenticate, getCommentsByDiscussionID);
router.get('/p/:id', authMiddleware.authenticate, getDiscussionById);
router.get('/:problem_slug', authMiddleware.authenticate, getDiscussions);

router.put('/comments/:comment_id/like', authMiddleware.authenticate, toggleLikeComment);
router.put('/comments/:comment_id', authMiddleware.authenticate, updateComment);
router.put('/:id/status', authMiddleware.authenticate, updateDiscussionStatus);
router.put('/:id', authMiddleware.authenticate, updateDiscussion);

router.delete('/comments/:id', authMiddleware.authenticate, deleteComment);
router.delete('/:id', authMiddleware.authenticate, deleteDiscussion);

module.exports = router;
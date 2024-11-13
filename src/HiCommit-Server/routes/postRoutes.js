
const express = require('express');
const router = express.Router();
const { createPost, getPosts, getPostByIdOrSlug, togglePostPublish, togglePostStatus, deletePostByIds, getPostByTag } = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const postMiddleware = require('../middleware/postMiddleware');

router.post('/create', authMiddleware.authenticate, createPost);
router.get('/list', getPosts);
router.get('/tag/:tag', getPostByTag);
router.get('/:id', getPostByIdOrSlug);
router.put('/edit.publish/:id', authMiddleware.authenticate, postMiddleware.isAuthor , togglePostPublish);
router.put('/edit.status/:id', authMiddleware.authenticate, postMiddleware.isAuthor , togglePostStatus);
router.delete('/destroy', authMiddleware.authenticate, postMiddleware.isAuthorOfPosts , deletePostByIds);

module.exports = router;
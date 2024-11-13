const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Post = require('../models/post');

// Middleware kiểm tra người dùng có phải là tác giả của bài viết không
exports.isAuthor = async (req, res, next) => {
    // Nếu là ADMIN thì không cần kiểm tra
    if (req.user.role === 'ADMIN') {
        return next();
    }

    try {
        // Tìm bài viết trong cơ sở dữ liệu bằng postId
        const post = await Post.findByPk(req.params.id);

        // Kiểm tra xem bài viết có tồn tại không
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Kiểm tra xem người dùng có phải là tác giả của bài viết không
        if (req.user.id !== post.created_by) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        next();
    } catch (error) {
        console.error('Error checking author:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Middleware kiểm tra người dùng có phải là tác giả của các bài viết trong mảng ids không
exports.isAuthorOfPosts = async (req, res, next) => {
    // Nếu là ADMIN thì không cần kiểm tra
    if (req.user.role === 'ADMIN') {
        return next();
    }

    try {
        // Tìm các bài viết trong cơ sở dữ liệu bằng ids
        const posts = await Post.findAll({ where: { id: req.body.ids } });

        // Kiểm tra xem các bài viết có tồn tại không
        if (!posts.length) {
            return res.status(404).json({ error: 'Posts not found' });
        }

        // Kiểm tra xem người dùng có phải là tác giả của các bài viết không
        for (let i = 0; i < posts.length; i++) {
            if (req.user.id !== posts[i].created_by) {
                return res.status(403).json({ error: 'Forbidden' });
            }
        }

        next();
    } catch (error) {
        console.error('Error checking author:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


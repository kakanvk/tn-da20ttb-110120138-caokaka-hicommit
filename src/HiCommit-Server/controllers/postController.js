
const Post = require('../models/post');
const User = require('../models/user');
const { fn, col, where, literal } = require('sequelize');

const createPost = async (req, res) => {
    try {
        const { title, description, content, thumbnail, tags } = req.body;

        const post = await Post.create({
            title,
            content,
            created_by: req.user.id,
            description,
            slug: req.body.slug || title.toLowerCase().replace(/ /g, '-'),
            thumbnail,
            tags: tags.map(tag => tag.trim())
        });

        res.status(201).json(post);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPosts = async (req, res) => {
    try {
        // Sử dụng include để join với bảng User
        const posts = await Post.findAll({
            where: {
                status: 'ACTIVE',
                publish: true
            },
            order: [['created_at', 'DESC']]
        });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPostByIdOrSlug = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (post) {
            res.status(200).json(post);
        } else {
            const post = await Post.findOne({ where: { slug: req.params.id } });
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'Post not found' });
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPostByTag = async (req, res) => {
    try {
        const tag = req.params.tag.trim(); // Lấy tag từ parameter và loại bỏ khoảng trắng thừa

        const posts = await Post.findAll({
            where: fn('JSON_CONTAINS', col('tags'), JSON.stringify(tag))
        });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Điều chỉnh Publish của bài viết
const togglePostPublish = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (post) {
            post.publish = !post.publish;
            await post.save();
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Toggle status ACTIVE/INACTIVE của bài viết
const togglePostStatus = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (post) {
            post.status = post.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
            await post.save();
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// delete post by ids
const deletePostByIds = async (req, res) => {
    try {
        const ids = req.body.ids;
        await Post.destroy({ where: { id: ids } });
        res.status(200).json({ message: 'Posts deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deletePostById = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (post) {
            await post.destroy();
            res.status(200).json({ message: 'Post deleted' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// [ADMIN]
const getPostsForAdmin = async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: {
                status: 'ACTIVE'
            },
            order: [['created_at', 'DESC']]
        });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getInActivePosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: {
                status: 'INACTIVE'
            },
            order: [['created_at', 'DESC']]
        });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const togglePublish = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (post) {
            post.publish = !post.publish;
            await post.save();
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const activePost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (post) {
            post.status = 'ACTIVE';
            await post.save();
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updatePost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (post) {
            const { title, description, content, thumbnail, tags } = req.body;
            post.title = title;
            post.description = description;
            post.content = content;
            post.thumbnail = thumbnail;
            post.tags = tags.map(tag => tag.trim());
            post.slug = req.body.slug || title.toLowerCase().replace(/ /g, '-');
            await post.save();
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createPost,
    getPosts,
    getPostByIdOrSlug,
    getPostByTag,
    togglePostPublish,
    togglePostStatus,
    deletePostByIds,
    deletePostById,
    getPostsForAdmin,
    getInActivePosts,
    togglePublish,
    activePost,
    updatePost
};
const Discussion = require('../models/discussion');
const User = require('../models/user');
const Problem = require('../models/problem');
const Comment = require('../models/comment');

const { getIO } = require('../socket');

const io = getIO();

// Comment(id, username, discussion_id, description, liked_by)

const createComment = async (req, res) => {
    const { id } = req.params;
    try {
        const { description } = req.body;

        const comment = await Comment.create({
            username: req.user.username,
            discussion_id: id,
            description: description
        });

        io.emit('updateComment', comment);

        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getCommentsByDiscussionID = async (req, res) => {
    const { id } = req.params;
    try {
        let comments = await Comment.findAll({
            where: { discussion_id: id },
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'username', 'avatar_url']
                }
            ],
            order: [['createdAt', 'ASC']]
        });

        comments.sort((a, b) => b.liked_by.length - a.liked_by.length);

        // Lấy thông tin user(id, username, avatar_url) trong liked_by
        for (const comment of comments) {
            const liked_avatar = [];
            for (const username of comment.liked_by) {
                const user = await User.findOne({ where: { username: username } });
                liked_avatar.push(user.avatar_url);
            }
            comment.dataValues.liked_avatar = liked_avatar;
        }

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const toggleLikeComment = async (req, res) => {
    const { comment_id } = req.params;
    try {
        const comment = await Comment.findByPk(comment_id);
        if (!comment) {
            return res.status(404).json({ error: 'Không tìm thấy bình luận này' });
        }

        let liked_by = comment.liked_by;

        if (liked_by.includes(req.user.username)) {
            liked_by = liked_by.filter(username => username !== req.user.username);
        } else {
            liked_by.push(req.user.username);
        }

        await comment.update({ liked_by: liked_by });

        io.emit('updateComment', comment);

        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateComment = async (req, res) => {
    const { comment_id } = req.params;
    try {
        const { description } = req.body;
        const comment = await Comment.findByPk(comment_id);
        if (!comment) {
            return res.status(404).json({ error: 'Không tìm thấy bình luận này' });
        }

        if (comment.username !== req.user.username) {
            return res.status(403).json({ error: 'Bạn không có quyền chỉnh sửa bình luận này' });
        }

        await comment.update({ description: description });

        io.emit('updateComment', comment);

        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteComment = async (req, res) => {
    const { id } = req.params;
    try {
        const comment = await Comment.findByPk(id);
        if (!comment) {
            return res.status(404).json({ error: 'Không tìm thấy bình luận này' });
        }

        await comment.destroy();

        io.emit('updateComment', comment);

        res.status(200).json({ message: 'Bình luận đã được xóa thành công' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createComment,
    getCommentsByDiscussionID,
    toggleLikeComment,
    updateComment,
    deleteComment
}
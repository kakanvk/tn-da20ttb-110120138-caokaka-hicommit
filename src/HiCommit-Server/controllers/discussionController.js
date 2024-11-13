const Discussion = require('../models/discussion');
const User = require('../models/user');
const Problem = require('../models/problem');
const Comment = require('../models/comment');
const { Sequelize } = require('sequelize');

const { getIO } = require('../socket');

const io = getIO();

const createDiscussion = async (req, res) => {
    const { problem_slug } = req.params;
    try {
        const { title, description } = req.body;

        const discussion = await Discussion.create({
            username: req.user.username,
            problem_slug,
            title,
            description
        });

        io.emit('newDiscussion', discussion);

        res.status(201).json(discussion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/*
{
    "title": "Làm thế nào để tối ưu hóa thuật toán?",
    "description": "Tôi đang gặp khó khăn trong việc tối ưu hóa thuật toán cho bài toán này. Có ai có gợi ý nào không?"
}
*/

const getDiscussions = async (req, res) => {
    const { problem_slug } = req.params;
    try {
        const discussions = await Discussion.findAll({
            order: [['createdAt', 'DESC']],
            where: { problem_slug },
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'username', 'avatar_url']
                }
            ]
        });

        // Lặp discussions và lấy ra số lượng comment của mỗi discussion 
        for (let i = 0; i < discussions.length; i++) {
            const discussion = discussions[i];
            const commentCount = await Comment.count({
                where: { discussion_id: discussion.id }
            });
            discussion.dataValues.comment_count = commentCount;
        }

        res.status(200).json(discussions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDiscussionById = async (req, res) => {
    try {
        const discussion = await Discussion.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'username', 'avatar_url']
                },
                {
                    model: Problem,
                    as: 'problem',
                    attributes: ['id', 'name', 'slug']
                }
            ]
        });

        if (discussion) {
            res.status(200).json(discussion);
        } else {
            res.status(404).json({ message: 'Không tìm thấy cuộc thảo luận' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateDiscussion = async (req, res) => {
    try {
        const { title, description } = req.body;
        const discussion = await Discussion.findByPk(req.params.id);

        if (discussion) {
            await discussion.update({ title, description });
            io.emit('updateDiscussion', discussion);
            res.status(200).json(discussion);
        } else {
            res.status(404).json({ message: 'Không tìm thấy cuộc thảo luận' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateDiscussionStatus = async (req, res) => {
    try {
        const discussion = await Discussion.findByPk(req.params.id);

        const newStatus = discussion.status === 'OPEN' ? 'CLOSED' : 'OPEN';

        if (discussion) {
            await discussion.update({ status: newStatus });
            io.emit('updateDiscussion', discussion);
            res.status(200).json(discussion);
        } else {
            res.status(404).json({ message: 'Không tìm thấy cuộc thảo luận' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteDiscussion = async (req, res) => {
    try {
        const discussion = await Discussion.findByPk(req.params.id);

        if (discussion) {
            await discussion.destroy();
            res.status(200).json({ message: 'Cuộc thảo luận đã được xóa' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy cuộc thảo luận' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createDiscussion,
    getDiscussions,
    getDiscussionById,
    updateDiscussion,
    updateDiscussionStatus,
    deleteDiscussion
};
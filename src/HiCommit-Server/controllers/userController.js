const User = require('../models/user');
const Submission = require('../models/submission');
const Problem = require('../models/problem');
const Post = require('../models/post');
const Course = require('../models/course');
const Contest = require('../models/contest');
const UserContest = require('../models/user_contest');
const { fn, col, where, literal, Op } = require('sequelize');
const sequelize = require('../configs/database');

// User(id, username, uid, email, role, status, avatar_url, favourite_post, favourite_course, favourite_problem, join_at)
// Post(id, title, created_by, description, content, slug, created_at, thumbnail, tags, publish, status)
// Course(id, created_by, name, description, class_name, join_key, slug, created_at, thumbnail, members, publish, units)
// UserContest(id, user_id, contest_id, status)
// Contest(id, created_by, name, description, start_time, end_time, duration, problems, publish, public, join_key, slug, pinned)

const createUser = async (req, res) => {
    try {
        const { username, uid, email, avatar_url } = req.body;
        const user = await User.create({ username, uid, email, avatar_url });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        users.forEach(user => {
            delete user.dataValues.uid;
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            delete user.dataValues.uid;
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserProfileByUsername = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { username: req.params.username },
            attributes: [
                'id',
                'username',
                'avatar_url',
                'email',
                'role',
                'createdAt',
                [
                    sequelize.literal(`(
                        SELECT COALESCE(SUM(
                            CASE 
                                WHEN EXISTS (
                                    SELECT 1 
                                    FROM Submissions s2 
                                    WHERE s2.problem_slug = p.slug 
                                    AND s2.username = User.username 
                                    AND s2.status = 'PASSED'
                                ) THEN p.score 
                                ELSE 0 
                            END
                        ), 0)
                        FROM Problems p
                        WHERE p.type = 'FREE'
                    )`),
                    'score'
                ],
                [
                    sequelize.literal(`(
                        SELECT GROUP_CONCAT(DISTINCT p.slug)
                        FROM Submissions s
                        JOIN Problems p ON s.problem_slug = p.slug
                        WHERE s.username = User.username 
                        AND s.status = 'PASSED'
                        AND p.type = 'FREE'
                    )`),
                    'completed_problems'
                ],
                [
                    sequelize.literal(`CAST((
                        SELECT COALESCE(
                            (SUM(CASE WHEN s.status = 'PASSED' THEN 1 ELSE 0 END) * 100.0) / 
                            NULLIF(COUNT(*), 0),
                            0
                        )
                        FROM Submissions s
                        JOIN Problems p ON s.problem_slug = p.slug
                        WHERE s.username = User.username 
                        AND p.type = 'FREE'
                    ) AS DECIMAL(10, 2))`),
                    'ac_rate'
                ],
            ]
        });

        // Lấy thông tin completed_problems(id, slug, name)
        if (user.dataValues.completed_problems) {
            const completedProblems = await Problem.findAll({
                where: {
                    slug: user.dataValues.completed_problems.split(',')
                },
                attributes: ['id', 'slug', 'name', 'level']
            });
            user.dataValues.completed_problems = completedProblems;
        }

        // Lấy ra các bài viết người dùng là author
        const posts = await Post.findAll({
            where: {
                created_by: user.id,
                status: 'ACTIVE',
                publish: true
            },
            attributes: ['id', 'title', 'createdAt', 'slug', 'thumbnail', 'description', 'tags']
        });
        user.dataValues.posts = posts;

        // Lấy ra các khoá học người dùng đã tham gia
        const courses = await Course.findAll({
            where: {
                created_by: user.id
            },
            attributes: ['id', 'name', 'createdAt', 'slug', 'thumbnail', 'class_name']
        });
        user.dataValues.courses = courses;

        // Lấy ra các cuộc thi người dùng đã tham gia dựa vào user_contest và contest
        const userContests = await UserContest.findAll({
            where: {
                user_id: user.id,
                status: 'ACTIVE'
            },
            include: [
                {
                    model: Contest,
                    attributes: ['id', 'name', 'start_time', 'end_time', 'duration', 'slug']
                }
            ]
        });
        user.dataValues.contests = userContests.map(uc => uc.Contest);

        if (user) {
            delete user.dataValues.uid;
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const toggleCourseFavourite = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (user) {
            let favourite_course = user.favourite_course || [];
            const index = favourite_course.indexOf(req.params.id);
            if (index === -1) {
                favourite_course.push(req.params.id);
            } else {
                favourite_course.splice(index, 1);
            }
            await user.update({ favourite_course });
            delete user.dataValues.uid;
            return res.status(200).json(user);
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateRole = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.update({ role: req.body.role });
            delete user.dataValues.uid;
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateStatus = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.update({ status: req.body.status });
            delete user.dataValues.uid;
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    getUserProfileByUsername,
    toggleCourseFavourite,
    updateRole,
    updateStatus
};

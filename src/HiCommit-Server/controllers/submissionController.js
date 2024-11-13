const Submission = require('../models/submission');
const Testcase = require('../models/testcase');
const Problem = require('../models/problem');
const User = require('../models/user');
const Course = require('../models/course');
const Unit = require('../models/unit');
const Contest = require('../models/contest');
const io = require('../server');

// Submission(id, problem_slug, user_id, sha, commit, run_id, code, status, duration, result, style_check, pass_count, total_count)
// Testcase(id, input, output, sugestion)
// Contest(id, created_by, name, description, start_time, end_time, duration, problems, publish, public, join_key, slug, pinned)

const getMySubmissions = async (req, res) => {
    try {
        const submissions = await Submission.findAll({
            where: {
                username: req.user.username
            },
            order: [['createdAt', 'DESC']]
        });

        io.emit('new_submission', submissions);

        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getSubmissionsByProblem = async (req, res) => {
    try {
        const submissions = await Submission.findAll({
            where: {
                problem_slug: req.params.problem_slug
            },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getMySubmissionsByProblem = async (req, res) => {
    try {
        const submissions = await Submission.findAll({
            where: {
                username: req.user.username,
                problem_slug: req.params.problem_slug
            },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const getSubmissionById = async (req, res) => {
    try {
        const submission = await Submission.findOne({
            where: {
                id: req.params.id
            }
        });

        // Lấy thông tin actor từ username
        const user = await User.findOne({
            where: {
                username: submission.username
            },
            attributes: ['id', 'username', 'avatar_url']
        });

        // Lấy ra thông tin problem từ problem_slug
        const problem = await Problem.findOne({
            where: {
                slug: submission.problem_slug
            }
        });

        // Tạo một bản sao đối tượng problem để thao tác
        let problemData = problem.toJSON();

        // Nếu là bài tập trong khóa học thì trả về thông tin khóa học và unit chứa bài tập này
        if (problem.type === 'COURSE') {
            const course = await Course.findByPk(problem.parent, {
                attributes: ['id', 'name', 'slug'],
            });

            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }

            problemData.parent = course;
        }

        problemData.testcase_count = problemData.testcases.length;

        // Xoá testcases để tránh lộ thông tin
        delete problemData.testcases;

        // Duyệt qua mảng result của submission để thêm thông tin testcase
        const testcases = [];
        for (let i = 0; i < submission.result.length; i++) {
            const testcase = await Testcase.findOne({
                where: {
                    id: submission.result[i].id
                }
            });

            testcases.push({
                id: testcase.id,
                input: testcase.input,
                output: testcase.output,
                suggestion: testcase.suggestion,
                status: submission.result[i].status,
                duration: submission.result[i].duration,
                actual_output: submission.result[i].actual_output
            });
        }

        submission.dataValues.problem = problemData;
        submission.dataValues.testcases = testcases;
        submission.dataValues.actor = user;

        res.status(200).json(submission);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Lấy danh sách các bài tập (slug) đã nộp của mình (theo username)
// Các Level Status: PASS > FAIL > ERROR > COMPILE_ERROR > PENDING
const getMySubmissionsResult = async (req, res) => {
    try {
        const submissions = await Submission.findAll({
            where: {
                username: req.user.username
            },
            order: [['createdAt', 'DESC']]
        });

        const statusPriority = {
            'PASSED': 4,
            'FAILED': 3,
            'ERROR': 2,
            'COMPILE_ERROR': 1,
            'PENDING': 0
        };

        const resultMap = {};

        submissions.forEach(submission => {
            const currentStatus = submission.status;
            const problemSlug = submission.problem_slug;

            if (!resultMap[problemSlug] || statusPriority[currentStatus] > statusPriority[resultMap[problemSlug]]) {
                resultMap[problemSlug] = currentStatus;
            }
        });

        res.status(200).json(resultMap);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const togglePublicCode = async (req, res) => {
    try {
        const submission = await Submission.findByPk(req.params.id);
        submission.public = !submission.public;
        await submission.save();
        res.status(200).json(submission);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getMySubmissions,
    getSubmissionsByProblem,
    getMySubmissionsByProblem,
    getSubmissionById,
    getMySubmissionsResult,
    togglePublicCode
};
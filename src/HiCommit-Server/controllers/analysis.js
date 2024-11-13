const User = require('../models/user');
const Course = require('../models/course');
const Problem = require('../models/problem');
const Submission = require('../models/submission');
const Contest = require('../models/contest');
const Unit = require('../models/unit');
const UserCourse = require('../models/user_course');
const Post = require('../models/post');
const { fn, col, where, literal, Op } = require('sequelize');
const sequelize = require('../configs/database');

// User(id, username, uid, email, role, status, avatar_url, favourite_post, favourite_course, favourite_problem, join_at)
// Problem(id, name, slug, tags, language, description, input, output, limit, examples, testcases, created_by, type, level, score, parent)
// Submission(id, user_id, problem_id, code, status, score, pass_count, total_count, created_at)
// Contest(id, name, slug, description, start_time, end_time, created_by, type, status, problems, posts, users)
// Post(id, title, slug, content, created_by, type, status, parent, comments, likes, tags)
// UNIT(id, course_id, name, children[])

const getAnalysis = async (req, res) => {
    try {

        const analysis = {
            '1_day': {
                users_count: 0,
                problems_count: 0,
                submissions_count: 0,
                posts_count: 0
            },
            '7_day': {
                users_count: 0,
                problems_count: 0,
                submissions_count: 0,
                posts_count: 0
            },
            '30_day': {
                users_count: 0,
                problems_count: 0,
                submissions_count: 0,
                posts_count: 0
            },
            'all_time': {
                users_count: 0,
                problems_count: 0,
                submissions_count: 0,
                posts_count: 0
            }
        };

        const users_count_all_time = await User.count();
        const problems_count_all_time = await Problem.count();
        const submissions_count_all_time = await Submission.count();
        const posts_count_all_time = await Post.count();

        analysis['all_time'] = {
            users_count: users_count_all_time,
            problems_count: problems_count_all_time,
            submissions_count: submissions_count_all_time,
            posts_count: posts_count_all_time
        };

        // Analysis 7 day ago
        const users_count_1_day = await User.count({
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
                }
            }
        });

        const problems_count_1_day = await Problem.count({
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
                }
            }
        });

        const submissions_count_1_day = await Submission.count({
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
                }
            }
        });

        const posts_count_1_day = await Post.count({
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
                }
            }
        });

        analysis['1_day'] = {
            users_count: users_count_1_day,
            problems_count: problems_count_1_day,
            submissions_count: submissions_count_1_day,
            posts_count: posts_count_1_day
        };

        // Analysis 7 day ago
        const users_count_7_day = await User.count({
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
                }
            }
        });

        const problems_count_7_day = await Problem.count({
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
                }
            }
        });

        const submissions_count_7_day = await Submission.count({
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
                }
            }
        });

        const posts_count_7_day = await Post.count({
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
                }
            }
        });

        analysis['7_day'] = {
            users_count: users_count_7_day,
            problems_count: problems_count_7_day,
            submissions_count: submissions_count_7_day,
            posts_count: posts_count_7_day
        };

        // Analysis 30 day ago
        const users_count_30_day = await User.count({
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
                }
            }
        });

        const problems_count_30_day = await Problem.count({
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
                }
            }
        });

        const submissions_count_30_day = await Submission.count({
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
                }
            }
        });

        const posts_count_30_day = await Post.count({
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
                }
            }
        });

        analysis['30_day'] = {
            users_count: users_count_30_day,
            problems_count: problems_count_30_day,
            submissions_count: submissions_count_30_day,
            posts_count: posts_count_30_day
        };

        // Đếm tổng các lượt nộp bài trên hệ thống theo status
        const submissions = await Submission.findAll();

        const submissions_analysis = {
            total: submissions.length,
            PASSED: submissions.filter(submission => submission.status === 'PASSED').length,
            FAILED: submissions.filter(submission => submission.status === 'FAILED').length,
            ERROR: submissions.filter(submission => submission.status === 'ERROR').length,
            COMPILE_ERROR: submissions.filter(submission => submission.status === 'COMPILE_ERROR').length,
        }

        analysis['submissions'] = submissions_analysis;

        res.status(200).json(analysis);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getRanking = async (req, res) => {
    // Dựa vào Problem, Submission, User để lấy ra ranking
    try {
        const ranking = await User.findAll({
            attributes: [
                'id',
                'username',
                'avatar_url',
                'role',
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
                // Tỉ lệ phần trăm lượt PASSED / Tổng số lượt nộp bài của user
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
                ]
            ],
            order: [[sequelize.literal('score'), 'DESC']]
        });
        res.status(200).json(ranking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy ra số lượt nộp bài theo 1 tháng
const countSubmissions60daysAgo = async (req, res) => {
    try {

        const problemId = req.params.id;
        const submissions = await Submission.findAll({
            where: {
                problem_slug: problemId
            },
            attributes: ['createdAt', 'status', 'username'],
            order: [[sequelize.col('createdAt'), 'ASC']]
        });

        const currentDate = new Date();
        const daysAgo = new Date(currentDate.getTime() - 59 * 24 * 60 * 60 * 1000);

        const formattedSubmissions = [];
        const formattedMySubmissions = [];

        for (let i = 0; i < 60; i++) {
            const date = new Date(daysAgo.getTime() + i * 24 * 60 * 60 * 1000);
            // Lưu tháng `day tháng month`
            const dateString = `${date.getDate()} thg ${date.getMonth() + 1}`;
            const submissionsCount = submissions.filter(submission => {
                const submissionDate = new Date(submission.createdAt);
                return `${submissionDate.getDate()} thg ${submissionDate.getMonth() + 1}` === dateString;
            }).length;

            const mySubmissionsCount = submissions.filter(submission => {
                const submissionDate = new Date(submission.createdAt);
                return `${submissionDate.getDate()} thg ${submissionDate.getMonth() + 1}` === dateString && submission.username === req.user.username;
            }).length;

            const passedCount = submissions.filter(submission => {
                const submissionDate = new Date(submission.createdAt);
                return `${submissionDate.getDate()} thg ${submissionDate.getMonth() + 1}` === dateString && submission.status === 'PASSED';
            }).length;

            const myPassedCount = submissions.filter(submission => {
                const submissionDate = new Date(submission.createdAt);
                return `${submissionDate.getDate()} thg ${submissionDate.getMonth() + 1}` === dateString && submission.status === 'PASSED' && submission.username === req.user.username;
            }).length;

            const failedCount = submissions.filter(submission => {
                const submissionDate = new Date(submission.createdAt);
                return `${submissionDate.getDate()} thg ${submissionDate.getMonth() + 1}` === dateString && submission.status === 'FAILED';
            }).length;

            const myFailedCount = submissions.filter(submission => {
                const submissionDate = new Date(submission.createdAt);
                return `${submissionDate.getDate()} thg ${submissionDate.getMonth() + 1}` === dateString && submission.status === 'FAILED' && submission.username === req.user.username;
            }).length;

            const errorCount = submissions.filter(submission => {
                const submissionDate = new Date(submission.createdAt);
                return `${submissionDate.getDate()} thg ${submissionDate.getMonth() + 1}` === dateString && submission.status === 'ERROR';
            }).length;

            const myErrorCount = submissions.filter(submission => {
                const submissionDate = new Date(submission.createdAt);
                return `${submissionDate.getDate()} thg ${submissionDate.getMonth() + 1}` === dateString && submission.status === 'ERROR' && submission.username === req.user.username;
            }).length;

            const compileErrorCount = submissions.filter(submission => {
                const submissionDate = new Date(submission.createdAt);
                return `${submissionDate.getDate()} thg ${submissionDate.getMonth() + 1}` === dateString && submission.status === 'COMPILE_ERROR';
            }).length;

            const myCompileErrorCount = submissions.filter(submission => {
                const submissionDate = new Date(submission.createdAt);
                return `${submissionDate.getDate()} thg ${submissionDate.getMonth() + 1}` === dateString && submission.status === 'COMPILE_ERROR' && submission.username === req.user.username;
            }).length;

            formattedSubmissions.push({ date: dateString, submissions: submissionsCount, PASSED: passedCount, FAILED: failedCount, ERROR: errorCount, COMPILE_ERROR: compileErrorCount });
            formattedMySubmissions.push({ date: dateString, submissions: mySubmissionsCount, PASSED: myPassedCount, FAILED: myFailedCount, ERROR: myErrorCount, COMPILE_ERROR: myCompileErrorCount });
        }

        const analysis = {
            all: formattedSubmissions,
            me: formattedMySubmissions
        };

        res.status(200).json(analysis);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCourseAnalysis = async (req, res) => {
    try {
        let course = await Course.findByPk(req.params.id, {
            attributes: ['id', 'name', 'slug', 'units']
        });

        if (!course) {
            course = await Course.findOne({
                where: { slug: req.params.id },
                attributes: ['id', 'name', 'slug', 'units']
            });
        }

        if (course) {
            const unitIds = course.units || [];
            const units = await Unit.findAll({
                where: {
                    id: unitIds
                },
                attributes: ['id', 'name', 'children', 'course_id']
            });

            // Sắp xếp units theo thứ tự trong course.units
            units.sort((a, b) => unitIds.indexOf(a.id) - unitIds.indexOf(b.id));

            let allProblems = [];

            // Duyệt qua các units, lấy ra các problem trong children
            for (let i = 0; i < units.length; i++) {
                const unit = units[i];
                const problemIds = unit.children || [];
                if (Array.isArray(problemIds) && problemIds.length > 0) {
                    const problems = await Problem.findAll({
                        where: {
                            id: problemIds,
                        },
                        attributes: ['id', 'name', 'slug', 'language', 'tags']
                    });

                    // Sắp xếp problems theo thứ tự trong unit.children
                    problems.sort((a, b) => problemIds.indexOf(a.id) - problemIds.indexOf(b.id));

                    // Bỏ đi problems.creator và thêm thông tin về unit
                    for (const problem of problems) {
                        if (problem && problem.dataValues) {
                            delete problem.dataValues.creator;
                            problem.dataValues.unit = {
                                id: unit.id,
                                name: unit.name
                            };

                            // Lấy số lượt nộp bài cho mỗi problem
                            const submissionCount = await Submission.count({
                                where: {
                                    problem_slug: problem.slug
                                }
                            });
                            problem.dataValues.submissionCount = submissionCount;

                            // // Tìm người nộp bài đầu tiên
                            // const firstSubmission = await Submission.findOne({
                            //     where: {
                            //         problem_slug: problem.slug
                            //     },
                            //     order: [['createdAt', 'ASC']],
                            //     attributes: ['username', 'createdAt', 'status']
                            // });

                            // if (firstSubmission) {
                            //     const firstUser = await User.findOne({
                            //         where: {
                            //             username: firstSubmission.username
                            //         },
                            //         attributes: ['username']
                            //     });
                            //     problem.dataValues.firstSubmission = {
                            //         username: firstUser ? firstUser.username : null,
                            //         createdAt: firstSubmission.createdAt,
                            //         status: firstSubmission.status
                            //     };
                            // } else {
                            //     problem.dataValues.firstSubmission = null;
                            // }

                            // Tìm người làm đúng đầu tiên
                            const firstPassedSubmission = await Submission.findOne({
                                where: {
                                    problem_slug: problem.slug,
                                    status: 'PASSED'
                                },
                                order: [['createdAt', 'ASC']],
                                attributes: ['username', 'createdAt']
                            });

                            if (firstPassedSubmission) {
                                const firstPassedUser = await User.findOne({
                                    where: {
                                        username: firstPassedSubmission.username
                                    },
                                    attributes: ['username']
                                });

                                // Đếm số lần nộp bài trước khi PASSED
                                const attemptsBeforePassed = await Submission.count({
                                    where: {
                                        problem_slug: problem.slug,
                                        username: firstPassedSubmission.username,
                                        createdAt: {
                                            [Op.lt]: firstPassedSubmission.createdAt
                                        }
                                    }
                                });

                                problem.dataValues.firstPassedSubmission = {
                                    username: firstPassedUser ? firstPassedUser.username : null,
                                    createdAt: firstPassedSubmission.createdAt,
                                    attempts: attemptsBeforePassed + 1 // Cộng thêm 1 cho lần PASSED
                                };

                            } else {
                                problem.dataValues.firstPassedSubmission = null;
                            }

                            // Đếm số lần nộp bài của toàn khoá học
                            const coursePassedSubmission = await Submission.findOne({
                                where: {
                                    problem_slug: problem.slug,
                                    status: 'PASSED'
                                },
                                order: [['createdAt', 'ASC']]
                            });

                            let courseAttemptsBeforePassed = 0;

                            if (coursePassedSubmission) {
                                courseAttemptsBeforePassed = await Submission.count({
                                    where: {
                                        problem_slug: problem.slug,
                                        createdAt: {
                                            [Op.lte]: coursePassedSubmission.createdAt
                                        }
                                    }
                                });
                            } else {
                                courseAttemptsBeforePassed = await Submission.count({
                                    where: {
                                        problem_slug: problem.slug,
                                    }
                                });
                            }

                            problem.dataValues.courseAttemptsBeforePassed = courseAttemptsBeforePassed;

                            // Đếm số lần nộp bài của người dùng hiện tại
                            const userPassedSubmission = await Submission.findOne({
                                where: {
                                    problem_slug: problem.slug,
                                    status: 'PASSED',
                                    username: req.user.username
                                },
                                order: [['createdAt', 'ASC']]
                            });

                            let userAttemptsBeforePassed = 0;

                            if (userPassedSubmission) {
                                userAttemptsBeforePassed = await Submission.count({
                                    where: {
                                        problem_slug: problem.slug,
                                        username: req.user.username,
                                        createdAt: {
                                            [Op.lte]: userPassedSubmission.createdAt
                                        }
                                    }
                                });
                            } else {
                                userAttemptsBeforePassed = await Submission.count({
                                    where: {
                                        problem_slug: problem.slug,
                                        username: req.user.username
                                    }
                                });
                            }

                            problem.dataValues.userAttemptsBeforePassed = userAttemptsBeforePassed;

                            allProblems.push(problem);
                        }
                    }
                }
            }

            // Thay thế units bằng mảng problems trong đối tượng course
            course.dataValues.problems = allProblems;
            delete course.dataValues.units;

            res.status(200).json(course);
        } else {
            res.status(404).json({ message: 'Không tìm thấy khóa học' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const analysisSubmissionOfCourse = async (req, res) => {
    try {
        let course = await Course.findByPk(req.params.id, {
            attributes: ['units']
        });

        if (!course) {
            course = await Course.findOne({
                where: { slug: req.params.id },
                attributes: ['units']
            });
        }

        if (course) {
            const unitIds = course.units || [];
            const units = await Unit.findAll({
                where: { id: unitIds },
                attributes: ['id', 'name', 'children']
            });

            units.sort((a, b) => unitIds.indexOf(a.id) - unitIds.indexOf(b.id));

            let allProblems = [];

            for (let i = 0; i < units.length; i++) {
                const unit = units[i];
                const problemIds = unit.children || [];
                if (Array.isArray(problemIds) && problemIds.length > 0) {
                    const problems = await Problem.findAll({
                        where: { id: problemIds },
                        attributes: ['id', 'name', 'slug']
                    });

                    problems.sort((a, b) => problemIds.indexOf(a.id) - problemIds.indexOf(b.id));

                    for (const problem of problems) {
                        if (problem && problem.dataValues) {
                            delete problem.dataValues.creator;

                            const currentDate = new Date();
                            const periods = [
                                { name: '1_days', days: 1 },
                                { name: '7_days', days: 7 },
                                { name: '28_days', days: 28 },
                                { name: '60_days', days: 60 },
                                { name: 'all_time', days: null }
                            ];

                            problem.dataValues.submissions = {
                                all_user: {},
                                only_me: {}
                            };

                            for (const period of periods) {
                                let whereClause = {
                                    problem_slug: problem.slug
                                };

                                if (period.days) {
                                    whereClause.createdAt = {
                                        [Op.gte]: new Date(currentDate - period.days * 24 * 60 * 60 * 1000)
                                    };
                                }

                                // Đếm cho tất cả người dùng
                                const allUserSubmissionCount = await Submission.count({ where: whereClause });
                                const allUserPassedSubmissionCount = await Submission.count({ where: { ...whereClause, status: 'PASSED' } });
                                const allUserFailedSubmissionCount = await Submission.count({ where: { ...whereClause, status: 'FAILED' } });
                                const allUserErrorSubmissionCount = await Submission.count({ where: { ...whereClause, status: 'ERROR' } });
                                const allUserCompileErrorSubmissionCount = await Submission.count({ where: { ...whereClause, status: 'COMPILE_ERROR' } });

                                problem.dataValues.submissions.all_user[period.name] = {
                                    total: allUserSubmissionCount,
                                    PASSED: allUserPassedSubmissionCount,
                                    FAILED: allUserFailedSubmissionCount,
                                    ERROR: allUserErrorSubmissionCount,
                                    COMPILE_ERROR: allUserCompileErrorSubmissionCount
                                };

                                // Đếm cho người dùng hiện tại
                                const onlyMeWhereClause = { ...whereClause, username: req.user.username };
                                const onlyMeSubmissionCount = await Submission.count({ where: onlyMeWhereClause });
                                const onlyMePassedSubmissionCount = await Submission.count({ where: { ...onlyMeWhereClause, status: 'PASSED' } });
                                const onlyMeFailedSubmissionCount = await Submission.count({ where: { ...onlyMeWhereClause, status: 'FAILED' } });
                                const onlyMeErrorSubmissionCount = await Submission.count({ where: { ...onlyMeWhereClause, status: 'ERROR' } });
                                const onlyMeCompileErrorSubmissionCount = await Submission.count({ where: { ...onlyMeWhereClause, status: 'COMPILE_ERROR' } });

                                problem.dataValues.submissions.only_me[period.name] = {
                                    total: onlyMeSubmissionCount,
                                    PASSED: onlyMePassedSubmissionCount,
                                    FAILED: onlyMeFailedSubmissionCount,
                                    ERROR: onlyMeErrorSubmissionCount,
                                    COMPILE_ERROR: onlyMeCompileErrorSubmissionCount
                                };
                            }

                            allProblems.push(problem);
                        }
                    }
                }
            }

            // Khởi tạo object mới để lưu trữ dữ liệu đã được trải phẳng
            const flattenedData = {
                all_user: {
                    '1_days': [],
                    '7_days': [],
                    '28_days': [],
                    '60_days': [],
                    'all_time': []
                },
                only_me: {
                    '1_days': [],
                    '7_days': [],
                    '28_days': [],
                    '60_days': [],
                    'all_time': []
                }
            };

            // Trải phẳng dữ liệu
            allProblems.forEach(problem => {
                ['all_user', 'only_me'].forEach(userType => {
                    Object.keys(problem.dataValues.submissions[userType]).forEach(period => {
                        flattenedData[userType][period].push({
                            id: problem.id,
                            name: problem.name,
                            slug: problem.slug,
                            ...problem.dataValues.submissions[userType][period]
                        });
                    });
                });
            });

            // Gửi dữ liệu đã được trải phẳng
            res.status(200).json(flattenedData);
        } else {
            res.status(404).json({ message: 'Không tìm thấy khóa học' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProblemAnalysisOfCourse = async (req, res) => {
    try {
        let course = await Course.findByPk(req.params.id, {
            attributes: ['id', 'name', 'slug', 'units']
        });

        if (!course) {
            course = await Course.findOne({
                where: { slug: req.params.id },
                attributes: ['id', 'name', 'slug', 'units']
            });
        }

        if (course) {
            const unitIds = course.units || [];
            const units = await Unit.findAll({
                where: {
                    id: unitIds
                },
                attributes: ['id', 'name', 'children', 'course_id']
            });

            // Sắp xếp units theo thứ tự trong course.units
            units.sort((a, b) => unitIds.indexOf(a.id) - unitIds.indexOf(b.id));

            let allProblems = [];

            // Duyệt qua các units, lấy ra các problem trong children
            for (let i = 0; i < units.length; i++) {
                const unit = units[i];
                const problemIds = unit.children || [];
                if (Array.isArray(problemIds) && problemIds.length > 0) {
                    const problems = await Problem.findAll({
                        where: {
                            id: problemIds,
                        },
                        attributes: ['id', 'name', 'slug', 'language', 'tags']
                    });

                    // Sắp xếp problems theo thứ tự trong unit.children
                    problems.sort((a, b) => problemIds.indexOf(a.id) - problemIds.indexOf(b.id));

                    // Bỏ đi problems.creator và thêm thông tin về unit
                    for (const problem of problems) {
                        if (problem && problem.dataValues) {
                            delete problem.dataValues.creator;
                            problem.dataValues.unit = {
                                id: unit.id,
                                name: unit.name
                            };

                            // Lấy số lượt nộp bài cho mỗi problem
                            const submissionCount = await Submission.count({
                                where: {
                                    problem_slug: problem.slug
                                }
                            });
                            problem.dataValues.submissionCount = submissionCount;

                            // Tìm người nộp bài đầu tiên
                            const firstSubmission = await Submission.findOne({
                                where: {
                                    problem_slug: problem.slug
                                },
                                order: [['createdAt', 'ASC']],
                                attributes: ['username', 'createdAt', 'status']
                            });

                            if (firstSubmission) {
                                const firstUser = await User.findOne({
                                    where: {
                                        username: firstSubmission.username
                                    },
                                    attributes: ['username', 'email', 'avatar_url']
                                });
                                problem.dataValues.firstSubmission = {
                                    username: firstUser ? firstUser.username : null,
                                    createdAt: firstSubmission.createdAt,
                                    status: firstSubmission.status,
                                    email: firstUser ? firstUser.email : null,
                                    avatar_url: firstUser ? firstUser.avatar_url : null,
                                };
                            } else {
                                problem.dataValues.firstSubmission = null;
                            }

                            // Tìm người làm đúng đầu tiên
                            const firstPassedSubmission = await Submission.findOne({
                                where: {
                                    problem_slug: problem.slug,
                                    status: 'PASSED'
                                },
                                order: [['createdAt', 'ASC']],
                                attributes: ['username', 'createdAt', 'status'],
                            });

                            if (firstPassedSubmission) {
                                const firstPassedUser = await User.findOne({
                                    where: {
                                        username: firstPassedSubmission.username
                                    },
                                    attributes: ['username', 'email', 'avatar_url']
                                });

                                // Đếm số lần nộp bài trước khi PASSED
                                const attemptsBeforePassed = await Submission.count({
                                    where: {
                                        problem_slug: problem.slug,
                                        username: firstPassedSubmission.username,
                                        createdAt: {
                                            [Op.lt]: firstPassedSubmission.createdAt
                                        }
                                    }
                                });

                                problem.dataValues.firstPassedSubmission = {
                                    username: firstPassedUser ? firstPassedUser.username : null,
                                    createdAt: firstPassedSubmission.createdAt,
                                    email: firstPassedUser ? firstPassedUser.email : null,
                                    avatar_url: firstPassedUser ? firstPassedUser.avatar_url : null,
                                    attempts: attemptsBeforePassed + 1 // Cộng thêm 1 cho lần PASSED
                                };

                            } else {
                                problem.dataValues.firstPassedSubmission = null;
                            }

                            // Đếm số lần nộp bài của toàn khoá học
                            const coursePassedSubmission = await Submission.findOne({
                                where: {
                                    problem_slug: problem.slug,
                                    status: 'PASSED'
                                },
                                order: [['createdAt', 'ASC']]
                            });

                            let courseAttemptsBeforePassed = 0;

                            if (coursePassedSubmission) {
                                courseAttemptsBeforePassed = await Submission.count({
                                    where: {
                                        problem_slug: problem.slug,
                                        createdAt: {
                                            [Op.lte]: coursePassedSubmission.createdAt
                                        }
                                    }
                                });
                            } else {
                                courseAttemptsBeforePassed = await Submission.count({
                                    where: {
                                        problem_slug: problem.slug,
                                    }
                                });
                            }

                            problem.dataValues.courseAttemptsBeforePassed = courseAttemptsBeforePassed;

                            // Lấy danh sách người dùng đã nộp bài và kết quả của họ
                            const submissions = await Submission.findAll({
                                where: {
                                    problem_slug: problem.slug
                                },
                                attributes: ['username', 'status', 'createdAt'],
                                order: [['createdAt', 'DESC']],
                                include: [{
                                    model: User,
                                    attributes: ['email', 'avatar_url'],
                                    required: false
                                }]
                            });

                            const userSubmissions = {};
                            for (const submission of submissions) {
                                if (!userSubmissions[submission.username]) {
                                    userSubmissions[submission.username] = {
                                        username: submission.username,
                                        email: submission.User ? submission.User.email : null,
                                        avatar_url: submission.User ? submission.User.avatar_url : null,
                                        lastSubmission: submission.createdAt,
                                        lastStatus: submission.status,
                                        submissions: 1
                                    };
                                } else {
                                    userSubmissions[submission.username].submissions++;
                                    if (submission.createdAt > userSubmissions[submission.username].lastSubmission) {
                                        userSubmissions[submission.username].lastSubmission = submission.createdAt;
                                        userSubmissions[submission.username].lastStatus = submission.status;
                                    }
                                }
                            }

                            problem.dataValues.userSubmissions = Object.values(userSubmissions);

                            allProblems.push(problem);
                        }
                    }
                }
            }

            // Thay thế units bằng mảng problems trong đối tượng course
            course.dataValues.problems = allProblems;
            delete course.dataValues.units;

            res.status(200).json(course);
        } else {
            res.status(404).json({ message: 'Không tìm thấy khóa học' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAnalysis,
    getRanking,
    countSubmissions60daysAgo,
    getCourseAnalysis,
    analysisSubmissionOfCourse,
    getProblemAnalysisOfCourse
};

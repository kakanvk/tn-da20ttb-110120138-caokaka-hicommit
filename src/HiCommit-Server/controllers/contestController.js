const User = require('../models/user');
const Contest = require('../models/contest');
const UserContest = require('../models/user_contest');
const Problem = require('../models/problem');
const Submission = require('../models/submission');

const { fn, col, where, literal } = require('sequelize');
const sequelize = require('../configs/database');
const e = require('express');

// User(id, username, uid, email, role, status, avatar_url, favourite_post, favourite_course, favourite_problem, join_at)
// Contest(id, created_by, name, description, start_time, end_time, duration, problems, publish, public, join_key, slug, pinned)
// UserContest(id, user_id, contest_id, status)
// Problem(id, name, slug, tags, language, description, input, output, limit, examples, testcases, created_by, type, level, score, parent)
// submission(id, problem_slug, user_id, sha, commit, run_id, code, status, duration, result, style_check, pass_count, total_count)

const getContests = async (req, res) => {
    try {
        const contests = await Contest.findAll({
            attributes: ['id', 'created_by', 'name', 'start_time', 'end_time', 'duration', 'public', 'join_key', 'slug', 'pinned', 'createdAt'],
            where: {
                publish: true
            },
            order: [
                ['pinned', 'DESC'],  // Sắp xếp theo 'pinned' trước
                ['createdAt', 'DESC'] // Sắp xếp theo thời gian tạo nếu cùng 'pinned'
            ]
        });

        const currentTimestamp = Math.floor(Date.now() / 1000); // Lấy thời gian hiện tại dưới dạng timestamp

        // Sắp xếp contests theo yêu cầu
        contests.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;

            const aInProgress = a.start_time < currentTimestamp && a.end_time > currentTimestamp;
            const bInProgress = b.start_time < currentTimestamp && b.end_time > currentTimestamp;

            if (aInProgress && !bInProgress) return -1;
            if (!aInProgress && bInProgress) return 1;

            const aUpcoming = a.start_time > currentTimestamp;
            const bUpcoming = b.start_time > currentTimestamp;

            if (aUpcoming && !bUpcoming) return -1;
            if (!aUpcoming && bUpcoming) return 1;

            return 0;
        });

        // Số người tham gia và thông tin người tạo
        for (let i = 0; i < contests.length; i++) {
            const contest = contests[i];
            const count = await UserContest.count({
                where: {
                    contest_id: contest.id
                }
            });
            const user = await User.findOne({
                where: {
                    id: contest.created_by
                },
                attributes: ['id', 'username', 'email', 'avatar_url', 'role']
            });
            contest.dataValues.members = count;
            contest.dataValues.creator = user;
        }

        return res.status(200).json(contests);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const getContestByID = async (req, res) => {
    try {
        const { id } = req.params;

        const contest = await Contest.findOne({
            where: {
                id
            },
            attributes: ['id', 'created_by', 'name', 'start_time', 'end_time', 'duration', 'public', 'join_key', 'slug', 'pinned', 'createdAt', 'problems']
        });

        if (!contest) {
            return res.status(404).json({
                message: 'Contest not found'
            });
        }

        // Lấy thông tin những người tham gia cùng với thông tin của họ
        const members = await UserContest.findAll({
            where: {
                contest_id: id
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'email', 'role']
                }
            ]
        });

        // Đưa thông tin user ra ngoài
        const membersWithUserInfo = members.map(member => {

            const user = {
                ...member.dataValues,
                user_id: member.User.id,
                username: member.User.username,
                email: member.User.email,
                role: member.User.role
            };

            delete user.User;

            return user;
        });

        // Lấy thông tin các bài tập trong cuộc thi
        const problems = [];
        for (let i = 0; i < contest.problems.length; i++) {
            const problem = await Problem.findOne({
                where: {
                    id: contest.problems[i]
                },
                attributes: ['id', 'name', 'slug', 'language', 'type', 'level', 'score'],
            });

            problems.push(problem);
        }

        // Thêm thông tin members vào contest
        contest.dataValues.members = membersWithUserInfo;
        contest.dataValues.problems = problems;

        return res.status(200).json(contest);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const getContestDescriptionByID = async (req, res) => {
    try {
        const { id } = req.params;

        const contest = await Contest.findOne({
            where: {
                id
            },
            attributes: ['description']
        });

        if (!contest) {
            return res.status(404).json({
                message: 'Contest not found'
            });
        }

        return res.status(200).json(contest.description);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const joinContest = async (req, res) => {
    try {
        const { id } = req.params;
        const { join_key } = req.body;

        const contest = await Contest.findOne({
            where: {
                id
            }
        });

        if (!contest) {
            return res.status(404).json({
                message: 'Contest not found'
            });
        };

        const userContests = await UserContest.findAll({
            where: {
                user_id: req.user.id,
                status: 'ACTIVE'
            }
        });

        const contests = [];

        for (let i = 0; i < userContests.length; i++) {
            const userContest = userContests[i];
            const contest = await Contest.findOne({
                where: {
                    id: userContest.contest_id,
                    publish: true
                },
                attributes: ['id', 'name', 'start_time', 'end_time', 'duration', 'public', 'slug']
            });

            // Nếu đang diễn ra cuộc thi thì trả về thông tin cuộc thi
            const currentTimestamp = Math.floor(Date.now() / 1000); // Lấy thời gian hiện tại dưới dạng timestamp

            if (contest.start_time < currentTimestamp && contest.end_time > currentTimestamp) {
                contests.push(contest);
            }
        }

        if (contests.length > 0) {
            return res.status(400).json({
                message: 'Bạn không thể tham gia nhiều cuộc thi cùng một lúc'
            });
        }

        // Nếu người dùng đã tham gia cuộc thi thì không thể tham gia lại
        const userContest = await UserContest.findOne({
            where: {
                user_id: req.user.id,
                contest_id: id
            }
        });

        if (userContest) {
            return res.status(400).json({
                message: 'Bạn chỉ có thể tham gia cuộc thi một lần duy nhất'
            });
        };

        if (!contest.public && contest.join_key !== join_key) {
            return res.status(400).json({
                message: 'Mã tham gia không chính xác'
            });
        };

        const userContestCreated = await UserContest.create({
            user_id: req.user.id,
            contest_id: id
        });

        return res.status(201).json(userContestCreated);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

// Lấy ra thông tin cuộc thi đang tham gia
const getJoinedContest = async (req, res) => {
    try {
        const userContests = await UserContest.findAll({
            where: {
                user_id: req.user.id,
                status: 'ACTIVE'
            }
        });

        const contests = [];

        for (let i = 0; i < userContests.length; i++) {
            const userContest = userContests[i];
            const contest = await Contest.findOne({
                where: {
                    id: userContest.contest_id,
                    publish: true
                },
                attributes: ['id', 'name', 'start_time', 'end_time', 'duration', 'public', 'slug']
            });

            // Nếu đang diễn ra cuộc thi thì trả về thông tin cuộc thi
            const currentTimestamp = Math.floor(Date.now() / 1000); // Lấy thời gian hiện tại dưới dạng timestamp

            if (contest.start_time < currentTimestamp && contest.end_time > currentTimestamp) {
                contests.push(contest);
            }
        }

        return res.status(200).json(contests[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const exitContest = async (req, res) => {
    try {
        const { id } = req.params;

        const userContest = await UserContest.findOne({
            where: {
                user_id: req.user.id,
                contest_id: id,
                status: 'ACTIVE'
            }
        });

        if (!userContest) {
            return res.status(404).json({
                message: 'User contest not found'
            });
        }

        // Cập nhật status thành "EXITED"
        await userContest.update({
            status: 'EXITED'
        });

        return res.status(200).json({
            message: 'Exit contest successfully'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const getSubmissionsByContestID = async (req, res) => {
    try {
        const contest = await Contest.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!contest) {
            return res.status(404).json({ error: 'Contest not found' });
        }

        const problems = await Problem.findAll({
            where: {
                id: contest.problems
            },
            attributes: ['slug', 'score']
        });

        const problemSlugs = problems.map(problem => problem.slug);

        const submissions = await Submission.findAll({
            where: {
                problem_slug: problemSlugs
            },
            order: [['createdAt', 'DESC']]
        });

        // Thêm score vào submission dựa vào problem_slug
        for (let i = 0; i < submissions.length; i++) {
            const submission = submissions[i];
            const problem = problems.find(problem => problem.slug === submission.problem_slug);
            submission.dataValues.score = problem.score;
            delete submission.dataValues.code;
            delete submission.dataValues.style_check;
            delete submission.dataValues.result;
            delete submission.dataValues.sha;
        }

        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getMembersByContestID = async (req, res) => {
    try {
        const { id } = req.params;

        const members = await UserContest.findAll({
            where: {
                contest_id: id
            },
            order: [
                ['createdAt', 'ASC']
            ],
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'email', 'role', 'avatar_url']
                }
            ]
        });

        // Đưa thông tin user ra ngoài
        const membersWithUserInfo = members.map(member => {

            const user = {
                ...member.dataValues,
                user_id: member.User.id,
                username: member.User.username,
                email: member.User.email,
                role: member.User.role,
                avatar_url: member.User.avatar_url
            };

            delete user.User;

            return user;
        }
        );

        return res.status(200).json(membersWithUserInfo);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

// ADMIN

const createContest = async (req, res) => {
    try {
        const { name, description, start_time, end_time, duration, public, join_key, slug } = req.body;

        const contest = await Contest.create({
            name,
            created_by: req.user.id,
            description,
            start_time,
            end_time,
            duration,
            public,
            join_key,
            slug
        });

        return res.status(201).json({
            contest
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message
        });
    }
}

const checkUserCanJoinContest = async (req, res, next) => {
    try {
        const { id } = req.params;

        const contest = await Contest.findOne({
            where: {
                id
            }
        });

        if (!contest) {
            return res.status(404).json({
                message: 'Contest not found'
            });
        }

        const currentTimestamp = Math.floor(Date.now() / 1000); // Lấy thời gian hiện tại dưới dạng timestamp

        if (contest.end_time < currentTimestamp) {
            return res.status(400).json({
                message: 'Contest has ended'
            });
        }

        if (contest.start_time > currentTimestamp) {
            return res.status(400).json({
                message: 'Contest has not started yet'
            });
        }

        const userContest = await UserContest.findOne({
            where: {
                user_id: req.user.id,
                contest_id: id
            }
        });

        if (userContest) {
            return res.status(400).json({
                message: 'User has already joined this contest'
            });
        }

        if (!contest.public && contest.join_key !== req.body.join_key) {
            return res.status(400).json({
                message: 'Invalid join key'
            });
        }

        const userContests = await UserContest.findAll({
            where: {
                user_id: req.user.id
            }
        });

        for (let i = 0; i < userContests.length; i++) {
            const userContest = userContests[i];
            const contest = await Contest.findOne({
                where: {
                    id: userContest.contest_id
                }
            });

            if (contest.start_time < currentTimestamp && contest.end_time > currentTimestamp) {
                return res.status(400).json({
                    message: 'User has already joined another contest'
                });
            }
        }

        return next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const getContestsForAdmin = async (req, res) => {
    try {
        const contests = await Contest.findAll({
            attributes: ['id', 'created_by', 'name', 'start_time', 'end_time', 'duration', 'publish', 'public', 'join_key', 'slug', 'pinned', 'createdAt'],
            // Các cuộc thi pinned sẽ được hiển thị đầu tiên
            order: [
                ['pinned', 'DESC'],
                ['createdAt', 'DESC']
            ]
        });

        const currentTimestamp = Math.floor(Date.now() / 1000); // Lấy thời gian hiện tại dưới dạng timestamp

        // Sắp xếp contests theo yêu cầu
        contests.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;

            const aInProgress = a.start_time < currentTimestamp && a.end_time > currentTimestamp;
            const bInProgress = b.start_time < currentTimestamp && b.end_time > currentTimestamp;

            if (aInProgress && !bInProgress) return -1;
            if (!aInProgress && bInProgress) return 1;

            const aUpcoming = a.start_time > currentTimestamp;
            const bUpcoming = b.start_time > currentTimestamp;

            if (aUpcoming && !bUpcoming) return -1;
            if (!aUpcoming && bUpcoming) return 1;

            return 0;
        });

        // Số người tham gia và thông tin người tạo
        for (let i = 0; i < contests.length; i++) {
            const contest = contests[i];
            const count = await UserContest.count({
                where: {
                    contest_id: contest.id
                }
            });
            const user = await User.findOne({
                where: {
                    id: contest.created_by
                },
                attributes: ['id', 'username', 'email', 'avatar_url', 'role']
            });
            contest.dataValues.members = count;
            contest.dataValues.creator = user;
        }

        return res.status(200).json(contests);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const getContestByIDForAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const contest = await Contest.findOne({
            where: {
                id
            }
        });

        if (!contest) {
            return res.status(404).json({
                message: 'Contest not found'
            });
        }

        // Lấy thông tin các bài tập trong cuộc thi
        const problems = [];
        for (let i = 0; i < contest.problems.length; i++) {
            const problem = await Problem.findOne({
                where: {
                    id: contest.problems[i]
                },
                attributes: ['id', 'name', 'slug', 'language', 'type', 'level', 'score'],
            });

            problems.push(problem);
        }

        contest.dataValues.problems = problems;

        return res.status(200).json(contest);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const getProblemsByContestID = async (req, res) => {
    try {
        const { id } = req.params;

        const contest = await Contest.findOne({
            where: {
                id
            }
        });

        if (!contest) {
            return res.status(404).json({
                message: 'Contest not found'
            });
        }

        // Duyệt qua contest.problems và lấy ra thông tin của các bài tập
        const problems = [];
        for (let i = 0; i < contest.problems.length; i++) {
            const problem = await Problem.findOne({
                where: {
                    id: contest.problems[i]
                },
                attributes: ['id', 'name', 'slug', 'language', 'type', 'level', 'score'],
            });

            problems.push(problem);
        }

        return res.status(200).json(problems);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const togglePublishContestByID = async (req, res) => {
    try {
        const { id } = req.params;

        const contest = await Contest.findOne({
            where: {
                id
            }
        });

        if (!contest) {
            return res.status(404).json({
                message: 'Contest not found'
            });
        }

        const updatedContest = await contest.update({
            publish: !contest.publish
        });

        return res.status(200).json({
            contest: updatedContest
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const togglePinnedContestByID = async (req, res) => {
    try {
        const { id } = req.params;

        const contest = await Contest.findOne({
            where: {
                id
            }
        });

        if (!contest) {
            return res.status(404).json({
                message: 'Contest not found'
            });
        }

        const updatedContest = await contest.update({
            pinned: !contest.pinned
        });

        return res.status(200).json({
            contest: updatedContest
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const updatePublicContestByID = async (req, res) => {
    try {
        const { id } = req.params;
        const { public } = req.body;

        const contest = await Contest.findOne({
            where: {
                id
            }
        });

        if (!contest) {
            return res.status(404).json({
                message: 'Contest not found'
            });
        }

        const updatedContest = await contest.update({
            public
        });

        return res.status(200).json({
            contest: updatedContest
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const updateProblemsByID = async (req, res) => {
    try {
        const { id } = req.params;
        const { problems } = req.body;

        const contest = await Contest.findOne({
            where: {
                id
            }
        });

        if (!contest) {
            return res.status(404).json({
                message: 'Contest not found'
            });
        }

        if (!problems || problems.length === 0) {
            return res.status(400).json({
                message: 'Problems cannot be empty'
            });
        }

        // Lọc ra id từ problems
        const problemIDs = problems.map(problem => problem.id);

        // update vào contest.problems
        await contest.update({
            problems: problemIDs
        });

        return res.status(200).json({
            message: 'Problems updated'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const updateStatusUserContest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const userContest = await UserContest.findOne({
            where: {
                id
            }
        });

        if (!userContest) {
            return res.status(404).json({
                message: 'User contest not found'
            });
        }

        await userContest.update({
            status
        });

        return res.status(200).json({
            message: 'User contest status updated'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const updateContestByID = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, start_time, end_time, duration, public, join_key, slug } = req.body;

        const contest = await Contest.findOne({
            where: {
                id
            }
        });

        if (!contest) {
            return res.status(404).json({
                message: 'Contest not found'
            });
        }

        const updatedContest = await contest.update({
            name,
            description,
            start_time,
            end_time,
            duration,
            public,
            slug
        });

        // Nếu join_key được cung cấp thì cập nhật
        if (join_key) {
            updatedContest.join_key = join_key;
            await updatedContest.save();
        }

        return res.status(200).json({
            contest: updatedContest
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const deleteProblemInContest = async (req, res) => {
    try {
        const { id } = req.params;
        const { problem_id } = req.params;

        const contest = await Contest.findOne({
            where: {
                id
            }
        });

        if (!contest) {
            return res.status(404).json({
                message: 'Contest not found'
            });
        }

        const problems = contest.problems;
        const index = problems.indexOf(problem_id);

        if (index === -1) {
            return res.status(404).json({
                message: 'Problem not found in contest'
            });
        }

        problems.splice(index, 1);

        await contest.update({
            problems
        });

        return res.status(200).json({
            message: 'Problem deleted in contest'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const deleteContestByID = async (req, res) => {
    try {
        const { id } = req.params;

        const contest = await Contest.findOne({
            where: {
                id
            }
        });

        if (!contest) {
            return res.status(404).json({
                message: 'Contest not found'
            });
        }

        await contest.destroy();

        return res.status(200).json({
            message: 'Contest deleted'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

module.exports = {
    getContests,
    getContestByID,
    getContestDescriptionByID,
    createContest,
    joinContest,
    getJoinedContest,
    exitContest,
    getMembersByContestID,
    getSubmissionsByContestID,
    // ADMIN
    getContestsForAdmin,
    getContestByIDForAdmin,
    getProblemsByContestID,
    togglePublishContestByID,
    togglePinnedContestByID,
    updatePublicContestByID,
    updateContestByID,
    updateProblemsByID,
    updateStatusUserContest,
    deleteProblemInContest,
    deleteContestByID
};
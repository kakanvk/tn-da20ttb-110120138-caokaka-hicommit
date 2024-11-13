const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Course = require('../models/course');

// Middleware kiểm tra người dùng có phải là tác giả của khóa học không
exports.isAuthor = async (req, res, next) => {
    // Nếu là ADMIN thì không cần kiểm tra
    if (req.user.role === 'ADMIN') {
        return next();
    }

    try {
        // Tìm khóa học trong cơ sở dữ liệu bằng courseId
        const course = await Course.findByPk(req.params.id);

        // Kiểm tra xem khóa học có tồn tại không
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Kiểm tra xem người dùng có phải là tác giả của khóa học không
        if (req.user.id !== course.created_by) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        next();
    } catch (error) {
        console.error('Error checking author:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

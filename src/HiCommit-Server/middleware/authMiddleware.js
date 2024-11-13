const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        // Tìm người dùng trong cơ sở dữ liệu bằng userId
        const user = await User.findByPk(decodedToken.id);

        // Kiểm tra xem người dùng có tồn tại không
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // xoá uid
        delete user.dataValues.uid;
        user.dataValues.favourite_post = JSON.parse(user.dataValues.favourite_post);
        user.dataValues.favourite_course = JSON.parse(user.dataValues.favourite_course);
        user.dataValues.favourite_problem = JSON.parse(user.dataValues.favourite_problem);

        req.user = user;

        next();
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Middleware để kiểm tra quyền truy cập role === "ADMIN"
exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Forbidden' });
        }

        next();
    } catch (error) {
        console.error('Error checking admin role:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.isAdminOrTeacher = (req, res, next) => {
    try {
        if (req.user.role !== 'ADMIN' && req.user.role !== 'TEACHER') {
            return res.status(403).json({ error: 'Forbidden' });
        }

        next();
    } catch (error) {
        console.error('Error checking admin or teacher role:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



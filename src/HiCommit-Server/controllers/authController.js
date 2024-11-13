const User = require('../models/user');
const axios = require('axios');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const decryptToken = (encryptedToken, key) => {
    // Sử dụng AES để giải mã token với key chỉ định
    const bytes = CryptoJS.AES.decrypt(encryptedToken, key);
    const originalToken = bytes.toString(CryptoJS.enc.Utf8);
    return originalToken;
}

exports.login = async (req, res) => {

    try {

        const { uid, email, access_token } = req.body;
        // Tìm người dùng trong cơ sở dữ liệu dựa trên email
        const user = await User.findOne({ where: { email } });

        // Nếu người dùng chưa tồn tại, tạo mới người dùng
        const token_decrypted = decryptToken(access_token ?? "", uid);

        const githubUser = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `token ${token_decrypted}`
            }
        });

        if (user) {

            // Kiểm tra mật khẩu
            const isUIDValid = await bcrypt.compare(uid, user.uid);
            if (!isUIDValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            if (user.username !== githubUser.data.login) {
                user.username = githubUser.data.login;
            }

            if (user.avatar_url !== githubUser.data.avatar_url) {
                user.avatar_url = githubUser.data.avatar_url;
            }

            await user.save();

            // Tạo token JWT
            const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: "30d" });

            // Lưu token vào cookie
            res.cookie('token', token, { httpOnly: true });

            delete user.dataValues.uid;
            user.dataValues.favourite_post = JSON.parse(user.dataValues.favourite_post);
            user.dataValues.favourite_course = JSON.parse(user.dataValues.favourite_course);
            user.dataValues.favourite_problem = JSON.parse(user.dataValues.favourite_problem);

            const response = {
                ...githubUser.data,
                ...user.dataValues
            }

            return res.status(200).json(response);

        } else {

            // Nếu access_token không hợp lệ, trả về lỗi
            if (!githubUser || !githubUser.data) {
                return res.status(401).json({ error: 'Invalid GitHub access token' });
            }

            const hashed_uid = await bcrypt.hash(uid, 10);

            const created_user = await User.create({ username: githubUser.data.login, uid: hashed_uid, email, avatar_url: githubUser.data.avatar_url });

            delete created_user.dataValues.uid;

            const response = {
                ...githubUser.data,
                ...created_user.dataValues
            }

            // Tạo token JWT
            const token = jwt.sign({ id: created_user.id }, process.env.SECRET_KEY, { expiresIn: "30d" });

            // Lưu token vào cookie
            res.cookie('token', token, { httpOnly: true });

            // Trả về phản hồi
            return res.status(201).json(response);
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.login_without_access_token = async (req, res) => {

    try {

        const { username } = req.body;

        // Tìm người dùng trong cơ sở dữ liệu dựa trên email
        const user = await User.findOne({ where: { username } });

        if (user) {

            // Tạo token JWT
            const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: "30d" });

            // Lưu token vào cookie
            res.cookie('token', token, { httpOnly: true });

            delete user.dataValues.uid;

            return res.status(200).json(user);

        }
        else {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.me = async (req, res) => {
    try {
        // Trả về thông tin người dùng hiện tại
        res.status(200).json(req.user);
    } catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.logout = async (req, res) => {
    try {
        // Xóa cookie chứa token
        res.clearCookie('token');

        // Trả về thông báo đăng xuất thành công
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
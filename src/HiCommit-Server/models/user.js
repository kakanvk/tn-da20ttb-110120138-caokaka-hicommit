const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const generateRandomId = () => {
    return crypto.randomBytes(5).toString('hex');
};

const User = sequelize.define('User', {
    id: {
        type: DataTypes.STRING(16),
        defaultValue: generateRandomId,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    uid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('ADMIN', 'STUDENT', 'TEACHER'),
        allowNull: false,
        defaultValue: 'STUDENT'
    },
    status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'PENDING'),
        allowNull: true,
        defaultValue: 'ACTIVE'
    },
    avatar_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    favourite_post: {
        type: DataTypes.JSON,
        defaultValue: [],
        get() {
            const rawValue = this.getDataValue('favourite_post');
            return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
        }
    },
    favourite_course: {
        type: DataTypes.JSON,
        defaultValue: [],
        get() {
            const rawValue = this.getDataValue('favourite_course');
            return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
        }
    },
    favourite_problem: {
        type: DataTypes.JSON,
        defaultValue: [],
        get() {
            const rawValue = this.getDataValue('favourite_problem');
            return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
        }
    },
    join_at: {
        type: DataTypes.BIGINT,
        defaultValue: () => Math.floor(Date.now() / 1000)
    },
}, {
    indexes: [{ unique: true, fields: ['email'] }],
});

module.exports = User;





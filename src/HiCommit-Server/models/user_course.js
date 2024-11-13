const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const User = require('./user');
const Course = require('./course');

const generateRandomId = () => {
    return crypto.randomBytes(5).toString('hex');
};

const UserCourse = sequelize.define('UserCourse', {
    // UserCourse(id, email, course_id, status)
    id: {
        type: DataTypes.STRING(16),
        defaultValue: generateRandomId,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    course_id: {
        type: DataTypes.STRING(16),
        allowNull: false,
        references: {
            model: Course,
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'BANNED'),
        allowNull: false,
        defaultValue: 'INACTIVE'
    },
}, {
    paranoid: true,
    timestamps: true,
    deletedAt: 'deletedAt',
});

UserCourse.belongsTo(Course, { foreignKey: 'course_id' });
UserCourse.belongsTo(User, {
    foreignKey: 'email',
    targetKey: 'email',
    constraints: false
});

module.exports = UserCourse;





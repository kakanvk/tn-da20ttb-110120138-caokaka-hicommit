const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const User = require('./user');
const Problem = require('./problem');

const generateRandomId = () => {
    return crypto.randomBytes(5).toString('hex');
};

// Discussion(id, username, problem_slug, title, description, status)
const Discussion = sequelize.define('Discussion', {
    id: {
        type: DataTypes.STRING(16),
        defaultValue: generateRandomId,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    problem_slug: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('OPEN', 'CLOSED'),
        allowNull: false,
        defaultValue: 'OPEN'
    }
}, {
    paranoid: true,
    timestamps: true,
    deletedAt: 'deletedAt',
});

Discussion.belongsTo(User, {
    foreignKey: 'username',
    targetKey: 'username',
    as: 'author'
});

Discussion.belongsTo(Problem, {
    foreignKey: 'problem_slug',
    targetKey: 'slug',
    as: 'problem'
});

module.exports = Discussion;
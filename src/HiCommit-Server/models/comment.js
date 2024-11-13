const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const User = require('./user');
const Discussion = require('./discussion');

const generateRandomId = () => {
    return crypto.randomBytes(5).toString('hex');
};

// Comment(id, username, discussion_id, description, liked_by)
const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.STRING(16),
        defaultValue: generateRandomId,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    discussion_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
            model: Discussion,
            key: 'id'
        }
    },
    description: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    liked_by: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        get() {
            const rawValue = this.getDataValue('liked_by');
            return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
        }
    }
}, {
    paranoid: true,
    timestamps: true,
    deletedAt: 'deletedAt',
});

Comment.belongsTo(Discussion, { foreignKey: 'discussion_id' });
Comment.belongsTo(User, {
    foreignKey: 'username', 
    targetKey: 'username',
    as: 'author'
});

module.exports = Comment;
const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const User = require('./user');

const generateRandomId = () => {
    return crypto.randomBytes(5).toString('hex');
};

const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.STRING(16),
        defaultValue: generateRandomId,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    created_by: {
        type: DataTypes.STRING(16),
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    description: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    content: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    created_at: {
        type: DataTypes.BIGINT,
        defaultValue: () => Math.floor(Date.now() / 1000)
    },
    thumbnail: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    tags: {
        type: DataTypes.JSON,
        defaultValue: [],
        get() {
            const rawValue = this.getDataValue('tags');
            return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
        }
    },
    publish: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'INACTIVE'
    },
    // Post(id, title, created_by, description, content, slug, created_at, thumbnail, tags, publish, status)
}, {
    defaultScope: {
        include: [
            {
                model: User,
                as: 'author',
                attributes: ['id', 'username', 'avatar_url', 'role']
            }
        ]
    },
    paranoid: true, // Bật tính năng xóa mềm
    deletedAt: 'deletedAt', // Cột dùng để đánh dấu xóa mềm
});

Post.belongsTo(User, { foreignKey: 'created_by', as: 'author' });

module.exports = Post;
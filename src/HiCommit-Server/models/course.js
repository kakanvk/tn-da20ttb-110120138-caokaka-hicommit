const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const User = require('./user');

const generateRandomId = () => {
    return crypto.randomBytes(5).toString('hex');
};

const Course = sequelize.define('Course', {
    // Course(id, created_by, name, description, class_name, join_key, slug, created_at, thumbnail, members, publish, units)
    id: {
        type: DataTypes.STRING(16),
        defaultValue: generateRandomId,
        primaryKey: true
    },
    created_by: {
        type: DataTypes.STRING(16),
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    class_name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    join_key: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    public: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    auto_join: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    created_at: {
        type: DataTypes.BIGINT,
        defaultValue: () => Math.floor(Date.now() / 1000)
    },
    thumbnail: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    members: {
        type: DataTypes.JSON,
        defaultValue: [],
        get() {
            const rawValue = this.getDataValue('members');
            return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
        }
    },
    publish: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    units: {
        type: DataTypes.JSON,
        defaultValue: [],
        get() {
            const rawValue = this.getDataValue('units');
            return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
        }
    }
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

Course.belongsTo(User, { foreignKey: 'created_by', as: 'author' });

module.exports = Course;
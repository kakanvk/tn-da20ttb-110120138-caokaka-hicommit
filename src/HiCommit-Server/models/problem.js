const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const User = require('./user');
const { loadEnvFile } = require('process');

const generateRandomId = () => {
    return crypto.randomBytes(5).toString('hex');
};

const defaultScore = {
    EASY: 20,
    MEDIUM: 40,
    HARD: 100
}

const Problem = sequelize.define('Problem', {
    id: {
        type: DataTypes.STRING(16),
        defaultValue: generateRandomId,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    tags: {
        type: DataTypes.JSON,
        defaultValue: [],
        get() {
            const rawValue = this.getDataValue('tags');
            if (rawValue === null) {
                return [];
            } else {
                return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
            }
        }
    },
    language: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    input: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    output: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    limit: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    examples: {
        type: DataTypes.JSON,
        defaultValue: [],
        get() {
            const rawValue = this.getDataValue('examples');
            if (rawValue === null) {
                return [];
            } else {
                return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
            }
        }
    },
    testcases: {
        type: DataTypes.JSON,
        defaultValue: [],
        get() {
            const rawValue = this.getDataValue('testcases');
            if (rawValue === null) {
                return [];
            } else {
                return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
            }
        }
    },
    created_by: {
        type: DataTypes.STRING(16),
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    type: {
        type: DataTypes.ENUM('COURSE', 'CONTEST', 'FREE'),
        allowNull: false,
        defaultValue: 'FREE'
    },
    level: {
        type: DataTypes.ENUM('EASY', 'MEDIUM', 'HARD'),
        allowNull: true,
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: true,
        set(value) {
            if (this.type === 'FREE') {
                this.setDataValue('score', defaultScore[this.level]);
            } else {
                this.setDataValue('score', value);
            }
        }
    },
    parent: {
        type: DataTypes.STRING(16),
        allowNull: true
    }
}, {
    defaultScope: {
        include: [
            {
                model: User,
                as: 'creator',
                attributes: ['id', 'username', 'avatar_url', 'role']
            }
        ]
    },
    indexes: [{ unique: true, fields: ['slug'] }],
    paranoid: true, // Bật tính năng xóa mềm
    deletedAt: 'deletedAt', // Cột dùng để đánh dấu xóa mềm
});

// Problem(id, name, slug, tags, language, description, input, output, limit, examples, testcases, created_by, type, level, score, parent)

Problem.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

module.exports = Problem;
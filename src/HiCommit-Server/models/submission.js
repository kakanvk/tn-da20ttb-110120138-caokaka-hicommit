const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const User = require('./user');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const generateRandomId = () => {
    return crypto.randomBytes(5).toString('hex');
};

// submission(id, problem_slug, user_id, sha, commit, run_id, code, status, duration, result, style_check, pass_count, total_count)

const Submission = sequelize.define('Submission', {
    id: {
        type: DataTypes.STRING(16),
        defaultValue: generateRandomId,
        primaryKey: true
    },
    problem_slug: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(16),
        allowNull: false
    },
    sha: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    commit: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    run_id: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    code: {
        // Base64 encoded
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    public: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    status: {
        // ['PENDING', 'PASSED', 'FAILED', 'ERROR', 'COMPILE_ERROR']
        type: DataTypes.ENUM('PENDING', 'PASSED', 'FAILED', 'ERROR', 'COMPILE_ERROR'),
        allowNull: false,
        defaultValue: 'PENDING'
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    result: {
        type: DataTypes.JSON,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('result');
            if (rawValue === null) {
                return [];
            } else {
                return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
            }
        }
    },
    review: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        get() {
            const rawValue = this.getDataValue('review');
            if (rawValue === null) {
                return [];
            } else {
                return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
            }
        }
    },
    pass_count: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    total_count: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
});

Submission.belongsTo(User, { foreignKey: 'username', targetKey: 'username' });

module.exports = Submission;
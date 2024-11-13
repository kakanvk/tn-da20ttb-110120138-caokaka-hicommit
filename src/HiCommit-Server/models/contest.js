const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const User = require('./user');

const generateRandomId = () => {
    return crypto.randomBytes(5).toString('hex');
};

const Contest = sequelize.define('Contest', {
    // Contest(id, created_by, name, description, start_time, end_time, duration, problems, publish, public, join_key, slug, pinned)
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
    start_time: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    end_time: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    duration: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    problems: {
        type: DataTypes.JSON,
        defaultValue: [],
        get() {
            const rawValue = this.getDataValue('problems');
            return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
        }
    },
    publish: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    public: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    join_key: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    pinned:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
}, {
    paranoid: true,
    timestamps: true,
    deletedAt: 'deletedAt',
});

Contest.belongsTo(User, { foreignKey: 'created_by' });

module.exports = Contest;
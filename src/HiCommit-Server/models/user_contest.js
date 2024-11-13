const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const User = require('./user');
const Contest = require('./contest');

const generateRandomId = () => {
    return crypto.randomBytes(5).toString('hex');
};

const UserContest = sequelize.define('UserContest', {
    // UserContest(id, user_id, contest_id, status)
    id: {
        type: DataTypes.STRING(16),
        defaultValue: generateRandomId,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.STRING(16),
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    contest_id: {
        type: DataTypes.STRING(16),
        allowNull: false,
        references: {
            model: Contest,
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('ACTIVE','EXITED','BANNED'),
        allowNull: false,
        defaultValue: 'ACTIVE'
    },
}, {
    paranoid: true,
    timestamps: true,
    deletedAt: 'deletedAt',
});

UserContest.belongsTo(User, { foreignKey: 'user_id'});
UserContest.belongsTo(Contest, { foreignKey: 'contest_id'});

module.exports = UserContest;
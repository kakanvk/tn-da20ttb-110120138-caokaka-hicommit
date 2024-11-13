const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const generateRandomId = () => {
    return crypto.randomBytes(5).toString('hex');
};

// Testcase(id, input, output, sugestion)

const Testcase = sequelize.define('Testcase', {
    id: {
        type: DataTypes.STRING(16),
        defaultValue: generateRandomId,
        primaryKey: true
    },
    input: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    output: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    suggestion: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    }
});

module.exports = Testcase;
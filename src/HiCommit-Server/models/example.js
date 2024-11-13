const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const generateRandomId = () => {
    return crypto.randomBytes(5).toString('hex');
};

// Example(id, input, output, note)

const Example = sequelize.define('Example', {
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
    note: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    }
});

// Example(id, input, output, note)

module.exports = Example;
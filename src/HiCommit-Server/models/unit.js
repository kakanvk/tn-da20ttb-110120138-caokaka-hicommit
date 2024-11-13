const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const Course = require('./course');

const generateRandomId = () => {
    return crypto.randomBytes(5).toString('hex');
};

// UNIT(id, course_id, name, children[])

const Unit = sequelize.define('Unit', {
    id: {
        type: DataTypes.STRING(16),
        defaultValue: generateRandomId,
        primaryKey: true
    },
    course_id: {
        type: DataTypes.STRING(16),
        allowNull: false,
        references: {
            model: Course,
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    children: {
        type: DataTypes.JSON,
        defaultValue: [],
        get() {
            const rawValue = this.getDataValue('children');
            if (rawValue === null) {
                return [];
            } else {
                return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
            }
        }
    }
});

Unit.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

module.exports = Unit;
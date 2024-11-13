const e = require('express');
const Unit = require('../models/unit');
const Course = require('../models/course');
const sequelize = require('../configs/database');
const { Op } = require('sequelize');

// UNIT(id, course_id, name, children[])

const createUnit = async (req, res) => {
    const { name } = req.body;
    const { course_id } = req.params;
    const transaction = await sequelize.transaction();

    try {
        // Tạo đơn vị mới
        const unit = await Unit.create({
            name,
            course_id
        }, { transaction });

        // Tìm khóa học và cập nhật mảng units
        const course = await Course.findByPk(course_id, { transaction });
        if (course) {
            const units = course.units || [];
            units.push(unit.id);
            course.units = units;
            await course.save({ transaction });
        }

        await transaction.commit();
        res.status(201).json(unit);
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: error.message });
    }
};

const getUnits = async (req, res) => {
    try {
        const units = await Unit.findAll({
            where: {
                course_id: req.params.course_id
            }
        });

        res.status(200).json(units);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUnitById = async (req, res) => {
    try {
        const unit = await Unit.findByPk(req.params.id);

        if (!unit) {
            return res.status(404).json({ error: 'Unit not found' });
        }

        res.status(200).json(unit);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUnitById = async (req, res) => {
    try {
        const { name, children } = req.body;
        const unit = await Unit.findByPk(req.params.unit_id);

        if (!unit) {
            return res.status(404).json({ error: 'Unit not found' });
        }

        if (name) {
            unit.name = name;
        }

        if (children) {
            unit.children = children;
        }

        await unit.save();

        res.status(200).json(unit);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUnitById = async (req, res) => {
    const { course_id, unit_id } = req.params;
    const transaction = await sequelize.transaction();

    try {
        const unit = await Unit.findByPk(unit_id, { transaction });

        if (!unit) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Unit not found' });
        }

        const course = await Course.findByPk(course_id, { transaction });
        if (!course) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Course not found' });
        }

        const units = course.units || [];
        const index = units.indexOf(unit_id);
        if (index > -1) {
            units.splice(index, 1);
            course.units = units;
            await course.save({ transaction });
        }

        const children = unit.children || [];

        await unit.destroy({ transaction });

        // Xử lý di dời `children`
        if (children.length > 0) {
            let nearbyUnit;

            if (index > 0) {
                // Ưu tiên Unit phía trước
                nearbyUnit = await Unit.findByPk(units[index - 1], { transaction });
            }

            if (!nearbyUnit && index < units.length) {
                // Nếu không có Unit phía trước, tìm Unit phía sau
                nearbyUnit = await Unit.findByPk(units[index], { transaction });
            }

            if (nearbyUnit) {
                const nearbyChildren = nearbyUnit.children || [];
                nearbyUnit.children = nearbyChildren.concat(children);
                await nearbyUnit.save({ transaction });
            } else {
                // Nếu không có Unit lân cận nào, log cảnh báo hoặc xử lý khác
                console.warn(`No nearby unit found for children from unit ${unit_id}`);
            }
        }

        await transaction.commit();
        res.status(204).end();
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createUnit,
    getUnits,
    getUnitById,
    updateUnitById,
    deleteUnitById
};
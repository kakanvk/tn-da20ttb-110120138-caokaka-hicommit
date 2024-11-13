const Testcase = require('../models/testcaseModel');

// Testcase(id, input, output, suggestion)

const createTestcase = async (req, res) => {
    try {
        const { input, output, suggestion } = req.body;

        // Kiểm tra null hoặc ""
        if (!input || !output) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const testcase = await Testcase.create({
            input,
            output,
            suggestion: suggestion || null
        });

        res.status(201).json(testcase);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getTestcases = async (req, res) => {
    try {
        const testcases = await Testcase.findAll({
            order: [['created_at', 'DESC']]
        });

        res.status(200).json(testcases);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createTestcase,
    getTestcases
};
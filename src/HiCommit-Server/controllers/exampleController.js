const Example = require('../models/example');

// Example(id, input, output, note)

const createExample = async (req, res) => {
    try {
        const { input, output, note } = req.body;

        // Kiểm tra null hoặc ""
        if (!input || !output) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const example = await Example.create({
            input,
            output,
            note: note || null
        });

        res.status(201).json(example);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getExamples = async (req, res) => {
    try {
        const examples = await Example.findAll({
            order: [['created_at', 'DESC']]
        });

        res.status(200).json(examples);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createExample,
    getExamples
};

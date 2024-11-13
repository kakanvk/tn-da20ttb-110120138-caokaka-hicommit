const express = require('express');
const router = express.Router();
const { geminiChat } = require('../controllers/geminiController');
const { chatWithGroq } = require('../controllers/llamaController');

router.post('/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        const response = await geminiChat(prompt);
        res.json({ response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// router.post('/chat', async (req, res) => {
//     try {
//         const { prompt } = req.body;
//         const response = await chatWithGroq(prompt);
//         res.json({ response: response.choices[0].message.content });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

module.exports = router;

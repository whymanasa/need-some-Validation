const aiService = require('../services/aiService');

async function validate(req, res) {
    const { promptType, userInput } = req.body;

    if (!promptType || !userInput) {
        return res.status(400).json({ error: 'Missing promptType or userInput' });
    }

    try {
        const response = await aiService.validateDecision(promptType, userInput);
        res.json({ result: response });
    } catch (error) {
        console.error('Error in validate controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { validate };

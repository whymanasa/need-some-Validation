const aiService = require('../services/aiService');
const NodeCache = require('node-cache');

// Cache for 1 hour
const cache = new NodeCache({ stdTTL: 3600 });

async function validate(req, res) {
    const { promptType, userInput } = req.body;

    if (!promptType || !userInput) {
        return res.status(400).json({ error: 'Missing promptType or userInput' });
    }

    // Create a unique cache key (normalize input)
    const cacheKey = `${promptType}-${userInput.trim().toLowerCase()}`;

    // Check cache
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
        // console.log(`Cache hit for: ${cacheKey}`); // Debug
        return res.json({ result: cachedResponse, cached: true });
    }

    try {
        const response = await aiService.validateDecision(promptType, userInput);

        // Store in cache
        cache.set(cacheKey, response);

        res.json({ result: response, cached: false });
    } catch (error) {
        console.error('Error in validate controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { validate };

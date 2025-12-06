const { AzureOpenAI } = require("openai");
const env = require('../config/env');
const angelPrompt = require('../prompts/angelPrompt');
const devilPrompt = require('../prompts/devilPrompt');
const judgePrompt = require('../prompts/judgePrompt');

const deployment = env.azureOpenAiDeploymentName;
const apiVersion = "2024-05-01-preview";
const client = new AzureOpenAI({
    endpoint: env.azureOpenAiEndpoint,
    apiKey: env.azureOpenAiApiKey,
    apiVersion: apiVersion,
    deployment: deployment,
});

async function validateDecision(promptType, userInput) {
    let systemPrompt;
    switch (promptType) {
        case 'angel':
            systemPrompt = angelPrompt;
            break;
        case 'devil':
            systemPrompt = devilPrompt;
            break;
        case 'judge':
            systemPrompt = judgePrompt;
            break;
        default:
            throw new Error('Invalid prompt type');
    }

    try {
        const result = await client.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userInput },
            ],
            model: deployment,
        });

        for (const choice of result.choices) {
            return choice.message.content;
        }
    } catch (err) {
        console.error("The sample encountered an error:", err);
        throw err;
    }
}

module.exports = { validateDecision };

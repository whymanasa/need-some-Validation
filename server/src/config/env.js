require('dotenv').config();

module.exports = {
    azureOpenAiApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAiEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
    azureOpenAiDeploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
    port: process.env.PORT || 3000,
};

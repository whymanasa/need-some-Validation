const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const decisionRoutes = require('./routes/decisionRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', decisionRoutes);

app.get('/', (req, res) => {
    res.send('Decision Validator API is running');
});

app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
});

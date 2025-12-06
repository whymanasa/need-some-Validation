const express = require('express');
const router = express.Router();
const decisionController = require('../controllers/decisionController');

router.post('/validate', decisionController.validate);

module.exports = router;

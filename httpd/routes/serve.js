const express = require('express');
const serveController = require('../controllers/serve');

const router = express.Router();

router.get('/client', serveController.client);

module.exports = router;

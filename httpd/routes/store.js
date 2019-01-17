const express = require('express');
const storeController = require('../controllers/store');

const router = express.Router();

router.post('/packet', storeController.storePacket);

module.exports = router;

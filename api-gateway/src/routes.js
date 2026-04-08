const express = require('express');
const { requestRide, getRideStatus } = require('./controllers');

const router = express.Router();

router.post('/request-ride', requestRide);
router.get('/status/:task_id', getRideStatus);

module.exports = router;

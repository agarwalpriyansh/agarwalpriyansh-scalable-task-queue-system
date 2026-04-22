const express = require('express');
const { requestRide, getRideStatus, registerDriver } = require('./controllers');

const router = express.Router();

router.post('/request-ride', requestRide);
router.get('/status/:task_id', getRideStatus);
router.post('/register-driver', registerDriver);

module.exports = router;

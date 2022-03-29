const express = require('express');
const { getRooms } = require('./rooms.js');
const router = express.Router();

router.get('/rooms', getRooms);

module.exports.routes = router;

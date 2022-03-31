const express = require('express');
const { login, register } = require('./auth.js');
const { getRooms, createRoom, updateRoom, deleteRoom } = require('./rooms.js');
const router = express.Router();

router.post('/auth/login', login);
router.post('/auth/register', register);

router.get('/rooms', getRooms);
router.post('/rooms', createRoom);
router.put('/rooms/:id', updateRoom);
router.delete('/rooms/:id', deleteRoom);

module.exports.routes = router;

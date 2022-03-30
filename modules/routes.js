const express = require('express');
const { getRooms, createRoom, updateRoom, deleteRoom } = require('./rooms.js');
const router = express.Router();

router.get('/rooms', getRooms);
router.post('/rooms', createRoom);
router.put('/rooms/:id', updateRoom);
router.delete('/rooms/:id', deleteRoom);

module.exports.routes = router;

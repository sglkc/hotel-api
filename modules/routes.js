const express = require('express');
const auth = require('./auth.js');
const facilities = require('./facilities.js');
const rooms = require('./rooms.js');
const roomFacilities = require('./room-facilities.js');
const roomTypes = require('./room-types.js');
const router = express.Router();
let group = '';

{
  let group = '/auth';
  router.get(group + '/roles', auth.getRoles);
  router.post(group + '/login', auth.login);
  router.post(group + '/register', auth.register);
}

{
  let group = '/services';
  router.get(group + '/facilities', facilities.getFacilities);
  router.post(group + '/facilities', facilities.createFacility);
  router.put(group + '/facilities/:id', facilities.updateFacility);
  router.delete(group + '/facilities/:id', facilities.deleteFacility);
}

{
  let group = '/services';
  router.get(group + '/rooms', rooms.getRooms);
  router.post(group + '/rooms', rooms.createRoom);
  router.put(group + '/rooms/:id', rooms.updateRoom);
  router.delete(group + '/rooms/:id', rooms.deleteRoom);
}

{
  let group = '/services/rooms/:roomid';
  router.get(group + '/facilities', roomFacilities.getRoomFacilities);
  router.post(group + '/facilities', roomFacilities.createRoomFacility);
  router.put(group + '/facilities/:id', roomFacilities.updateRoomFacility);
  router.delete(group + '/facilities/:id', roomFacilities.deleteRoomFacility);
}

{
  let group = '/services/rooms';
  router.get(group + '/types', roomTypes.getRoomTypes);
  router.post(group + '/types', roomTypes.createRoomType);
  router.put(group + '/types/:id', roomTypes.updateRoomType);
  router.delete(group + '/types/:id', roomTypes.deleteRoomType);
}

module.exports.routes = router;

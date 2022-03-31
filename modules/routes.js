const express = require('express');
const auth = require('./auth.js');
const facilities = require('./facilities.js');
const rooms = require('./rooms.js');
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

module.exports.routes = router;

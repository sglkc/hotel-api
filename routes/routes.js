const express = require('express');
const { c } = require('./functions.js');
const { admin, staff, verify } = require('../middlewares/authentication.js');
const router = express.Router();
let group = '';

{
  let group = '/auth';
  router.get(group + '/roles', c('auth@getRoles'));
  router.post(group + '/login', c('auth@login'));
  router.post(group + '/register', c('auth@register'));
  router.post(group + '/verify', c('auth@verify'));
}

{
  let group = '/services/facilities';
  router.get(group + '', c('facilities@index'));
  router.post(group + '', admin, c('facilities@create'));
  router.put(group + '/:id', admin, c('facilities@update'));
  router.delete(group + '/:id', admin, c('facilities@delete'));
}

{
  let group = '/services/rooms';
  router.get(group + '', c('rooms@index'));
  router.get(group + '/:id', c('rooms@get'));
  router.post(group + '', admin, c('rooms@create'));
  router.put(group + '/:id', admin, c('rooms@update'));
  router.delete(group + '/:id', admin, c('rooms@delete'));
}

{
  let group = '/services/room-facilities';
  router.get(group + '', staff, c('room-facilities@index'));
  router.post(group + '', admin, c('room-facilities@create'));
  router.put(group + '/:id', admin, c('room-facilities@update'));
  router.delete(group + '/:id', admin, c('room-facilities@delete'));
}

{
  let group = '/services/room-types';
  router.get(group + '', c('room-types@index'));
  router.get(group + '/:id', c('room-types@get'));
  router.post(group + '', admin, c('room-types@create'));
  router.put(group + '/:id', admin, c('room-types@update'));
  router.delete(group + '/:id', admin, c('room-types@delete'));
}

{
  let group = '/services/room-types/:typeid';
  router.get(group + '/rooms', c('rooms@indexFromType'));
  router.get(group + '/facilities', c('room-facilities@indexFromType'));
}

{
  let group = '/services/reservations';
  router.get(group + '', staff, c('reservations@index'));
  router.post(group + '', verify, c('reservations@create'));
  router.delete(group + '/:id', staff, c('reservations@delete'));
}

module.exports.routes = router;

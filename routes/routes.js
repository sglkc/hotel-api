const express = require('express');
const { c } = require('./functions.js');
const { adminOnly } = require('../middlewares/authentication.js');
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
  let group = '/services';
  router.get(group + '/facilities', c('facilities@index'));
  router.post(group + '/facilities', adminOnly, c('facilities@create'));
  router.put(group + '/facilities/:id', adminOnly, c('facilities@update'));
  router.delete(group + '/facilities/:id', adminOnly, c('facilities@delete'));
}

{
  let group = '/services';
  router.get(group + '/rooms', c('rooms@index'));
  router.get(group + '/rooms/:id', c('rooms@get'));
  router.post(group + '/rooms', adminOnly, c('rooms@create'));
  router.put(group + '/rooms/:id', adminOnly, c('rooms@update'));
  router.delete(group + '/rooms/:id', adminOnly, c('rooms@delete'));
}

{
  let group = '/services/rooms/:roomid';
  router.get(group + '/facilities', c('room-facilities@index'));
  router.post(group + '/facilities', c('room-facilities@create'));
  router.put(group + '/facilities/:id', c('room-facilities@update'));
  router.delete(
    group + '/facilities/:id', adminOnly, c('room-facilities@delete')
  );
}

{
  let group = '/services';
  router.get(group + '/room-types', c('room-types@index'));
  router.get(group + '/room-types/:id', c('room-types@get'));
  router.post(group + '/room-types', adminOnly, c('room-types@create'));
  router.put(group + '/room-types/:id', adminOnly, c('room-types@update'));
  router.delete(group + '/room-types/:id', adminOnly, c('room-types@delete'));
}

module.exports.routes = router;

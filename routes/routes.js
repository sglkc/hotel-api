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
  let group = '/services/facilities';
  router.get(group + '', c('facilities@index'));
  router.post(group + '', adminOnly, c('facilities@create'));
  router.put(group + '/:id', adminOnly, c('facilities@update'));
  router.delete(group + '/:id', adminOnly, c('facilities@delete'));
}

{
  let group = '/services/rooms';
  router.get(group + '', c('rooms@index'));
  router.get(group + '/:id', c('rooms@get'));
  router.post(group + '', adminOnly, c('rooms@create'));
  router.put(group + '/:id', adminOnly, c('rooms@update'));
  router.delete(group + '/:id', adminOnly, c('rooms@delete'));
}

{
  let group = '/services/room-facilities';
  router.get(group + '', c('room-facilities@index'));
  router.post(group + '', c('room-facilities@create'));
  router.put(group + '/:id', c('room-facilities@update'));
  router.delete(group + '/:id', c('room-facilities@delete'));
}

{
  let group = '/services/room-types';
  router.get(group + '', c('room-types@index'));
  router.get(group + '/:id', c('room-types@get'));
  router.post(group + '', adminOnly, c('room-types@create'));
  router.put(group + '/:id', adminOnly, c('room-types@update'));
  router.delete(group + '/:id', adminOnly, c('room-types@delete'));
}

module.exports.routes = router;

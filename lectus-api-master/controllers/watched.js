"use strict"
const express = require('express'),
      router = express.Router(),
      expressJoi = require('express-joi-validator'),
      WatchedRepository = require('../repositories/watched-repository'),
      watchedRepository = new WatchedRepository();

router.get('/', (req, res, next) => {
  watchedRepository.getAll(req.profile.name)
    .then((recentlyWatchedList) => res.json(recentlyWatchedList))
    .catch((err) => next(err));
});

router.post('/', expressJoi(require('../validators/new-watched-item')), (req, res, next) => {
  watchedRepository.save(req.profile.name, req.body.item)
    .then((createdItem) => res.status(201).json(createdItem))
    .catch((err) => next(err));
});

router.post('/show/', expressJoi(require('../validators/new-show-watched-item')), (req, res, next) => {
  watchedRepository.saveWatchedShow(req.profile.name, req.body.item)
    .then((createdItem) => res.status(201).json(createdItem))
    .catch((err) => next(err));
});


router.delete('/:id', (req, res, next) => {
  watchedRepository.remove(req.profile.name, req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => next(err));
});



module.exports = router;
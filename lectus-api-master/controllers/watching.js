"use strict"
const express = require('express'),
      router = express.Router(),
      WatchingRepository = require('../repositories/watching-repository'),
      watchingRepository = new WatchingRepository(),
      expressJoi = require('express-joi-validator'),
      findByIdSchema = require('../validators/find-by-id');

router.get('/', (req, res, next) => {
  watchingRepository.getAll(req.profile.name)
    .then((continueWatchingList) => res.json(continueWatchingList))
    .catch((err) => next(err));
});

router.get('/:id', expressJoi(findByIdSchema),(req, res, next) => {
  watchingRepository.getByMovieId(req.profile.name, req.params.id)
    .then((item) => res.json(item))
    .catch((err) => next(err));
});



router.post('/', expressJoi(require('../validators/new-watching-item')),(req, res, next) => {
  watchingRepository.save(req.profile.name, req.body.item)
    .then((response) => res.json(response))
    .catch((err) => next(err));
});

router.delete('/:id', expressJoi(findByIdSchema) ,(req, res, next) => {
  watchingRepository.remove(req.profile.name, req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => next(err));
});

router.delete('/show/:id', expressJoi(findByIdSchema) ,(req, res, next) => {
  watchingRepository.removeShowWatching(req.profile.name, req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => next(err));
});



router.get('/remove/:id', (req, res, next) => {
    watchingRepository.remove(req.profile.name, req.params.id)
        .then((movie) => { res.json({ success: true }); })
        .catch((err) => next(err));
});

module.exports = router;
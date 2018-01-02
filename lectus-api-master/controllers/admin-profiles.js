"use strict"
const express = require('express'),
      router = express.Router(),
      ProfileRepository = require('../repositories/profile.repository'),
      profileRepository = new ProfileRepository(),
      expressJoi = require('express-joi-validator');

router.post('/', expressJoi(require('../validators/new-profile')), (req, res, next) => {
  profileRepository.save(req.body.profile)
    .then(() => res.status(204).end())
    .catch((err) => next(err));
});

router.delete('/:name', (req, res, next) => {
  profileRepository.remove(req.params.name)
    .then(() => res.status(204).end())
    .catch((err) => next(err));
});

module.exports = router;
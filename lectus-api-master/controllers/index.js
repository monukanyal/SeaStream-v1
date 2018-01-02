"use strict"
const express = require('express'),
    router = express.Router();

router.use('/api/movies', require('./movies'));
router.use('/api/shows', require('./shows'));
router.use('/api/watching', require('./watching'));
router.use('/api/show-watching', require('./show-watching'));
router.use('/api/watched', require('./watched'));
router.use('/api/admin/profiles', require('./admin-profiles'));
router.use('/profiles', require('./profiles'));
router.use('/settings', require('./settings'));
router.use('/setup', require('./setup'));
router.use('/movie', require('./importMovies'));
router.use('/shows', require('./importshows'));


module.exports = router;
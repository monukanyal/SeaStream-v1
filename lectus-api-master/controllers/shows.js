"use strict"
const express = require('express'),
      router = express.Router(),
       expressJoi = require('express-joi-validator'),
      ShowService = require('../services/show.service'),
      showService = new ShowService(),
        ShowRepository = require('../repositories/show.repository'),
    showRepository = new ShowRepository();

router.get('/all', (req, res, next) => {
    showRepository.getAll()
        .then((movies) => res.json(movies))
        .catch((err) => next(err));
});

router.get('/', (req, res, next) => {
  showService.getRandomShowsForHomeScreen(req.profile.name)
    .then(shows => res.json(shows))
    .catch(err => next(err));
});

router.get('/:id', expressJoi(require('../validators/find-by-id')), (req, res, next) => {
    showRepository.getById(req.params.id)
        .then((show) => res.json(show))
        .catch((err) => next(err));
});

router.get('/seasons/:id', expressJoi(require('../validators/find-by-id')), (req, res, next) => {
    showRepository.getSeasonByShowId(req.params.id)
        .then((show) => res.json(show))
        .catch((err) => next(err));
});

router.get('/episodes/:id', expressJoi(require('../validators/find-by-id')), (req, res, next) => {
    showRepository.getEpisodeBySeasonId(req.params.id)
        .then((show) => res.json(show))
        .catch((err) => next(err));
});

router.get('/seasondetails/:id', expressJoi(require('../validators/find-by-id')), (req, res, next) => {
    showRepository.getSeasonById(req.params.id)
        .then((show) => res.json(show))
        .catch((err) => next(err));
});

router.get('/episodedetails/:id', expressJoi(require('../validators/find-by-id')), (req, res, next) => {
    showRepository.getEpisodeById(req.params.id)
        .then((show) => res.json(show))
        .catch((err) => next(err));
});

router.get('/genre/:genre', (req, res, next) => {
    showRepository.getByGenre(req.params.genre)
        .then((shows) => res.json(shows))
        .catch((err) => next(err));
});


router.get('/title/:title', (req, res, next) => {
  console.log(req.params.title)
  showRepository.getShowByTitle(req.params.title)
    .then(shows => res.json(shows))
    .catch(err => next(err));
});


router.get('/showExists/:title/:season/:episode', (req, res, next) => { 
   showRepository.getShowByInfo(req.params.title,req.params.season, req.params.episode)
    .then(shows => res.json(shows))
    .catch(err => next(err));
});


   router.post('/save', (req, res, next) => {  
       showRepository.save(req.body)
        .then((res) => res.json(res))
        .catch((err) => next(err));
});


router.get('/getshowinfo/:id',expressJoi(require('../validators/find-by-id')), (req, res, next) => { 
   showRepository.getShowByEpisodeId(req.params.id)
    .then(shows => res.json(shows))
    .catch(err => next(err));
});





module.exports = router;
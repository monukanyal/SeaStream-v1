"use strict"
const express = require('express'),
    router = express.Router(),
    expressJoi = require('express-joi-validator'),
    MovieRepository = require('../repositories/movie-repository'),
    movieRepository = new MovieRepository(),
    MovieService = require('../services/movie.service'),
    movieService = new MovieService();
  
router.get('/all', (req, res, next) => {
  // console.log('all');
    movieRepository.getAll()
        .then((movies) => res.json(movies))
        .catch((err) => next(err));
});
router.get('/', (req, res, next) => {   
    //console.log('home');
    movieService.getRandomMoviesForHomeScreen(req.profile.name)
        .then((movies) => res.json(movies))
        .catch((err) =>next(err) );
});

router.get('/:id', expressJoi(require('../validators/find-by-id')), (req, res, next) => {
    movieRepository.getById(req.params.id)
        .then((movie) => res.json(movie))
        .catch((err) => next(err));
});

router.get('/genre/:genre', (req, res, next) => {
    movieRepository.getByGenre(req.profile.name, req.params.genre)
        .then((movies) => res.json(movies))
        .catch((err) => next(err));
});

router.get('/title/:title', (req, res, next) => {
    movieRepository.getByTitle(req.params.title)
        .then((movies) => res.json(movies))
        .catch((err) => next(err));
});


router.get('/cast/:actor', (req, res, next) => {
    movieRepository.getByActor(req.params.actor)
        .then((movies) => res.json(movies))
        .catch((err) => next(err));
});

router.get('/search/:text', (req, res, next) => {
    movieRepository.getByText(req.profile.name, req.params.text)
        .then((movies) => res.json(movies))
        .catch((err) => next(err));
});


router.get('/remove/:id', expressJoi(require('../validators/find-by-id')), (req, res, next) => {
    movieRepository.remove(req.params.id)
        .then((movie) => { res.json({ success: true }); })
        .catch((err) => next(err));
});

router.get('/watchingremove/:id', expressJoi(require('../validators/find-by-id')), (req, res, next) => {
    movieRepository.removeWatching(req.params.id)
        .then((movie) => { res.json({ success: true }); })
        .catch((err) => next(err));
});


//router.post('/remove', expressJoi(require('../validators/find-by-id')), (req, res, next) => {
//    movieRepository.remove(req.param.id)
//        .then((profile) => {
//            // let token = tokenService.generate(profile);
//            res.json({ success: true });
//        })
//        .catch((err) => next(err));
//});

module.exports = router;
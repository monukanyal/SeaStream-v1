"use strict"
const express = require('express'),
    router = express.Router(),
        MovieRepository = require('../repositories/movie-repository'),        
    movieRepository = new MovieRepository(),
     ApiTheMovieDbRepository = require('../repositories/api-themoviedb-respository'),        
    apiRepository = new ApiTheMovieDbRepository();
    

     router.post('/save', (req, res, next) => {       
       movieRepository.save(req.body)
        .then((res) => res.json(res))
        .catch((err) => next(err));
});

router.get('/title/:title', (req, res, next) => {
    movieRepository.getByTitle(req.params.title)
        .then((movies) => res.json(movies))
        .catch((err) => next(err));
});

router.get('/exists/:title/:filename', (req, res, next) => {
    movieRepository.CheckMovieExists(req.params.title, req.params.filename)
        .then((movies) => res.json(movies))
        .catch((err) => next(err));
});

     router.post('/update', (req, res, next) => {     
     console.log('movie update'+req.body);  
       movieRepository.update(req.body)
        .then((response) => res.json(response))
        .catch((err) => next(err));
});

router.get('/getMovieNames/:title', (req, res, next) => {
  apiRepository.getKeywords(req.params.title, 'movie')
        .then((response) => res.json(response))
        .catch((err) => next(err));     
});

router.get('/getTvNames/:title', (req, res, next) => {
    apiRepository.getKeywords(req.params.title, 'series')
        .then((response) => res.json(response))
        .catch((err) => next(err));
     
});

router.get('/downloadDetail/:id/:tvid', (req, res, next) => {
  movieRepository.DownloadMovieInfo(req.params.id, req.params.tvid)
        .then((response) => res.json(response))
        .catch((err) => next(err));
     
});

     router.post('/remove', (req, res, next) => {     
  movieRepository.removeByPath(req.body.path)
        .then((response) => res.json(response))
        .catch((err) => next(err));
     
});   

  
module.exports = router;
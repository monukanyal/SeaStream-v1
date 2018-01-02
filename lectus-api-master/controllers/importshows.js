"use strict"
const express = require('express'),
      router = express.Router(),
          ShowRepository = require('../repositories/show.repository'),
    showRepository = new ShowRepository();

    router.get('/title/:name', (req, res, next) => {
       showRepository.getShowByTitle(req.params.name)
    .then(shows => res.json(shows))
    .catch(err => next(err));
});

router.get('/exists/:name', (req, res, next) => {
    showRepository.CheckShowExists(req.params.name)
        .then((movies) => res.json(movies))
        .catch((err) => next(err));
});

router.get('/showExists/:title/:season/:episode', (req, res, next) => { 
   showRepository.getShowByInfo(req.params.title,req.params.season, req.params.episode)
    .then(shows => res.json(shows))
    .catch(err => next(err));
});

   router.post('/save', (req, res, next) => {  
       showRepository.save(req.body)
        .then((response) => 
        	res.json(response)
        	)
        .catch((err) => next(err));
   });

   router.post('/saveseasons', (req, res, next) => {
   	showRepository.saveSeasons(req.body)
		 .then((response) =>
		 	res.json(response)
			 )
		 .catch((err) => next(err));
   });

   router.get('/seasonid/:showid/:season', (req, res, next) => {
   	showRepository.getSeasonInfo(req.params.showid, req.params.season)
		 .then(shows => res.json(shows))
		 .catch(err => next(err));
   });

   router.get('/episode/:seasonid/:episode', (req, res, next) => {
   	showRepository.getEpisodeInfo(req.params.seasonid, req.params.episode)
		 .then(episode => res.json(episode))
		 .catch(err => next(err));
   });


   router.post('/saveepisode', (req, res, next) => {
   	showRepository.saveEpisode(req.body)
		 .then((response) =>
		 	res.json(response)
			 )
		 .catch((err) => next(err));
   });


   router.post('/updateepisode', (req, res, next) => {
   	showRepository.updateEpisode(req.body)
		 .then((response) =>
		 	res.json(response)
			 )
		 .catch((err) => next(err));
   });


     router.post('/update', (req, res, next) => {       
       showRepository.update(req.body)
        .then((response) => res.json(response))
        .catch((err) => next(err));
});

router.get('/downloadDetail/:id/:tvid', (req, res, next) => {
    console.log(req.params.id);

      console.log(req.params.tvid);

  showRepository.DownloadShowInfo(req.params.id, req.params.tvid)
        .then((response) => res.json(response))
        .catch((err) => next(err));
     
});


module.exports = router;
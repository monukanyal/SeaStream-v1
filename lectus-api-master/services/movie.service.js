"use strict"
const MovieRepository = require('../repositories/movie-repository'),
      WatchedRepository = require('../repositories/watched-repository'),
      WatchingRepository = require('../repositories/watching-repository'),
      LectusCache = require('../helpers/lectus-cache'),
      ApiTheMovieDbRepository = require('../repositories/api-themoviedb-respository'),
      imdbservice = require('../services/imdb.service');

class MovieService {

  constructor() {
    this.movieRepository = new MovieRepository();
    this.watchedRepository = new WatchedRepository();
    this.watchingRepository = new WatchingRepository();
    this.lectusCache = new LectusCache();
    this.apiTheMovieDbRepository = new ApiTheMovieDbRepository();
  }

  getRandomMoviesForHomeScreen(profile){
    return new Promise((resolve, reject) => {

     // this.lectusCache.getRandomMovies(profile)
      //  .then((movies) => {
       //   if (movies) {
        //    resolve(movies);
        //  } else {
            let getMoviesPromise = this.movieRepository.getRandomMoviesByProfile(profile);
            let getWatchedPromise = this.watchedRepository.getRandomMovies(profile);
            let getWatchingPromise = this.watchingRepository.getRandomMovies(profile);
            Promise.all([getMoviesPromise, getWatchedPromise, getWatchingPromise])
              .then((responses) => {
               // console.log('homescreen responses'+getMoviesPromise);
                let movieCollection = [];
                movieCollection.push(responses[2]);
                movieCollection.push(responses[1]);
                responses[0].map(genreItem => {
                  movieCollection.push(genreItem);
                });

              //  this.lectusCache.setRandomMovies(profile, movieCollection);
                resolve(movieCollection)
              })
              .catch((err) => reject(err));
         // }
       // })
       // .catch((err) => reject(err));
    });
  }

addMovieInfo(tvid, movieid){

imdbservice.getImdbIdromTvId(tvid).then(res=> {console.log(res)});
  
}



}

module.exports = MovieService;
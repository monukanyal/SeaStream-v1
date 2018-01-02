"use strict"
const nodeCache = require('node-cache'),
      cache = new nodeCache(),
      randomMoviesCacheKey = 'randomMovies',
      randomShowsCacheKey = 'randomShows';

class LectusCache{

  constructor(){
    this.keyExpirationInSeconds = 60*10;
  }

  getRandomMovies(profile){
    return new Promise((resolve, reject) => {
      cache.get(`${randomMoviesCacheKey}-${profile}`, (err, movies) => {
        if(err){
          reject(err);
        } else {
          resolve(movies);
        }
      });
    });
  }

  setRandomMovies(profile, movies){
    cache.set(`${randomMoviesCacheKey}-${profile}`, movies, this.keyExpirationInSeconds);
  }

  getRandomShows(profile){
    return new Promise((resolve, reject) => {
      cache.get(`${randomShowsCacheKey}-${profile}`, (err, shows) => {
        if (err) {
          reject(err);
        } else {
          resolve(shows);
        }
      });
    });
  }

  setRandomShows(profile, shows){
    cache.set(`${randomShowsCacheKey}-${profile}`, shows, this.keyExpirationInSeconds);
  }

}

module.exports = LectusCache;
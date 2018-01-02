"use strict"
const _ = require('lodash'),
Boom = require('boom'),
      db = require('../config/db');

class WatchingRepository {
  getAll(profile) {
    return new Promise((resolve, reject) => {
      db.watching.find({ watcher: profile}, (err, watchingList) => {
        if (err) {
          reject(err);
        } else {
          resolve(watchingList);
        }
      });
    });
  }

  getByMovieId(profile, movieId) {
       return new Promise((resolve, reject) => {
      db.watching.findOne({watcher: profile, 'movie._id': movieId}, (err, item) => {
        if (err) {
          reject(err);
        } else {         
          resolve(item);
        }
      });
    });
  }

  getWatchingByMovieId(movieId) {
       return new Promise((resolve, reject) => {
      db.watching.findOne({ 'movie._id': movieId}, (err, item) => {
        if (err) {
          reject(err);
        } else {         
          resolve(item);
        }
      });
    });
  }

  save(watcher, item){
    
    return new Promise((resolve, reject) => {
      item.watcher = watcher;
        db.watching.findOne({ "watcher": watcher, "movie._id": item.movie._id }, (err, watch) => {
        if (err) {
          reject(err);
        } else if(watch) {  
                      db.watching.remove({ "watcher": watcher, "movie._id": item.movie._id }, { multi: true }, () => {
                       db.watching.insert(item,  (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(item);
        }
      });
                    });
        }
        else {       
             db.watching.insert(item,  (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(item);
        }
      });
        }
      });


      // db.watching.update({ "watcher": watcher, "movie._id": item.movie._id }, item, { "upsert": true }, (err) => {
      //   if (err) {
      //     reject(err);
      //   } else {
      //     resolve();
      //   }
      // });
    });
    
  }

  remove(profile, movieId) {   
   
    return new Promise((resolve, reject) => {
      // this.getWatchingByMovieId(movieId)
      //   .then((item) => {

      //     console.log(JSON.stringify(item));
      //     if (!item) {
      //       reject(Boom.notFound('The watching item to be deleted cannot be found'));
      //     } else {   
                       db.watching.remove({"watcher" : profile, _id: movieId}, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
        //   }
        // })
        // .catch((err) => reject(err));
    });
  }


   removeShowWatching(profile, movieId) {
    return new Promise((resolve, reject) => {        
                       db.showWatching.remove({"watcher" : profile , 'show._id': movieId}, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });    
    });
  }


  getRandomMovies(profile) {
    return new Promise((resolve, reject) => {
      this.getAll(profile)
        .then((watchingList) => {
         // console.log(watchingList);
          var strippedListContainingMovieDetailsOnly = this.stripAwayUnwantedProperties(watchingList);
          var randomMovies = this.selectRandomMovies(strippedListContainingMovieDetailsOnly);
          //console.log('watching---');
         // console.log(randomMovies);
          resolve({ "genre": "Continue Watching", "movies" : randomMovies });
        })
        .catch((err) => reject(err));
    });
  }

  stripAwayUnwantedProperties(watchingList) {
    let strippedList = [];

    watchingList.map((item) => {
      strippedList.push({ _id: item.movie._id, title: item.movie.title, poster:item.movie.poster, watchingId : item._id });
    });

    return strippedList;
  }

  selectRandomMovies(movies){

    let numberOfMoviesToDisplay = 20;
     var randomMovies = [];

      if (!movies.length || movies.length <= numberOfMoviesToDisplay) {

 for(var i = 0; i < movies.length; i++ ){
           randomMovies.push(movies[i]);
    }

      return randomMovies;
    }

    for(var i = 0; i <numberOfMoviesToDisplay; i++ ){    
        randomMovies.push(movies[i]);
    }
    return randomMovies;

  };

}

module.exports = WatchingRepository;

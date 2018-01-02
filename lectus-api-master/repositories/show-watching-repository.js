"use strict"
const _ = require('lodash'),
Boom = require('boom'),
      db = require('../config/db');

class ShowWatchingRepository {
  getAll(profile) {
    return new Promise((resolve, reject) => {
      db.showWatching.find({ watcher: profile}, (err, watchingList) => {
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
      db.showWatching.findOne({watcher: profile, 'movie._id': movieId}, (err, item) => {
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
      db.showWatching.findOne({_id: movieId}, (err, item) => {
        if (err) {
          reject(err);
        } else {         
          resolve(item);
        }
      });
    });
  }

  // todo: add one here for getByMovieId

  save(watcher, item){
    
    return new Promise((resolve, reject) => {
      item.watcher = watcher;
        db.showWatching.findOne({ "watcher": watcher, "show._id": item.show._id }, (err, watch) => {
        if (err) {
          reject(err);
        } else if(watch) {  
                      db.showWatching.remove({ "watcher": watcher, "show._id": item.show._id }, { multi: true }, () => {
                       db.showWatching.insert(item,  (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(item);
        }
      });
                    });
        }
        else {       
             db.showWatching.insert(item,  (err) => {
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

  remove(movieId) {
    return new Promise((resolve, reject) => {
      this.getWatchingByMovieId(movieId)
        .then((item) => {
          if (!item) {
            reject(Boom.notFound('The watching item to be deleted cannot be found'));
          } else {
                       db.showWatching.remove({_id: item._id}, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          }
        })
        .catch((err) => reject(err));
    });
  }

  

  getRandomShows(profile) {
    return new Promise((resolve, reject) => {
      this.getAll(profile)
        .then((watchingList) => {         
          var strippedListContainingMovieDetailsOnly = this.stripAwayUnwantedProperties(watchingList);
          var randomMovies = this.selectRandomMovies(strippedListContainingMovieDetailsOnly);
          resolve({ "genre": "Continue Watching", "shows" : randomMovies });
        })
        .catch((err) => reject(err));
    });
  }

  stripAwayUnwantedProperties(watchingList) {
    let strippedList = [];

    watchingList.map((item) => {
      strippedList.push({ _id: item.show._id, title: item.show.title, poster:item.show.poster, watchingId : item._id });
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

module.exports = ShowWatchingRepository;

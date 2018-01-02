"use strict"
const Boom = require('boom'),
      db = require('../config/db');

class WatchedRepository {
  getAll(profile) {
    return new Promise((resolve, reject) => {
      db.watched.find({ watcher: profile }, (err, watchedList) => {
        if (err) {
          reject(err);
        } else {
          resolve(watchedList);
        }
      });
    });
  }

  getById(profile, id) {
    return new Promise((resolve, reject) => {
      db.watched.findOne({ watcher: profile, _id: id }, (err, item) => {
        if (err) {
          reject(err);
        } else if (!item) {
          reject(Boom.notFound());
        } else {
          resolve(item);
        }
      });
    });
  }

  add(profile, item) {
    return new Promise((resolve, reject) => {
      var recentlyWatchedItem = {
        watcher: profile,
        movie: item.movie,
      };

      db.watched.insert(recentlyWatchedItem, (err, savedItem) => {
        if (err) {
          reject(err);
        } else {
          resolve(savedItem);
        }
      });
    });
  }

  save(watcher, item){
    return new Promise((resolve, reject) => {
      item.watcher = watcher;
      db.watched.update({ "watcher": watcher, "movie._id": item.movie._id }, item, { "upsert": true }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

    saveWatchedShow(watcher, item){
    return new Promise((resolve, reject) => {
      item.watcher = watcher;
      db.showWatched.update({ "watcher": watcher, "show._id": item.show._id }, item, { "upsert": true }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  remove(profile, id) {
    return new Promise((resolve, reject) => {
      this.getById(profile, id)
        .then((item) => {
          db.watched.remove({ _id: item._id }, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        })
        .catch((err) => reject(err));
    });
  }

  getRandomMovies(profile) {
    return new Promise((resolve, reject) => {
      this.getAll(profile)
        .then((watchedList) => {
          var strippedListContainingMovieDetailsOnly = this.stripAwayUnwantedProperties(watchedList);
          var randomMovies = this.selectRandomMovies(strippedListContainingMovieDetailsOnly);
          resolve({ "genre": "Recently Watched", "movies": randomMovies });
        })
        .catch((err) => reject(err));
    });
  }

  stripAwayUnwantedProperties(watchedList) {
    let strippedList = [];

    watchedList.map((item) => {
      strippedList.push({ _id: item.movie._id, title: item.movie.title, poster:item.movie.poster });
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

    for(var i = 0; i < numberOfMoviesToDisplay; i++ ){
           randomMovies.push(movies[i]);
    }

    return randomMovies;

  };

}

module.exports = WatchedRepository;
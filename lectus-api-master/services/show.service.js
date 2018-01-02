"use strict"
const ShowRepository = require('../repositories/show.repository'),
      LectusCache = require('../helpers/lectus-cache'),
      ShowWatchingRepository = require('../repositories/show-watching-repository');

class ShowService {
  constructor(){
    this.showRepository = new ShowRepository();
     this.ShowWatchingRepository = new ShowWatchingRepository();
    this.lectusCache = new LectusCache();
  }

  getRandomShowsForHomeScreen(profile){   
    return new Promise((resolve, reject) => {
      // this.lectusCache.getRandomShows(profile)
      //   .then(shows => {
      //     if (shows) {
      //       resolve(shows);
      //     } else {        
let getShowsPromise = this.showRepository.getRandomShows()
 let getShowsWatchingPromise = this.ShowWatchingRepository.getRandomShows(profile);
 let getShowsWatchedPromise = {
    "genre": "Watched",
    "shows": []
  };

           Promise.all([getShowsPromise, getShowsWatchedPromise, getShowsWatchingPromise])
              .then((responses) => {               
                let showCollection = [];
                showCollection.push(responses[2]);
                showCollection.push(responses[1]);
                responses[0].map(genreItem => {
                  showCollection.push(genreItem);
                });
              //  this.lectusCache.setRandomMovies(profile, movieCollection);
                resolve(showCollection)
              })
              .catch((err) => reject(err));
                   // this.showRepository.getRandomShows()
            //   .then(showCollection => {
            //     //this.lectusCache.setRandomShows(profile, showCollection);
            //     resolve(showCollection);
            //   })
            //   .catch(err => reject(err));
        //   }
        // })
        // .catch(err => reject(err));
    });
  }
}

module.exports = ShowService;
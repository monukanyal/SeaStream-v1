"use strict"
const _ = require('lodash'),
      db = require('../config/db'),
       Boom = require('boom'),
         joinPath = require('path.join'),
         fs = require('fs'),
             SettingsRepository = require('../repositories/settings-repository'),
    settingRepository = new SettingsRepository(),
      MoviesRepository = require('../repositories/movie-repository'),
    movieRepository = new MoviesRepository(),
       ApiTheMovieDbRepository = require('../repositories/api-themoviedb-respository'),        
    apiRepository = new ApiTheMovieDbRepository(),    
       imdbservice = require('../services/imdb.service'), 
       imageService = require('../services/image.service');

class ShowRepository {

    getRandomShows(){
        return new Promise((resolve, reject) => {
            this.getAll()
              .then(shows => {
                  let showsSortedIntoGenres = this.splitShowsIntoGenres(shows);
        let randomlySelectedShows = this.selectRandomShows(showsSortedIntoGenres);
        resolve(randomlySelectedShows);
    })
    .catch(err => reject(err));
});
}

getAll(){
    return new Promise((resolve, reject) => {
        db.shows.find({}, (err, shows) => {
            if (err) {
            reject(err);
} else {
     var showlist= [];  

    

                for(var i=0; i<shows.length; i++){
                     (function(j){
  shows[j].iswatching =false;
    shows[j].iswatched =false;
                         db.showWatching.findOne({'show.showid': shows[i]._id }, (error, watching)=> {
                          
                             if (watching != null)
                             {
                                 shows[j].iswatching =true;
                                 shows[j].iswatched =false;
                             }

                               db.showWatched.findOne({'show.showid': shows[j]._id }, (error, watching)=> {
                          
                             if (watching != null)
                             {
                                 shows[j].iswatching =false;
                                  shows[j].iswatched =true;
                             }

                             showlist.push(shows[j]);

                  if (showlist.length==shows.length){   
                            
resolve(showlist);
                }

                               });

                         })
                     })(i)

     
                }

    
        //  resolve(shows);
}
});
});
}

getById(id) {
    return new Promise((resolve, reject) => {
        db.shows.findOne({ _id: id }, (err, show) => {
            if (err) {
                reject(err);
} else if (!show) {
    reject(Boom.notFound())
} else {
                   resolve(show)
}
});
});
}

getByImdbIdandShowId(imbdid, showid) {
    return new Promise((resolve, reject) => {
        db.shows.findOne({imdbid: imbdid, $not : { _id: showid }  }, (err, show) => {
            if (err) {
                reject(err);
}  else {
                   resolve(show)
}
});
});
}




getSeasonByShowId(id) {
    return new Promise((resolve, reject) => {
        db.seasons.find({ showid: id }).sort({ season: 1 }).exec(function (err, show) {
            if (err) {
                reject(err);
} else if (show.length==0) {
    reject(Boom.notFound())
} else {


     var seasonlist= [];           
                for(var i=0; i<show.length; i++){
                     (function(j){
  show[j].iswatching =false;
   show[j].iswatched =false;
                         db.showWatching.findOne({'show.seasonid': show[j]._id}, (error, watching)=> {
                           

                             if (watching != null)
                             {
                                 show[j].iswatching =true;
                                  show[j].iswatched =false;
                             }

                               db.showWatched.findOne({'show.seasonid': show[j]._id }, (error, watching)=> {
                          
                             if (watching != null)
                             {
                                 show[j].iswatching =false;
                                  show[j].iswatched =true;
                             }
                              
seasonlist.push(show[j]);

                  if (seasonlist.length==show.length){   
                              
resolve(seasonlist);
                } });
                         })
                     })(i)

     
                }
                  // resolve(show)
}
                   });
});
}

getSeasonById(id) {
       return new Promise((resolve, reject) => {
           db.seasons.findOne({ _id: id }, (err, season) => {
               if (err) {
                   reject(err);
} else if (!season) {
       reject(Boom.notFound())
   } else {
                   resolve(season)
   }
   });
   });
}

getEpisodeById(id) {
       return new Promise((resolve, reject) => {
           db.episodes.findOne({ _id: id }, (err, episode) => {
               if (err) {
                   reject(err);
} else if (!episode) {
       reject(Boom.notFound())
   } else {


     db.settings.findOne({ folderName: 'tvshows' }, (err, setting) => {
            var folderpath = joinPath(setting.folderPath,'/');
  var filepath = joinPath(episode.file);
  filepath = filepath.replace(folderpath, '/dir3/')
episode.file=filepath;
                    resolve(episode)  
        }); 

                
   }
   });
   });
}

                   getEpisodeBySeasonId(id) {

                       
                       return new Promise((resolve, reject) => {
                           db.episodes.find({ seasonid: id }).sort({ episode: 1 }).exec(function (err, episodes) {
                               if (err) {
                                   reject(err);
                               } else if (episodes.length ==0) {
                                   reject(Boom.notFound())
                               } else {

     var episdoelist= [];           
 
         db.settings.findOne({ folderName: 'tvshows' }, (err, setting) => {
            var folderpath = joinPath(setting.folderPath,'/');

                for(var i=0; i<episodes.length; i++){
 var filepath = joinPath(episodes[i].file);
  filepath = filepath.replace(folderpath, '/dir3/')
episodes[i].file=filepath;

                     (function(j){

              

                         db.showWatching.findOne({'show._id': episodes[j]._id }, (error, watching)=> {
                            episodes[j].iswatching =false;
                                                          
                             if (watching != null)
                             {
                                 episodes[j].iswatching =true;
                             }

                             
                             episodes[j].episode = parseInt(episodes[j].episode)
episdoelist.push(episodes[j]);

                  if (episdoelist.length==episodes.length){   
var episdoelist2 =
                    episdoelist.sort(function(a, b) { 
  return a.episode - b.episode;
});

resolve(episdoelist);
                }
                         })
                     })(i)

     
                }


                //    resolve(episode)  
        }); 


             

                                  // resolve(episodes)
                               }
                           });
                   });
                   }

splitShowsIntoGenres(shows){
    let genres = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "Foreign", "History", "Horror", "Music", "Mystery", "Romance", "Science Fiction", "TV Movie", "Thriller", "War", "Western", "Home Shows"];
    let showsByGenre = [];

    genres.map(genre => {
        let genreEntry = { "genre": genre, shows: [] };
    genreEntry.shows = _.filter(shows, show => {
        return _.includes(show.genres, genre);
});
showsByGenre.push(genreEntry);
});

return showsByGenre;
}

selectRandomShows(genreCollection){
    let numberOfShowsToDisplayPerGenre = 20;
    genreCollection.map(collection => {
let randomShows = [];
     if (!collection.shows.length || collection.shows.length <= numberOfShowsToDisplayPerGenre)
{
if (!collection.shows.length) return;

        for(var i = 0; i < collection.shows.length; i++){
    randomShows.push(collection.shows[i]);
}

collection.shows = randomShows;

}

else {
    for(var i = 0; i < collection.shows.length; i++){
    randomShows.push(collection.shows[i]);
}}
collection.shows = randomShows;


});

return genreCollection;
}

save(show) {
    return new Promise((resolve, reject) => {
        db.shows.insert(show, (err, response) =>  {
            if (err) {
          reject(err);
} else {
        	resolve(response);
}
});
});
}

   update(show){
               return new Promise((resolve, reject) => {  

                     fs.access(show.poster.replace('posters','tmp'), fs.R_OK | fs.W_OK, function (err) {
  if (err){}else {fs.rename(show.poster.replace('posters','tmp'), show.poster);
fs.rename(show.backdrop.replace('backdrops','tmp'), show.backdrop);}
});
               db.shows.remove({ _id: show._id }, err => {         
        if (err) {
          reject({"success": false});
        } else {           
         db.shows.insert(show, (err, response) =>  {         
        if (err) {
          reject({"success": false});
        } else {           
          resolve({"success": true});
        }
      });
        }
      });    
    });}


saveSeasons(seasons) {
    return new Promise((resolve, reject) => {
        db.seasons.insert(seasons, (err, response) => {
            if (err) {
   				reject(err);
} else {
   				resolve(response);
}
});
});
}

updateSeasons(seasons) {

       return new Promise((resolve, reject) => {  


               db.seasons.findOne( {$and : [{season: parseInt(seasons[0].season)},{ showid: seasons[0].showid}]}, (err, response) =>  {         
        if (err) {
         // reject({"success": false});
        } else if(response) {           
          db.seasons.remove({ _id: response._id }, err => { 
          });
        }



        db.seasons.insert(seasons, (err, response) => {
            if (err) {
   				reject(err);
} else {
   				resolve(response);
}
});

      });
        

});
}


saveEpisode(episode) {
    return new Promise((resolve, reject) => {
        db.episodes.insert(episode, (err, response) => {
            if (err) {
   				reject(err);
} else {
   				resolve(response);
}
});
});
}

   updateEpisode(episode){
               return new Promise((resolve, reject) => { 

if (episode._id != null){



                     fs.access(episode.poster.replace('posters','tmp'), fs.R_OK | fs.W_OK, function (err) {
  if (err){}else {fs.rename(episode.poster.replace('posters','tmp'), episode.poster);
fs.rename(episode.backdrop.replace('backdrops','tmp'), episode.backdrop);}
});
               db.episodes.remove({ _id: episode._id }, err => {         
        if (err) {
          reject({"success": false});
        } else {           
           db.episodes.insert(episode, (err, response) =>  {         
        if (err) {
          reject({"success": false});
        } else {           
          resolve({"success": true});
        }
      });
        }
      });    
    }
    else {

        db.episodes.findOne({seasonid: episode.seasonid, episode: parseInt(episode.episode)}, (err, response) => {
            if (err) {
   				reject(err);
} else {
   			
               db.episodes.remove({ _id: episode._id }, err => {    });
}

});

      db.episodes.insert(episode, (err, response) =>  {         
        if (err) {
          reject({"success": false});
        } else {           
          resolve({"success": true});
        }
      });


    }
    });}

getByGenre(genre) {
    return new Promise((resolve, reject) => {
        db.shows.find({ genres: new RegExp(genre, 'i') }, (err, shows) => {
            if (err) {
                reject(err);
} else if (!shows.length) {
    reject(Boom.notFound(`No movies found for genre "${genre}"`));
} else {

       var seasonlist= [];           
                for(var i=0; i<shows.length; i++){
                     (function(j){
 shows[j].iswatching =false;
  shows[j].iswatched =false;
                         db.showWatching.findOne({'show.showid': shows[j]._id}, (error, watching)=> {
                           
                             if (watching != null)
                             {
                                 shows[j].iswatching =true;
                                  shows[j].iswatched =false;
                             }

                               db.showWatched.findOne({'show.showid': shows[j]._id }, (error, watching)=> {
                           
                             if (watching != null)
                             {
                                 shows[j].iswatching =false;
                                  shows[j].iswatched =true;
                             }
                              
seasonlist.push(shows[j]);

                  if (seasonlist.length==shows.length){   
                              
resolve(seasonlist);
                } });
                         })
                     })(i)

     
                }

                 //   resolve(shows);
}
});
});
}

getShowByTitle(title) {
    console.log(title);
    return new Promise((resolve, reject) => {
        db.shows.findOne({ title: new RegExp(title, 'i') }, (err, show) => {
            if (err) {
            reject(err);
} else if(!show) {
    reject(Boom.notFound(`No shows found by title "${title}"`));  
}
else {
             resolve(show);
}
});
});
}

   CheckShowExists(title) {
        return new Promise((resolve, reject) => {
            db.shows.findOne({ title : title }, (err, shows) => {
                if (err) {
                    reject(err);
                } else if (!shows) {
                    resolve({success:false});
                } else {
                    resolve({success:true, _id : shows._id});
                }
            });
        });
     }



getShowByInfo(title,season, episode) {
 
    return new Promise((resolve, reject) => {
        db.shows.findOne({ title: { $regex: new RegExp(title, 'i') }, season :season, episode:episode  }, (err, show) => {
            if (err) {
            reject(err);
} else if(!show) {
    reject(Boom.notFound(`No shows found by title "${title}"`));  
}
else {
             resolve(show);
}
});
});
}

getSeasonInfo(showId, season) {
    return new Promise((resolve, reject) => {
        db.seasons.findOne({ showid: showId, season: parseInt(season) }, (err, seasons) => {
            if (err) {
   				reject(err);
} else if (!seasons) {
    reject(Boom.notFound(`No season found for "${showId}"`));
} else {
   				resolve(seasons);
}
});
});
}


getSeasonInfoByShowIdAndSeason(showId, season) {
    return new Promise((resolve, reject) => {
        db.seasons.findOne({ showid: showId, season: parseInt(season) }, (err, seasons) => {
            if (err) {
   				reject(err);
}  else {
   				resolve(seasons);
}
});
});
}

getEpisodeInfo(seasonid, episode) {	
    return new Promise((resolve, reject) => {
        db.episodes.findOne({ seasonid: seasonid, episode: parseInt(episode).toString() }, (err, episodes) => {
            if (err) {
   				reject(err);
} else if (!episodes) {
    reject(Boom.notFound('No episodes found'));
} else {

resolve(episodes)
   				
}
});
});
}


getShowByEpisodeId(episodeId) {
 
    return new Promise((resolve, reject) => {

       db.episodes.findOne({_id: episodeId  }, (err, episode) => {
          
            if (err) {
            reject(err);
} else if(!episode) {
    reject(Boom.notFound(`No shows found by title "${episodeId}"`));  
}
else {

 //   (function(){

          db.seasons.findOne({ _id: episode.seasonid  }, (err, season) => {

            
            if (err) {
            reject(err);
} else if(!season) {
    reject(Boom.notFound(`No shows found by title "${episode.seasonid}"`));  
}
else {

    // (function(){
         
           db.shows.findOne({ _id: season.showid  }, (err, show) => {
            if (err) {
            reject(err);
} else if(!show) {
    reject(Boom.notFound(`No shows found by title "${season.showid}"`));  
}
else {
             resolve(show);
}
});

//});

           
}
});
 //   });


        
}
});


});
}


/**Start Download Show Info */

  _mapShowObject(movie, data){
        movie.title = data.Title;
        movie.released = data.Year;
        movie.runtime = data.Runtime;
        movie.description = data.Plot;
        movie.genres = data.Genre.split(', ');
        movie.cast = data.Actors.split(', ');
        movie.rated = data.Rated;
        movie.rating = data.Rating;
        movie.director = data.Director;
        movie.writer = data.Writer;
        movie.imdbid = data.imdbID;
        movie.seriesid= data.seriesid;
        return movie;
    }
  
  
	getSeasons(show, path,season_num) {		
       
		imdbservice.getSeasonsDataFromTmdb(show.tvid).then(showSeasons => {
                 
			if (showSeasons) {
			var seasons = [];
            settingRepository.getByName('posters').then(setting=> {
					for (var i = 0; i < showSeasons.length; i++) {
	
						if (showSeasons[i].season_number==season_num)
						{
									var newposter ="";					
							if (showSeasons[i].poster_path != null){
							newposter = joinPath(setting.folderPath , showSeasons[i].poster_path);
							}
							let season = {
							season: showSeasons[i].season_number,
							poster: newposter,
							showid: show._id,
							id: showSeasons[i].id
						}

						var response = { poster_path: showSeasons[i].poster_path, backdrop_path: '' };
						movieRepository._processBackdropAndPoster(response);

						seasons.push(season);
                      
						this.updateSeasons(seasons).then(() => {							
						this.getSeasonInfoByShowIdAndSeason(show._id, show.season).then(season => {
							if (season != null)
							{		
                         
							this.getEpisode(show, season._id, path);
                        }
                        else {
                             console.log("season not found");
                        }							
						});
					});
						}
					}
				});
			}
		});
	}

getEpisode(showObj, seasonid, path) {	

    imdbservice.getEpisodefromImdb(showObj.imdbid, showObj.season, showObj.episode).then(showimdb => {  
       if (showimdb.Response=="True"){
    imdbservice.getEpisodeDataFromTmdb(showObj.tvid, showObj.season, showObj.episode).then(showInfo => {
if (showInfo) {

										settingRepository.getByName('posters').then(setting => {
											settingRepository.getByName('backdrops').then(setting2 => {

												let showNewObj = {
													title: showimdb.title,
													released: showimdb._year_data,
													runtime: showimdb.runtime,
													description: showimdb.plot,
													genres: [],
													cast: [],
													rated: showimdb.rated,
													rating: showimdb.rating,
													director: showimdb.director,
													writer: showimdb.writer,
													imdbid: showimdb.imdbid,
													poster: showimdb.poster,
													season: showimdb.season,
													episode: showimdb.episode,
													seriesid: showimdb.seriesid
												};
												showNewObj.genres = showimdb.genre.split(', ');
												showNewObj.cast = showimdb.actors.split(', ');
												showNewObj.tvid = showInfo.id;
                                                showNewObj.backdrop = joinPath(setting2,showInfo.still_path);
												showNewObj.poster = joinPath(setting,showInfo.still_path);
                                                
												if (showInfo.still_path == undefined && showInfo.still_path == null){
													showNewObj.backdrop = "";
												showNewObj.poster = "";
												}
                                                else {
                                                    showNewObj.backdrop = joinPath(setting2,showInfo.still_path);
												showNewObj.poster = joinPath(setting,showInfo.still_path);
                                                }																							
												
												showNewObj.description = showInfo.overview;
												showNewObj.seasonid = seasonid;	
												showNewObj.file = path;
												showNewObj.vttfile = path.replace('.mp4', '.vtt');											
												var response = { poster_path: showInfo.still_path, backdrop_path: showInfo.still_path };
												this.updateEpisode(showNewObj).then(() => {
													movieRepository._processBackdropAndPoster(response);
													movieRepository._processCast(showNewObj.cast);
												});

											});

										});
											}

    });
}



    });
	}
    

    DownloadShowInfo(showid, tvid){

         return new Promise((resolve, reject) => {  

// imdbservice.getImdbIdromTvId(tvid).then(res=> 
// {
    var _imdbId=tvid;
      this.getByImdbIdandShowId(_imdbId,showid ).then(show=> {    

        if (show!= null){
reject(Boom.notFound());
        }
        else {    
//call if show not found
imdbservice.getMetadatabyId(_imdbId).then(response=> {   
    let showNewObj = this._mapShowObject({}, response);

imdbservice.getMetadataFromTmdb(response.imdbID).then(showInfo=> {

				 				showNewObj.tvid = showInfo.id;
				 				showNewObj.backdrop = showInfo.backdrop_path;
				 				showNewObj.poster = showInfo.poster_path;
				 				showNewObj.description = showInfo.overview;

	var response = { poster_path: showNewObj.poster, backdrop_path: showNewObj.backdrop }
                         movieRepository._processBackdropAndPoster(response);

settingRepository.getByName('posters').then(setting=> {

  showNewObj.poster='';  
                          if (showInfo.poster_path != null && showInfo.poster_path != "") {                           
		                showNewObj.poster = joinPath(setting.folderPath, showInfo.poster_path);                       
                          }
                                        settingRepository.getByName('backdrops').then(setting=> {     

                                     showNewObj.backdrop ='';
                                             if (showInfo.backdrop_path != null &&showInfo.backdrop_path != "")  {
		             showNewObj.backdrop = joinPath(setting.folderPath , showInfo.backdrop_path);
                          }  
                               

 db.shows.findOne({ _id: showid }, (err, movie) => {
                        
if (movie != null){
                        showNewObj._id = showid;
                              showNewObj.file=movie.file;
 showNewObj.vtt =movie.file.replace('.mp4', 'vtt');       
 showNewObj.season = movie.season;
		showNewObj.episode = movie.episode;  
        if (movie.file ==null)     movie.file='';
         this.update(showNewObj);
movieRepository._processCast(showNewObj.cast);
  this.getSeasons(showNewObj, movie.file, movie.season);
  resolve(showNewObj);
  
}
else { resolve(null);}
                                });                  
                   
                  
                     });});    

		});

                             
                           

            
});
        }
});

//});
});
    }


}

module.exports = ShowRepository;
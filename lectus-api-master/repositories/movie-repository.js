"use strict"
const _ = require('lodash'),
    Boom = require('boom'),
    db = require('../config/db'),
    	request = require('request'),
         SettingsRepository = require('../repositories/settings-repository'),
    settingRepository = new SettingsRepository(),
      ApiTheMovieDbRepository = require('../repositories/api-themoviedb-respository'),        
    apiRepository = new ApiTheMovieDbRepository(),    
       imdbservice = require('../services/imdb.service'), 
       imageService = require('../services/image.service'),
    fs = require('fs'),
      joinPath = require('path.join');

class MovieRepository {
    getRandomMovies() {
        return new Promise((resolve, reject) => {
            this.getAll()
                .then((movies) => {
                    var moviesSortedIntoGenres = this.splitMoviesIntoGenres(movies);
                    var randomlySelectedMovies = this.selectRandomMovies(moviesSortedIntoGenres);
                    resolve(randomlySelectedMovies);
                })
                .catch((err) => reject(err));
        });
    }


      getRandomMoviesByProfile(profile) {
        return new Promise((resolve, reject) => {
            this.getAllMovies(profile)
                .then((movies) => {
                     // console.log('getRandomMoviesByProfile :'+JSON.stringify(movies)); 
                     var moviesSortedIntoGenres = this.splitMoviesIntoGenres(movies);
                    var randomlySelectedMovies = this.selectRandomMovies(moviesSortedIntoGenres);
                    resolve(randomlySelectedMovies);
                })
                .catch((err) => reject(err));
        });
    }

    getAll() {
        return new Promise((resolve, reject) => {
            db.movies.find({}, (err, movies) => {
               //console.log('Movies'+movies);
                if (err) {
                    reject(err);
                } else {
                    resolve(movies);
                }
            });
        });
    }


       getAllMovies(profile) {
           
        return new Promise((resolve, reject) => {
            db.movies.find({}, (err, movies) => {
                if (err) {
                    reject(err);
                } else {
                 // console.log('length:'+movies.length);
                 var i =0;     
                 var movielist= [];           
                for(i=0; i<movies.length; i++){

                     (function(j){                       
                        
                       // console.log('j'+movies[j]._id);
                        movies[j].isWatching=false;  
                        movies[j].isWatching=false; 
                        movielist.push(movies[j]);             
                        resolve(movielist);
                           

           /*db.watching.findOne({watcher: profile, 'movie._id': movies[j]._id}, (err, item) => {     

                  if (err) {
                    movies[j].isWatching=false
                  } else {         
                      if (item != null){                       
                     movies[j].isWatching=true;            
                      movies[j].isWatched=false;                
                       }
                     else { 
                          movies[j].isWatching=false;           
                  }
              }    

             db.watched.findOne({watcher: profile, 'movie._id': movies[j]._id}, (err, watcheditem) => {     
                  if (err) {
                              movies[j].isWatched=false;
                  } else {         
                      if (watcheditem != null){  
                           movies[j].isWatching=false; 
                           movies[j].isWatched=true;                   
                       }
                     else {            
                            movies[j].isWatched=false;         
                  }
              }

                     movielist.push(movies[j]);  
                   if (movielist.length==movies.length-1)
                   {   
                                    
                        resolve(movielist);
                    } 

               });    
                }); */             
              })(i);
 }
                }
            });
        });
    }


  getByImdbIdandMovieId(imdbid,movieId) {
        return new Promise((resolve, reject) => {
            db.movies.findOne( {imdbid:imdbid, $not: { _id :movieId }}, (err, movie) => {

                if (err) {
                    reject(err);
                }  else {
                   resolve(movie);       
      }
            });
        });
    }

    getById(id) {
        return new Promise((resolve, reject) => {
            db.movies.findOne({ _id: id }, (err, movie) => {
                if (err) {
                    reject(err);
                } else if (!movie) {
                    reject(Boom.notFound())
                } else {
  db.settings.findOne({ folderName: 'movies' }, (err, setting) => {
            var folderpath = joinPath(setting.folderPath,'/');
  var filepath = joinPath(movie.file);
  filepath = filepath.replace(folderpath, '/dir/')
movie.file=filepath;
                   resolve(movie)
        });   
      }
            });
        });
    }

      getByFilePath(path) {
        return new Promise((resolve, reject) => {
            db.movies.findOne({ file: path }, (err, movie) => {
                if (err) {
                    reject(err);
                } else if (!movie) {
                    resolve(null)
                } else {
                   resolve(movie)}
        });     
           
        });
    }


    getByText(profile, text) {
        return new Promise((resolve, reject) => {
            db.movies.find({ $or: [{ title: new RegExp(text, 'i') }, { cast: new RegExp(text, 'i') }, { genres: new RegExp(text, 'i') }, { file: new RegExp(text, 'i') }] }, (err, movies) => {
                if (err) {
                    reject(err);
                } else if (!movies.length) {
                    reject(Boom.notFound(`No movies found "${text}"`));
                } else {     

                     var i =0;     
                 var movielist= [];           
                for(i=0; i<movies.length; i++){

                     (function(j){                       
                        

 db.watching.findOne({watcher: profile, 'movie._id': movies[j]._id}, (err, item) => {     
        if (err) {
          movies[j].isWatching=false
        } else {         
            if (item != null){                       
           movies[j].isWatching=true;            
            movies[j].isWatched=false;                
             }
           else { 
                movies[j].isWatching=false;           
        }
    }    

   db.watched.findOne({watcher: profile, 'movie._id': movies[j]._id}, (err, watcheditem) => {     
        if (err) {
                    movies[j].isWatched=false;
        } else {         
            if (watcheditem != null){  
                 movies[j].isWatching=false; 
            movies[j].isWatched=true;                   
             }
           else {            
                  movies[j].isWatched=false;         
        }
    }

movielist.push(movies[j]);  

         if (movielist.length==movies.length-1){   
                          
resolve(movielist);
                } 

     });    
      });
                      
              })(i);

    
 }

                   
                }
            });
        });
    }

    getByGenre(profile, genre) {
        return new Promise((resolve, reject) => {
            db.movies.find({ genres: new RegExp(genre, 'i') }, (err, movies) => {
                if (err) {
                    reject(err);
                } else if (!movies.length) {
                    reject(Boom.notFound(`No movies found for genre "${genre}"`));
                } else {


                     var i =0;     
                 var movielist= [];           
                for(i=0; i<movies.length; i++){

                     (function(j){                       
                        
              movielist.push(movies[j]);  

              if (movielist.length==movies.length-1){   
                        
              resolve(movielist);
              } 
/* db.watching.findOne({watcher: profile, 'movie._id': movies[j]._id}, (err, item) => {     
        if (err) {
          movies[j].isWatching=false
        } else {         
            if (item != null){                       
           movies[j].isWatching=true;            
            movies[j].isWatched=false;                
             }
           else { 
                movies[j].isWatching=false;           
        }
    }    

   db.watched.findOne({watcher: profile, 'movie._id': movies[j]._id}, (err, watcheditem) => {     
        if (err) {
                    movies[j].isWatched=false;
        } else {         
            if (watcheditem != null){  
                 movies[j].isWatching=false; 
            movies[j].isWatched=true;                   
             }
           else {            
                  movies[j].isWatched=false;         
        }
    }

movielist.push(movies[j]);  

         if (movielist.length==movies.length-1){   
                          
resolve(movielist);
                } 

     });    
      }); */
                      
              })(i);

    
 }


                  //  resolve(movies);
                }
            });
        });
    }

    getByTitle(title) {
        return new Promise((resolve, reject) => {
            db.movies.find({ title: new RegExp(title, 'i') }, (err, movies) => {
                if (err) {
                    reject(err);
                } else if (!movies.length) {
                    reject(Boom.notFound(`No movies found with title containing "${title}"`));
                } else {
                    resolve(movies);
                }
            });
        });
    }


     CheckMovieExists(title, filename) {
        return new Promise((resolve, reject) => {
          //  db.movies.findOne( {$or : [ { title : title}, { file :new RegExp(filename, 'i')  } ] }, (err, movies) => {
            db.movies.findOne( {$and : [ { title : title}, { file :new RegExp(filename, 'i')  } ] }, (err, movies) => {
                if (err) {
                    reject(err);
                } else if (!movies) {
                    resolve({success:false});
                } else {
                    resolve({success:true, _id : movies._id});
                }
            });
        });
     }


    getByActor(actor) {
        return new Promise((resolve, reject) => {
            db.movies.find({ cast: new RegExp(actor, 'i') }, (err, movies) => {
                if (err) {
                    reject(err);
                } else if (!movies.length) {
                    reject(Boom.notFound(`No movies found by actor "${actor}"`));
                } else {
                    resolve(movies);
                }
            });
        });
    }

    splitMoviesIntoGenres(movies) {
        let genres = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "Foreign", "History", "Horror", "Music", "Mystery", "Romance", "Science Fiction", "TV Movie", "Thriller", "War", "Western", "Home Movies"];
        let moviesByGenre = [];

        genres.map((genre) => {
            let genreEntry = { "genre": genre, movies: [] };
            genreEntry.movies = _.filter(movies, (movie) => {              
              return _.includes(movie.genres, genre);
            });           
            //var imagedata = base64_encode(genreEntry.movies.file);
            //genreEntry.movies.filedata = imagedata;
            moviesByGenre.push(genreEntry);
        });

        return moviesByGenre;
    };

    selectRandomMovies(genreCollection) {
        let numberOfMoviesToDisplayPerGenre = 20;
         

        genreCollection.map((collection) => {
 var randomMovies = [];       
    

       if (!collection.movies.length || collection.movies.length  <= numberOfMoviesToDisplayPerGenre )
           {

                for(var i = 0; i < collection.movies.length; i++ ){
           randomMovies.push(collection.movies[i]);
    }

               return randomMovies;
           
        }
           else{
   for (var i = 0; i < numberOfMoviesToDisplayPerGenre; i++) {   
                randomMovies.push(collection.movies[i]);
            }
           }
                      collection.movies = randomMovies;
        });

        return genreCollection;
    }

    remove(id) {
        return new Promise((resolve, reject) => {
            this.getById(id)
                .then((movie) => {
                    db.movies.remove({ _id: movie._id }, (err) => {
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

    removeByPath(path) {
        return new Promise((resolve, reject) => {
            this.getByFilePath(path)
                .then((movie) => {    

                    if (movie != null){

 db.movies.remove({ _id: movie._id }, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                              db.watching.remove({ 'movie._id': movie._id }, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    }); resolve();
                        }
                    });}
                    else {                     
                               db.episodes.findOne({ file: path }, (err, episode) => {
                                 

                        if (err) {
                            reject(err);
                        } else if(!episode) {                        
                            resolve();
                        }
                        else {                          

         db.episodes.remove({ _id: episode._id }, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                             db.showWatching.remove({ 'show._id': episode._id }, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                        }
                    });
                        }
                    });



                    


   

                    }
                })
                .catch((err) => reject(err));
        });
    }

  removeWatching(id) {
        return new Promise((resolve, reject) => {
            this.getById(id)
                .then((movie) => {
                    db.watching.remove({ _id: movie._id }, (err) => {
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


    // function to encode file data to base64 encoded string
    base64_encode(file) {
               // read binary data
        var bitmap = fs.readFileSync(file);
      // convert binary data to base64 encoded string
        return new Buffer(bitmap).toString('base64');
    }

save(movie){
         return new Promise((resolve, reject) => {
      db.movies.update({ title: movie.title }, movie, { upsert: true }, err => {
        if (err) {
          reject(err);
        } else {
          resolve(movie);
        }
      });
    });}

    update(movie){
     // console.log('for updation:');
      //console.log(movie);
               return new Promise((resolve, reject) => {  
   //commented           
  /* 
    fs.access(movie.poster.replace('posters','tmp'), fs.R_OK | fs.W_OK, function (err) {
    if (err){}else {fs.rename(movie.poster.replace('posters','tmp'), movie.poster);
    fs.rename(movie.backdrop.replace('backdrops','tmp'), movie.backdrop);}
    }); 
 */

    //-------------@ESFERA-------------------------------------------------------------
    fs.access(movie.poster.replace('posters','tmp'), fs.R_OK | fs.W_OK, function (err) 
     {
    if (err){

    }
    else
    {
      fs.rename(movie.poster.replace('posters','tmp'), movie.poster);
            
      }
    });

         fs.access(movie.backdrop.replace('backdrops','tmp'), fs.R_OK | fs.W_OK, function (err) 
     {
    if (err){

    }
    else
    {
        fs.rename(movie.backdrop.replace('backdrops','tmp'), movie.backdrop);
            
      }
    });

  //-----------------@ESFERA------------------------------------------------------------------
// fs.rename(movie.poster.replace('posters','tmp'), movie.poster);
// fs.rename(movie.backdrop.replace('backdrops','tmp'), movie.backdrop);

               db.movies.remove({ _id: movie._id }, err => {         
        if (err) {
          reject({"success": false});
        } else {           
          db.movies.update({ _id: movie._id }, movie, { upsert: true }, err => {         
        if (err) {
          reject({"success": false});
        } else {           
          resolve({"success": true});
        }
      });
        }
      });


    
    });}


/**Start Download Movie Info */

  _mapMovieObject(movie, data){
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
        return movie;
    }

 _processCast(cast){    
    if (cast){
        cast.map(actor => {
            imageService.getActorImage(actor)
              .then(image => {
                   settingRepository.getByName('actors').then(setting=> {
                  fs.writeFile(joinPath(setting.folderPath, actor + '.jpg'), image, 'binary', function (err) {
                      // todo: do something useful here (log error or something)
                  });
                   });
              });
        });
    }
}
     _processBackdropAndPoster(posterAndBackdropPath) {
        imageService.getPosterImage(posterAndBackdropPath.poster_path)
        .then(image => {
            if (posterAndBackdropPath.poster_path!= null) {
             settingRepository.getByName('posters').then(setting=> {              

            fs.writeFile(joinPath(setting.folderPath, posterAndBackdropPath.poster_path), image, 'binary', function (err) {
                // todo: do something useful here too
            });
        });
    }
        });
      imageService.getBackdropImage(posterAndBackdropPath.backdrop_path)
        .then(image => {

              if (posterAndBackdropPath.backdrop_path != null) {
               settingRepository.getByName('backdrops').then(setting=> {
            fs.writeFile(joinPath(setting.folderPath, posterAndBackdropPath.backdrop_path), image, 'binary', function (err) {
                // todo: do something useful here too
            });
              });
              }
        });
    }

    DownloadMovieInfo(movieid, tvid){
         return new Promise((resolve, reject) => {  

//apiRepository.getMovieDetailbyTvId(tvid).then(res=> 
//{
    var _imdbId  =tvid;
    
        this.getByImdbIdandMovieId(_imdbId,movieid ).then(movie=> {
        

        if (movie!= null){
reject(Boom.notFound());
        }
        else {    
//call if movie not found

imdbservice.getMetadatabyId(_imdbId).then(response=> {

 
    let newMovie = this._mapMovieObject({}, response);
//   newMovie.file = path;
// newMovie.vttfile = path.replace('.mp4', '.vtt');
                            imageService.getPosterAndBackdropPath(newMovie.imdbid, 'movies')
                .then(response => {          


 this._processBackdropAndPoster(response);
                	 settingRepository.getByName('posters').then(setting=> {
  newMovie.poster='';

                          if (response.poster_path != null) {                           
		                newMovie.poster = joinPath(setting.folderPath, response.poster_path);                       
                          }
                                        settingRepository.getByName('backdrops').then(setting=> {     

                                     newMovie.backdrop ='';
                                             if (response.poster_path != null) {
		             newMovie.backdrop = joinPath(setting.folderPath , response.backdrop_path);
                          }  

                                

 db.movies.findOne({ _id: movieid }, (err, movie) => {
                        
if (movie != null){
                        newMovie._id = movieid;
                              newMovie.file=movie.file;
 newMovie.vtt =newMovie.file.replace('.mp4', '.vtt');        
                  this.update(newMovie);

            
  this._processCast(newMovie.cast);
  resolve(newMovie);
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

module.exports = MovieRepository;
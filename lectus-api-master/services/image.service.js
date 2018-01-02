const request = require('request'),
      API_KEY = '3826993d2b0fe69554800426868bb782',
      https = require('https');

class ImageService {
  getActorImage(name) {
     return new Promise((resolve, reject) => {
      request.get(`https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&language=en-US&query=${name}`, (error, response, body) => {
        if (error) {         
          reject(error);
        }
else {
   // todo: what if there are multiple results?
        var bodyAsObject = JSON.parse(body);    
                 if (bodyAsObject.results != undefined){       
        var actor = bodyAsObject.results[0];
        if (actor != undefined && actor !=[])
        {
           if (actor.profile_path != undefined)
        {

        https.get(`https://image.tmdb.org/t/p/w300_and_h450_bestv2${actor.profile_path}`, function (profileResponse) {
          var image_data = '';
          profileResponse.setEncoding('binary');

          profileResponse.on('data', function (chunk) {
            image_data += chunk
          });

          profileResponse.on('end', function () {
            resolve(image_data)
          });
        });}  else { resolve();}
        }  else { resolve();}
         }
         else { resolve();}
}
     
      });
    });
  }

  getBackdropImage(backdropPath) {
    return new Promise((resolve) => {
      https.get(`https://image.tmdb.org/t/p/w500${backdropPath}`, function (backdropResponse) {
        var image_data = '';
        backdropResponse.setEncoding('binary');

        backdropResponse.on('data', function (chunk) {
          image_data += chunk
        });

        backdropResponse.on('end', function () {
          resolve(image_data)
        });
      });
    });
  }

  getPosterImage(posterPath) {
    return new Promise((resolve) => {
      https.get(`https://image.tmdb.org/t/p/w342${posterPath}`, function (posterResponse) {
        var image_data = '';
        posterResponse.setEncoding('binary');

        posterResponse.on('data', function (chunk) {
          image_data += chunk
        });

        posterResponse.on('end', function () {
          resolve(image_data);
        });
      });
    });
  }

  getPosterAndBackdropPath(imdbid, type) {

  	return new Promise((resolve) => {
      request.get(`https://api.themoviedb.org/3/find/${imdbid}?api_key=${API_KEY}&language=en-US&external_source=imdb_id`, (error, response, body) => {
        var responseAsObject = JSON.parse(body);
          var backdropPath = "", posterPath = "";

        if (type == 'movies'){
        	if (responseAsObject.movie_results != [] && responseAsObject.movie_results != undefined)
          {
 var movie = responseAsObject.movie_results[0];    
        if (movie != null){
                   if (movie.poster_path != undefined) 
              posterPath = movie.poster_path;
         
          if (movie.backdrop_path != undefined)
         backdropPath = movie.backdrop_path;
        }
          }
      }
      else if (type == 'episode')
      {
      	if (responseAsObject.tv_episode_results != [] && responseAsObject.tv_episode_results != undefined)
          {

         var episode = responseAsObject.tv_episode_results[0];
         
if (episode != null){
                   if (episode.still_path != undefined) 
              posterPath = episode.still_path;         
        //   if (movie.backdrop_path != undefined)
        //  backdropPath = movie.backdrop_path;
        }
      }}
       
        resolve({ poster_path: posterPath, backdrop_path: backdropPath });
      });
    });
  }

}

module.exports = new ImageService();
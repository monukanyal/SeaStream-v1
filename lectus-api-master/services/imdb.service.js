const 	request = require('request'),
 API_KEY = '3826993d2b0fe69554800426868bb782',
 apikey ="f853e223";
	

 class ImdbService {

	 getMetadatabyId(id) {		 		         
         return new Promise((resolve, reject) => {
    			request.get(`http://www.omdbapi.com/?i=${id}&plot=full&apikey=${apikey}`, (error, response, body) => {
    		    				if (error) {								
    					reject(error);
    				}
					else {	
						var bodyAsObject = JSON.parse(body);

					    				if (bodyAsObject != undefined && bodyAsObject != []) {
    					var movieDetails = bodyAsObject;						

					    resolve(movieDetails);
    				}
    				else { resolve();}
					}
    			});
    		});
  }

  getEpisodefromImdb(imdbid, season, episode) {				 	
         return new Promise((resolve, reject) => {					
    			request.get(`http://www.omdbapi.com/?i=${imdbid}&apikey=${apikey}&season=${season}&episode=${episode}`, (error, response, body) => {
    		
    				if (error) {
					    					reject(error);
    				}
					else {
						var bodyAsObject = JSON.parse(body);    
																    				if (bodyAsObject != undefined && bodyAsObject != []) {
    					var movieDetails = bodyAsObject;
					    resolve(movieDetails);
    				}
    				else { resolve();}
					}

						
    			});
    		});

  }

// 	 getMetadataFromTmdbByTitle(title) {	 

//          return new Promise((resolve, reject) => {
//     			request.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&page=1&query=${title}`, (error, response, body) => {
//     		    				if (error) {								
//     					reject(error);
//     				}
// 					else {	
// 						var bodyAsObject = JSON.parse(body); 

// 					    				if (bodyAsObject.results != undefined && bodyAsObject.results != []) {
//     					var movieDetails = bodyAsObject.results[0];						

// 					    resolve(movieDetails);
//     				}
//     				else { resolve();}
// 					}
//     			});
//     		});
//   }

	 getImdbIdromTvId(tvid) {			
         return new Promise((resolve, reject) => {					
    			request.get(`https://api.themoviedb.org/3/movie/${tvid}?api_key=${API_KEY}&language=en-US`, (error, response, body) => {
    		
    				if (error) {					
    					reject(error);
    				}
					else {
						var bodyAsObject = JSON.parse(body);   						
							
										    				if (bodyAsObject != undefined && bodyAsObject != []) {
    					var movieDetails = bodyAsObject;
					    resolve(movieDetails);
    				}
    				else { resolve();}
					}

						
    			});
    		});
  }

  

 getEpisodeImdbIdromTvId(tvid, season, episode) {				 	
         return new Promise((resolve, reject) => {					
    			request.get(`https://api.themoviedb.org/3/tv/${tvid}/season/${season}/episode/${episode}/external_ids?api_key=${API_KEY}&language=en-US`, (error, response, body) => {
    		
    				if (error) {
					    					reject(error);
    				}
					else {
						var bodyAsObject = JSON.parse(body);    
																    				if (bodyAsObject != undefined && bodyAsObject != []) {
    					var movieDetails = bodyAsObject;
					    resolve(movieDetails);
    				}
    				else { resolve();}
					}

						
    			});
    		});
  }

    getMetadataFromTmdb(imdb_id) {
   return new Promise((resolve, reject) => {
    			request.get(`https://api.themoviedb.org/3/find/${imdb_id}?api_key=${API_KEY}&language=en-US&external_source=imdb_id`, (error, response, body) => {
    		
    				if (error) {
					
    					reject(error);
    				}					
					else {
							var bodyAsObject = JSON.parse(body);						     						
					    				if (bodyAsObject.tv_results != undefined && bodyAsObject.tv_results != "") {									
    					var tvShowDetails = bodyAsObject.tv_results[0];
					    resolve(tvShowDetails);
    				}
					 			else if (bodyAsObject.movie_results != undefined && bodyAsObject.movie_results != "") {
    					var tvShowDetails = bodyAsObject.movie_results[0];
					    resolve(tvShowDetails);
    				}
    				else { 					
						resolve();}
					}

					
    			});
    		});
    }

    getSeasonsDataFromTmdb(tvid) {

	
    	return new Promise((resolve, reject) => {
    	request.get(`https://api.themoviedb.org/3/tv/${tvid}?api_key=${API_KEY}&language=en-US`, (error, response, body) => {
    			if (error) {
    						
    				reject(error);
    			}

else {
		    if (body) {
		    	var bodyAsObject = JSON.parse(body);
					
						if (bodyAsObject.seasons != undefined && bodyAsObject.seasons != []) {
    									    resolve(bodyAsObject.seasons);
    				}
		   
		    }
    			else { resolve(); }
}
    	
    		});
    	});
    }

    getEpisodeDataFromTmdb(tvid, season, episode) {	
    	return new Promise((resolve, reject) => {
			
    			request.get(`https://api.themoviedb.org/3/tv/${tvid}/season/${season}/episode/${episode}?api_key=${API_KEY}&language=en-US`, (error, response, body) => {
    			if (error) {
    				reject(error);
    			}
				else {
    			if (body) {
    				var bodyAsObject = JSON.parse(body);
    				resolve(bodyAsObject);
    			}
    			else { resolve(null); }
				}

    		
    		});
    	});
    }
 }

module.exports = new ImdbService();
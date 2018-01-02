  "use strict"
const _ = require('lodash'),
    Boom = require('boom'),
     request = require('request'),
      API_Key = '3826993d2b0fe69554800426868bb782',
	  apikey ="f853e223";

  class ApiTheMovieDbRepository {

	  getKeywords(keyword, type)
	  {		
                      return new Promise((resolve, reject) => {  
    			request.get('http://www.omdbapi.com/?s='+keyword+'&apikey='+apikey+'&Type='+type, (error, response, body) => {
    		    			                                                   if (error) {
																				 console.log("Api Error : "+ JSON.stringify(error));
																			
    					reject(error);
    				}
					else {	
						var bodyAsObject = JSON.parse(body);  
					//	console.log(JSON.stringify(body));
					    				if (bodyAsObject.Search != undefined && bodyAsObject.Search != []) {
    					var namelist = bodyAsObject.Search;						

					    resolve(namelist);
    				}
    				else { resolve();}
					}
    			});
    		});

		  
	  }

 getMovieKeywords(title){


                      return new Promise((resolve, reject) => {  
    			request.get('https://api.themoviedb.org/3/search/movie?api_key='+ API_Key+ '&query='+ title, (error, response, body) => {
    		    			                                                   if (error) {								
    					reject(error);
    				}
					else {	
						var bodyAsObject = JSON.parse(body);                      
					    				if (bodyAsObject.results != undefined && bodyAsObject.results != []) {
    					var namelist = bodyAsObject.results;						

					    resolve(namelist);
    				}
    				else { resolve();}
					}
    			});
    		});
    }

getTvKeywords(title){	
                   return new Promise((resolve, reject) => {  
    			request.get('https://api.themoviedb.org/3/search/tv?api_key='+ API_Key+ '&query='+ title, (error, response, body) => {
    		    				                   
                                if (error) {								
    					reject(error);
    				}
					else {	
						var bodyAsObject = JSON.parse(body); 
                        
					    				if (bodyAsObject.results != undefined && bodyAsObject.results != []) {
    					var namelist = bodyAsObject.results;						

					    resolve(namelist);
    				}
    				else { resolve();}
					}
    			});
    		});
    }

getMovieDetailbyTvId(tvid){
                   return new Promise((resolve, reject) => {  
    			request.get('https://api.themoviedb.org/3/movie/'+tvid+'?api_key='+ API_Key, (error, response, body) => {    		    				                   
                                if (error) {								
    					reject(error);
    				}
					else {	
						var bodyAsObject = JSON.parse(body);                         
					    				if (bodyAsObject != undefined && bodyAsObject != []) {  
					    resolve(bodyAsObject);
    				}
    				else { resolve();}
					}
    			});
    		});
    }

    getShowDetailbyTvId(tvid){
                   return new Promise((resolve, reject) => {  
    			request.get('https://api.themoviedb.org/3/tv/'+tvid+'?api_key='+ API_Key, (error, response, body) => {    		    				                   
                                if (error) {								
    					reject(error);
    				}
					else {	
						var bodyAsObject = JSON.parse(body);                         
					    				if (bodyAsObject != undefined && bodyAsObject != []) {  
					    resolve(bodyAsObject);
    				}
    				else { resolve();}
					}
    			});
    		});
    }

   }


module.exports = ApiTheMovieDbRepository;
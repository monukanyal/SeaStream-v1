"use strict"
const Datastore = require('nedb'),
      config = require('./config'),
          joinPath = require('path.join'),
  fs = require('fs'),
   osHomedir = require('os-homedir');
 
let db = {};
let baseDirectoryForDbFiles = config.db[process.env.NODE_ENV];
//let baseDirectoryForDbFiles = "undefined";
var rootFolder =osHomedir();
//var slash ='/';
rootFolder = rootFolder+ joinPath('/', 'Lectus files');

/*if (process.platform =='win32')
{
rootFolder = rootFolder +'\\Lectus files';
slash='\\';
}
else {
    rootFolder = rootFolder +'/Lectus files';
    slash ='/';
}*/

//var rootFolder = path.dirname(require.main.filename) + '\\files';
db.settings = new Datastore(joinPath(rootFolder,'databases','settings.db'));
db.movies = new Datastore(joinPath(rootFolder,'databases','movies.db'));
db.shows = new Datastore(joinPath(rootFolder,'databases','shows.db'));
db.profiles = new Datastore(joinPath(rootFolder,'databases','profiles.db'));
db.watched = new Datastore(joinPath(rootFolder,'databases','watched.db'));
db.watching = new Datastore(joinPath(rootFolder,'databases','watching.db'));
db.seasons = new Datastore(joinPath(rootFolder,'databases','seasons.db'));
db.episodes = new Datastore(joinPath(rootFolder,'databases','episodes.db'));
db.showWatching = new Datastore(joinPath(rootFolder,'databases','showWatching.db'));
db.showWatched = new Datastore(joinPath(rootFolder,'databases','showWatched.db'));

db.settings.loadDatabase();
db.movies.loadDatabase();
db.shows.loadDatabase();
db.profiles.loadDatabase();
db.watched.loadDatabase();
db.watching.loadDatabase();
db.seasons.loadDatabase();
db.episodes.loadDatabase();
db.showWatching.loadDatabase();
db.showWatched.loadDatabase();

db.settings.find({}, (err, settings) => {
                                 if (err) {           
                } else if (settings.length==0) { 
                    var paths = [];
paths.push({"folderName" : 'default', "folderPath" : rootFolder});
paths.push({"folderName" : 'movies', "folderPath" : joinPath(rootFolder,"movies")});
paths.push({"folderName" :'tvshows', "folderPath" :joinPath(rootFolder,"tvshows")});
paths.push({"folderName" :'music', "folderPath" :joinPath(rootFolder,"music")});
paths.push({"folderName" :'backdrops',"folderPath" :joinPath(rootFolder,"backdrops")});
paths.push({"folderName" :'posters', "folderPath" :joinPath(rootFolder,"posters")});
paths.push({"folderName" :'actors',"folderPath" :joinPath(rootFolder,"actors")});
paths.push({"folderName" :'uploads',"folderPath" :joinPath(rootFolder,"uploads")});
paths.push({"folderName" :'databases',"folderPath" :joinPath(rootFolder,"databases")});
paths.push({"folderName" :'temp',"folderPath" :joinPath(rootFolder,"tmp")});
             db.settings.remove({}, { multi: true }, () => {                      
                        db.settings.insert(paths, (err) => {
                           
                        });
                    });

                    for(var i=0; i<paths.length; i++){ 
var dir = paths[i].folderPath;
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}                  
}
                }
            else {
                var paths = [];
                                
                paths.push({"folderName" :'temp',"folderPath" :joinPath(rootFolder,"tmp")});
                    for(var i=0; i<paths.length; i++){ 
var dir = paths[i].folderPath;
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}                  
}
            } } );



module.exports = db;


       




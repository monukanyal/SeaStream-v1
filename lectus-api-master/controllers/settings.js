"use strict"
const express = require('express'),
    router = express.Router(),
    expressJoi = require('express-joi-validator'),
    SettingsRepository = require('../repositories/settings-repository'),
    settingRepository = new SettingsRepository(),
        fs = require('fs');

const Datastore = require('nedb'),
  config = require('../config/config');

let db = {};

router.get('/folders', (req, res, next) => {
    settingRepository.getByText()
        .then((setting) => res.json(setting))
        .catch((err) => next(err));
});

router.get('/getfolder/:name', (req, res, next) => {
         settingRepository.getByName(req.params.name)
        .then((setting) => res.json(setting))
        .catch((err) => next(err));
});

router.get('/defaultFolder', (req, res, next) => {
    settingRepository.getDefaultByText()
        .then((setting) => { if (setting.length > 0){ res.json({ success: true, data : setting }); }
    else {
        res.json({ success: false });
    }})
        .catch((err) => {res.json({ success: false });});
});

router.post('/updatemoviepath', expressJoi(require('../validators/setting')), (req, res, next) => {
    settingRepository.updateMoviePath(req.body.movieFolder)
        .then((setting) => res.json(setting))
        .catch((err) => next(err));
});


router.post('/updatedefaultpath', expressJoi(require('../validators/setting')), (req, res, next) => {
     var rootFolder =req.body.movieFolder;
    var paths = [];
    paths.push({"folderName" : 'default', "folderPath" : rootFolder});
   
     
                           
                           
paths.push({"folderName" : 'movies', "folderPath" : rootFolder + "\\movies"});
paths.push({"folderName" :'tvshows', "folderPath" :rootFolder + "\\tvshows"});
paths.push({"folderName" :'music', "folderPath" :rootFolder + "\\music"});
paths.push({"folderName" :'backdrops',"folderPath" : rootFolder+"\\backdrops"});
paths.push({"folderName" :'posters', "folderPath" :rootFolder+"\\posters"});
paths.push({"folderName" :'actors',"folderPath" : rootFolder+"\\actors"});
paths.push({"folderName" :'uploads',"folderPath" : rootFolder+"\\uploads"});
paths.push({"folderName" :'databases',"folderPath" : rootFolder+"\\databases"});
paths.push({"folderName" :'temp',"folderPath" : rootFolder+"\\tmp"});
            //update default url
    settingRepository.updateDefaultFolderPath(paths)
        .then((setting) => { res.json(setting);

for(var i=0; i<paths.length; i++){ 
var dir = paths[i].folderPath;
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}                  
}
//          db.movies = new Datastore(rootFolder +'databases\\movies.db');
// db.shows = new Datastore(rootFolder +'databases\\shows.db');
// db.profiles = new Datastore(rootFolder +'databases\\profiles.db');
// db.watched = new Datastore(rootFolder +'databases\\watched.db');
// db.watching = new Datastore(rootFolder +'databases\\watching.db');
// db.settings = new Datastore(rootFolder +'databases\\settings.db');


// db.movies.loadDatabase();
// db.shows.loadDatabase();
// db.profiles.loadDatabase();
// db.watched.loadDatabase();
// db.watching.loadDatabase();
// db.settings.loadDatabase();            
 })
        .catch((err) => res.json(err));
});


router.post('/updatefolderspath', expressJoi(require('../validators/setting-folders')), (req, res, next) => {   
    
var moviefolder = req.body.movies;
var rootFolder ="C:\\files\\";

 settingRepository.getByName('default')
        .then((setting) => 
        {
rootFolder = setting.folderPath;

var paths = [];
paths.push({"folderName" : 'default', "folderPath" : rootFolder});
paths.push({"folderName" : 'movies', "folderPath" : req.body.movies});
paths.push({"folderName" :'tvshows', "folderPath" :req.body.tvShows});
paths.push({"folderName" :'music', "folderPath" : rootFolder+"\\music"});
paths.push({"folderName" :'backdrops',"folderPath" : rootFolder+"\\backdrops"});
paths.push({"folderName" :'posters', "folderPath" :rootFolder+"\\posters"});
paths.push({"folderName" :'actors',"folderPath" : rootFolder+"\\actors"});
paths.push({"folderName" :'uploads',"folderPath" : rootFolder+"\\uploads"});
paths.push({"folderName" :'databases',"folderPath" : rootFolder+"\\databases"});
paths.push({"folderName" :'temp',"folderPath" : rootFolder+"\\tmp"});

    //update movies url
    settingRepository.updateFolderPath(paths)
        .then((setting) => { res.json(setting);
for(var i=0; i<paths.length; i++){ 
var dir = paths[i].folderPath;
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}                  
} })
        .catch((err) => res.json(err));

//  //update default url
//     settingRepository.updateDefaultFolderPath(paths)
//         .then((setting) => { res.json(setting);
// for(var i=0; i<paths.length; i++){ 
// var dir = paths[i].folderPath;
// if (!fs.existsSync(dir)){
//     fs.mkdirSync(dir);
// }                  
// } })
//         .catch((err) => res.json(err));
        })
        .catch((err) => next(err));



// if (moviefolder.indexOf('/') > -1)
// {
// rootFolder = moviefolder.replace(moviefolder.split('/')[moviefolder.split('/').length - 1], '')
// }
// else {
//   rootFolder = moviefolder.replace(moviefolder.split('\\')[moviefolder.split('\\').length - 1], '')
// }
   // var folderpath = req.body.movies.replace(req.body.movies);


    //     //update backdrops url
    // settingRepository.updateFolderPath('backdrops', rootFolder+"backdrops")
    //     .then((setting) => res.json(setting))
    //     .catch((err) => next(err));

    // //update tvShows url
    // settingRepository.updateFolderPath('tvshows', req.body.tvShows)
    //     .then((setting) => res.json(setting))
    //     .catch((err) => next(err));

    // //update music url
    // settingRepository.updateFolderPath('music', req.body.music)
    //     .then((setting) => res.json(setting))
    //     .catch((err) => next(err));



    //     //update posters url
    // settingRepository.updateFolderPath('posters', rootFolder+"posters")
    //     .then((setting) => res.json(setting))
    //     .catch((err) => next(err));

    //     //update actors url
    // settingRepository.updateFolderPath('actors', rootFolder+"actors")
    //     .then((setting) => res.json(setting))
    //     .catch((err) => next(err));

    //         //update uploads url
    // settingRepository.updateFolderPath('uploads', rootFolder+"uploads")
    //     .then((setting) => res.json(setting))
    //     .catch((err) => next(err));
});

module.exports = router;

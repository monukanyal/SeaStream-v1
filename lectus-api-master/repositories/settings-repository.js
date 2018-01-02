"use strict"
const Boom = require('boom'),
    db = require('../config/db');

class SettingsRepository {

    getByText() {
        return new Promise((resolve, reject) => {
           
            db.settings.find({}, (err, settings) => {
                if (err) {
                    reject(err);
                } else if (settings.length == 0) {
                    reject(Boom.notFound(`No setting found`));
                } else {
                    resolve(settings);
                }
            });
        });
    }

      getByName(text) {
        return new Promise((resolve, reject) => {         
            db.settings.findOne({ folderName: text }, (err, setting) => {
                if (err) {
                    reject(err);
                } else if (setting == null) {
                    reject(Boom.notFound(`No setting found`));
                } else {
                    resolve(setting);
                }
            });
        });
    }
    
    getDefaultByText() {
        return new Promise((resolve, reject) => {
                        db.defaultSetting.find({}, (err, settings) => {
                                 if (err) {
                    reject(err);
                } else if (settings.length == 0) {
                    reject(Boom.notFound(`No setting found`));
                } else {
                    resolve(settings);
                }
            });
        });
    }


    updateMoviePath(url) {
        return new Promise((resolve, reject) => {
            db.settings.findOne({ folderName: new RegExp('movies', 'i') }, (err, settings) => {
                
                if (err) {
                    reject(err);
                } else if (settings == null) {
                    reject(Boom.notFound(`No setting found "${'movies'}"`));
                } else {
                    var settingObj = settings;
                    settingObj.folderPath = url;
                    db.settings.remove({ _id: settingObj._id }, { multi: true }, () => {
                        db.settings.insert(settingObj, (err) => {
                            if (err) {
                              
                            } else {
                                                              resolve(settingObj);
                            }
                        });
                    });


                    //// resolve(settings);
                    //db.settings.update({ _id: settingObj._id }, { $set: { folderPath: settingObj.folderPath } }, { upsert: true }, function () {
                    //    // A new document { _id: 'id5', planet: 'Pluton', distance: 38 } has been added to the collection  
                    //    resolve(settingObj);
                    //});
                }
            });
        });
    }

    // updateFolderPath(paths) {
    //     return new Promise((resolve, reject) => {
            
    //         db.settings.findOne({ $or: [{ folderName: 'movies' }] }, (err, settings) => {
    //                            if (err) {
                    
    //             }  else {
    //                 var settingObj = settings;
    //                 settingObj.folderPath = url;
    //                 db.settings.remove({ _id: settingObj._id }, { multi: true }, () => {
    //                     db.settings.insert(settingObj, (err) => {
    //                         if (err) {
                             
    //                         } else {                               
    //                             resolve(settingObj);
    //                         }
    //                     });
    //                 });


    //                 //// resolve(settings);
    //                 //db.settings.update({ _id: settingObj._id }, { $set: { folderPath: settingObj.folderPath } }, { upsert: true }, function () {
    //                 //    // A new document { _id: 'id5', planet: 'Pluton', distance: 38 } has been added to the collection  
    //                 //    resolve(settingObj);
    //                 //});
    //             }
    //         });
    //     });
    // }


      updateFolderPath(paths) {
        return new Promise((resolve, reject) => {
            
                               db.settings.remove({}, { multi: true }, () => {
                      
                        db.settings.insert(paths, (err) => {
                            if (err) {
                             
                            } else {                               
                                resolve(paths);
                            }
                        });
                    });


                    //// resolve(settings);
                    //db.settings.update({ _id: settingObj._id }, { $set: { folderPath: settingObj.folderPath } }, { upsert: true }, function () {
                    //    // A new document { _id: 'id5', planet: 'Pluton', distance: 38 } has been added to the collection  
                    //    resolve(settingObj);
                    //});
                }
            );
  
    }
    
    //    updateDefaultFolderPath(paths) {
    //                return new Promise((resolve, reject) => {            
    //                            db.defaultSetting.remove({}, { multi: true }, () => {                      
    //                     db.defaultSetting.insert(paths, (err) => {
    //                         if (err) {
    //                        reject(err);
    //                         } else {                                    
    //                                                            resolve(paths);
    //                         }
    //                     });
    //                 });
    //             }
    //         );
  
    // }
}

module.exports = SettingsRepository;
"use strict"
const Boom = require('boom'),
 _ = require('lodash'),
    db = require('../config/db'),
    fs = require('fs');

class ProfileRepository {

    getAll() {
        return new Promise((resolve, reject) => {
            db.profiles.find({}, (err, profiles) => {
                if (err) {
                    reject(err);
                } else {
              resolve(profiles);
                }
            });
        });
    }


    getByName(name) {
        return new Promise((resolve, reject) => {
            db.profiles.findOne({ name: new RegExp(name, 'i') }, (err, profile) => {
                if (err) {
                    reject(err);
                } else if (!profile) {
                    reject(Boom.notFound());
                } else {                   
                    resolve(profile);
                }
            });
        });
    }

    save(profileToSave) {
        return new Promise((resolve, reject) => {
            db.profiles.insert(profileToSave, (err, newProfile) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(newProfile);
                }
            });
        });
    }

    createInitialProfile(profile) {
        return new Promise((resolve, reject) => {
            db.profiles.find({ isAdmin: true }, (err, profiles) => {
                if (err) {
                    reject(err);
                } else if (profiles.length >= 1) {
                    reject(Boom.forbidden());
                } else {
                    profile.isAdmin = true;
                    this.save(profile)
                        .then((newProfile) => resolve(newProfile))
                        .catch((err) => reject(err));
                }
            });
        });
    }

    UpdateProfile(profile) {
		        return new Promise((resolve, reject) => {



            if (profile.filePath != undefined && profile.filePath != null)
            {

                fs.stat(profile.filePath.replace('uploads', 'tmp'), function(err, stat) {
    if(err == null) {
       fs.rename(profile.filePath.replace('uploads', 'tmp'), profile.filePath);
    } 
});
            }
                
                    
            db.profiles.findOne({ name: profile.id }, (err, profiles) => {
                if (err) {
                    reject(err);
                } else if (profiles != null) {
                    
                    var profileObj = profiles;
                    profileObj.filePath = profile.filePath;
                    profileObj.name = profile.id;
                    profileObj.fullName = profile.name

                                                          db.profiles.remove({ _id: profileObj._id }, function () {
                  
                                       db.profiles.insert(profileObj, function () {
                        // A new document { _id: 'id5', planet: 'Pluton', distance: 38 } has been added to the collection  
                        resolve(profileObj);
                    });
                                                          });
                    

                } else {
                    reject(Boom.forbidden());
                }
            });
        });
    }

    createNewProfile(profile) {
        return new Promise((resolve, reject) => {

            if (profile.filePath != undefined && profile.filePath != null)
            {

                fs.stat(profile.filePath.replace('uploads', 'tmp'), function(err, stat) {
    if(err == null) {
       fs.rename(profile.filePath.replace('uploads', 'tmp'), profile.filePath);
    } 
});

            }



            db.profiles.find({ name: profile.name }, (err, profiles) => {
                if (err) {
                    reject(err);
                } else if (profiles.length >= 1) {
                    reject(Boom.forbidden());
                } else {
                    // profile.isAdmin = true;
                    this.save(profile)
                        .then((newProfile) => resolve(newProfile))
                        .catch((err) => reject(err));
                }
            });
        });
    }

 changePassword(profile) {
        return new Promise((resolve, reject) => {
            db.profiles.findOne({ $and: [{ name: profile.name }, { password: profile.oldpassword }]}, (err, profiles) => {
                if (err) {
                    reject(err);
                } else if (profiles != null) {                    
                    var profileObj = profiles; 
                      db.profiles.update({ _id: profileObj._id }, {$set : { password: profile.newpassword  }}, {}, function () {
                        // A new document { _id: 'id5', planet: 'Pluton', distance: 38 } has been added to the collection  
                        resolve(profileObj);
                    });
                    } else {
                   reject(Boom.forbidden());
                }
            });
        });
    }

    // function to encode file data to base64 encoded string
    base64_encode(file) {
               if (file != undefined) {

            // read binary data
            var bitmap = fs.readFileSync(file);
            // convert binary data to base64 encoded string
            return new Buffer(bitmap).toString('base64');
        }
        return '';
    }

}

module.exports = ProfileRepository;
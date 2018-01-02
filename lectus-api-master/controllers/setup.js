"use strict"
const express = require('express'),
      router = express.Router(),
      expressJoi = require('express-joi-validator'),
      ProfileRepository = require('../repositories/profile.repository'),
      profileRepository = new ProfileRepository(),
       LicenseService = require('../services/licence.service'),
      licenseService = new LicenseService();

router.post('/profile', expressJoi(require('../validators/new-profile')),(req, res, next) => {
  profileRepository.createInitialProfile(req.body.profile)
    .then((newProfile) => res.json(newProfile))
    .catch((err) => next(err));
});

router.post('/newprofile', expressJoi(require('../validators/new-profile')), (req, res, next) => {

    licenseService.getLicence(req.body.profile.name, req.body.profile.password).then(response => {

if (response){
  profileRepository.createNewProfile(req.body.profile)
        .then((newProfile) =>    
        {
 newProfile.licenseKey = response;
         res.json(newProfile);
        } )  
       
        .catch((err) => next(err));
}
else {
    var newProfile = req.body.profile;
    newProfile.licenseKey = "Access Denied!";
         res.json(newProfile);
 //res.json("Access Denied!");
}
  
        }).catch((err) => next(err));
});

module.exports = router;
"use strict"
const express = require('express'),
    router = express.Router(),
    expressJoi = require('express-joi-validator'),
    ProfileRepository = require('../repositories/profile.repository'),
    profileRepository = new ProfileRepository(),
        LicenceService = require('../services/licence.service'),     
        licenceService = new  LicenceService(),
    TokenService = require('../services/token.service'),
    tokenService = new TokenService();


router.get('/', (req, res, next) => {
    profileRepository.getAll()
        .then((profiles) => res.json(profiles))
        .catch((err) => next(err))
});

router.get('/:name', (req, res, next) => {
    profileRepository.getByName(req.params.name)
        .then((profile) => {
            let token = tokenService.generate(profile);
            res.json({ success: true, data: token, obj: profile });
        })
        .catch((err) =>  res.json({ success: false, data: '', obj: [] }));
});

router.post('/userlogin', expressJoi(require('../validators/login-user')), (req, res, next) => {
    profileRepository.getByName(req.body.name)
        .then((profile) => {
             let token = tokenService.generate(profile);
           if (profile.password ==req.body.password)           
           {res.json({ success: true, data: token });
        }
        else { res.json({ success: false });}
           
        })
        .catch((err) => next(err));
});

router.post('/changepassword', expressJoi(require('../validators/change-password')), (req, res, next) => {
    profileRepository.changePassword(req.body)
        .then((profile) => {          
            res.json({ success: true });
        })
        .catch((err) => next(err));
});


router.post('/updateprofile', expressJoi(require('../validators/user-profile')), (req, res, next) => {
    profileRepository.UpdateProfile(req.body)
        .then((profile) => {
            // let token = tokenService.generate(profile);
            res.json({ success: true });
        })
        .catch((err) => next(err));
});

router.post('/createnewprofile', expressJoi(require('../validators/create-new-profile')), (req, res, next) => {
      profileRepository.createNewProfile(req.body)
        .then((profile) => {
            // let token = tokenService.generate(profile);
            res.json({ success: true });
        })
        .catch((err) => { res.json({ success: false });});
});

router.post('/remove/:id', expressJoi(require('../validators/user-profile')), (req, res, next) => {
    profileRepository.createNewProfile(req.body)
        .then((profile) => {
            // let token = tokenService.generate(profile);
            res.json({ success: true });
        })
        .catch((err) => next(err));
});


    router.post('/getLicence', (req, res, next) => {     

        var email = req.body.email;
        var password = req.body.password;
        
    console.log(email);

licenceService.getLicence(email, password).then((response) => res.json(response))
    .catch((err) => next(err));

//   movieRepository.removeByPath(req.body.path)
//         .then((response) => res.json(response))
//         .catch((err) => next(err));
     
}); 

module.exports = router;


"use strict"
const Boom = require('boom'),
      TokenService = require('../services/token.service'),
      tokenService = new TokenService(),
      ProfileRepository = require('../repositories/profile.repository'),
      profileRepository = new ProfileRepository();

let verifyToken = (req, res, next) => {

  if (req.method === 'OPTIONS') {
    return next();
  }

  var token = req.headers['x-access-token'];
  if (!token) {
    return next(Boom.forbidden('No token provided.'));
  }
  req.profile = { name: 'lectus', isAdmin: true };
  //return next();
    tokenService.verify(token)
      .then((decodedToken) => {
        profileRepository.getByName(decodedToken.name)
          .then((profile) => {
            req.profile = { name: profile.name, isAdmin: profile.isAdmin };
            return next();
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => next(err));
};

module.exports = verifyToken;
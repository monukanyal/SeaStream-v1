"use strict"
const jwt = require('jsonwebtoken'),
      config = require('../config/config');

class TokenService {
  generate(object){
    let token = jwt.sign(object, config.auth.secret);
    return token;
  }

  verify(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.auth.secret, (err, decodedToken) => {
        if (err) {
          reject(err);
        }
        resolve(decodedToken);
      });
    });
  }
}

module.exports = TokenService;
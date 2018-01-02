"use strict"
const Boom = require('boom');

let adminsOnly = (req, res, next) => {
  if (!req.profile.isAdmin) {
    return next(Boom.forbidden());
  }
  next();
};

module.exports = adminsOnly;
"use strict"
const Boom = require('boom');

let errorHandler = (err, req, res, next) => {

  if (!err.isBoom) {
    err = Boom.create(err.status || 500, err.message, err.data);
  }

  if(process.env.NODE_ENV === 'prod') {
    delete err.stack;
  }

  // todo: add logging here

  res.status(err.output.statusCode).json(err.output.payload);
};

module.exports = errorHandler;
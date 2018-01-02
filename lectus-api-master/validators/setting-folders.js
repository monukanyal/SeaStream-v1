const Joi = require('joi');

module.exports = {
    body: {
        movies: Joi.string().required(),
        tvShows: Joi.string()     
    }
};
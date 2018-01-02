

const Joi = require('joi');

module.exports = {
    body: {
        movieFolder: Joi.string().required()
    }
};
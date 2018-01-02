

const Joi = require('joi');

module.exports = {
    body: {
        filePath: Joi.string().required(),
        name: Joi.string().min(2).max(20).required(),
        id: Joi.string().required()

    }
};
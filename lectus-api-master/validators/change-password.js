

const Joi = require('joi');

module.exports = {
    body: {
              name: Joi.string().required(),
        oldpassword: Joi.string().required(),
        newpassword: Joi.string().required()

    }
};
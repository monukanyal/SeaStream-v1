const Joi = require('joi');

module.exports = {
    body: {
        profile: {
            name: Joi.string().min(2).max(20).required(),
            isAdmin: Joi.boolean(),
            password: Joi.string(),
            fullName : Joi.string()
        }
    }
};

const Joi = require('joi');

module.exports = {
    body: {
       
            name: Joi.string().alphanum().required(),
            isAdmin: Joi.boolean(),
            filePath: Joi.string().required(),
            password:Joi.string().required(),
        fullName : Joi.string()
    }
};

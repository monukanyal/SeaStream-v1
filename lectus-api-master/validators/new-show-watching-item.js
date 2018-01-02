const Joi = require('joi');

module.exports = {
  body: {
    item: {
      show: {
        _id: Joi.string().regex(new RegExp("^[0-9a-zA-Z]{16}$")).required(),
        title: Joi.string(),
        poster:Joi.string(),
        showid :Joi.string(),
        seasonid :Joi.string()
      },
      time: Joi.number().required()
    }
  }
};
const Joi = require('joi');

module.exports = {
  body: {
    item: {
      movie: {
        _id: Joi.string().regex(new RegExp("^[0-9a-zA-Z]{16}$")).required(),
        title: Joi.string(),
        poster:Joi.string()
      },
      date: Joi.date()
    }
  }
};
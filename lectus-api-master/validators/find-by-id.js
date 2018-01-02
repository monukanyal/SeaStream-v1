const Joi = require('joi');

module.exports = {
  params: {
    id: Joi.string().regex(new RegExp("^[0-9a-zA-Z]{16}$")).required()
  }
};
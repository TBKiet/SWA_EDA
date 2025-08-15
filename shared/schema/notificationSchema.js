const Joi = require('joi');

module.exports = Joi.object({
  userId: Joi.number().required(),
  message: Joi.string().required(),
});

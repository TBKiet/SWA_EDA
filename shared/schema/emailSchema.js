const Joi = require('joi');

module.exports = Joi.object({
  userId: Joi.number().required(),
  subject: Joi.string().required(),
  body: Joi.string().required(),
});

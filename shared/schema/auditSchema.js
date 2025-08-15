const Joi = require('joi');

module.exports = Joi.object({
  eventType: Joi.string().required(),
  data: Joi.object().required(),
});

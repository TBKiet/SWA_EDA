const Joi = require('joi');

module.exports = Joi.object({
  userId: Joi.number().required(),
  eventId: Joi.number().required(),
});

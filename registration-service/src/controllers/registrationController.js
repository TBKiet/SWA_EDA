const registrationService = require('../services/registrationService');

module.exports = {
  createRegistration: async (request, reply) => {
    try {
      const { userId, eventId, userEmail, userPhone, userDeviceToken } = request.body;

      if (!userId || !eventId) {
        return reply.code(400).send({ error: 'Missing userId or eventId' });
      }

      const registration = await registrationService.createRegistration({
        userId,
        eventId,
        userEmail,
        userPhone,
        userDeviceToken,
      });

      reply.code(201).send(registration);
    } catch (err) {
      request.log.error('❌ Error in createRegistration controller:', err);
      reply.code(500).send({ error: err.message });
    }
  },
};

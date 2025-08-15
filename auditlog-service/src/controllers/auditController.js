const { logAudit } = require('../producers/auditLogged');

module.exports = {
  logAudit: async (request, reply) => {
    try {
      const { eventType, data } = request.body;
      if (!eventType || !data) {
        return reply.status(400).send({ error: 'Missing eventType or data' });
      }

      const log = await logAudit({ eventType, data });
      reply.status(201).send({ message: 'Audit log created', log });
    } catch (error) {
      request.log.error(`Failed to process audit log: ${error.message}`);
      reply.status(500).send({ error: 'Failed to process audit log' });
    }
  },
};
const notificationService = require('../services/notificationService');

module.exports = {
  sendNotification: async (request, reply) => {
    const { userId, message } = request.body;
    await notificationService.sendNotification({ userId, message });
    reply.code(200).send({ message: 'Notification sent' });
  },
};

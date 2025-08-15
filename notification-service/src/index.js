const fastify = require('fastify')({ logger: true });
const notificationController = require('./controllers/notificationController');
const { ensureKafkaTopics } = require('../shared/utils/kafkaInit');
const consumeRegistrationCreated = require('./consumers/registrationCreated');

fastify.post('/notifications', notificationController.sendNotification);

const start = async () => {
  try {
    await ensureKafkaTopics();
    await consumeRegistrationCreated();
    await fastify.listen({ port: 3004, host: '0.0.0.0' });
    fastify.log.info('Notification Service running on port 3004');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

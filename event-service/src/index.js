const fastify = require('fastify')({ logger: true });
const eventController = require('./controllers/eventController');
const sequelize = require('./utils/db');
const { ensureKafkaTopics } = require('../shared/utils/kafkaInit');
const consumeRegistrationCreated = require('./consumers/createdConsumer');

fastify.post('/events', eventController.createEvent);
fastify.get('/events', eventController.getEvents);

const start = async () => {
  try {
    await sequelize.sync();
    await ensureKafkaTopics();

    await consumeRegistrationCreated(); // 👈 PHẢI GỌI NÓ Ở ĐÂY

    await fastify.listen({ port: 3002, host: '0.0.0.0' });
    fastify.log.info('✅ Event Service running on port 3002');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

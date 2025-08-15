const fastify = require('fastify')({ logger: true });
const app = require('./app');

const start = async () => {
  try {
    await fastify.register(app);
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    fastify.log.info('User Service running on port 3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

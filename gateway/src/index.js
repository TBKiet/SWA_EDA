const fastify = require('fastify')({ logger: true });
const config = require('./config/config');
const cors = require('@fastify/cors');

const start = async () => {
  try {
    await fastify.register(cors, {
      origin: '*', // Cho phép tất cả các nguồn
    });

    fastify.register(require('./routes'));

    await fastify.listen({ port: config.port, host: '0.0.0.0' });
    fastify.log.info(`Gateway running on port ${config.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); // 👈 bắt đầu server

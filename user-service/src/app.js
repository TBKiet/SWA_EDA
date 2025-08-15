const userController = require('./controllers/userController');
const sequelize = require('./utils/db');
const { ensureKafkaTopics } = require('../../shared/utils/kafkaInit');

async function routes(fastify, options) {
  // Đăng ký route
  fastify.post('/users', userController.createUser);
  fastify.post('/auth/login', userController.loginUser);

  // Khởi tạo DB và Kafka (chỉ trong môi trường production/development)
  if (process.env.NODE_ENV !== 'test') {
    await ensureKafkaTopics();
    await sequelize.sync();
  }
}

module.exports = routes;

const userService = require('../services/userService');
const sendUserCreatedEvent = require('../producers/userCreated');
const sendUserLoggedInEvent = require('../producers/userLoggedIn');

module.exports = {
  createUser: async (request, reply) => {
    try {
      request.log.info('🔍 createUser controller called with body:', request.body);
      const { username, email, password, phone, deviceToken } = request.body;

      if (!username || !email || !password) {
        return reply.code(400).send({ error: 'Missing required fields: username, email, password' });
      }

      const user = await userService.createUser({ username, email, password, phone, deviceToken });

      // Gửi sự kiện USER_CREATED + AUDIT
      await sendUserCreatedEvent(user);

      reply.code(201).send(user);
    } catch (error) {
      request.log.error('❌ Error in createUser controller:', error);

      if (error.name === 'SequelizeValidationError') {
        return reply.code(400).send({ error: error.errors.map(e => e.message) });
      }

      reply.code(500).send({ error: error.message });
    }
  },

  loginUser: async (request, reply) => {
    try {
      const { email, password } = request.body;
      if (!email || !password) {
        return reply.code(400).send({ error: 'Missing email or password' });
      }

      const user = await userService.authenticateUser(email, password);

      // Gửi sự kiện USER_LOGGED_IN + AUDIT
      await sendUserLoggedInEvent(user, email, true);

      reply.code(200).send({ message: 'Login successful', user });
    } catch (error) {
      // Gửi sự kiện login thất bại (không có user)
      await sendUserLoggedInEvent(null, request.body.email, false);

      reply.code(401).send({ error: error.message });
    }
  },
};

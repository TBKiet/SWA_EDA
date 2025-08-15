const { kafkaClient } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');

const producer = kafkaClient.producer();

module.exports = {
  getEvents: async (request, reply) => {
    const response = await fetch('http://event-service:3002/events');
    // const response = await fetch('http://event-service:3002/events', {
    //   headers: { Authorization: request.headers['authorization'] },
    // });
    if (!response.ok) {
      throw new Error('Failed to fetch events from event-service');
    }
    const events = await response.json();
    reply.send(events);
  },
  createRegistration: async (request, reply) => {
    const { userId, eventId } = request.body;
    await producer.connect();
    await producer.send({
      topic: EVENT_TOPICS.REGISTRATION_CREATED,
      messages: [{ value: JSON.stringify({ userId, eventId }) }],
    });
    await producer.disconnect();
    reply.code(201).send({ message: 'Registration request sent' });
  },
  createUser: async (request, reply) => {
    const { username, email, password } = request.body;

    const response = await fetch('http://user-service:3001/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    if (!response.ok) {
      return reply.code(500).send({ error: 'Failed to create user via user-service' });
    }

    const data = await response.json();
    reply.code(201).send(data);
  },
  loginUser: async (request, reply) => {
    const { email, password } = request.body;

    const response = await fetch('http://user-service:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      return reply.code(401).send({ error: 'Invalid email or password' });
    }

    const data = await response.json();
    reply.code(200).send(data);
  },
};

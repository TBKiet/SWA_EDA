const eventService = require('../services/eventService');
const { kafkaClient } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');

const producer = kafkaClient.producer();

module.exports = {
  createEvent: async (request, reply) => {
    const { name, description, shortDescription, date, location, capacity, image, status } = request.body;
    const event = await eventService.createEvent({ name, description, shortDescription, date, location, capacity, image, status });
    await producer.connect();
    await producer.send({
      topic: EVENT_TOPICS.EVENT_CREATED,
      messages: [{ value: JSON.stringify(event) }],
    });
    await producer.disconnect();
    reply.code(201).send(event);
  },
  getEvents: async (request, reply) => {
    const events = await eventService.getEvents();
    reply.send(events);
  },
};

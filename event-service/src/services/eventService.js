const { Event } = require('../models/event');

module.exports = {
  createEvent: async ({ name, description, shortDescription, date, location, capacity, image, status }) => {
    return await Event.create({ name, description, shortDescription, date, location, capacity, registered: 0, image, status });
  },
  getEvents: async () => {
    return await Event.findAll({
      order: [['name', 'ASC']]
    });
  },
};
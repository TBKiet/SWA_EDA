const tap = require('tap');
const eventService = require('../../src/services/eventService');

tap.test('createEvent should create an event', async (t) => {
  const event = await eventService.createEvent({ title: 'Test', date: '2025-12-01' });
  t.ok(event);
  t.equal(event.title, 'Test');
  t.end();
});

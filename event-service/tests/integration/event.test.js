const tap = require('tap');
const fastify = require('fastify')();
fastify.register(require('../../src'));

tap.test('POST /events should create event', async (t) => {
  const response = await fastify.inject({
    method: 'POST',
    url: '/events',
    payload: { title: 'Test Event', date: '2025-12-01' },
  });
  t.equal(response.statusCode, 201);
  t.end();
});

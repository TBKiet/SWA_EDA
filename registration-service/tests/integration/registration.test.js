const tap = require('tap');
const fastify = require('fastify')();
fastify.register(require('../../src'));

tap.test('POST /registrations should create registration', async (t) => {
  const response = await fastify.inject({
    method: 'POST',
    url: '/registrations',
    payload: { userId: 1, eventId: 1 },
  });
  t.equal(response.statusCode, 201);
  t.end();
});

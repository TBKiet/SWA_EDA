const tap = require('tap');
const fastify = require('fastify')();
fastify.register(require('../../src/routes'));

tap.test('GET /events should return events', async (t) => {
  const response = await fastify.inject({
    method: 'GET',
    url: '/events',
    headers: { authorization: 'Bearer mock-token' },
  });
  t.equal(response.statusCode, 200);
  t.end();
});

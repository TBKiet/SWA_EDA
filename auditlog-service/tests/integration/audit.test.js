const tap = require('tap');
const fastify = require('fastify')();
fastify.register(require('../../src'));

tap.test('POST /audit should log audit', async (t) => {
  const response = await fastify.inject({
    method: 'POST',
    url: '/audit',
    payload: { eventType: 'test', data: {} },
  });
  t.equal(response.statusCode, 200);
  t.end();
});

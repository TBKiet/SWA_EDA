const tap = require('tap');
const fastify = require('fastify')();
fastify.register(require('../../src'));

tap.test('POST /notifications should send notification', async (t) => {
  const response = await fastify.inject({
    method: 'POST',
    url: '/notifications',
    payload: { userId: 1, message: 'Test notification' },
  });
  t.equal(response.statusCode, 200);
  t.end();
});

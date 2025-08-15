const tap = require('tap');
const fastify = require('fastify')();
fastify.register(require('../../src/app'));

tap.test('POST /users should create user', async (t) => {
  const response = await fastify.inject({
    method: 'POST',
    url: '/users',
    payload: { 
      username: 'testuser' + Date.now(),
      email: 'test' + Date.now() + '@example.com',
      password: 'testpassword',
      phone: '0123456789'
    },
  });
  t.equal(response.statusCode, 201);
  t.end();
});

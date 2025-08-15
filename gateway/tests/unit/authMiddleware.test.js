const tap = require('tap');
const auth = require('../../src/middleware/auth');

tap.test('auth middleware should reject missing token', async (t) => {
  const request = { headers: {} };
  const reply = { code: (code) => ({ send: (data) => ({ code, data }) }) };
  const result = await auth(request, reply);
  t.equal(result.code, 401);
  t.end();
});

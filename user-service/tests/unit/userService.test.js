const tap = require('tap');
const userService = require('../../src/services/userService');

tap.test('createUser should create a user', async (t) => {
  const userData = {
    username: 'testuser' + Date.now(), // Thêm timestamp để email unique
    email: 'test' + Date.now() + '@example.com',
    password: 'testpassword',
    phone: '0123456789',
    deviceToken: 'sometoken123'
  };
  const user = await userService.createUser(userData);
  t.ok(user);
  t.equal(user.username, userData.username);
  t.equal(user.email, userData.email);
  t.end();
});

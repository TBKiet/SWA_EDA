const tap = require('tap');
const registrationService = require('../../src/services/registrationService');

tap.test('createRegistration should create a registration', async (t) => {
  const registration = await registrationService.createRegistration({ userId: 1, eventId: 1 });
  t.ok(registration);
  t.equal(registration.userId, 1);
  t.end();
});

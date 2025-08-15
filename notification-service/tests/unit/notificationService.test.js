const tap = require('tap');
const notificationService = require('../../src/services/notificationService');

tap.test('sendNotification should send a notification', async (t) => {
  await notificationService.sendNotification({ userId: 1, message: 'Test' });
  t.pass('Notification sent');
  t.end();
});

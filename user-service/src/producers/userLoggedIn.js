const { kafkaProducer, connectProducer } = require('../../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../../shared/event-types');

module.exports = async function sendUserLoggedInEvent(user, email, success) {
  const data = {
    userId: user?.id || null,
    email,
    timestamp: new Date().toISOString(),
  };

  await connectProducer();

  if (success) {
    await kafkaProducer.send({
      topic: EVENT_TOPICS.USER_LOGGED_IN,
      messages: [{ value: JSON.stringify(data) }],
    });

  } else {
    await kafkaProducer.send({
      topic: EVENT_TOPICS.AUDIT_FAILED,
      messages: [{
        value: JSON.stringify({
          eventType: EVENT_TOPICS.USER_LOGGED_IN,
          error: 'Invalid login attempt',
          data,
        }),
      }],
    });
  }
};

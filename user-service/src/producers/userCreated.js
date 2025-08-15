const { kafkaProducer, connectProducer } = require('../../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../../shared/event-types');

module.exports = async function sendUserCreatedEvent(user) {
  const userData = {
    userId: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    deviceToken: user.deviceToken,
    timestamp: new Date().toISOString(),
  };

  await connectProducer();

  try {
    // Gửi USER_CREATED
    await kafkaProducer.send({
      topic: EVENT_TOPICS.USER_CREATED,
      messages: [{ value: JSON.stringify(userData) }],
    });

  } catch (err) {
    // Gửi log lỗi AUDIT_FAILED
    await kafkaProducer.send({
      topic: EVENT_TOPICS.AUDIT_FAILED,
      messages: [{
        value: JSON.stringify({
          eventType: EVENT_TOPICS.USER_CREATED,
          error: err.message,
          timestamp: new Date().toISOString(),
        }),
      }],
    });
    throw err;
  }
};

const { connectProducer, kafkaProducer } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');

async function sendEmailFailedEvent({ userId, email, error, eventId }) {
  await connectProducer();

  const payload = {
    userId,
    email,
    error,
    eventId,
    timestamp: new Date().toISOString(),
  };

  await kafkaProducer.send({
    topic: EVENT_TOPICS.EMAIL_FAILED,
    messages: [{ value: JSON.stringify(payload) }],
  });

  console.log(`⚠️ Sent ${EVENT_TOPICS.EMAIL_FAILED} for user ${userId}`);
}

module.exports = { sendEmailFailedEvent };

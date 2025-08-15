const { connectProducer, kafkaProducer } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');

async function sendEmailSentEvent({ userId, email, subject }) {
  await connectProducer();
  const payload = {
    userId,
    email,
    subject,
    timestamp: new Date().toISOString(),
  };

  await kafkaProducer.send({
    topic: EVENT_TOPICS.NOTIFICATION_SENT,
    messages: [{ value: JSON.stringify(payload) }],
  });

  console.log(`📤 Sent ${EVENT_TOPICS.NOTIFICATION_SENT} for user ${userId}`);
}

module.exports = { sendEmailSentEvent };

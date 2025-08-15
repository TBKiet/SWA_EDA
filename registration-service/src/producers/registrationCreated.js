const { connectProducer, kafkaProducer } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');

async function sendRegistrationCreated({ eventId, userId, userEmail, userPhone, userDeviceToken }) {
  await connectProducer();

  const registrationEvent = {
    eventId,
    userId,
    userEmail,
    userPhone,
    userDeviceToken,
    timestamp: new Date().toISOString(),
  };

  await kafkaProducer.send({
    topic: EVENT_TOPICS.REGISTRATION_CREATED,
    messages: [{ value: JSON.stringify(registrationEvent) }],
  });

  console.log(`📤 Sent ${EVENT_TOPICS.REGISTRATION_CREATED}:`, registrationEvent);
}

module.exports = sendRegistrationCreated;

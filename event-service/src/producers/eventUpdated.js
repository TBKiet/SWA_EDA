const { kafkaProducer, connectProducer } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');

module.exports = async function sendEventUpdated({ eventId, updatedFields, updatedBy }) {
  try {
    await connectProducer();

    const message = {
      eventId,
      updatedFields,
      updatedBy,
      timestamp: new Date().toISOString(),
    };

    console.log('📤 Sending EVENT_UPDATED to Kafka:', message);

    await kafkaProducer.send({
      topic: EVENT_TOPICS.EVENT_UPDATED,
      messages: [{ value: JSON.stringify(message) }],
    });

    console.log('📤 Sent EVENT_UPDATED to Kafka:', message);
  } catch (error) {
    console.error('❌ Failed to send EVENT_UPDATED:', error);
  }
};

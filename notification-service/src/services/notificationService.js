const { kafkaClient } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');

const producer = kafkaClient.producer();

module.exports = {
  sendNotification: async ({ userId, message }) => {
    console.log(`Sending notification to user ${userId}: ${message}`);
    await producer.connect();
    await producer.send({
      topic: EVENT_TOPICS.NOTIFICATION_SENT,
      messages: [{ value: JSON.stringify({ userId, message }) }],
    });
    await producer.disconnect();
  },
};

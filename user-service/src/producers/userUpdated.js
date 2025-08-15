const { kafkaClient } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');

module.exports = async () => {
  const consumer = kafkaClient.consumer({ groupId: 'user-group' });
  await consumer.connect();
  await consumer.subscribe({ topic: EVENT_TOPICS.USER_UPDATED });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`User Updated: ${message.value.toString()}`);
    },
  });
};

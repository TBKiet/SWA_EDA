const { kafkaClient, createConsumer } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');

module.exports = async () => {
  try {
    // Reuse createConsumer to ensure single connection per group
    const consumer = await createConsumer('registration-group');
    
    // Subscribe to topic with fromBeginning: true for processing all messages
    await consumer.subscribe({ 
      topic: EVENT_TOPICS.REGISTRATION_CANCELLED, 
      fromBeginning: true 
    });

    // Process messages with error handling
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const messageValue = message.value?.toString();
          console.log(`Registration Cancelled: ${messageValue}`);
        } catch (error) {
          console.error(`Error processing message from topic ${topic} partition ${partition}:`, error);
        }
      },
    });

    // Handle consumer errors
    consumer.on('consumer.crash', ({ payload }) => {
      console.error('Consumer crashed:', payload.error);
    });

    console.log(`✅ Consumer for ${EVENT_TOPICS.REGISTRATION_CANCELLED} started`);
  } catch (error) {
    console.error('Failed to start consumer:', error);
    throw error;
  }
};
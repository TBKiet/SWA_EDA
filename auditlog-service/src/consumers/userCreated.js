const { kafkaClient, createConsumer } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');
const { logAudit } = require('../producers/auditLogged');

module.exports = async () => {
  try {
    // Reuse createConsumer to ensure single connection per group
    const consumer = await createConsumer('audit-user-created');
    
    // Subscribe to USER_CREATED topic
    await consumer.subscribe({ 
      topic: EVENT_TOPICS.USER_CREATED, 
      fromBeginning: true 
    });
    console.log(`✅ Subscribed to topic: ${EVENT_TOPICS.USER_CREATED}`);

    // Process messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const data = JSON.parse(message.value?.toString() || '{}');
          const { userId, username, userEmail, timestamp } = data;
          console.log(`📥 Received ${EVENT_TOPICS.USER_CREATED} for audit:`, data);

          // Validate required fields
          if (!userId) {
            console.warn('⚠️ Missing userId in message:', data);
            return;
          }

          // Trigger audit logging
          await logAudit({
            eventType: EVENT_TOPICS.USER_CREATED,
            data: { userId, username, userEmail, timestamp },
          });
          console.log(`✅ Audit log created for ${EVENT_TOPICS.USER_CREATED}`);

        } catch (error) {
          console.error(`❌ Error processing message from topic ${topic} partition ${partition}:`, error);
        }
      },
    });

    // Handle consumer crashes
    consumer.on('consumer.crash', ({ payload }) => {
      console.error('❌ Consumer crashed:', payload.error);
    });

    console.log(`🚀 Consumer for ${EVENT_TOPICS.USER_CREATED} started`);
  } catch (error) {
    console.error('❌ Failed to start USER_CREATED audit consumer:', error);
    throw error;
  }
};

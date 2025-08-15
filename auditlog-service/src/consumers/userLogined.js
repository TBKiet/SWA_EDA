const { kafkaClient, createConsumer } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');
const { logAudit } = require('../producers/auditLogged');

module.exports = async () => {
  try {
    const consumer = await createConsumer('audit-user-logged');
    await consumer.subscribe({ topic: EVENT_TOPICS.USER_LOGGED_IN, fromBeginning: true });
    console.log(`✅ Subscribed to topic: ${EVENT_TOPICS.USER_LOGGED_IN}`);
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const data = JSON.parse(message.value?.toString() || '{}');
          const { userId, username, userEmail, timestamp } = data;
          console.log(`📥 Received ${EVENT_TOPICS.USER_LOGGED_IN}:`, data);
          if (!userId) {
            console.warn('⚠️ Missing userId');
            return;
          }
          await logAudit({
            eventType: EVENT_TOPICS.USER_LOGGED_IN,
            data: { userId, username, userEmail, timestamp },
          });
          console.log(`✅ Audit log created for ${EVENT_TOPICS.USER_LOGGED_IN}`);
        } catch (error) {
          console.error(`❌ Error processing ${topic} partition ${partition}:`, error);
        }
      },
    });
    console.log(`🚀 Consumer for ${EVENT_TOPICS.USER_LOGGED_IN} started`);
  } catch (error) {
    console.error('❌ Failed to start USER_LOGGED_IN consumer:', error);
    throw error;
  }
};

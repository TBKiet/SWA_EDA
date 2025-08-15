const { kafkaClient, createConsumer } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');
const { logAudit } = require('../producers/auditLogged');

module.exports = async () => {
  try {
    const consumer = await createConsumer('audit-email-sent');
    
    await consumer.subscribe({ 
      topic: EVENT_TOPICS.NOTIFICATION_SENT, 
      fromBeginning: true 
    });
    console.log(`✅ Subscribed to topic: ${EVENT_TOPICS.NOTIFICATION_SENT}`);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const data = JSON.parse(message.value?.toString() || '{}');
          const { userId, email, subject } = data;

          console.log(`📥 Received ${EVENT_TOPICS.NOTIFICATION_SENT} for audit:`, data);

          if (!userId || !email) {
            console.warn('⚠️ Missing userId or email in message:', data);
            return;
          }

          await logAudit({
            eventType: EVENT_TOPICS.NOTIFICATION_SENT,
            data: {
              userId,
              email,
              subject,
              timestamp: data.timestamp || new Date().toISOString(),
            },
          });

          console.log(`✅ Audit log created for ${EVENT_TOPICS.NOTIFICATION_SENT}`);
        } catch (error) {
          console.error(`❌ Error processing message from topic ${topic} partition ${partition}:`, error);
        }
      },
    });

    consumer.on('consumer.crash', ({ payload }) => {
      console.error('❌ Consumer crashed:', payload.error);
    });

    console.log(`🚀 Consumer for ${EVENT_TOPICS.NOTIFICATION_SENT} started`);
  } catch (error) {
    console.error('❌ Failed to start NOTIFICATION_SENT audit consumer:', error);
    throw error;
  }
};

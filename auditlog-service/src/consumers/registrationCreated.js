const { kafkaClient, createConsumer } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');
const { logAudit } = require('../producers/auditLogged');

module.exports = async () => {
  try {
    const consumer = await createConsumer('audit-registration-created');
    
    await consumer.subscribe({ 
      topic: EVENT_TOPICS.REGISTRATION_CREATED, 
      fromBeginning: true 
    });
    console.log(`✅ Subscribed to topic: ${EVENT_TOPICS.REGISTRATION_CREATED}`);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const data = JSON.parse(message.value?.toString() || '{}');
          const { eventId, userId, timestamp } = data;
          console.log(`📥 Received ${EVENT_TOPICS.REGISTRATION_CREATED} for audit:`, data);

          if (!eventId || !userId) {
            console.warn('⚠️ Missing eventId or userId in message:', data);
            return;
          }

          await logAudit({
            eventType: EVENT_TOPICS.REGISTRATION_CREATED,
            data: { eventId, userId, timestamp },
          });
          console.log(`✅ Audit log created for ${EVENT_TOPICS.REGISTRATION_CREATED}`);

        } catch (error) {
          console.error(`❌ Error processing message from topic ${topic} partition ${partition}:`, error);
        }
      },
    });

    consumer.on('consumer.crash', ({ payload }) => {
      console.error('❌ Consumer crashed:', payload.error);
    });

    console.log(`🚀 Consumer for ${EVENT_TOPICS.REGISTRATION_CREATED} started`);
  } catch (error) {
    console.error('❌ Failed to start REGISTRATION_CREATED audit consumer:', error);
    throw error;
  }
};

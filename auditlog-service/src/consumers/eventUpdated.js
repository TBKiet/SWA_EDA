const { kafkaClient, createConsumer } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');
const { logAudit } = require('../producers/auditLogged');

module.exports = async () => {
  try {
    const consumer = await createConsumer('audit-event-updated');

    await consumer.subscribe({
      topic: EVENT_TOPICS.EVENT_UPDATED,
      fromBeginning: true,
    });

    console.log(`✅ Subscribed to topic: ${EVENT_TOPICS.EVENT_UPDATED}`);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const raw = message.value?.toString() || '{}';
          const data = JSON.parse(raw);
          const { eventId, updatedFields, updatedBy, timestamp } = data;

          console.log(`📥 Received ${EVENT_TOPICS.EVENT_UPDATED} for audit:`, data);

          if (!eventId) {
            console.warn('⚠️ Missing eventId in message:', data);
            return;
          }

          await logAudit({
            eventType: EVENT_TOPICS.EVENT_UPDATED,
            data: {
              eventId,
              updatedFields,
              updatedBy,
              timestamp: data.timestamp || new Date().toISOString(),
            },
          });

          console.log(`✅ Audit log created for ${EVENT_TOPICS.EVENT_UPDATED}`);
        } catch (error) {
          console.error(`❌ Error processing message from topic ${topic} partition ${partition}:`, error);
        }
      },
    });

    consumer.on('consumer.crash', ({ payload }) => {
      console.error('❌ Consumer crashed:', payload.error);
    });

    console.log(`🚀 Consumer for ${EVENT_TOPICS.EVENT_UPDATED} started`);
  } catch (error) {
    console.error('❌ Failed to start EVENT_UPDATED audit consumer:', error);
    throw error;
  }
};

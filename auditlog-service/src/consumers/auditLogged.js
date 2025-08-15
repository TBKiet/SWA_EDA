const { createConsumer } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');
const { AuditLog } = require('../models/auditLog'); // mongoose model

module.exports = async () => {
  const consumer = await createConsumer('audit-audit-logged');
  await consumer.subscribe({ topic: EVENT_TOPICS.AUDIT_LOGGED });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const { eventType, data } = JSON.parse(message.value.toString());

        // ❗ Bỏ qua nếu là SYSTEM_STARTUP (đã được ghi trực tiếp)
        if (eventType === 'SYSTEM_STARTUP') {
          console.log('ℹ️ Skipped SYSTEM_STARTUP log from Kafka');
          return;
        }
        
        await AuditLog.create({ eventType, data, timestamp: new Date() });
        console.log(`📝 Audit log saved: ${eventType}`);
      } catch (error) {
        console.error('❌ Error writing audit log:', error.message);
      }
    },
  });
};

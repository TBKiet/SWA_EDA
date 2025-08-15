const { AuditLog } = require('../models/auditLog');
const { kafkaClient, kafkaProducer, connectProducer } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');

module.exports = {
  logAudit: async ({ eventType, data }) => {
    try {
      // Validate input
      if (!eventType || !data) {
        throw new Error('Missing eventType or data in audit log request');
      }

      // Create audit log in the database
      console.log(`🔍 Creating audit log for eventType: ${eventType}, data:`, data);
      const log = await AuditLog.create({ eventType, data });
      console.log(`✅ Audit log created with ID: ${log._id} for eventType: ${eventType}`);

      // Prevent self-referential logging for AUDIT_LOGGED events
      if (eventType === EVENT_TOPICS.AUDIT_LOGGED) {
        console.log('ℹ️ Skipping Kafka message for AUDIT_LOGGED to prevent loop');
        return;
      }

      // Ensure producer is connected
      await connectProducer();

      // Send message to AUDIT_LOGGED topic
      await kafkaProducer.send({
        topic: EVENT_TOPICS.AUDIT_LOGGED,
        messages: [{ value: JSON.stringify(log) }],
      });
      console.log(`📤 Sent audit log to topic ${EVENT_TOPICS.AUDIT_LOGGED}:`, log);
      
      return log; // Return log for potential caller use
    } catch (error) {
      console.error(`❌ Failed to process audit log for eventType: ${eventType}:`, error);
      // Optionally send to AUDIT_FAILED topic
      try {
        await connectProducer();
        await kafkaProducer.send({
          topic: EVENT_TOPICS.AUDIT_FAILED,
          messages: [{ value: JSON.stringify({ eventType, data, error: error.message }) }],
        });
        console.log(`📤 Sent audit failure to topic ${EVENT_TOPICS.AUDIT_FAILED}`);
      } catch (kafkaError) {
        console.error('❌ Failed to send to AUDIT_FAILED topic:', kafkaError);
      }
      throw error;
    }
  },
};

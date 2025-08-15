const fastify = require('fastify')({ logger: true });
const auditController = require('./controllers/auditController');
const mongoose = require('./utils/db');
const auditLogged = require('./producers/auditLogged');
const userCreatedAuditConsumer = require('./consumers/userCreated');
const registrationCreatedAuditConsumer = require('./consumers/registrationCreated');
const updateEventAuditConsumer = require('./consumers/eventUpdated');
const consumeAuditLogged = require('./consumers/auditLogged');
const userLoggedInAuditConsumer = require('./consumers/userLogined');
const notificationSentAuditConsumer = require('./consumers/emailSent');

const start = async () => {
  try {
    // Explicitly wait for MongoDB connection
    await mongoose.connection.readyState === 1
      ? Promise.resolve()
      : mongoose.connection.asPromise();
    fastify.log.info('✅ MongoDB connection established');

    // Log system startup event
    await auditLogged.logAudit({
      eventType: 'SYSTEM_STARTUP',
      data: { message: 'Audit Service started successfully', timestamp: new Date().toISOString() },
    });
    fastify.log.info('✅ System startup audit logged');

    // Start all consumers
    const consumers = [
      { name: 'USER_CREATED', consumer: userCreatedAuditConsumer },
      { name: 'REGISTRATION_CREATED', consumer: registrationCreatedAuditConsumer },
      { name: 'UPDATE_EVENT', consumer: updateEventAuditConsumer },
      { name: 'AUDIT_LOGGED', consumer: consumeAuditLogged },
      { name: 'USER_LOGGED_IN', consumer: userLoggedInAuditConsumer },
      { name: 'NOTIFICATION_SENT', consumer: notificationSentAuditConsumer }
    ];

    for (const { name, consumer } of consumers) {
      await consumer();
      fastify.log.info(`✅ ${name} consumer started`);
    }

    // Register audit endpoint
    fastify.post('/audit', auditController.logAudit);
    fastify.log.info('✅ Audit endpoint registered at /audit');

    // Start Fastify server
    await fastify.listen({ port: 3006, host: '0.0.0.0' });
    fastify.log.info('🚀 Audit Service running on port 3006');
  } catch (err) {
    fastify.log.error('❌ Failed to start Audit Service:', err.message, err.stack);
    process.exit(1);
  }
};

start();

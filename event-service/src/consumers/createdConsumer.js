const { createConsumer } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');
const { Event } = require('../models/event');
const sendEventUpdated = require('../producers/eventUpdated');

module.exports = async function consumeRegistrationCreated() {
  try {
    const consumer = await createConsumer('event-group');

    await consumer.subscribe({
      topic: EVENT_TOPICS.REGISTRATION_CREATED,
      fromBeginning: true,
    });

    console.log(`✅ Subscribed to topic: ${EVENT_TOPICS.REGISTRATION_CREATED}`);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const data = JSON.parse(message.value?.toString());
          const { eventId } = data;

          if (!eventId) {
            console.warn('⚠️ Missing eventId in registration message:', data);
            return;
          }

          await Event.increment('registered', { where: { id: eventId } });
          console.log(`✅ Incremented registered for event ${eventId}`);

          const updatedEvent = await Event.findByPk(eventId);
          if (updatedEvent) {
            await sendEventUpdated({
              eventId: updatedEvent.id,
              updatedFields: { registered: updatedEvent.registered },
              updatedBy: 'registration-service',
            });
            console.log(`📤 Sent EVENT_UPDATED for event ${eventId}`);
          }
        } catch (error) {
          console.error(`❌ Error processing registration message:`, error);
        }
      },
    });

    consumer.on('consumer.crash', ({ payload }) => {
      console.error('❌ Consumer crashed:', payload.error);
    });
  } catch (error) {
    console.error('❌ Failed to start REGISTRATION_CREATED consumer:', error);
    throw error;
  }
};

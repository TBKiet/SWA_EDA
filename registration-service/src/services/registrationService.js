const { Registration } = require('../models/registration');
const sendRegistrationCreated = require('../producers/registrationCreated');

async function createRegistration({ eventId, userId, userEmail, userPhone, userDeviceToken }) {
  if (!eventId || !userId) {
    throw new Error('Missing required fields: eventId or userId');
  }

  console.log(`🔍 Creating registration for event: ${eventId}, user: ${userId}`);
  const registration = await Registration.create({ 
    eventId, 
    userId, 
    userEmail, 
    userPhone, 
    userDeviceToken 
  });
  console.log(`✅ Registration created with ID: ${registration.id}`);

  // Gửi Kafka event
  await sendRegistrationCreated({ eventId, userId, userEmail, userPhone, userDeviceToken });

  return registration;
}

module.exports = { createRegistration };

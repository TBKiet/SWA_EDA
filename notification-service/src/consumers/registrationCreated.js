const { createConsumer } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');
const { sendEmailSentEvent } = require('../producers/notificationSent');
const { sendEmailFailedEvent } = require('../producers/notificationFailed'); // 👈 Thêm
const nodemailer = require('nodemailer');

console.log('🚀 Notification consumer is starting...');

// ✅ SMTP config
const emailTransport = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

module.exports = async () => {
  try {
    const consumer = await createConsumer('notification-group');
    await consumer.subscribe({
      topic: EVENT_TOPICS.REGISTRATION_CREATED,
      fromBeginning: true,
    });

    console.log(`✅ Subscribed to topic: ${EVENT_TOPICS.REGISTRATION_CREATED}`);

    await consumer.run({
      eachMessage: async ({ message }) => {
        const raw = message.value?.toString() || '{}';
        let parsed;

        try {
          parsed = JSON.parse(raw);
        } catch (err) {
          console.error('❌ Failed to parse message:', raw);
          return;
        }

        const { eventId, userId, userEmail } = parsed;
        const toEmail = userEmail || process.env.DEFAULT_NOTIFICATION_EMAIL;

        if (!eventId || !userId || !toEmail) {
          console.warn('⚠️ Missing required fields in message:', parsed);
          return;
        }

        try {
          // ✅ Gửi email
          await emailTransport.sendMail({
            from: `"EDA Demo" <${process.env.SMTP_USER}>`,
            to: toEmail,
            subject: 'Event Registration Confirmation',
            text: `You have successfully registered for event ${eventId}!`,
            html: `<p>You have successfully registered for event <strong>${eventId}</strong>!</p>`,
          });

          console.log(`✅ Email sent to ${toEmail}`);

          await sendEmailSentEvent({
            userId,
            email: toEmail,
            subject: 'Event Registration Confirmation',
          });

        } catch (error) {
          console.error(`❌ Failed to send email to ${toEmail}:`, error);
        }
      },
    });
  } catch (err) {
    console.error('❌ Failed to start notification consumer:', err);
  }
};

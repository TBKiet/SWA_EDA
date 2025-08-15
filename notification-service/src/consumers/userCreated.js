const { createConsumer, kafkaProducer, connectProducer } = require('../../shared/utils/kafkaClient');
const { EVENT_TOPICS } = require('../../shared/event-types');
const nodemailer = require('nodemailer');

const emailTransport = nodemailer.createTransport({
  service: 'SendGrid',
  auth: { user: 'apikey', pass: process.env.SENDGRID_API_KEY },
});

module.exports = async () => {
  try {
    await connectProducer(); // Kết nối producer 1 lần

    const consumer = await createConsumer('user-group');
    await consumer.subscribe({ topic: EVENT_TOPICS.USER_CREATED, fromBeginning: true });

    console.log(`✅ Subscribed to topic: ${EVENT_TOPICS.USER_CREATED}`);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const raw = message.value?.toString() || '{}';
          const { userId, username, userEmail } = JSON.parse(raw);

          if (!userId) {
            console.warn('⚠️ Missing userId in message:', raw);
            return;
          }

          // Gửi email nếu có
          if (userEmail) {
            await emailTransport.sendMail({
              from: 'no-reply@yourapp.com',
              to: userEmail,
              subject: 'Welcome to Our Platform!',
              text: `Hello ${username || 'User'}, your account has been created successfully!`,
              html: `<p>Hello ${username || 'User'}, your account has been created successfully!</p>`,
            });
            console.log(`✅ Welcome email sent to ${userEmail}`);
          }

          // Gửi sự kiện audit.logged qua Kafka
          const auditLog = {
            eventType: EVENT_TOPICS.USER_CREATED,
            data: {
              userId,
              username,
              email: userEmail,
              timestamp: new Date().toISOString(),
            },
          };

          await kafkaProducer.send({
            topic: EVENT_TOPICS.AUDIT_LOGGED,
            messages: [{ value: JSON.stringify(auditLog) }],
          });

          console.log(`📤 Audit log event sent to topic ${EVENT_TOPICS.AUDIT_LOGGED}`);
        } catch (error) {
          console.error(`❌ Error handling ${EVENT_TOPICS.USER_CREATED} message:`, error);
        }
      },
    });

    consumer.on('consumer.crash', ({ payload }) => {
      console.error('❌ Consumer crashed:', payload.error);
    });

    console.log(`🚀 USER_CREATED Consumer started`);
  } catch (error) {
    console.error('❌ Failed to start USER_CREATED consumer:', error);
    throw error;
  }
};

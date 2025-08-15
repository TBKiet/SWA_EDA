const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'phatk222@gmail.com',
    pass: 'arjw vjgp qehz zohf' // chính là app password vừa tạo
  }
});

async function sendMail(to, subject, text) {
  try {
    const info = await transporter.sendMail({
      from: '"EDA Demo" <phatk222@gmail.com>',
      to,
      subject,
      text,
    });
    console.log('📤 Email sent:', info.messageId);
  } catch (err) {
    console.error('❌ Failed to send email:', err);
  }
}


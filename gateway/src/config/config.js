require('dotenv').config();
module.exports = {
  port: process.env.PORT || 3000,
  kafkaBrokers: process.env.KAFKA_BROKERS || 'kafka:9092',
};

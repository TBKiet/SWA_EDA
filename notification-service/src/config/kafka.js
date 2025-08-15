require('dotenv').config();
module.exports = {
  kafkaBrokers: process.env.KAFKA_BROKERS || 'kafka:9092',
};

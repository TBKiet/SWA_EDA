const { Kafka } = require('kafkajs');
require('dotenv').config();

const kafka = new Kafka({
  clientId: 'eventflow',
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['kafka:9092'],
});

// Shared producer: connect sẵn khi app khởi động
const producer = kafka.producer();
let isProducerConnected = false;

const connectProducer = async () => {
  if (!isProducerConnected) {
    await producer.connect();
    isProducerConnected = true;
    console.log('✅ Kafka producer connected');
  }
};

// Hàm tạo consumer mới với groupId tùy chỉnh
const createConsumer = async (groupId) => {
  const consumer = kafka.consumer({ 
    groupId,
    sessionTimeout: 30000,
    heartbeatInterval: 3000,
    maxPollInterval: 300000,
  });
  await consumer.connect();
  console.log(`✅ Kafka consumer [${groupId}] connected`);
  return consumer;
};

module.exports = {
  kafkaClient: kafka,
  kafkaProducer: producer,
  connectProducer,
  createConsumer,
};

const { kafkaClient } = require('./kafkaClient');
const { EVENT_TOPICS } = require('../event-types');

async function ensureKafkaTopics() {
  const admin = kafkaClient.admin();
  await admin.connect();

  const existingTopics = await admin.listTopics();

  const topicsToCreate = Object.values(EVENT_TOPICS)
    .filter(topic => !existingTopics.includes(topic))
    .map(topic => ({
      topic,
      numPartitions: 1,
      replicationFactor: 1,
    }));

  if (topicsToCreate.length > 0) {
    await admin.createTopics({
      topics: topicsToCreate,
      waitForLeaders: true,
    });
    console.log(`✅ Created Kafka topics: ${topicsToCreate.map(t => t.topic).join(', ')}`);
  } else {
    console.log('✅ All Kafka topics already exist.');
  }

  await admin.disconnect();
}

module.exports = { ensureKafkaTopics };

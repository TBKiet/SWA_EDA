#!/bin/bash
set -e

echo "🛠 Creating Kafka topics..."

TOPICS=(
  user.created
  user.updated
  user.logged_in
  event.created
  event.updated
  registration.created
  registration.cancelled
  notification.sent
  notification.failed
  audit.logged
  audit.failed
)

for topic in "${TOPICS[@]}"; do
  echo "➡️ Creating topic: $topic"
  kafka-topics --bootstrap-server kafka:9092 \
    --create --if-not-exists \
    --topic "$topic" \
    --replication-factor 1 \
    --partitions 1
done

echo "✅ All Kafka topics created successfully."

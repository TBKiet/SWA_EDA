#!/bin/sh

set -e

KAFKA_HOST=${KAFKA_HOST:-kafka}
KAFKA_PORT=${KAFKA_PORT:-9092}

echo "⏳ Waiting for Kafka at $KAFKA_HOST:$KAFKA_PORT..."

until nc -z "$KAFKA_HOST" "$KAFKA_PORT"; do
  echo "🔁 Kafka not ready yet..."
  sleep 2
done

echo "✅ Kafka is up – continuing"
exec "$@"

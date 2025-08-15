#!/bin/sh

HOST=${MONGO_HOST:-mongo}
PORT=${MONGO_PORT:-27017}

echo "Waiting for MongoDB at $HOST:$PORT..."

while ! nc -z $HOST $PORT; do
  sleep 1
done

echo "MongoDB is available — continuing..."

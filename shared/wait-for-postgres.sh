#!/bin/sh

set -e

host=$(echo $DATABASE_URL | sed -E 's|.*://.*:(.*)@(.*):.*\/.*|\2|')
port=$(echo $DATABASE_URL | sed -E 's|.*://.*:.*@(.*):([0-9]+)/.*|\2|')

echo "⏳ Waiting for PostgreSQL at $host:$port..."

until nc -z "$host" "$port"; do
  echo "🔁 PostgreSQL not ready yet..."
  sleep 2
done

echo "✅ PostgreSQL is up – continuing"
exec "$@"

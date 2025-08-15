#!/bin/bash
set -e

echo "📦 Creating multiple PostgreSQL databases..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  CREATE DATABASE userdb;
  CREATE DATABASE eventdb;
  CREATE DATABASE registrationdb;
EOSQL

echo "✅ Databases created: userdb, eventdb, registrationdb"

# Seed initial data for eventdb
echo "🌱 Seeding eventdb with initial events..."
psql -U "$POSTGRES_USER" -d eventdb -f /docker-entrypoint-initdb.d/seed-event.sql
echo "✅ Seeding completed."

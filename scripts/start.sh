#!/bin/bash
echo "=================================="
echo "🚂 Starting application..."
echo "=================================="

echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "PGHOST: $PGHOST"
echo "PGPORT: $PGPORT"
echo "PGUSER: $PGUSER"
echo "PGDATABASE: $PGDATABASE"
echo "PGPASSWORD exists: ${PGPASSWORD:+yes}"
echo "=================================="

# Run migrations
echo "🔄 Running database migrations..."
node scripts/railway-migrate.js

# Start the app
echo "🚀 Launching Express server..."
exec node src/index.js

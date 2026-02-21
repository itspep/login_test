#!/bin/bash
echo "=================================="
echo "🚂 Starting application..."
echo "=================================="

echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "DATABASE_URL exists: ${DATABASE_URL:+yes}"
echo "=================================="

# Only run migrations in production
if [ "$NODE_ENV" = "production" ]; then
  echo "🔄 Running database migrations..."
  node scripts/railway-migrate.js
else
  echo "⚠️ Skipping migrations in development mode"
fi

# Start the app
echo "🚀 Launching Express server..."
exec node src/index.js

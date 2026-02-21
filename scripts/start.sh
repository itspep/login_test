#!/bin/bash
echo "=================================="
echo "🚂 Starting application..."
echo "=================================="

# Show environment info
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "DATABASE_URL exists: ${DATABASE_URL:+yes}"
echo "DATABASE_URL starts with: ${DATABASE_URL:0:30}..."

# Make sure we're not loading .env in production
export NODE_ENV=production

# Run migrations
echo "🔄 Running database migrations..."
node scripts/railway-migrate.js

# Start the app
echo "🚀 Launching Express server..."
exec node src/index.js

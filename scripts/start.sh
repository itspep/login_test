#!/bin/bash

# Run migrations before starting the app
echo "🚂 Running migrations before start..."
node scripts/railway-migrate.js

# Start the app
echo "🚀 Starting app..."
npm start

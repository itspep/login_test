const { execSync } = require('child_process');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Check if we're in Railway environment
if (process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_SERVICE_NAME) {
  console.log('🚂 Running in Railway environment');
  
  // Verify DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in Railway environment');
    process.exit(1);
  }
  
  console.log(`✅ DATABASE_URL found (starts with: ${process.env.DATABASE_URL.substring(0, 20)}...)`);
}

try {
  console.log('🔄 Running Prisma migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('✅ Migrations completed successfully');
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}

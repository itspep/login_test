const { execSync } = require('child_process');

console.log('🚂 Running Prisma migrations...');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

try {
  // Use the DATABASE_URL from Railway environment
  execSync('npx prisma migrate deploy', { 
    stdio: 'inherit',
    env: process.env // Pass through Railway's environment
  });
  console.log('✅ Migrations completed successfully');
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}

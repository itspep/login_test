const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('==================================');
console.log('🚂 Running Prisma migrations...');
console.log('==================================');

// Check if DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set!');
  process.exit(1);
}

console.log('✅ DATABASE_URL is set');
console.log(`📊 Database host: ${process.env.DATABASE_URL.includes('railway.internal') ? 'internal' : 'external'}`);

// Delete Prisma engine cache if it exists (sometimes fixes issues)
const prismaCacheDir = path.join('/tmp', 'prisma-engine-cache');
if (fs.existsSync(prismaCacheDir)) {
  fs.rmSync(prismaCacheDir, { recursive: true, force: true });
  console.log('🧹 Cleared Prisma cache');
}

try {
  // Force Prisma to regenerate client with current environment
  console.log('🔄 Generating Prisma client...');
  execSync('npx prisma generate --force', { 
    stdio: 'inherit',
    env: process.env
  });
  
  console.log('🔄 Running migrations...');
  execSync('npx prisma migrate deploy', { 
    stdio: 'inherit',
    env: process.env
  });
  
  console.log('✅ Migrations completed successfully');
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  console.log('📝 DATABASE_URL used:', process.env.DATABASE_URL ? 'present' : 'missing');
  process.exit(1);
}

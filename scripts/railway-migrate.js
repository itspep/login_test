const { execSync } = require('child_process');

console.log('==================================');
console.log('🚂 Running Prisma migrations...');
console.log('==================================');

// Check Railway's built-in PG variables (these ALWAYS exist)
console.log('📊 PostgreSQL variables check:');
console.log('  PGHOST:', process.env.PGHOST || '❌ MISSING');
console.log('  PGPORT:', process.env.PGPORT || '❌ MISSING');
console.log('  PGUSER:', process.env.PGUSER || '❌ MISSING');
console.log('  PGDATABASE:', process.env.PGDATABASE || '❌ MISSING');
console.log('  PGPASSWORD exists:', process.env.PGPASSWORD ? '✅' : '❌');

if (!process.env.PGHOST) {
  console.error('❌ Critical: PostgreSQL host variables not found!');
  console.error('This means the database is not properly linked to this service.');
  process.exit(1);
}

// Construct DATABASE_URL from PG variables
const databaseUrl = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}?sslmode=require`;

// Set it as an environment variable for Prisma
process.env.DIRECT_DATABASE_URL = databaseUrl;
process.env.DATABASE_URL = databaseUrl;

console.log('✅ Constructed DATABASE_URL from PG variables');

try {
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
  process.exit(1);
}

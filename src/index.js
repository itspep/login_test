const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const viewRoutes = require('./routes/views');
const prisma = require('./utils/prisma');

// Load environment variables ONLY in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
  console.log('📝 Loaded .env file (development mode)');
} else {
  console.log('🚀 Running in production mode, using environment variables');
}

const app = express();
const PORT = process.env.PORT || 3000;

// Log database connection info (safely)
console.log('📊 Database connection:', {
  type: 'postgresql',
  host: process.env.DATABASE_URL ? process.env.DATABASE_URL.split('@')[1]?.split('/')[0] : 'not set',
  database: process.env.DATABASE_URL ? process.env.DATABASE_URL.split('/').pop() : 'not set'
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Make user available to all views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Server is running',
        env: process.env.NODE_ENV,
        database: process.env.DATABASE_URL ? 'configured' : 'missing'
    });
});

// Routes
app.use('/', viewRoutes);
app.use('/auth', authRoutes);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).render('index', { 
        title: '404 - Page Not Found',
        error: 'Page not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ error: 'Something broke!', message: err.message });
});

// Start server
const start = async () => {
    try {
        // Test database connection
        await prisma.$connect();
        console.log('✅ Database connected successfully');
        
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to connect to database:', error.message);
        console.error('Error code:', error.code);
        process.exit(1);
    }
};

if (require.main === module) {
    start();
}

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

module.exports = app;

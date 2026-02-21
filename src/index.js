const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const viewRoutes = require('./routes/views');
const prisma = require('./utils/prisma');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
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

// Routes
app.use('/', viewRoutes);
app.use('/auth', authRoutes);

// 404 handler - render 404 page
app.use('*', (req, res) => {
    res.status(404).render('index', { 
        title: '404 - Page Not Found',
        error: 'Page not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('index', { 
        title: '500 - Server Error',
        error: 'Something broke!'
    });
});

// Start server
const start = async () => {
    try {
        await prisma.$connect();
        console.log('✅ Database connected successfully');
        
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📝 Homepage: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

start();

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    console.log('👋 Disconnected from database');
    process.exit(0);
});

const express = require('express');
const router = express.Router();

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

// Redirect if already logged in
const redirectIfAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    next();
};

// Home page
router.get('/', (req, res) => {
    res.render('index', { 
        title: 'Home',
        user: req.session.user || null
    });
});

// Login page
router.get('/login', redirectIfAuthenticated, (req, res) => {
    res.render('login', { 
        title: 'Login',
        error: null,
        success: null,
        formData: {}
    });
});

// Signup page
router.get('/signup', redirectIfAuthenticated, (req, res) => {
    res.render('signup', { 
        title: 'Sign Up',
        errors: [],
        formData: {}
    });
});

// Dashboard page (protected)
router.get('/dashboard', requireAuth, (req, res) => {
    res.render('dashboard', { 
        title: 'Dashboard',
        user: req.session.user
    });
});

module.exports = router;

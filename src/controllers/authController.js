const prisma = require('../utils/prisma');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

// @desc    Register a new user
// @route   POST /auth/signup
// @access  Public
const signup = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('signup', {
                title: 'Sign Up',
                errors: errors.array(),
                formData: req.body
            });
        }

        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        });

        if (existingUser) {
            let errorMsg = existingUser.email === email 
                ? 'Email already registered' 
                : 'Username already taken';
            
            return res.render('signup', {
                title: 'Sign Up',
                errors: [{ msg: errorMsg }],
                formData: req.body
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });

        // Set session
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
        };

        res.redirect('/dashboard');

    } catch (error) {
        console.error('Signup error:', error);
        res.render('signup', {
            title: 'Sign Up',
            errors: [{ msg: 'Server error during signup' }],
            formData: req.body
        });
    }
};

// @desc    Login user
// @route   POST /auth/login
// @access  Public
const login = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('login', {
                title: 'Login',
                error: errors.array()[0].msg,
                success: null,
                formData: req.body
            });
        }

        const { email, password } = req.body;

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.render('login', {
                title: 'Login',
                error: 'Invalid credentials',
                success: null,
                formData: req.body
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.render('login', {
                title: 'Login',
                error: 'Invalid credentials',
                success: null,
                formData: req.body
            });
        }

        // Set session
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
        };

        res.redirect('/dashboard');

    } catch (error) {
        console.error('Login error:', error);
        res.render('login', {
            title: 'Login',
            error: 'Server error during login',
            success: null,
            formData: req.body
        });
    }
};

// @desc    Logout user
// @route   GET /auth/logout
// @access  Private
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/login');
    });
};

module.exports = {
    signup,
    login,
    logout
};

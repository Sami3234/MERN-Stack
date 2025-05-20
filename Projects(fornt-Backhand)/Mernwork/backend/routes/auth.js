const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, password, name, email, role, department, campus } = req.body;

        // Validate required fields
        if (!username || !password || !name || !email || !role || !campus) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address' });
        }

        // Validate role
        const validRoles = ['student', 'teacher', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role selected' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Create new user
        const user = new User({
            username,
            password,
            name,
            email,
            role,
            department: role === 'teacher' ? department : undefined,
            campus
        });

        await user.save();

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'comsats-secret-key',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                campus: user.campus
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // For testing purposes, allow these credentials
        if (username === 'admin' && password === 'admin123' && role === 'admin') {
            const token = jwt.sign(
                { userId: 'admin123', role: 'admin' },
                process.env.JWT_SECRET || 'comsats-secret-key',
                { expiresIn: '24h' }
            );
            return res.json({
                success: true,
                message: 'Login successful',
                token,
                user: {
                    id: 'admin123',
                    username: 'admin',
                    name: 'Admin User',
                    role: 'admin',
                    campus: 'Islamabad'
                }
            });
        }

        if (username === 'teacher' && password === 'teacher123' && role === 'teacher') {
            const token = jwt.sign(
                { userId: 'teacher123', role: 'teacher' },
                process.env.JWT_SECRET || 'comsats-secret-key',
                { expiresIn: '24h' }
            );
            return res.json({
                success: true,
                message: 'Login successful',
                token,
                user: {
                    id: 'teacher123',
                    username: 'teacher',
                    name: 'Teacher User',
                    role: 'teacher',
                    department: 'Computer Science',
                    campus: 'Islamabad'
                }
            });
        }

        if (username === 'student' && password === 'student123' && role === 'student') {
            const token = jwt.sign(
                { userId: 'student123', role: 'student' },
                process.env.JWT_SECRET || 'comsats-secret-key',
                { expiresIn: '24h' }
            );
            return res.json({
                success: true,
                message: 'Login successful',
                token,
                user: {
                    id: 'student123',
                    username: 'student',
                    name: 'Student User',
                    role: 'student',
                    campus: 'Islamabad'
                }
            });
        }

        // If no matching credentials found
        return res.status(401).json({
            success: false,
            message: 'Invalid username, password, or role'
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in'
        });
    }
});

// Get current user
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Error fetching user' });
    }
});

module.exports = router; 
const dotenv = require('dotenv');
const admin = require('firebase-admin');
const serviceAccount = require('./config/llamaspit-2ada9-firebase-adminsdk-vr20d-345b23e445.json');
const db = require('./models'); // Import all models from index.js
const cors = require('cors');
const { Op } = require('sequelize');

// load the .env file from ../
dotenv.config({ path: '../.env' });

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5500;

app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

const authenticateUser = async (req, res, next) => {
    const idToken = req.headers.authorization?.split(' ')[1];
    if (!idToken) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Firebase authentication error:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

// Using `db.User` to access the User model
const { User } = db;  // Access User from the imported `db` object

db.sequelize.sync()
  .then(() => console.log('Database synchronized successfully.'))
  .catch(err => console.error('Error synchronizing database:', err));

app.post('/api/user/profile', authenticateUser, async (req, res) => {
    let { username } = req.body;
    const firebaseUid = req.user.uid;

    console.log(`Attempting to create or find user with firebaseUid: ${firebaseUid}`);

    try {
        if (username.includes(' ')) {
            username = username.replace(/\s/g, '');
        }

        const [user, created] = await User.findOrCreate({
          where: { firebaseUid },
          defaults: { username },
        });

        if (!created) {
            console.log(`User found, updating username to: ${username}`);
            user.username = username;
            await user.save();
        } else {
            console.log(`New user created with username: ${username}`);
        }

        res.status(201).json(user);
    } catch (error) {
        console.error('Error during user creation or update:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/user/profile', authenticateUser, async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization header is missing or malformed.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(token); // Decoding with Firebase Admin SDK
        const firebaseUid = decodedToken.uid;

        const user = await User.findOne({ where: { firebaseUid } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.cookie('firebaseUid', firebaseUid, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });

        res.status(200).json(user);
    } catch (error) {
        console.error("Error verifying ID token:", error.message);
        res.status(401).json({ error: 'Invalid or expired ID token' });
    }
});

app.post('/api/user/check-username', async (req, res) => {
    const { username } = req.body;

    if (username.includes(' ')) {
        return res.status(400).json({ error: 'Username cannot contain spaces' });
    }

    try {
        const user = await User.findOne({ where: { username: { [Op.iLike]: username } } });
        if (user) {
            return res.status(200).json({ available: false });
        }

        res.status(200).json({ available: true });
    } catch (error) {
        console.error('Error checking username availability:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/user/:slug', authenticateUser, async (req, res) => {
    const { slug } = req.params;

    try {
        const { Op } = require('sequelize');
        const user = await User.findOne({ where: { username: { [Op.iLike]: slug } } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log('\x1b[32m%s\x1b[0m', `Server is running on port ${PORT}`);
});
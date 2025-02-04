const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// MongoDB connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'myDatabase';

let db; // Store DB connection

// Connect to MongoDB once and reuse it
async function connectToDatabase() {
  if (!db) {
    const client = new MongoClient(url);
    try {
      await client.connect();
      console.log('Connected to MongoDB');
      db = client.db(dbName);
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }
}

// Default route to check server status
app.get('/', (req, res) => {
  console.log('GET /');
  res.send('Server is running!');
});

// Signup route
app.post('/signup', async (req, res) => {
  console.log('POST /signup request received', req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    console.log('Email or password missing');
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    console.log('Invalid email format');
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    await connectToDatabase();
    const usersCollection = db.collection('users');

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { email, password: hashedPassword };
    const result = await usersCollection.insertOne(newUser);

    console.log('User inserted:', result);
    if (result.acknowledged) {
      res.status(201).json({ message: 'Signup successful' });
    } else {
      console.log('Failed to sign up user');
      res.status(500).json({ error: 'Failed to sign up' });
    }
  } catch (error) {
    console.error('Error during signup process:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const PORT = 5000; // Changed from 3000 to avoid conflict with React frontend
const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'myDatabase';

app.use(express.json());
app.use(cors());

let db;

// 🔹 Connect to MongoDB once and reuse connection
async function connectToDatabase() {
  if (!db) {
    const client = new MongoClient(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
      await client.connect();
      console.log('✅ Connected to MongoDB');
      db = client.db(DB_NAME);
    } catch (error) {
      console.error('❌ Error connecting to MongoDB:', error);
      process.exit(1); // Stop server if DB connection fails
    }
  }
}

// 🔹 Root Route
app.get('/', (req, res) => {
  console.log('➡️ GET /');
  res.send('✅ Server is running!');
});

// 🔹 Signup API
app.post('/api/signup', async (req, res) => {
  console.log('➡️ POST /api/signup', req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    console.log('⚠️ Missing email or password');
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    console.log('⚠️ Invalid email format');
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    await connectToDatabase();
    const usersCollection = db.collection('users');

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      console.log('⚠️ User already exists');
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { email, password: hashedPassword };
    const result = await usersCollection.insertOne(newUser);

    if (result.acknowledged) {
      console.log('✅ User signed up:', result.insertedId);
      res.status(201).json({ message: 'Signup successful' });
    } else {
      console.log('❌ Signup failed');
      res.status(500).json({ error: 'Signup failed' });
    }
  } catch (error) {
    console.error('❌ Error during signup:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 🔹 Start server
app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

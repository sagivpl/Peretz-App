const express = require('express');
const database = require('../db');

const router = express.Router();

// GET /api/users - Get all users
router.get('/', async (req, res) => {
  try {
    const collection = database.getUsersCollection();
    const users = await collection.find({}).toArray();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const collection = database.getUsersCollection();
    const user = await collection.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST /api/users - Create new user
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required and must be a non-empty string' });
    }

    const newUser = {
      id: new Date().getTime().toString(),
      name: name.trim()
    };

    const collection = database.getUsersCollection();
    const result = await collection.insertOne(newUser);
    
    if (!result.acknowledged) {
      throw new Error('Failed to create user');
    }

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

module.exports = router;
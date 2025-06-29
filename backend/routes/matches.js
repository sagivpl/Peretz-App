const express = require('express');
const database = require('../db');

const router = express.Router();

// GET /api/matches - Get all matches
router.get('/', async (req, res) => {
  try {
    const collection = database.getMatchesCollection();
    const matches = await collection.find({}).sort({ kickoffTime: 1 }).toArray();
    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// GET /api/matches/:id - Get match by ID
router.get('/:id', async (req, res) => {
  try {
    const collection = database.getMatchesCollection();
    const match = await collection.findOne({ id: req.params.id });
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    res.json(match);
  } catch (error) {
    console.error('Error fetching match:', error);
    res.status(500).json({ error: 'Failed to fetch match' });
  }
});

// GET /api/matches/status/:status - Get matches by status
router.get('/status/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = ['upcoming', 'in_progress', 'completed'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be: upcoming, in_progress, or completed' });
    }

    const collection = database.getMatchesCollection();
    const matches = await collection.find({ status }).sort({ kickoffTime: 1 }).toArray();
    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches by status:', error);
    res.status(500).json({ error: 'Failed to fetch matches by status' });
  }
});

// POST /api/matches - Create new match
router.post('/', async (req, res) => {
  try {
    const { homeTeam, awayTeam, kickoffTime, isLocked = false, orderOfChoice = [], status = 'upcoming' } = req.body;
    
    if (!homeTeam || !awayTeam || !kickoffTime) {
      return res.status(400).json({ error: 'homeTeam, awayTeam, and kickoffTime are required' });
    }

    if (isNaN(Date.parse(kickoffTime))) {
      return res.status(400).json({ error: 'kickoffTime must be a valid ISO date string' });
    }

    const newMatch = {
      id: new Date().getTime().toString(),
      homeTeam: homeTeam.trim(),
      awayTeam: awayTeam.trim(),
      kickoffTime,
      isLocked,
      orderOfChoice,
      status
    };

    const collection = database.getMatchesCollection();
    const result = await collection.insertOne(newMatch);
    
    if (!result.acknowledged) {
      throw new Error('Failed to create match');
    }

    res.status(201).json(newMatch);
  } catch (error) {
    console.error('Error creating match:', error);
    res.status(500).json({ error: 'Failed to create match' });
  }
});

// PUT /api/matches/:id/result - Update match result
router.put('/:id/result', async (req, res) => {
  try {
    const { actualHomeScore, actualAwayScore } = req.body;
    
    if (typeof actualHomeScore !== 'number' || typeof actualAwayScore !== 'number') {
      return res.status(400).json({ error: 'actualHomeScore and actualAwayScore must be numbers' });
    }

    if (actualHomeScore < 0 || actualAwayScore < 0) {
      return res.status(400).json({ error: 'Scores must be non-negative numbers' });
    }

    const collection = database.getMatchesCollection();
    const result = await collection.findOneAndUpdate(
      { id: req.params.id },
      { 
        $set: { 
          actualHomeScore, 
          actualAwayScore, 
          status: 'completed',
          isLocked: true 
        } 
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'Match not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error updating match result:', error);
    res.status(500).json({ error: 'Failed to update match result' });
  }
});

module.exports = router;
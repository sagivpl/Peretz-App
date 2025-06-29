const express = require('express');
const database = require('../db');

const router = express.Router();

// Helper function to calculate prediction points
function calculatePoints(prediction, match) {
  if (match.actualHomeScore === undefined || match.actualAwayScore === undefined) return 0;
  
  // Exact score prediction
  if (prediction.homeScore === match.actualHomeScore && 
      prediction.awayScore === match.actualAwayScore) {
    return 3;
  }
  
  // Correct result type (win/draw/loss) and goal difference
  const predGoalDiff = prediction.homeScore - prediction.awayScore;
  const actualGoalDiff = match.actualHomeScore - match.actualAwayScore;
  if (Math.sign(predGoalDiff) === Math.sign(actualGoalDiff) && 
      predGoalDiff === actualGoalDiff) {
    return 2;
  }
  
  // Correct result type only (win/draw/loss)
  if (Math.sign(predGoalDiff) === Math.sign(actualGoalDiff)) {
    return 1;
  }
  
  return 0;
}

// GET /api/predictions - Get all predictions
router.get('/', async (req, res) => {
  try {
    const collection = database.getPredictionsCollection();
    const predictions = await collection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(predictions);
  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({ error: 'Failed to fetch predictions' });
  }
});

// GET /api/predictions/user/:userId - Get predictions by user
router.get('/user/:userId', async (req, res) => {
  try {
    const collection = database.getPredictionsCollection();
    const predictions = await collection.find({ userId: req.params.userId }).sort({ createdAt: -1 }).toArray();
    res.json(predictions);
  } catch (error) {
    console.error('Error fetching user predictions:', error);
    res.status(500).json({ error: 'Failed to fetch user predictions' });
  }
});

// GET /api/predictions/match/:matchId - Get predictions by match
router.get('/match/:matchId', async (req, res) => {
  try {
    const collection = database.getPredictionsCollection();
    const predictions = await collection.find({ matchId: req.params.matchId }).sort({ createdAt: 1 }).toArray();
    res.json(predictions);
  } catch (error) {
    console.error('Error fetching match predictions:', error);
    res.status(500).json({ error: 'Failed to fetch match predictions' });
  }
});

// POST /api/predictions - Create new prediction
router.post('/', async (req, res) => {
  try {
    const { userId, matchId, homeScore, awayScore } = req.body;
    
    if (!userId || !matchId || typeof homeScore !== 'number' || typeof awayScore !== 'number') {
      return res.status(400).json({ error: 'userId, matchId, homeScore, and awayScore are required' });
    }

    if (homeScore < 0 || awayScore < 0) {
      return res.status(400).json({ error: 'Scores must be non-negative numbers' });
    }

    // Check if match exists and is not locked
    const matchCollection = database.getMatchesCollection();
    const match = await matchCollection.findOne({ id: matchId });
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    if (match.isLocked) {
      return res.status(400).json({ error: 'Cannot create prediction for locked match' });
    }

    const predictionCollection = database.getPredictionsCollection();
    
    // Check if prediction already exists
    const existingPrediction = await predictionCollection.findOne({
      userId,
      matchId
    });

    const newPrediction = {
      id: new Date().getTime().toString(),
      userId,
      matchId,
      homeScore,
      awayScore,
      createdAt: new Date().toISOString()
    };

    let result;
    if (existingPrediction) {
      // Update existing prediction
      result = await predictionCollection.findOneAndReplace(
        { userId, matchId },
        newPrediction,
        { returnDocument: 'after' }
      );
    } else {
      // Create new prediction
      const insertResult = await predictionCollection.insertOne(newPrediction);
      if (!insertResult.acknowledged) {
        throw new Error('Failed to create prediction');
      }
      result = newPrediction;
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating prediction:', error);
    res.status(500).json({ error: 'Failed to create prediction' });
  }
});

// PUT /api/predictions/calculate-points/:matchId - Calculate and update points for a match
router.put('/calculate-points/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;

    const matchCollection = database.getMatchesCollection();
    const match = await matchCollection.findOne({ id: matchId });
    
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    if (match.actualHomeScore === undefined || match.actualAwayScore === undefined) {
      return res.status(400).json({ error: 'Match scores not set' });
    }

    const predictionCollection = database.getPredictionsCollection();
    const predictions = await predictionCollection.find({ matchId }).toArray();

    const updatePromises = predictions.map(prediction => {
      const points = calculatePoints(prediction, match);
      return predictionCollection.updateOne(
        { id: prediction.id },
        { $set: { points } }
      );
    });

    await Promise.all(updatePromises);

    res.json({ message: `Updated points for ${predictions.length} predictions` });
  } catch (error) {
    console.error('Error calculating points:', error);
    res.status(500).json({ error: 'Failed to calculate points' });
  }
});

module.exports = router;
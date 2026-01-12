const express = require('express');
const { YieldPrediction, Block, Estate } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

// Generate yield prediction
router.post('/predict-yield', async (req, res) => {
  try {
    const { blockId, ndvi, rainfall, temperature, soilMoisture, treeAge } = req.body;

    if (!blockId || !ndvi || !rainfall || !temperature || !soilMoisture || !treeAge) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Statistical prediction formula
    const predictedYield = (ndvi * 800) + (rainfall * 0.5) - (temperature * 5) + (soilMoisture * 2) + (treeAge * 2);
    
    // Calculate confidence based on input quality
    let confidence = 85; // Base confidence
    if (ndvi > 0.7) confidence += 5;
    if (rainfall > 200 && rainfall < 400) confidence += 5;
    if (temperature > 24 && temperature < 30) confidence += 5;
    if (soilMoisture > 50 && soilMoisture < 80) confidence += 5;
    
    confidence = Math.min(confidence, 95); // Cap at 95%

    // Determine status based on predicted yield
    let status = 'green';
    if (predictedYield < 600) status = 'red';
    else if (predictedYield < 800) status = 'yellow';

    // Save prediction
    const prediction = await YieldPrediction.create({
      blockId,
      predictedYield: Math.round(predictedYield * 100) / 100,
      confidence,
      factors: {
        ndvi,
        rainfall,
        temperature,
        soilMoisture,
        treeAge
      },
      generatedAt: new Date(),
      predictionPeriod: 'monthly',
      status
    });

    res.json({
      prediction,
      message: 'Yield prediction generated successfully',
      status,
      confidence
    });
  } catch (error) {
    console.error('Error generating yield prediction:', error);
    res.status(500).json({ error: 'Failed to generate yield prediction' });
  }
});

// Get predictions for a specific block
router.get('/block/:blockId', async (req, res) => {
  try {
    const { blockId } = req.params;
    const { limit = 10 } = req.query;

    const predictions = await YieldPrediction.findAll({
      where: { blockId },
      include: [{
        model: Block,
        as: 'block',
        attributes: ['id', 'name'],
        include: [{
          model: Estate,
          as: 'estate',
          attributes: ['name', 'district']
        }]
      }],
      order: [['generatedAt', 'DESC']],
      limit: parseInt(limit)
    });

    res.json(predictions);
  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({ error: 'Failed to fetch predictions' });
  }
});

// Get all predictions
router.get('/', async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    const whereClause = {};
    if (status) whereClause.status = status;

    const predictions = await YieldPrediction.findAndCountAll({
      where: whereClause,
      include: [{
        model: Block,
        as: 'block',
        attributes: ['id', 'name', 'area'],
        include: [{
          model: Estate,
          as: 'estate',
          attributes: ['name', 'district']
        }]
      }],
      order: [['generatedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      predictions: predictions.rows,
      total: predictions.count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({ error: 'Failed to fetch predictions' });
  }
});

// Get prediction analytics
router.get('/analytics/summary', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setMonth(thirtyDaysAgo.getMonth() - 1);

    // Get recent predictions
    const recentPredictions = await YieldPrediction.findAll({
      where: {
        generatedAt: {
          [Op.gte]: thirtyDaysAgo
        }
      },
      attributes: [
        'predictedYield',
        'confidence',
        'status',
        'generatedAt'
      ],
      include: [{
        model: Block,
        as: 'block',
        attributes: ['id', 'name'],
        include: [{
          model: Estate,
          as: 'estate',
          attributes: ['name']
        }]
      }],
      order: [['generatedAt', 'DESC']]
    });

    // Calculate analytics
    const totalPredictions = recentPredictions.length;
    const avgPredictedYield = totalPredictions > 0 ? 
      recentPredictions.reduce((sum, p) => sum + parseFloat(p.predictedYield), 0) / totalPredictions : 0;
    
    const avgConfidence = totalPredictions > 0 ? 
      recentPredictions.reduce((sum, p) => sum + parseFloat(p.confidence), 0) / totalPredictions : 0;

    const statusDistribution = {
      green: recentPredictions.filter(p => p.status === 'green').length,
      yellow: recentPredictions.filter(p => p.status === 'yellow').length,
      red: recentPredictions.filter(p => p.status === 'red').length
    };

    res.json({
      totalPredictions,
      avgPredictedYield: Math.round(avgPredictedYield * 100) / 100,
      avgConfidence: Math.round(avgConfidence * 100) / 100,
      statusDistribution,
      recentPredictions: recentPredictions.slice(0, 10)
    });
  } catch (error) {
    console.error('Error fetching prediction analytics:', error);
    res.status(500).json({ error: 'Failed to fetch prediction analytics' });
  }
});

// Delete prediction
router.delete('/:id', async (req, res) => {
  try {
    const prediction = await YieldPrediction.findByPk(req.params.id);
    
    if (!prediction) {
      return res.status(404).json({ error: 'Prediction not found' });
    }

    await prediction.destroy();
    res.json({ message: 'Prediction deleted successfully' });
  } catch (error) {
    console.error('Error deleting prediction:', error);
    res.status(500).json({ error: 'Failed to delete prediction' });
  }
});

module.exports = router;






const express = require('express');
const { Block, Estate, HealthMetric } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

// Get all blocks with optional estate filter
router.get('/', async (req, res) => {
  try {
    const { estateId } = req.query;
    const whereClause = estateId ? { estateId } : {};

    const blocks = await Block.findAll({
      where: whereClause,
      include: [{
        model: Estate,
        as: 'estate',
        attributes: ['id', 'name', 'district']
      }],
      order: [['name', 'ASC']]
    });

    res.json(blocks);
  } catch (error) {
    console.error('Error fetching blocks:', error);
    res.status(500).json({ error: 'Failed to fetch blocks' });
  }
});

// Get single block with detailed info
router.get('/:id', async (req, res) => {
  try {
    const block = await Block.findByPk(req.params.id, {
      include: [{
        model: Estate,
        as: 'estate',
        attributes: ['id', 'name', 'district', 'location']
      }]
    });

    if (!block) {
      return res.status(404).json({ error: 'Block not found' });
    }

    // Get recent health metrics
    const recentHealth = await HealthMetric.findOne({
      where: { blockId: block.id },
      order: [['date', 'DESC']]
    });

    res.json({
      ...block.toJSON(),
      recentHealth
    });
  } catch (error) {
    console.error('Error fetching block:', error);
    res.status(500).json({ error: 'Failed to fetch block' });
  }
});

// Create new block
router.post('/', async (req, res) => {
  try {
    const { estateId, name, area, treeCount, plantingYear, cloneType, soilType, geometry } = req.body;

    if (!estateId || !name || !area || !plantingYear || !cloneType || !soilType || !geometry) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const block = await Block.create({
      estateId,
      name,
      area,
      treeCount: treeCount || 0,
      plantingYear,
      cloneType,
      soilType,
      geometry,
      healthScore: 0.75 // Default health score
    });

    res.status(201).json(block);
  } catch (error) {
    console.error('Error creating block:', error);
    res.status(500).json({ error: 'Failed to create block' });
  }
});

// Update block
router.put('/:id', async (req, res) => {
  try {
    const block = await Block.findByPk(req.params.id);
    
    if (!block) {
      return res.status(404).json({ error: 'Block not found' });
    }

    await block.update(req.body);
    res.json(block);
  } catch (error) {
    console.error('Error updating block:', error);
    res.status(500).json({ error: 'Failed to update block' });
  }
});

// Delete block
router.delete('/:id', async (req, res) => {
  try {
    const block = await Block.findByPk(req.params.id);
    
    if (!block) {
      return res.status(404).json({ error: 'Block not found' });
    }

    await block.destroy();
    res.json({ message: 'Block deleted successfully' });
  } catch (error) {
    console.error('Error deleting block:', error);
    res.status(500).json({ error: 'Failed to delete block' });
  }
});

// Analyze block health (simulate satellite analysis)
router.post('/:id/analyze-health', async (req, res) => {
  try {
    const block = await Block.findByPk(req.params.id);
    
    if (!block) {
      return res.status(404).json({ error: 'Block not found' });
    }

    // Simulate satellite analysis with random values
    const analysisResults = {
      ndvi: Math.random() * 0.5 + 0.35, // 0.35-0.85
      ndwi: Math.random() * 0.3 + 0.1,  // 0.1-0.4
      nbr: Math.random() * 0.5 + 0.2,  // 0.2-0.7
      canopyDensity: Math.random() * 35 + 60, // 60-95%
      healthScore: Math.random() * 0.35 + 0.6, // 0.6-0.95
      temperature: Math.random() * 10 + 22, // 22-32°C
      rainfall: Math.random() * 200 + 100, // 100-300mm
      soilMoisture: Math.random() * 40 + 40 // 40-80%
    };

    // Save analysis results as health metric
    await HealthMetric.create({
      blockId: block.id,
      date: new Date(),
      ...analysisResults
    });

    // Update block health score
    await block.update({ healthScore: analysisResults.healthScore });

    res.json({
      message: 'Health analysis completed',
      results: analysisResults,
      status: analysisResults.healthScore > 0.8 ? 'excellent' : 
              analysisResults.healthScore > 0.6 ? 'good' : 'needs_attention'
    });
  } catch (error) {
    console.error('Error analyzing block health:', error);
    res.status(500).json({ error: 'Failed to analyze block health' });
  }
});

module.exports = router;






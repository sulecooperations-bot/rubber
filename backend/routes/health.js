const express = require('express');
const { HealthMetric, Block, Estate } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

// Get health metrics for a specific block
router.get('/:blockId', async (req, res) => {
  try {
    const { blockId } = req.params;
    const { startDate, endDate, limit = 50 } = req.query;
    
    const whereClause = { blockId };
    
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date[Op.gte] = startDate;
      if (endDate) whereClause.date[Op.lte] = endDate;
    }

    const metrics = await HealthMetric.findAll({
      where: whereClause,
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
      order: [['date', 'DESC']],
      limit: parseInt(limit)
    });

    res.json(metrics);
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    res.status(500).json({ error: 'Failed to fetch health metrics' });
  }
});

// Get latest health metrics for all blocks
router.get('/', async (req, res) => {
  try {
    const { estateId } = req.query;
    
    const whereClause = {};
    if (estateId) {
      whereClause['$block.estateId$'] = estateId;
    }

    const metrics = await HealthMetric.findAll({
      where: whereClause,
      include: [{
        model: Block,
        as: 'block',
        attributes: ['id', 'name', 'area', 'treeCount'],
        include: [{
          model: Estate,
          as: 'estate',
          attributes: ['id', 'name', 'district']
        }]
      }],
      order: [['date', 'DESC']],
      group: ['blockId'] // Get latest metric for each block
    });

    res.json(metrics);
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    res.status(500).json({ error: 'Failed to fetch health metrics' });
  }
});

// Create new health metric
router.post('/', async (req, res) => {
  try {
    const { blockId, date, ndvi, ndwi, nbr, canopyDensity, healthScore, temperature, rainfall, soilMoisture } = req.body;

    if (!blockId || !date || !ndvi || !healthScore) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const metric = await HealthMetric.create({
      blockId,
      date,
      ndvi,
      ndwi,
      nbr,
      canopyDensity,
      healthScore,
      temperature,
      rainfall,
      soilMoisture
    });

    // Update block's health score
    const block = await Block.findByPk(blockId);
    if (block) {
      await block.update({ healthScore });
    }

    res.status(201).json(metric);
  } catch (error) {
    console.error('Error creating health metric:', error);
    res.status(500).json({ error: 'Failed to create health metric' });
  }
});

// Get health trends for a block
router.get('/:blockId/trends', async (req, res) => {
  try {
    const { blockId } = req.params;
    const { period = '3months' } = req.query;
    
    let startDate = new Date();
    switch (period) {
      case '1month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 3);
    }

    const trends = await HealthMetric.findAll({
      where: {
        blockId,
        date: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        'date',
        'ndvi',
        'ndwi',
        'nbr',
        'canopyDensity',
        'healthScore',
        'temperature',
        'rainfall',
        'soilMoisture'
      ],
      order: [['date', 'ASC']]
    });

    res.json(trends);
  } catch (error) {
    console.error('Error fetching health trends:', error);
    res.status(500).json({ error: 'Failed to fetch health trends' });
  }
});

// Get health summary for dashboard
router.get('/summary/overview', async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get latest health metrics for all blocks
    const latestMetrics = await HealthMetric.findAll({
      where: {
        date: {
          [Op.gte]: sevenDaysAgo
        }
      },
      attributes: [
        'blockId',
        'healthScore',
        'ndvi',
        'canopyDensity',
        'temperature',
        'rainfall'
      ],
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
      order: [['date', 'DESC']],
      group: ['blockId']
    });

    // Calculate summary statistics
    const totalBlocks = latestMetrics.length;
    const avgHealthScore = latestMetrics.length > 0 ? 
      latestMetrics.reduce((sum, m) => sum + parseFloat(m.healthScore), 0) / latestMetrics.length : 0;
    
    const healthyBlocks = latestMetrics.filter(m => parseFloat(m.healthScore) >= 0.8).length;
    const warningBlocks = latestMetrics.filter(m => 
      parseFloat(m.healthScore) >= 0.6 && parseFloat(m.healthScore) < 0.8
    ).length;
    const criticalBlocks = latestMetrics.filter(m => parseFloat(m.healthScore) < 0.6).length;

    res.json({
      totalBlocks,
      avgHealthScore: Math.round(avgHealthScore * 100) / 100,
      healthyBlocks,
      warningBlocks,
      criticalBlocks,
      latestMetrics
    });
  } catch (error) {
    console.error('Error fetching health summary:', error);
    res.status(500).json({ error: 'Failed to fetch health summary' });
  }
});

module.exports = router;






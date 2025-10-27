const express = require('express');
const { TappingRecord, Worker, Block, Estate } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

const router = express.Router();

// Get tapping records with filters
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, workerId, blockId, limit = 100, offset = 0 } = req.query;
    
    const whereClause = {};
    
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date[Op.gte] = startDate;
      if (endDate) whereClause.date[Op.lte] = endDate;
    }
    
    if (workerId) whereClause.workerId = workerId;
    if (blockId) whereClause.blockId = blockId;

    const records = await TappingRecord.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Worker,
          as: 'worker',
          attributes: ['id', 'name', 'photo']
        },
        {
          model: Block,
          as: 'block',
          attributes: ['id', 'name'],
          include: [{
            model: Estate,
            as: 'estate',
            attributes: ['name', 'district']
          }]
        }
      ],
      order: [['date', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      records: records.rows,
      total: records.count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching tapping records:', error);
    res.status(500).json({ error: 'Failed to fetch tapping records' });
  }
});

// Get single tapping record
router.get('/:id', async (req, res) => {
  try {
    const record = await TappingRecord.findByPk(req.params.id, {
      include: [
        {
          model: Worker,
          as: 'worker',
          attributes: ['id', 'name', 'photo', 'contactNumber']
        },
        {
          model: Block,
          as: 'block',
          attributes: ['id', 'name', 'area'],
          include: [{
            model: Estate,
            as: 'estate',
            attributes: ['name', 'district']
          }]
        }
      ]
    });

    if (!record) {
      return res.status(404).json({ error: 'Tapping record not found' });
    }

    res.json(record);
  } catch (error) {
    console.error('Error fetching tapping record:', error);
    res.status(500).json({ error: 'Failed to fetch tapping record' });
  }
});

// Create new tapping record
router.post('/', async (req, res) => {
  try {
    const { workerId, blockId, date, latexYield, quality, weatherCondition, tappingTime, notes } = req.body;

    if (!workerId || !blockId || !date || !latexYield || !quality) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const record = await TappingRecord.create({
      workerId,
      blockId,
      date,
      latexYield,
      quality,
      weatherCondition,
      tappingTime,
      notes
    });

    // Update worker's average yield
    const worker = await Worker.findByPk(workerId);
    if (worker) {
      const recentRecords = await TappingRecord.findAll({
        where: { workerId },
        attributes: ['latexYield'],
        order: [['date', 'DESC']],
        limit: 30 // Last 30 records
      });
      
      const totalYield = recentRecords.reduce((sum, r) => sum + parseFloat(r.latexYield), 0);
      const avgYield = recentRecords.length > 0 ? totalYield / recentRecords.length : 0;
      
      await worker.update({ averageYield: avgYield });
    }

    res.status(201).json(record);
  } catch (error) {
    console.error('Error creating tapping record:', error);
    res.status(500).json({ error: 'Failed to create tapping record' });
  }
});

// Update tapping record
router.put('/:id', async (req, res) => {
  try {
    const record = await TappingRecord.findByPk(req.params.id);
    
    if (!record) {
      return res.status(404).json({ error: 'Tapping record not found' });
    }

    await record.update(req.body);
    res.json(record);
  } catch (error) {
    console.error('Error updating tapping record:', error);
    res.status(500).json({ error: 'Failed to update tapping record' });
  }
});

// Delete tapping record
router.delete('/:id', async (req, res) => {
  try {
    const record = await TappingRecord.findByPk(req.params.id);
    
    if (!record) {
      return res.status(404).json({ error: 'Tapping record not found' });
    }

    await record.destroy();
    res.json({ message: 'Tapping record deleted successfully' });
  } catch (error) {
    console.error('Error deleting tapping record:', error);
    res.status(500).json({ error: 'Failed to delete tapping record' });
  }
});

// Get tapping analytics
router.get('/analytics/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const whereClause = {};
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date[Op.gte] = startDate;
      if (endDate) whereClause.date[Op.lte] = endDate;
    }

    // Get yield by worker (simplified for SQLite)
    const allRecords = await TappingRecord.findAll({
      where: whereClause,
      include: [{
        model: Worker,
        as: 'worker',
        attributes: ['name']
      }],
      order: [['latexYield', 'DESC']]
    });

    // Group by worker manually
    const workerStats = {};
    allRecords.forEach(record => {
      const workerId = record.workerId;
      if (!workerStats[workerId]) {
        workerStats[workerId] = {
          workerId,
          worker: record.worker,
          yields: [],
          count: 0
        };
      }
      workerStats[workerId].yields.push(parseFloat(record.latexYield));
      workerStats[workerId].count++;
    });

    const yieldByWorker = Object.values(workerStats)
      .map(stat => ({
        workerId: stat.workerId,
        worker: stat.worker,
        totalYield: stat.yields.reduce((sum, yield) => sum + yield, 0),
        avgYield: stat.yields.reduce((sum, yield) => sum + yield, 0) / stat.yields.length,
        recordCount: stat.count
      }))
      .sort((a, b) => b.totalYield - a.totalYield)
      .slice(0, 10);

    // Get daily yield trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyRecords = await TappingRecord.findAll({
      where: {
        ...whereClause,
        date: {
          [Op.gte]: thirtyDaysAgo
        }
      },
      attributes: ['date', 'latexYield'],
      order: [['date', 'ASC']]
    });

    // Group by date manually
    const dailyStats = {};
    dailyRecords.forEach(record => {
      // Handle both Date objects and date strings
      const date = record.date instanceof Date ? record.date : new Date(record.date);
      const dateStr = date.toISOString().split('T')[0];
      if (!dailyStats[dateStr]) {
        dailyStats[dateStr] = { date: dateStr, yields: [], count: 0 };
      }
      dailyStats[dateStr].yields.push(parseFloat(record.latexYield));
      dailyStats[dateStr].count++;
    });

    const dailyTrend = Object.values(dailyStats).map(stat => ({
      date: stat.date,
      totalYield: stat.yields.reduce((sum, yield) => sum + yield, 0),
      recordCount: stat.count
    }));

    // Get quality distribution
    const qualityRecords = await TappingRecord.findAll({
      where: whereClause,
      attributes: ['quality']
    });

    const qualityDistribution = [
      { qualityCategory: 'excellent', count: qualityRecords.filter(r => r.quality >= 90).length },
      { qualityCategory: 'good', count: qualityRecords.filter(r => r.quality >= 80 && r.quality < 90).length },
      { qualityCategory: 'fair', count: qualityRecords.filter(r => r.quality >= 70 && r.quality < 80).length },
      { qualityCategory: 'poor', count: qualityRecords.filter(r => r.quality < 70).length }
    ];

    res.json({
      yieldByWorker,
      dailyTrend,
      qualityDistribution
    });
  } catch (error) {
    console.error('Error fetching tapping analytics:', error);
    res.status(500).json({ error: 'Failed to fetch tapping analytics' });
  }
});

module.exports = router;

const express = require('express');
const { Worker, Block, Estate, TappingRecord } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

// Get all workers with assigned blocks
router.get('/', async (req, res) => {
  try {
    const workers = await Worker.findAll({
      include: [{
        model: Block,
        as: 'assignedBlock',
        attributes: ['id', 'name', 'area'],
        include: [{
          model: Estate,
          as: 'estate',
          attributes: ['name', 'district']
        }]
      }],
      order: [['name', 'ASC']]
    });

    res.json(workers);
  } catch (error) {
    console.error('Error fetching workers:', error);
    res.status(500).json({ error: 'Failed to fetch workers' });
  }
});

// Get single worker by ID
router.get('/:id', async (req, res) => {
  try {
    const worker = await Worker.findByPk(req.params.id, {
      include: [{
        model: Block,
        as: 'assignedBlock',
        include: [{
          model: Estate,
          as: 'estate',
          attributes: ['name', 'district']
        }]
      }]
    });

    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    res.json(worker);
  } catch (error) {
    console.error('Error fetching worker:', error);
    res.status(500).json({ error: 'Failed to fetch worker' });
  }
});

// Create new worker
router.post('/', async (req, res) => {
  try {
    const { name, photo, contactNumber, assignedBlockId, joinDate } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const worker = await Worker.create({
      name,
      photo,
      contactNumber,
      assignedBlockId,
      joinDate: joinDate || new Date(),
      isActive: true
    });

    res.status(201).json(worker);
  } catch (error) {
    console.error('Error creating worker:', error);
    res.status(500).json({ error: 'Failed to create worker' });
  }
});

// Update worker
router.put('/:id', async (req, res) => {
  try {
    const worker = await Worker.findByPk(req.params.id);
    
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    await worker.update(req.body);
    res.json(worker);
  } catch (error) {
    console.error('Error updating worker:', error);
    res.status(500).json({ error: 'Failed to update worker' });
  }
});

// Delete worker
router.delete('/:id', async (req, res) => {
  try {
    const worker = await Worker.findByPk(req.params.id);
    
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    await worker.destroy();
    res.json({ message: 'Worker deleted successfully' });
  } catch (error) {
    console.error('Error deleting worker:', error);
    res.status(500).json({ error: 'Failed to delete worker' });
  }
});

// Get worker performance analytics
router.get('/:id/analytics', async (req, res) => {
  try {
    const worker = await Worker.findByPk(req.params.id);
    
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get recent tapping records
    const recentRecords = await TappingRecord.findAll({
      where: {
        workerId: worker.id,
        date: {
          [Op.gte]: thirtyDaysAgo
        }
      },
      order: [['date', 'DESC']]
    });

    // Calculate analytics
    const totalYield = recentRecords.reduce((sum, record) => sum + parseFloat(record.latexYield), 0);
    const averageYield = recentRecords.length > 0 ? totalYield / recentRecords.length : 0;
    const averageQuality = recentRecords.length > 0 ? 
      recentRecords.reduce((sum, record) => sum + parseFloat(record.quality), 0) / recentRecords.length : 0;

    // Quality distribution
    const qualityDistribution = {
      excellent: recentRecords.filter(r => r.quality >= 90).length,
      good: recentRecords.filter(r => r.quality >= 80 && r.quality < 90).length,
      fair: recentRecords.filter(r => r.quality >= 70 && r.quality < 80).length,
      poor: recentRecords.filter(r => r.quality < 70).length
    };

    res.json({
      worker: {
        id: worker.id,
        name: worker.name,
        assignedBlock: worker.assignedBlock
      },
      analytics: {
        totalRecords: recentRecords.length,
        totalYield: Math.round(totalYield * 100) / 100,
        averageYield: Math.round(averageYield * 100) / 100,
        averageQuality: Math.round(averageQuality * 100) / 100,
        qualityDistribution,
        recentRecords: recentRecords.slice(0, 10) // Last 10 records
      }
    });
  } catch (error) {
    console.error('Error fetching worker analytics:', error);
    res.status(500).json({ error: 'Failed to fetch worker analytics' });
  }
});

module.exports = router;






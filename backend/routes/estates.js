const express = require('express');
const { Estate, Block } = require('../models');

const router = express.Router();

// Get all estates
router.get('/', async (req, res) => {
  try {
    const estates = await Estate.findAll({
      include: [{
        model: Block,
        as: 'blocks',
        attributes: ['id', 'name', 'area', 'treeCount', 'healthScore']
      }],
      order: [['name', 'ASC']]
    });

    res.json(estates);
  } catch (error) {
    console.error('Error fetching estates:', error);
    res.status(500).json({ error: 'Failed to fetch estates' });
  }
});

// Get single estate by ID
router.get('/:id', async (req, res) => {
  try {
    const estate = await Estate.findByPk(req.params.id, {
      include: [{
        model: Block,
        as: 'blocks',
        attributes: ['id', 'name', 'area', 'treeCount', 'plantingYear', 'cloneType', 'healthScore']
      }]
    });

    if (!estate) {
      return res.status(404).json({ error: 'Estate not found' });
    }

    res.json(estate);
  } catch (error) {
    console.error('Error fetching estate:', error);
    res.status(500).json({ error: 'Failed to fetch estate' });
  }
});

// Create new estate
router.post('/', async (req, res) => {
  try {
    const { name, location, totalArea, district, established, description } = req.body;

    if (!name || !location || !totalArea || !district || !established) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const estate = await Estate.create({
      name,
      location,
      totalArea,
      district,
      established,
      description
    });

    res.status(201).json(estate);
  } catch (error) {
    console.error('Error creating estate:', error);
    res.status(500).json({ error: 'Failed to create estate' });
  }
});

// Update estate
router.put('/:id', async (req, res) => {
  try {
    const estate = await Estate.findByPk(req.params.id);
    
    if (!estate) {
      return res.status(404).json({ error: 'Estate not found' });
    }

    await estate.update(req.body);
    res.json(estate);
  } catch (error) {
    console.error('Error updating estate:', error);
    res.status(500).json({ error: 'Failed to update estate' });
  }
});

// Delete estate
router.delete('/:id', async (req, res) => {
  try {
    const estate = await Estate.findByPk(req.params.id);
    
    if (!estate) {
      return res.status(404).json({ error: 'Estate not found' });
    }

    await estate.destroy();
    res.json({ message: 'Estate deleted successfully' });
  } catch (error) {
    console.error('Error deleting estate:', error);
    res.status(500).json({ error: 'Failed to delete estate' });
  }
});

module.exports = router;






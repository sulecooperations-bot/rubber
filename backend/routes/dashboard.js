const express = require('express');
const { Estate, Block, Worker, TappingRecord, HealthMetric } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [
      totalEstates,
      totalBlocks,
      totalWorkers,
      totalArea,
      totalTrees,
      recentTappingRecords,
      healthMetrics
    ] = await Promise.all([
      Estate.count(),
      Block.count(),
      Worker.count({ where: { isActive: true } }),
      Block.sum('area'),
      Block.sum('treeCount'),
      TappingRecord.findAll({
        where: {
          date: {
            [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        },
        attributes: ['latexYield']
      }),
      HealthMetric.findAll({
        where: {
          date: {
            [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        },
        attributes: ['healthScore']
      })
    ]);

    // Calculate average yield
    const totalYield = recentTappingRecords.reduce((sum, record) => sum + parseFloat(record.latexYield), 0);
    const averageYield = recentTappingRecords.length > 0 ? totalYield / recentTappingRecords.length : 0;

    // Calculate average health score
    const totalHealthScore = healthMetrics.reduce((sum, metric) => sum + parseFloat(metric.healthScore), 0);
    const averageHealthScore = healthMetrics.length > 0 ? totalHealthScore / healthMetrics.length : 0.75;

    res.json({
      totalEstates,
      totalBlocks,
      totalWorkers,
      totalArea: parseFloat(totalArea || 0),
      totalTrees: parseInt(totalTrees || 0),
      averageYield: Math.round(averageYield * 100) / 100,
      healthIndex: Math.round(averageHealthScore * 100),
      activeWorkers: totalWorkers
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Get dashboard trends (monthly data for charts)
router.get('/trends', async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Get all tapping records from last 6 months
    const allRecords = await TappingRecord.findAll({
      where: {
        date: {
          [Op.gte]: sixMonthsAgo
        }
      },
      attributes: ['date', 'latexYield'],
      order: [['date', 'ASC']]
    });

    // Group by month manually (SQLite compatible)
    const monthlyYield = {};
    allRecords.forEach(record => {
      // Handle both Date objects and date strings
      const date = record.date instanceof Date ? record.date : new Date(record.date);
      const month = date.toISOString().substring(0, 7); // YYYY-MM
      if (!monthlyYield[month]) {
        monthlyYield[month] = { month, yields: [] };
      }
      monthlyYield[month].yields.push(parseFloat(record.latexYield));
    });

    // Calculate averages and totals
    const yieldTrends = Object.values(monthlyYield).map(monthData => ({
      month: monthData.month,
      avgYield: monthData.yields.reduce((sum, yield) => sum + yield, 0) / monthData.yields.length,
      totalYield: monthData.yields.reduce((sum, yield) => sum + yield, 0)
    }));

    // Get monthly rainfall data (simulated)
    const monthlyRainfall = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      monthlyRainfall.push({
        month: date.toISOString().substring(0, 7),
        rainfall: Math.random() * 200 + 100 // 100-300mm
      });
    }

    // Get health trends (simplified for SQLite)
    const allHealthMetrics = await HealthMetric.findAll({
      where: {
        date: {
          [Op.gte]: sixMonthsAgo
        }
      },
      attributes: ['date', 'healthScore'],
      order: [['date', 'ASC']]
    });

    // Group health metrics by month
    const monthlyHealth = {};
    allHealthMetrics.forEach(metric => {
      // Handle both Date objects and date strings
      const date = metric.date instanceof Date ? metric.date : new Date(metric.date);
      const month = date.toISOString().substring(0, 7);
      if (!monthlyHealth[month]) {
        monthlyHealth[month] = { month, scores: [] };
      }
      monthlyHealth[month].scores.push(parseFloat(metric.healthScore));
    });

    const healthTrends = Object.values(monthlyHealth).map(monthData => ({
      month: monthData.month,
      avgHealth: monthData.scores.reduce((sum, score) => sum + score, 0) / monthData.scores.length
    }));

    res.json({
      yieldTrends,
      rainfallData: monthlyRainfall,
      healthTrends
    });
  } catch (error) {
    console.error('Error fetching dashboard trends:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard trends' });
  }
});

module.exports = router;

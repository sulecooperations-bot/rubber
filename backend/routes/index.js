const express = require('express');
const dashboardRoutes = require('./dashboard');
const estateRoutes = require('./estates');
const blockRoutes = require('./blocks');
const workerRoutes = require('./workers');
const tappingRoutes = require('./tapping');
const healthRoutes = require('./health');
const predictionRoutes = require('./predictions');

const router = express.Router();

// Mount route modules
router.use('/dashboard', dashboardRoutes);
router.use('/estates', estateRoutes);
router.use('/blocks', blockRoutes);
router.use('/workers', workerRoutes);
router.use('/tapping-records', tappingRoutes);
router.use('/health-metrics', healthRoutes);
router.use('/predictions', predictionRoutes);

module.exports = router;





const Estate = require('./Estate');
const Block = require('./Block');
const Worker = require('./Worker');
const TappingRecord = require('./TappingRecord');
const HealthMetric = require('./HealthMetric');
const YieldPrediction = require('./YieldPrediction');

// Define associations
Estate.hasMany(Block, { foreignKey: 'estateId', as: 'blocks' });
Block.belongsTo(Estate, { foreignKey: 'estateId', as: 'estate' });

Block.hasMany(Worker, { foreignKey: 'assignedBlockId', as: 'workers' });
Worker.belongsTo(Block, { foreignKey: 'assignedBlockId', as: 'assignedBlock' });

Block.hasMany(TappingRecord, { foreignKey: 'blockId', as: 'tappingRecords' });
TappingRecord.belongsTo(Block, { foreignKey: 'blockId', as: 'block' });

Worker.hasMany(TappingRecord, { foreignKey: 'workerId', as: 'tappingRecords' });
TappingRecord.belongsTo(Worker, { foreignKey: 'workerId', as: 'worker' });

Block.hasMany(HealthMetric, { foreignKey: 'blockId', as: 'healthMetrics' });
HealthMetric.belongsTo(Block, { foreignKey: 'blockId', as: 'block' });

Block.hasMany(YieldPrediction, { foreignKey: 'blockId', as: 'yieldPredictions' });
YieldPrediction.belongsTo(Block, { foreignKey: 'blockId', as: 'block' });

module.exports = {
  Estate,
  Block,
  Worker,
  TappingRecord,
  HealthMetric,
  YieldPrediction
};





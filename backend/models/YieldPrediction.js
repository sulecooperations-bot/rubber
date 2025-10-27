const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const YieldPrediction = sequelize.define('YieldPrediction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  blockId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'blocks',
      key: 'id'
    }
  },
  predictedYield: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Predicted yield in kg/ha/month'
  },
  confidence: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    comment: 'Confidence percentage'
  },
  factors: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'JSON object with input factors used for prediction'
  },
  generatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  predictionPeriod: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'monthly',
    comment: 'monthly, quarterly, yearly'
  },
  status: {
    type: DataTypes.ENUM('green', 'yellow', 'red'),
    allowNull: false,
    comment: 'Alert status based on prediction'
  }
}, {
  tableName: 'yield_predictions',
  timestamps: true
});

module.exports = YieldPrediction;





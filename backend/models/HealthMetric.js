const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const HealthMetric = sequelize.define('HealthMetric', {
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
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  ndvi: {
    type: DataTypes.DECIMAL(4, 3),
    allowNull: false,
    comment: 'Normalized Difference Vegetation Index'
  },
  ndwi: {
    type: DataTypes.DECIMAL(4, 3),
    allowNull: true,
    comment: 'Normalized Difference Water Index'
  },
  nbr: {
    type: DataTypes.DECIMAL(4, 3),
    allowNull: true,
    comment: 'Normalized Burn Ratio'
  },
  canopyDensity: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Canopy density percentage'
  },
  healthScore: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
    comment: 'Overall health score 0-1'
  },
  temperature: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Temperature in Celsius'
  },
  rainfall: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true,
    comment: 'Rainfall in mm'
  },
  soilMoisture: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Soil moisture percentage'
  }
}, {
  tableName: 'health_metrics',
  timestamps: true
});

module.exports = HealthMetric;





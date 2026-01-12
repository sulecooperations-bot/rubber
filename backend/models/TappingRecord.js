const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TappingRecord = sequelize.define('TappingRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  workerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'workers',
      key: 'id'
    }
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
  latexYield: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    comment: 'Yield in kg'
  },
  quality: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    comment: 'Quality percentage'
  },
  weatherCondition: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Sunny, Rainy, Cloudy, etc.'
  },
  tappingTime: {
    type: DataTypes.TIME,
    allowNull: true,
    comment: 'Time of day tapping was done'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'tapping_records',
  timestamps: true
});

module.exports = TappingRecord;






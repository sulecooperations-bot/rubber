const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Estate = sequelize.define('Estate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  location: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'JSON object with lat, lng coordinates'
  },
  totalArea: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Total area in hectares'
  },
  district: {
    type: DataTypes.STRING,
    allowNull: false
  },
  established: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Year established'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'estates',
  timestamps: true
});

module.exports = Estate;






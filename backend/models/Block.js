const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Block = sequelize.define('Block', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  estateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'estates',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  area: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    comment: 'Area in hectares'
  },
  treeCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  plantingYear: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cloneType: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Rubber clone variety'
  },
  soilType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  geometry: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'GeoJSON polygon coordinates'
  },
  healthScore: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    defaultValue: 0.75,
    comment: 'Health score 0-1'
  }
}, {
  tableName: 'blocks',
  timestamps: true
});

module.exports = Block;






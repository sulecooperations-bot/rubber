const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Worker = sequelize.define('Worker', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Path to worker photo'
  },
  contactNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  assignedBlockId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'blocks',
      key: 'id'
    }
  },
  joinDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  averageYield: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
    comment: 'Average daily yield in kg'
  }
}, {
  tableName: 'workers',
  timestamps: true
});

module.exports = Worker;






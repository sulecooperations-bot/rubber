const { sequelize } = require('../config/database');
const { Estate, Block, Worker, TappingRecord, HealthMetric, YieldPrediction } = require('../models');

const migrate = async () => {
  try {
    console.log('🔄 Starting database migration...');
    
    // Sync all models (create tables)
    await sequelize.sync({ force: false });
    console.log('✅ Database tables synchronized');
    
    // Check if we need to seed data
    const estateCount = await Estate.count();
    if (estateCount === 0) {
      console.log('🌱 No data found, running seed script...');
      const seedScript = require('./seed');
      await seedScript();
    } else {
      console.log('📊 Database already contains data, skipping seed');
    }
    
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  migrate();
}

module.exports = migrate;






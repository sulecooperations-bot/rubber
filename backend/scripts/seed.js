const { sequelize } = require('../config/database');
const { Estate, Block, Worker, TappingRecord, HealthMetric, YieldPrediction } = require('../models');

// Sri Lankan estate data
const estatesData = [
  {
    name: 'Malwatta Estate',
    location: { lat: 7.4863, lng: 80.3647 },
    totalArea: 125.5,
    district: 'Kurunegala',
    established: 1985,
    description: 'Premium rubber estate in Kurunegala district'
  },
  {
    name: 'Horana Estate',
    location: { lat: 6.7153, lng: 80.0622 },
    totalArea: 98.3,
    district: 'Kalutara',
    established: 1978,
    description: 'Well-established estate in the Western Province'
  },
  {
    name: 'Deniyaya Estate',
    location: { lat: 6.3500, lng: 80.5500 },
    totalArea: 156.7,
    district: 'Matara',
    established: 1982,
    description: 'High-altitude estate with excellent growing conditions'
  },
  {
    name: 'Agalawatta Estate',
    location: { lat: 6.4500, lng: 80.2000 },
    totalArea: 87.2,
    district: 'Ratnapura',
    established: 1990,
    description: 'Modern estate with advanced cultivation techniques'
  }
];

// Sri Lankan worker names
const workerNames = [
  'Suresh Jayasinghe', 'Nimal Perera', 'Thilini Rajapaksha', 'Kasun Abeywickrama',
  'Priyanka Fernando', 'Dilshan Silva', 'Anoma Wijesinghe', 'Chaminda Rathnayake',
  'Kumari Perera', 'Sarath Bandara', 'Nishadi Karunaratne', 'Upul Mendis',
  'Sanduni Jayawardena', 'Ranjith Premasiri', 'Chandrika Seneviratne', 'Ajith Kumara'
];

// Rubber clone types
const cloneTypes = ['RRIM 600', 'RRIM 712', 'RRIM 2001', 'RRIM 3001', 'PB 86', 'GT 1'];

// Soil types
const soilTypes = ['Red Yellow Podzolic', 'Reddish Brown Earth', 'Red Latasolic', 'Alluvial'];

// Generate random data functions
const randomBetween = (min, max) => Math.random() * (max - min) + min;
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomChoice = (array) => array[Math.floor(Math.random() * array.length)];

// Generate GeoJSON polygon for a block
const generateBlockPolygon = (centerLat, centerLng, size = 0.01) => {
  const offset = size / 2;
  return {
    type: 'Polygon',
    coordinates: [[
      [centerLng - offset, centerLat - offset],
      [centerLng + offset, centerLat - offset],
      [centerLng + offset, centerLat + offset],
      [centerLng - offset, centerLat + offset],
      [centerLng - offset, centerLat - offset]
    ]]
  };
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await sequelize.sync({ force: true });
    console.log('✅ Database cleared');

    // Create estates
    const estates = await Estate.bulkCreate(estatesData);
    console.log(`✅ Created ${estates.length} estates`);

    // Create blocks for each estate
    const blocks = [];
    for (const estate of estates) {
      const blockCount = randomInt(3, 8);
      for (let i = 0; i < blockCount; i++) {
        const blockLat = estate.location.lat + randomBetween(-0.01, 0.01);
        const blockLng = estate.location.lng + randomBetween(-0.01, 0.01);
        
        const block = await Block.create({
          estateId: estate.id,
          name: `Block ${String.fromCharCode(65 + i)} - ${estate.name}`,
          area: randomBetween(8, 25),
          treeCount: randomInt(200, 800),
          plantingYear: randomInt(1985, 2015),
          cloneType: randomChoice(cloneTypes),
          soilType: randomChoice(soilTypes),
          geometry: generateBlockPolygon(blockLat, blockLng),
          healthScore: randomBetween(0.6, 0.95)
        });
        blocks.push(block);
      }
    }
    console.log(`✅ Created ${blocks.length} blocks`);

    // Create workers
    const workers = [];
    for (let i = 0; i < 16; i++) {
      const assignedBlock = randomChoice(blocks);
      const worker = await Worker.create({
        name: workerNames[i],
        photo: `/workers/worker_${i + 1}.jpg`,
        contactNumber: `+94${randomInt(70, 77)}${randomInt(100000, 999999)}`,
        assignedBlockId: assignedBlock.id,
        joinDate: new Date(randomInt(2015, 2023), randomInt(0, 11), randomInt(1, 28)),
        isActive: Math.random() > 0.1,
        averageYield: randomBetween(18, 28)
      });
      workers.push(worker);
    }
    console.log(`✅ Created ${workers.length} workers`);

    // Create tapping records for the last 6 months
    const tappingRecords = [];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    for (let i = 0; i < 180; i++) { // 6 months of data
      const recordDate = new Date(startDate);
      recordDate.setDate(recordDate.getDate() + i);
      
      // Skip weekends (simulate 5-day work week)
      if (recordDate.getDay() === 0 || recordDate.getDay() === 6) continue;

      const worker = randomChoice(workers);
      const block = worker.assignedBlockId ? 
        blocks.find(b => b.id === worker.assignedBlockId) : 
        randomChoice(blocks);

      const tappingRecord = await TappingRecord.create({
        workerId: worker.id,
        blockId: block.id,
        date: recordDate,
        latexYield: randomBetween(15, 35),
        quality: randomBetween(75, 95),
        weatherCondition: randomChoice(['Sunny', 'Cloudy', 'Rainy', 'Overcast']),
        tappingTime: `${randomInt(5, 8).toString().padStart(2, '0')}:${randomInt(0, 59).toString().padStart(2, '0')}`,
        notes: Math.random() > 0.7 ? 'Good tapping session' : null
      });
      tappingRecords.push(tappingRecord);
    }
    console.log(`✅ Created ${tappingRecords.length} tapping records`);

    // Create health metrics for the last 3 months
    const healthMetrics = [];
    for (const block of blocks) {
      for (let i = 0; i < 12; i++) { // Weekly data for 3 months
        const metricDate = new Date();
        metricDate.setDate(metricDate.getDate() - (i * 7));
        
        const healthMetric = await HealthMetric.create({
          blockId: block.id,
          date: metricDate,
          ndvi: randomBetween(0.35, 0.85),
          ndwi: randomBetween(0.1, 0.4),
          nbr: randomBetween(0.2, 0.7),
          canopyDensity: randomBetween(60, 95),
          healthScore: randomBetween(0.6, 0.95),
          temperature: randomBetween(22, 32),
          rainfall: randomBetween(50, 300),
          soilMoisture: randomBetween(40, 80)
        });
        healthMetrics.push(healthMetric);
      }
    }
    console.log(`✅ Created ${healthMetrics.length} health metrics`);

    // Create yield predictions
    const yieldPredictions = [];
    for (const block of blocks) {
      const prediction = await YieldPrediction.create({
        blockId: block.id,
        predictedYield: randomBetween(450, 1200),
        confidence: randomBetween(75, 95),
        factors: {
          ndvi: randomBetween(0.35, 0.85),
          rainfall: randomBetween(100, 450),
          temperature: randomBetween(22, 32),
          soilMoisture: randomBetween(40, 80),
          treeAge: 2024 - block.plantingYear
        },
        generatedAt: new Date(),
        predictionPeriod: 'monthly',
        status: Math.random() > 0.7 ? 'green' : Math.random() > 0.4 ? 'yellow' : 'red'
      });
      yieldPredictions.push(prediction);
    }
    console.log(`✅ Created ${yieldPredictions.length} yield predictions`);

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Estates: ${estates.length}`);
    console.log(`   - Blocks: ${blocks.length}`);
    console.log(`   - Workers: ${workers.length}`);
    console.log(`   - Tapping Records: ${tappingRecords.length}`);
    console.log(`   - Health Metrics: ${healthMetrics.length}`);
    console.log(`   - Yield Predictions: ${yieldPredictions.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;






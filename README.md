# 🌿 SPATIO SDS - RubberPanel

A comprehensive geospatial-intelligent Rubber Plantation Management System designed specifically for Sri Lankan rubber estates. Built with modern web technologies and featuring AI-powered insights, interactive maps, and real-time monitoring capabilities.

## 🎯 Features

### 📊 Dashboard & Analytics
- **Real-time Statistics**: Total area, tree count, yield metrics, health index
- **Interactive Charts**: Monthly yield trends, rainfall correlation analysis
- **Weather Integration**: Live weather data for Kurunegala, Sri Lanka
- **Live Map Preview**: Quick overview of all plantation locations

### 🗺️ Interactive Plantation Map
- **Leaflet Integration**: High-resolution satellite and terrain maps
- **Block Visualization**: Color-coded health status for each block
- **Health Analysis**: Simulated satellite analysis with NDVI calculations
- **Block Management**: Add, edit, and monitor plantation blocks

### 👥 Worker Management
- **Worker Profiles**: Complete worker information with photos
- **Assignment Tracking**: Block assignments and performance metrics
- **Performance Analytics**: Individual and team performance insights
- **Contact Management**: Worker contact information and status

### 📝 Tapping Records
- **Daily Logging**: Comprehensive tapping record management
- **Quality Tracking**: Latex quality assessment and monitoring
- **Weather Correlation**: Weather impact on yield analysis
- **Performance Charts**: Yield by worker, daily trends, quality distribution

### 🤖 AI Insights & Forecasting
- **Yield Prediction**: Statistical model for yield forecasting
- **Health Analysis**: Remote sensing data simulation
- **Confidence Scoring**: Prediction reliability indicators
- **Historical Tracking**: Past predictions and accuracy analysis

### 📄 Reports & Export
- **PDF Generation**: Professional plantation reports
- **SPATIO SDS Branding**: Consistent corporate identity
- **Multiple Templates**: Monthly, analytics, and estate-specific reports
- **Data Export**: Comprehensive data export capabilities

## 🏗️ Architecture

### Frontend
- **React 18** with Vite for fast development
- **TailwindCSS** with custom Sri Lankan rubber plantation theme
- **Recharts** for data visualization
- **Leaflet** for interactive maps
- **Framer Motion** for smooth animations
- **Lucide React** for consistent iconography

### Backend
- **Node.js** with Express framework
- **Sequelize ORM** for database management
- **SQLite** for development (PostgreSQL migration ready)
- **RESTful API** with comprehensive endpoints
- **CORS** enabled for frontend integration

### Database Schema
- **Estate**: Plantation estates with location data
- **Block**: Individual plantation blocks with health metrics
- **Worker**: Worker profiles and assignments
- **TappingRecord**: Daily latex collection records
- **HealthMetric**: Remote sensing and health data
- **YieldPrediction**: AI-generated yield forecasts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RubberPlantaion
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # Backend
   cp backend/env.example backend/.env
   
   # Frontend
   cp frontend/.env.example frontend/.env
   ```

5. **Seed the database**
   ```bash
   cd backend
   npm run seed
   ```

6. **Start the development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/api/health

## 📊 Sample Data

The system comes pre-loaded with realistic Sri Lankan data:

### Estates
- **Malwatta Estate** (Kurunegala) - 125.5 ha
- **Horana Estate** (Kalutara) - 98.3 ha  
- **Deniyaya Estate** (Matara) - 156.7 ha
- **Agalawatta Estate** (Ratnapura) - 87.2 ha

### Workers
- Suresh Jayasinghe, Nimal Perera, Thilini Rajapaksha, Kasun Abeywickrama
- Priyanka Fernando, Dilshan Silva, Anoma Wijesinghe, Chaminda Rathnayake
- And 8 more realistic Sri Lankan names

### Data Points
- **6 months** of tapping records
- **Health metrics** with NDVI, NDWI, NBR data
- **Yield predictions** with confidence scores
- **Weather data** for Kurunegala region

## 🎨 Design System

### Color Palette
- **Primary Green**: #3C7A44 (Rubber tree green)
- **Secondary Beige**: #F5E6B1 (Latex cream)
- **Accent Brown**: #8B5E3C (Tree bark)
- **Neutral Grays**: #F8F8F8 to #1C1C1C

### Typography
- **Headings**: Poppins (modern, clean)
- **Body**: Inter (highly readable)

### Components
- **StatsCard**: Reusable metric display cards
- **Modal**: Consistent overlay dialogs
- **Button**: Themed action buttons
- **LoadingSpinner**: Rubber leaf animation

## 🔧 API Endpoints

### Dashboard
- `GET /api/dashboard/stats` - Overview statistics
- `GET /api/dashboard/trends` - Chart data

### Estates & Blocks
- `GET /api/estates` - List all estates
- `GET /api/blocks` - List all blocks
- `POST /api/blocks/:id/analyze-health` - Health analysis

### Workers & Records
- `GET /api/workers` - Worker management
- `GET /api/tapping-records` - Tapping records
- `GET /api/tapping-records/analytics/summary` - Performance analytics

### AI & Health
- `POST /api/predictions/predict-yield` - Generate predictions
- `GET /api/health-metrics/:blockId` - Health data
- `GET /api/health-metrics/summary/overview` - Health overview

## 🚀 Deployment

### Development
- SQLite database for easy setup
- Hot reload for both frontend and backend
- Comprehensive error handling and logging

### Production - Netlify + Railway (Recommended)

Deploy the frontend to Netlify and backend to Railway in minutes!

📖 **[Quick Deploy Guide](QUICK_DEPLOY.md)** - Deploy in 10 minutes
📖 **[Full Deployment Guide](NETLIFY_DEPLOYMENT.md)** - Detailed instructions

**Quick Steps:**
1. Push code to GitHub
2. Deploy backend to [Railway](https://railway.app)
3. Deploy frontend to [Netlify](https://netlify.com)
4. Configure environment variables
5. Seed the database

### Alternative: Docker Deployment
   ```bash
   # Build and run with Docker Compose
   docker-compose up -d
   ```

### Production - PostgreSQL Migration
1. **Database Setup**
   ```bash
   # Install PostgreSQL with PostGIS
   sudo apt-get install postgresql postgresql-contrib postgis
   
   # Create database
   createdb rubber_plantation
   psql rubber_plantation -c "CREATE EXTENSION postgis;"
   ```

2. **Environment Configuration**
   ```bash
   # Update backend/.env
   DB_DIALECT=postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=rubber_plantation
   DB_USER=your_username
   DB_PASSWORD=your_password
   ```

## 🔮 Future Enhancements

### Phase 2 Features
- **Real Satellite Integration**: Sentinel-2, Landsat data
- **Authentication System**: User roles and permissions
- **Mobile App**: React Native companion app
- **SMS Alerts**: Worker notifications and alerts
- **Multi-language**: Sinhala language support

### Phase 3 Features
- **Machine Learning**: Advanced yield prediction models
- **Drone Integration**: UAV imagery processing
- **IoT Sensors**: Real-time environmental monitoring
- **3D Visualization**: CesiumJS 3D plantation view

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **SPATIO SDS** - Sri Lankan geospatial solutions provider
- **Sri Lankan Rubber Industry** - For inspiration and context
- **Open Source Community** - For the amazing tools and libraries
- **Plantation Workers** - The backbone of the rubber industry

## 📞 Support

For support and questions:
- **Email**: support@spatiosds.lk
- **Website**: https://spatiosds.lk
- **Documentation**: [Full Documentation](docs/)

---

**Built with ❤️ for the Sri Lankan Rubber Industry**

*SPATIO SDS - RubberPanel v1.0 | Sri Lanka*

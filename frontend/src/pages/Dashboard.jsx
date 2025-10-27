import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Trees, 
  Users, 
  TrendingUp, 
  Activity,
  Cloud,
  CloudRain,
  Thermometer,
  Droplets
} from 'lucide-react'
import { dashboardAPI } from '../services/api'
import StatsCard from '../components/StatsCard'
import LoadingSpinner from '../components/LoadingSpinner'
import YieldTrendChart from '../components/charts/YieldTrendChart'
import RainfallCorrelationChart from '../components/charts/RainfallCorrelationChart'
import WeatherWidget from '../components/WeatherWidget'
import LiveMapPreview from '../components/LiveMapPreview'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [trends, setTrends] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsResponse, trendsResponse] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getTrends()
      ])
      
      setStats(statsResponse.data)
      setTrends(trendsResponse.data)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-neutral-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-heading font-bold text-neutral-900 dark:text-dark-100 mb-2">
          Plantation Dashboard
        </h1>
        <p className="text-neutral-600 dark:text-dark-400">
          Real-time monitoring of your rubber plantation operations
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatsCard
          title="Total Area"
          value={`${stats?.totalArea || 0} ha`}
          change="+2.5%"
          changeType="positive"
          icon={MapPin}
          color="primary"
        />
        <StatsCard
          title="Total Trees"
          value={stats?.totalTrees || 0}
          change="+1.2%"
          changeType="positive"
          icon={Trees}
          color="green"
        />
        <StatsCard
          title="Average Yield"
          value={`${stats?.averageYield || 0} kg/day`}
          change="+5.8%"
          changeType="positive"
          icon={TrendingUp}
          color="blue"
        />
        <StatsCard
          title="Health Index"
          value={`${stats?.healthIndex || 0}%`}
          change="+3.2%"
          changeType="positive"
          icon={Activity}
          color="orange"
        />
      </motion.div>

      {/* Charts Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Yield Trends */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-neutral-900">
              Yield Trends
            </h3>
            <div className="flex items-center space-x-2 text-sm text-neutral-600">
              <TrendingUp className="w-4 h-4" />
              <span>Last 6 months</span>
            </div>
          </div>
          <YieldTrendChart data={trends?.yieldTrends || []} />
        </div>

        {/* Rainfall Correlation */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-neutral-900">
              Rainfall vs Yield
            </h3>
            <div className="flex items-center space-x-2 text-sm text-neutral-600">
              <CloudRain className="w-4 h-4" />
              <span>Correlation</span>
            </div>
          </div>
          <RainfallCorrelationChart 
            yieldData={trends?.yieldTrends || []} 
            rainfallData={trends?.rainfallData || []} 
          />
        </div>
      </motion.div>

      {/* Bottom Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Weather Widget */}
        <div className="lg:col-span-1">
          <WeatherWidget />
        </div>

        {/* Live Map Preview */}
        <div className="lg:col-span-2">
          <LiveMapPreview />
        </div>
      </motion.div>

      {/* Additional Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <StatsCard
          title="Active Workers"
          value={stats?.activeWorkers || 0}
          change="+2"
          changeType="positive"
          icon={Users}
          color="secondary"
        />
        <StatsCard
          title="Total Estates"
          value={stats?.totalEstates || 0}
          change="0%"
          changeType="neutral"
          icon={MapPin}
          color="accent"
        />
        <StatsCard
          title="Blocks Monitored"
          value={stats?.totalBlocks || 0}
          change="+1"
          changeType="positive"
          icon={Trees}
          color="green"
        />
      </motion.div>
    </div>
  )
}

export default Dashboard

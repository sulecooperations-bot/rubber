import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  color = 'primary',
  formatValue = (val) => val 
}) => {
  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <Minus className="w-4 h-4 text-neutral-500" />
    }
  }

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600 bg-green-50'
      case 'negative':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-neutral-600 bg-neutral-50'
    }
  }

  const getIconColor = () => {
    const colorMap = {
      primary: 'text-primary-600 bg-primary-100',
      secondary: 'text-secondary-600 bg-secondary-100',
      accent: 'text-accent-600 bg-accent-100',
      green: 'text-green-600 bg-green-100',
      blue: 'text-blue-600 bg-blue-100',
      orange: 'text-orange-600 bg-orange-100'
    }
    return colorMap[color] || colorMap.primary
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="stats-card"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-neutral-900 mb-2">
            {formatValue(value)}
          </p>
          
          {change !== undefined && (
            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getChangeColor()}`}>
              {getChangeIcon()}
              <span>{change}</span>
            </div>
          )}
        </div>
        
        {Icon && (
          <div className={`p-3 rounded-lg ${getIconColor()}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default StatsCard





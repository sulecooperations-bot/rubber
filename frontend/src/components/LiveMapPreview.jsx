import { motion } from 'framer-motion'
import { MapPin, Eye, Layers, Navigation } from 'lucide-react'
import { Link } from 'react-router-dom'

const LiveMapPreview = () => {
  // Mock map data
  const estates = [
    { name: 'Malwatta Estate', district: 'Kurunegala', blocks: 6, health: 85, lat: 7.4863, lng: 80.3647 },
    { name: 'Horana Estate', district: 'Kalutara', blocks: 4, health: 92, lat: 6.7153, lng: 80.0622 },
    { name: 'Deniyaya Estate', district: 'Matara', blocks: 8, health: 78, lat: 6.3500, lng: 80.5500 },
    { name: 'Agalawatta Estate', district: 'Ratnapura', blocks: 5, health: 88, lat: 6.4500, lng: 80.2000 }
  ]

  const getHealthColor = (health) => {
    if (health >= 90) return 'text-green-600 bg-green-50'
    if (health >= 80) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-heading font-semibold text-neutral-900">
            Plantation Overview
          </h3>
        </div>
        <Link 
          to="/map" 
          className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>View Full Map</span>
        </Link>
      </div>

      {/* Interactive Map Preview */}
      <div className="relative h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-lg mb-4 overflow-hidden border-2 border-green-300">
        {/* Map Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%233C7A44' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Map Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Navigation className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <p className="text-sm text-primary-700 font-medium">Sri Lanka</p>
            <p className="text-xs text-primary-600">Rubber Plantations</p>
          </div>
        </div>
        
        {/* Estate Markers with Health Colors */}
        {estates.map((estate, index) => {
          const healthColor = estate.health >= 90 ? 'bg-green-500' : 
                             estate.health >= 80 ? 'bg-yellow-500' : 'bg-red-500'
          const positions = [
            { top: '20%', left: '25%' },
            { top: '30%', right: '20%' },
            { bottom: '25%', left: '30%' },
            { bottom: '20%', right: '25%' }
          ]
          
          return (
            <div
              key={index}
              className={`absolute w-4 h-4 ${healthColor} rounded-full border-2 border-white shadow-lg animate-pulse cursor-pointer`}
              style={positions[index]}
              title={`${estate.name} - ${estate.health}% health`}
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                {estate.name}
              </div>
            </div>
          )
        })}
        
        {/* Map Grid Lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(to right, #3C7A44 1px, transparent 1px),
              linear-gradient(to bottom, #3C7A44 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
      </div>

      {/* Estate List */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-neutral-700 mb-3">Estate Status</h4>
        {estates.map((estate, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-neutral-900">{estate.name}</p>
                <p className="text-xs text-neutral-500">{estate.district} • {estate.blocks} blocks</p>
              </div>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(estate.health)}`}>
              {estate.health}%
            </div>
          </div>
        ))}
      </div>

      {/* Map Legend */}
      <div className="mt-4 pt-4 border-t border-neutral-200">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Healthy (90%+)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Good (80-89%)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Needs Attention (&lt;80%)</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default LiveMapPreview

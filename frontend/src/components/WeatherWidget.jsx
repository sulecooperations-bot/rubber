import { motion } from 'framer-motion'
import { Cloud, CloudRain, Sun, Thermometer, Droplets, Wind } from 'lucide-react'

const WeatherWidget = () => {
  // Mock weather data for Kurunegala, Sri Lanka
  const weatherData = {
    location: 'Kurunegala, Sri Lanka',
    temperature: 28,
    condition: 'Partly Cloudy',
    humidity: 75,
    windSpeed: 12,
    rainfall: 15,
    forecast: [
      { day: 'Today', high: 30, low: 24, condition: 'Partly Cloudy', icon: Cloud },
      { day: 'Tomorrow', high: 29, low: 23, condition: 'Light Rain', icon: CloudRain },
      { day: 'Day After', high: 31, low: 25, condition: 'Sunny', icon: Sun }
    ]
  }

  const getWeatherIcon = (condition) => {
    if (condition.toLowerCase().includes('rain')) return CloudRain
    if (condition.toLowerCase().includes('sunny')) return Sun
    return Cloud
  }

  const WeatherIcon = getWeatherIcon(weatherData.condition)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-semibold text-neutral-900">
          Weather
        </h3>
        <div className="text-sm text-neutral-500">
          {weatherData.location}
        </div>
      </div>

      {/* Current Weather */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <WeatherIcon className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <div className="text-3xl font-bold text-neutral-900">
              {weatherData.temperature}°C
            </div>
            <div className="text-sm text-neutral-600">
              {weatherData.condition}
            </div>
          </div>
        </div>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Droplets className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-neutral-600">Humidity</span>
          <span className="text-sm font-medium text-neutral-900">{weatherData.humidity}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <Wind className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-neutral-600">Wind</span>
          <span className="text-sm font-medium text-neutral-900">{weatherData.windSpeed} km/h</span>
        </div>
        <div className="flex items-center space-x-2">
          <CloudRain className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-neutral-600">Rainfall</span>
          <span className="text-sm font-medium text-neutral-900">{weatherData.rainfall} mm</span>
        </div>
        <div className="flex items-center space-x-2">
          <Thermometer className="w-4 h-4 text-red-500" />
          <span className="text-sm text-neutral-600">Feels like</span>
          <span className="text-sm font-medium text-neutral-900">{weatherData.temperature + 2}°C</span>
        </div>
      </div>

      {/* Forecast */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-neutral-700 mb-3">3-Day Forecast</h4>
        {weatherData.forecast.map((day, index) => {
          const Icon = day.icon
          return (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4 text-neutral-500" />
                <span className="text-sm text-neutral-600">{day.day}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-neutral-900">{day.high}°</span>
                <span className="text-sm text-neutral-500">{day.low}°</span>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default WeatherWidget






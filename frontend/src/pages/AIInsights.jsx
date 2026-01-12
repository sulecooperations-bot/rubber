import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Calculator, BarChart3 } from 'lucide-react'
import { predictionsAPI, blocksAPI } from '../services/api'
import { useToast } from '../contexts/ToastContext'
import LoadingSpinner from '../components/LoadingSpinner'
import Button from '../components/Button'

const AIInsights = () => {
  const [blocks, setBlocks] = useState([])
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [predictionForm, setPredictionForm] = useState({
    blockId: '',
    ndvi: '',
    rainfall: '',
    temperature: '',
    soilMoisture: '',
    treeAge: ''
  })
  const [predictionResult, setPredictionResult] = useState(null)
  const [isPredicting, setIsPredicting] = useState(false)
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [blocksResponse, predictionsResponse] = await Promise.all([
        blocksAPI.getAll(),
        predictionsAPI.getAll()
      ])
      setBlocks(blocksResponse.data || [])
      setPredictions(predictionsResponse.data?.predictions || predictionsResponse.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      showError('Failed to load AI insights data')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setPredictionForm(prev => ({ ...prev, [field]: value }))
  }

  const generatePrediction = async () => {
    if (!predictionForm.blockId || !predictionForm.ndvi || !predictionForm.rainfall || 
        !predictionForm.temperature || !predictionForm.soilMoisture || !predictionForm.treeAge) {
      showError('Please fill in all fields')
      return
    }

    try {
      setIsPredicting(true)
      const response = await predictionsAPI.predictYield(predictionForm)
      setPredictionResult(response.data)
      showSuccess('Yield prediction generated successfully')
      // Refresh predictions list
      const predictionsResponse = await predictionsAPI.getAll()
      setPredictions(predictionsResponse.data?.predictions || predictionsResponse.data || [])
    } catch (error) {
      console.error('Error generating prediction:', error)
      showError(error.message || 'Failed to generate prediction')
    } finally {
      setIsPredicting(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'green':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'yellow':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'red':
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      default:
        return <CheckCircle className="w-5 h-5 text-neutral-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'green':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'yellow':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'red':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-neutral-600 bg-neutral-50 border-neutral-200'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading AI insights..." />
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
        <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-2">
          AI Insights & Forecasting
        </h1>
        <p className="text-neutral-600">
          AI-powered yield predictions and plantation health analysis
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prediction Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Brain className="w-6 h-6 text-primary-600" />
            <h3 className="text-xl font-heading font-semibold text-neutral-900">
              Yield Prediction
            </h3>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Select Block
              </label>
              <select
                className="select-field"
                value={predictionForm.blockId}
                onChange={(e) => handleInputChange('blockId', e.target.value)}
              >
                <option value="">Choose a block</option>
                {blocks.map(block => (
                  <option key={block.id} value={block.id}>
                    {block.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  NDVI (0-1)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  className="input-field"
                  value={predictionForm.ndvi}
                  onChange={(e) => handleInputChange('ndvi', e.target.value)}
                  placeholder="0.75"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Rainfall (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="input-field"
                  value={predictionForm.rainfall}
                  onChange={(e) => handleInputChange('rainfall', e.target.value)}
                  placeholder="250"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="input-field"
                  value={predictionForm.temperature}
                  onChange={(e) => handleInputChange('temperature', e.target.value)}
                  placeholder="28"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Soil Moisture (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  className="input-field"
                  value={predictionForm.soilMoisture}
                  onChange={(e) => handleInputChange('soilMoisture', e.target.value)}
                  placeholder="65"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Tree Age (years)
              </label>
              <input
                type="number"
                className="input-field"
                value={predictionForm.treeAge}
                onChange={(e) => handleInputChange('treeAge', e.target.value)}
                placeholder="15"
              />
            </div>

            <Button
              onClick={generatePrediction}
              loading={isPredicting}
              className="w-full"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Generate Prediction
            </Button>
          </form>
        </motion.div>

        {/* Prediction Result */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="w-6 h-6 text-primary-600" />
            <h3 className="text-xl font-heading font-semibold text-neutral-900">
              Prediction Result
            </h3>
          </div>

          {predictionResult ? (
            <div className="space-y-4">
              <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {predictionResult.prediction.predictedYield} kg/ha/month
                </div>
                <div className="text-sm text-neutral-600">
                  Predicted Yield
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <div className="text-2xl font-bold text-neutral-900">
                    {predictionResult.prediction.confidence}%
                  </div>
                  <div className="text-sm text-neutral-600">Confidence</div>
                </div>
                
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center justify-center space-x-1">
                    {getStatusIcon(predictionResult.prediction.status)}
                    <span className="text-lg font-semibold capitalize">
                      {predictionResult.prediction.status}
                    </span>
                  </div>
                  <div className="text-sm text-neutral-600">Status</div>
                </div>
              </div>

              <div className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-medium text-neutral-900 mb-2">Input Factors</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>NDVI: {predictionResult.prediction.factors.ndvi}</div>
                  <div>Rainfall: {predictionResult.prediction.factors.rainfall}mm</div>
                  <div>Temperature: {predictionResult.prediction.factors.temperature}°C</div>
                  <div>Soil Moisture: {predictionResult.prediction.factors.soilMoisture}%</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">
                Fill in the form and generate a prediction to see results here
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Predictions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="card"
      >
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="w-6 h-6 text-primary-600" />
          <h3 className="text-xl font-heading font-semibold text-neutral-900">
            Recent Predictions
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Block
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Predicted Yield
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Generated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {predictions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-neutral-500">
                    No predictions found. Generate a prediction to see results here.
                  </td>
                </tr>
              ) : (
                predictions.slice(0, 10).map((prediction, index) => (
                <motion.tr
                  key={prediction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-neutral-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-neutral-900">
                      {prediction.block?.name}
                    </div>
                    <div className="text-sm text-neutral-500">
                      {prediction.block?.estate?.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-neutral-900">
                      {prediction.predictedYield} kg/ha/month
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900">
                      {prediction.confidence}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prediction.status)}`}>
                      {getStatusIcon(prediction.status)}
                      <span className="ml-1 capitalize">{prediction.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-500">
                      {new Date(prediction.generatedAt).toLocaleDateString()}
                    </div>
                  </td>
                </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export default AIInsights






import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClipboardList, Plus, Filter, Download, Calendar, User, MapPin, Edit, Trash2 } from 'lucide-react'
import { tappingAPI, workersAPI, blocksAPI } from '../services/api'
import { useToast } from '../contexts/ToastContext'
import LoadingSpinner from '../components/LoadingSpinner'
import Button from '../components/Button'
import Modal from '../components/Modal'
import TappingAnalytics from '../components/TappingAnalytics'

const TappingRecords = () => {
  const [records, setRecords] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [workers, setWorkers] = useState([])
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    workerId: '',
    blockId: ''
  })
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    workerId: '',
    blockId: '',
    latexYield: '',
    quality: '',
    weatherCondition: '',
    tappingTime: '',
    notes: ''
  })
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    fetchRecords()
    fetchAnalytics()
    fetchWorkers()
    fetchBlocks()
  }, [])

  const fetchRecords = async () => {
    try {
      setLoading(true)
      const response = await tappingAPI.getAll(filters)
      setRecords(response.data?.records || response.data || [])
    } catch (error) {
      console.error('Error fetching tapping records:', error)
      showError('Failed to load tapping records')
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await tappingAPI.getAnalytics(filters)
      setAnalytics(response.data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  const fetchWorkers = async () => {
    try {
      const response = await workersAPI.getAll()
      setWorkers(response.data || [])
    } catch (error) {
      console.error('Error fetching workers:', error)
    }
  }

  const fetchBlocks = async () => {
    try {
      const response = await blocksAPI.getAll()
      setBlocks(response.data || [])
    } catch (error) {
      console.error('Error fetching blocks:', error)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    fetchRecords()
    fetchAnalytics()
  }

  const handleEdit = (record) => {
    setEditingRecord(record)
    setFormData({
      date: record.date ? record.date.split('T')[0] : new Date().toISOString().split('T')[0],
      workerId: record.workerId || '',
      blockId: record.blockId || '',
      latexYield: record.latexYield || '',
      quality: record.quality || '',
      weatherCondition: record.weatherCondition || '',
      tappingTime: record.tappingTime || '',
      notes: record.notes || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (recordId) => {
    if (window.confirm('Are you sure you want to delete this tapping record?')) {
      try {
        await tappingAPI.delete(recordId)
        showSuccess('Tapping record deleted successfully')
        fetchRecords()
        fetchAnalytics()
      } catch (error) {
        console.error('Error deleting record:', error)
        showError(error.response?.data?.error || 'Failed to delete record')
      }
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.workerId || !formData.blockId || !formData.date || !formData.latexYield || !formData.quality) {
      showError('Please fill in all required fields')
      return
    }

    try {
      setSubmitting(true)
      if (editingRecord) {
        await tappingAPI.update(editingRecord.id, formData)
        showSuccess('Tapping record updated successfully')
      } else {
        await tappingAPI.create(formData)
        showSuccess('Tapping record added successfully')
      }
      setShowModal(false)
      setEditingRecord(null)
      setFormData({
        date: new Date().toISOString().split('T')[0],
        workerId: '',
        blockId: '',
        latexYield: '',
        quality: '',
        weatherCondition: '',
        tappingTime: '',
        notes: ''
      })
      fetchRecords()
      fetchAnalytics()
    } catch (error) {
      console.error('Error saving record:', error)
      showError(error.response?.data?.error || 'Failed to save tapping record')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingRecord(null)
    setFormData({
      date: new Date().toISOString().split('T')[0],
      workerId: '',
      blockId: '',
      latexYield: '',
      quality: '',
      weatherCondition: '',
      tappingTime: '',
      notes: ''
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getQualityColor = (quality) => {
    if (quality >= 90) return 'text-green-600 bg-green-50'
    if (quality >= 80) return 'text-yellow-600 bg-yellow-50'
    if (quality >= 70) return 'text-orange-600 bg-orange-50'
    return 'text-red-600 bg-red-50'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading tapping records..." />
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
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-2">
            Tapping Records
          </h1>
          <p className="text-neutral-600">
            Track daily latex collection and worker performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Record
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-neutral-600" />
          <h3 className="text-lg font-heading font-semibold text-neutral-900">
            Filters
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              className="input-field"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              className="input-field"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Worker
            </label>
            <select
              className="select-field"
              value={filters.workerId}
              onChange={(e) => handleFilterChange('workerId', e.target.value)}
            >
              <option value="">All Workers</option>
              {workers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Block
            </label>
            <select
              className="select-field"
              value={filters.blockId}
              onChange={(e) => handleFilterChange('blockId', e.target.value)}
            >
              <option value="">All Blocks</option>
              {blocks.map((block) => (
                <option key={block.id} value={block.id}>
                  {block.name} - {block.estate?.name || 'Unknown Estate'}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <Button onClick={applyFilters} className="w-full">
              Apply Filters
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Analytics */}
      {analytics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TappingAnalytics data={analytics} />
        </motion.div>
      )}

      {/* Records Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="card p-0 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-neutral-200">
          <h3 className="text-lg font-heading font-semibold text-neutral-900">
            Recent Records
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Worker
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Block
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Yield
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Quality
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Weather
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {records.map((record, index) => (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-neutral-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm text-neutral-900">
                        {formatDate(record.date)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm text-neutral-900">
                        {record.worker?.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm text-neutral-900">
                        {record.block?.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-neutral-900">
                      {record.latexYield} kg
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(record.quality)}`}>
                      {record.quality}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-600">
                      {record.weatherCondition || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(record)}
                        className="text-primary-600 hover:text-primary-900 flex items-center space-x-1"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Empty State */}
      {!loading && records.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center py-12"
        >
          <ClipboardList className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Tapping Records Found</h3>
          <p className="text-neutral-600 mb-4">Get started by adding your first tapping record</p>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Record
          </Button>
        </motion.div>
      )}

      {/* Add/Edit Record Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingRecord ? 'Edit Tapping Record' : 'Add Tapping Record'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="input-field"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Worker <span className="text-red-500">*</span>
              </label>
              <select
                className="select-field"
                value={formData.workerId}
                onChange={(e) => handleInputChange('workerId', e.target.value)}
                required
              >
                <option value="">Select worker</option>
                {workers.map((worker) => (
                  <option key={worker.id} value={worker.id}>
                    {worker.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Block <span className="text-red-500">*</span>
            </label>
            <select
              className="select-field"
              value={formData.blockId}
              onChange={(e) => handleInputChange('blockId', e.target.value)}
              required
            >
              <option value="">Select block</option>
              {blocks.map((block) => (
                <option key={block.id} value={block.id}>
                  {block.name} - {block.estate?.name || 'Unknown Estate'}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Yield (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                className="input-field"
                value={formData.latexYield}
                onChange={(e) => handleInputChange('latexYield', e.target.value)}
                placeholder="25.5"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Quality (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                className="input-field"
                value={formData.quality}
                onChange={(e) => handleInputChange('quality', e.target.value)}
                placeholder="85.5"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Weather Condition
            </label>
            <select
              className="select-field"
              value={formData.weatherCondition}
              onChange={(e) => handleInputChange('weatherCondition', e.target.value)}
            >
              <option value="">Select weather</option>
              <option value="Sunny">Sunny</option>
              <option value="Cloudy">Cloudy</option>
              <option value="Rainy">Rainy</option>
              <option value="Overcast">Overcast</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Tapping Time
            </label>
            <input
              type="time"
              className="input-field"
              value={formData.tappingTime}
              onChange={(e) => handleInputChange('tappingTime', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Notes
            </label>
            <textarea
              className="input-field"
              rows="3"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {editingRecord ? 'Update Record' : 'Add Record'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default TappingRecords






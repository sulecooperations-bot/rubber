import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Plus, Edit, Trash2, Phone, MapPin, TrendingUp } from 'lucide-react'
import { workersAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import Button from '../components/Button'
import Modal from '../components/Modal'

const Workers = () => {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingWorker, setEditingWorker] = useState(null)

  useEffect(() => {
    fetchWorkers()
  }, [])

  const fetchWorkers = async () => {
    try {
      setLoading(true)
      const response = await workersAPI.getAll()
      setWorkers(response.data)
    } catch (error) {
      console.error('Error fetching workers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (worker) => {
    setEditingWorker(worker)
    setShowModal(true)
  }

  const handleDelete = async (workerId) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      try {
        await workersAPI.delete(workerId)
        fetchWorkers()
      } catch (error) {
        console.error('Error deleting worker:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading workers..." />
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
            Workers
          </h1>
          <p className="text-neutral-600">
            Manage plantation workers and their assignments
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Worker
        </Button>
      </motion.div>

      {/* Workers Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {workers.map((worker, index) => (
          <motion.div
            key={worker.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="card-hover"
          >
            <div className="flex items-start space-x-4">
              {/* Worker Photo */}
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-primary-600" />
              </div>

              {/* Worker Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-neutral-900 truncate">
                  {worker.name}
                </h3>
                <p className="text-sm text-neutral-600 mb-2">
                  {worker.assignedBlock?.name || 'No assignment'}
                </p>
                
                <div className="space-y-1 text-sm text-neutral-500">
                  {worker.contactNumber && (
                    <div className="flex items-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>{worker.contactNumber}</span>
                    </div>
                  )}
                  {worker.assignedBlock?.estate && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{worker.assignedBlock.estate.name}</span>
                    </div>
                  )}
                  {worker.averageYield && (
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{worker.averageYield.toFixed(1)} kg/day</span>
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <div className="mt-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    worker.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {worker.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleEdit(worker)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4 text-neutral-600" />
                </button>
                <button
                  onClick={() => handleDelete(worker.id)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Add/Edit Worker Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingWorker(null)
        }}
        title={editingWorker ? 'Edit Worker' : 'Add New Worker'}
        size="md"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              className="input-field"
              defaultValue={editingWorker?.name || ''}
              placeholder="Enter worker's full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Contact Number
            </label>
            <input
              type="tel"
              className="input-field"
              defaultValue={editingWorker?.contactNumber || ''}
              placeholder="+94 77 123 4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Assigned Block
            </label>
            <select className="select-field">
              <option value="">Select a block</option>
              <option value="1">Block A - Malwatta Estate</option>
              <option value="2">Block B - Malwatta Estate</option>
              <option value="3">Block C - Horana Estate</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Join Date
            </label>
            <input
              type="date"
              className="input-field"
              defaultValue={editingWorker?.joinDate?.split('T')[0] || ''}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              defaultChecked={editingWorker?.isActive ?? true}
            />
            <label htmlFor="isActive" className="text-sm text-neutral-700">
              Active worker
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false)
                setEditingWorker(null)
              }}
            >
              Cancel
            </Button>
            <Button>
              {editingWorker ? 'Update Worker' : 'Add Worker'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Workers





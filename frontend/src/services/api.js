import axios from 'axios'

// Auto-detect API URL based on environment
const getApiBaseUrl = () => {
  // If VITE_API_URL is set, use it (production on Netlify/Railway)
  if (import.meta.env.VITE_API_URL) {
    const url = import.meta.env.VITE_API_URL
    // Ensure it ends with /api if not already
    return url.endsWith('/api') ? url : url.endsWith('/') ? `${url}api` : `${url}/api`
  }
  
  // For local development, detect the port
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const currentPort = window.location.port
    if (currentPort) {
      const baseUrl = window.location.origin.replace(`:${currentPort}`, ':5000')
      return `${baseUrl}/api`
    }
    // If no port, assume default
    return 'http://localhost:5000/api'
  }
  
  // Fallback for production - use relative path
  return '/api'
}

const API_BASE_URL = getApiBaseUrl()

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message)
    
    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection.'
    } else {
      // Handle specific HTTP status codes
      switch (error.response.status) {
        case 400:
          error.message = error.response.data?.error || 'Invalid request'
          break
        case 401:
          error.message = 'Unauthorized. Please login again.'
          break
        case 403:
          error.message = 'Access forbidden'
          break
        case 404:
          error.message = error.response.data?.error || 'Resource not found'
          break
        case 500:
          error.message = 'Server error. Please try again later.'
          break
        default:
          error.message = error.response.data?.error || error.message || 'An error occurred'
      }
    }
    
    return Promise.reject(error)
  }
)

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getTrends: () => api.get('/dashboard/trends'),
}

// Estates API
export const estatesAPI = {
  getAll: () => api.get('/estates'),
  getById: (id) => api.get(`/estates/${id}`),
  create: (data) => api.post('/estates', data),
  update: (id, data) => api.put(`/estates/${id}`, data),
  delete: (id) => api.delete(`/estates/${id}`),
}

// Blocks API
export const blocksAPI = {
  getAll: (params) => api.get('/blocks', { params }),
  getById: (id) => api.get(`/blocks/${id}`),
  create: (data) => api.post('/blocks', data),
  update: (id, data) => api.put(`/blocks/${id}`, data),
  delete: (id) => api.delete(`/blocks/${id}`),
  analyzeHealth: (id) => api.post(`/blocks/${id}/analyze-health`),
}

// Workers API
export const workersAPI = {
  getAll: () => api.get('/workers'),
  getById: (id) => api.get(`/workers/${id}`),
  create: (data) => api.post('/workers', data),
  update: (id, data) => api.put(`/workers/${id}`, data),
  delete: (id) => api.delete(`/workers/${id}`),
  getAnalytics: (id) => api.get(`/workers/${id}/analytics`),
}

// Tapping Records API
export const tappingAPI = {
  getAll: (params) => api.get('/tapping-records', { params }),
  getById: (id) => api.get(`/tapping-records/${id}`),
  create: (data) => api.post('/tapping-records', data),
  update: (id, data) => api.put(`/tapping-records/${id}`, data),
  delete: (id) => api.delete(`/tapping-records/${id}`),
  getAnalytics: (params) => api.get('/tapping-records/analytics/summary', { params }),
}

// Health Metrics API
export const healthAPI = {
  getByBlock: (blockId, params) => api.get(`/health-metrics/${blockId}`, { params }),
  getAll: (params) => api.get('/health-metrics', { params }),
  create: (data) => api.post('/health-metrics', data),
  getTrends: (blockId, params) => api.get(`/health-metrics/${blockId}/trends`, { params }),
  getSummary: () => api.get('/health-metrics/summary/overview'),
}

// Predictions API
export const predictionsAPI = {
  predictYield: (data) => api.post('/predictions/predict-yield', data),
  getByBlock: (blockId, params) => api.get(`/predictions/block/${blockId}`, { params }),
  getAll: (params) => api.get('/predictions', { params }),
  getAnalytics: () => api.get('/predictions/analytics/summary'),
  delete: (id) => api.delete(`/predictions/${id}`),
}

export default api

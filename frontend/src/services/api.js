import axios from 'axios'

// Auto-detect API URL based on environment
const getApiBaseUrl = () => {
  // If VITE_API_URL is set, use it (production on Netlify/Railway)
  if (import.meta.env.VITE_API_URL) {
    const url = import.meta.env.VITE_API_URL.trim()
    // Ensure it ends with /api if not already
    const apiUrl = url.endsWith('/api') ? url : url.endsWith('/') ? `${url}api` : `${url}/api`
    console.log('[API] Using VITE_API_URL:', apiUrl)
    return apiUrl
  }
  
  // For local development, detect the port
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const currentPort = window.location.port
    if (currentPort) {
      const baseUrl = window.location.origin.replace(`:${currentPort}`, ':5000')
      const apiUrl = `${baseUrl}/api`
      console.log('[API] Using localhost:', apiUrl)
      return apiUrl
    }
    // If no port, assume default
    const apiUrl = 'http://localhost:5000/api'
    console.log('[API] Using default localhost:', apiUrl)
    return apiUrl
  }
  
  // Production fallback - show warning if no API URL is configured
  console.warn('[API] ⚠️ VITE_API_URL not set! API calls will fail. Please configure VITE_API_URL in Netlify environment variables.')
  console.warn('[API] Current hostname:', window.location.hostname)
  // Still return relative path as fallback, but it likely won't work
  return '/api'
}

const API_BASE_URL = getApiBaseUrl()
console.log('[API] Base URL configured:', API_BASE_URL)

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
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    const requestUrl = error.config?.url || 'unknown'
    const fullUrl = error.config?.baseURL + requestUrl
    
    // Handle network errors (CORS, connection refused, etc.)
    if (!error.response) {
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        console.error('❌ Network Error:', {
          url: fullUrl,
          message: 'Cannot connect to backend API',
          suggestion: 'Check if VITE_API_URL is configured correctly in Netlify'
        })
        error.message = `Cannot connect to backend API. Please check your configuration.`
        error.userMessage = `Backend API is not accessible. Please ensure VITE_API_URL is set in Netlify environment variables pointing to your Railway backend URL.`
      } else {
        console.error('❌ API Request Failed:', {
          url: fullUrl,
          error: error.message,
          code: error.code
        })
        error.message = error.message || 'Network error. Please check your connection.'
      }
    } else {
      // Handle HTTP response errors
      console.error(`❌ API Error ${error.response.status}:`, {
        url: fullUrl,
        status: error.response.status,
        data: error.response.data
      })
      
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

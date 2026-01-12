import { useState, useEffect } from 'react'
import { Wifi, WifiOff, AlertCircle } from 'lucide-react'
import api from '../services/api'

const ConnectionStatus = () => {
  const [status, setStatus] = useState('checking') // 'checking' | 'connected' | 'disconnected'
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await api.get('/health')
        if (response.status === 200) {
          setStatus('connected')
        } else {
          setStatus('disconnected')
        }
      } catch (error) {
        setStatus('disconnected')
      }
    }

    checkConnection()
    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000)
    return () => clearInterval(interval)
  }, [])

  if (status === 'connected') {
    return null // Don't show anything when connected
  }

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 bg-white dark:bg-dark-800 border border-red-200 dark:border-red-800 rounded-lg shadow-lg p-3 max-w-sm"
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className="flex items-center space-x-2 cursor-pointer">
        {status === 'checking' ? (
          <>
            <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-yellow-600 dark:text-yellow-400">Checking connection...</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-600 dark:text-red-400 font-medium">
              Backend API Disconnected
            </span>
          </>
        )}
      </div>
      
      {showDetails && status === 'disconnected' && (
        <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800">
          <p className="text-xs text-neutral-600 dark:text-dark-400 mb-2">
            The frontend cannot connect to the backend API. This usually means:
          </p>
          <ul className="text-xs text-neutral-600 dark:text-dark-400 space-y-1 list-disc list-inside">
            <li>VITE_API_URL is not configured in Netlify</li>
            <li>Backend is not running or not accessible</li>
            <li>CORS configuration issue</li>
          </ul>
          <p className="text-xs text-neutral-500 dark:text-dark-500 mt-2">
            Check the browser console for more details.
          </p>
        </div>
      )}
    </div>
  )
}

export default ConnectionStatus

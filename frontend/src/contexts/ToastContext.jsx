import { createContext, useContext, useState, useCallback } from 'react'
import { ToastContainer } from '../components/Toast'

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random()
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      autoClose: true,
      ...toast
    }
    setToasts((prev) => [...prev, newToast])
    return id
  }, [])

  const showSuccess = useCallback((message, title = 'Success') => {
    return addToast({ type: 'success', message, title })
  }, [addToast])

  const showError = useCallback((message, title = 'Error') => {
    return addToast({ type: 'error', message, title, duration: 7000 })
  }, [addToast])

  const showWarning = useCallback((message, title = 'Warning') => {
    return addToast({ type: 'warning', message, title })
  }, [addToast])

  const showInfo = useCallback((message, title = 'Info') => {
    return addToast({ type: 'info', message, title })
  }, [addToast])

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showWarning, showInfo, addToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

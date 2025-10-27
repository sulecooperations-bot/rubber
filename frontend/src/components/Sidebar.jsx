import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Map, 
  Users, 
  ClipboardList, 
  Brain, 
  FileText,
  X,
  Leaf
} from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/map', icon: Map, label: 'Plantation Map' },
    { path: '/workers', icon: Users, label: 'Workers' },
    { path: '/tapping', icon: ClipboardList, label: 'Tapping Records' },
    { path: '/ai-insights', icon: Brain, label: 'AI Insights' },
    { path: '/reports', icon: FileText, label: 'Reports' },
  ]

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-800 border-r border-neutral-200 dark:border-dark-700 lg:translate-x-0 lg:block"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-dark-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <Leaf className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-lg font-heading font-bold text-primary-600 dark:text-primary-400">
                  SPATIO SDS
                </h1>
                <p className="text-xs text-neutral-500 dark:text-dark-400">RubberPanel v1.0</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-neutral-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-600 dark:text-dark-300" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border-r-2 border-primary-500 dark:border-primary-400'
                      : 'text-neutral-600 dark:text-dark-300 hover:bg-neutral-100 dark:hover:bg-dark-700 hover:text-neutral-900 dark:hover:text-dark-100'
                  }`}
                  onClick={() => {
                    // Don't close sidebar on desktop when clicking navigation items
                    if (window.innerWidth < 1024) {
                      onClose()
                    }
                  }}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-200 dark:border-dark-700">
            <div className="text-center">
              <p className="text-xs text-neutral-500 dark:text-dark-400">
                Sri Lankan Rubber Plantation
              </p>
              <p className="text-xs text-neutral-400 dark:text-dark-500 mt-1">
                Management System
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar

import { motion } from 'framer-motion'
import { Menu, Bell, User, Settings } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

const Navbar = ({ onMenuClick }) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-dark-800 border-b border-neutral-200 dark:border-dark-700 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-neutral-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-neutral-600 dark:text-dark-300" />
          </button>
          
          <div className="hidden lg:block">
            <h2 className="text-xl font-heading font-semibold text-neutral-900 dark:text-dark-100">
              Rubber Plantation Management
            </h2>
            <p className="text-sm text-neutral-500 dark:text-dark-400">
              SPATIO SDS - Sri Lanka
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Notifications */}
          <button className="relative p-2 hover:bg-neutral-100 dark:hover:bg-dark-700 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-neutral-600 dark:text-dark-300" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-neutral-900 dark:text-dark-100">Plantation Manager</p>
              <p className="text-xs text-neutral-500 dark:text-dark-400">SPATIO SDS</p>
            </div>
            
            <button className="flex items-center space-x-2 p-2 hover:bg-neutral-100 dark:hover:bg-dark-700 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <Settings className="w-4 h-4 text-neutral-600 dark:text-dark-300" />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Navbar

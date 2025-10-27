import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Check if we're on desktop and if there's a saved preference
    const isDesktop = window.innerWidth >= 1024
    const savedState = localStorage.getItem('sidebarOpen')
    return savedState ? JSON.parse(savedState) : isDesktop
  })

  // Show sidebar by default on desktop
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024
      if (isDesktop) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }
    
    handleResize() // Set initial state
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen))
  }, [sidebarOpen])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-dark-900">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout

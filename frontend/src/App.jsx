import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import MapView from './pages/MapView'
import Workers from './pages/Workers'
import TappingRecords from './pages/TappingRecords'
import AIInsights from './pages/AIInsights'
import Reports from './pages/Reports'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-gradient-to-br from-primary-50 via-neutral-50 to-secondary-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900"
        >
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/workers" element={<Workers />} />
              <Route path="/tapping" element={<TappingRecords />} />
              <Route path="/ai-insights" element={<AIInsights />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </Layout>
        </motion.div>
      </Router>
    </ThemeProvider>
  )
}

export default App

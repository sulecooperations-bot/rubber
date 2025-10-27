import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Calendar, BarChart3, MapPin, Users, TrendingUp } from 'lucide-react'
import { dashboardAPI, blocksAPI, workersAPI, tappingAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import Button from '../components/Button'

const Reports = () => {
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState(null)

  const generateReport = async () => {
    try {
      setLoading(true)
      
      // Fetch all necessary data
      const [statsResponse, blocksResponse, workersResponse, tappingResponse] = await Promise.all([
        dashboardAPI.getStats(),
        blocksAPI.getAll(),
        workersAPI.getAll(),
        tappingAPI.getAnalytics()
      ])

      const reportData = {
        stats: statsResponse.data,
        blocks: blocksResponse.data,
        workers: workersResponse.data,
        tapping: tappingResponse.data,
        generatedAt: new Date().toISOString()
      }

      setReportData(reportData)
      
      // Generate PDF (mock implementation)
      generatePDF(reportData)
      
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setLoading(false)
    }
  }

  const generatePDF = (data) => {
    // Mock PDF generation - in a real implementation, you would use jsPDF
    console.log('Generating PDF with data:', data)
    
    // Simulate PDF generation
    setTimeout(() => {
      const link = document.createElement('a')
      link.href = '#'
      link.download = `Plantation_Report_${new Date().toISOString().split('T')[0]}.pdf`
      link.click()
    }, 1000)
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
            Reports & Analytics
          </h1>
          <p className="text-neutral-600">
            Generate comprehensive plantation reports and export data
          </p>
        </div>
        <Button
          onClick={generateReport}
          loading={loading}
          className="flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Generate Report</span>
        </Button>
      </motion.div>

      {/* Report Preview */}
      {reportData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card"
        >
          <div className="flex items-center space-x-2 mb-6">
            <FileText className="w-6 h-6 text-primary-600" />
            <h3 className="text-xl font-heading font-semibold text-neutral-900">
              Plantation Report Preview
            </h3>
          </div>

          <div className="space-y-6">
            {/* Header Section */}
            <div className="text-center py-8 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg">
              <h2 className="text-3xl font-heading font-bold text-primary-600 mb-2">
                SPATIO SDS
              </h2>
              <h3 className="text-xl font-heading font-semibold text-neutral-700 mb-1">
                RubberPanel v1.0
              </h3>
              <p className="text-neutral-600">Sri Lankan Rubber Plantation Management System</p>
              <p className="text-sm text-neutral-500 mt-2">
                Generated on {new Date(reportData.generatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {/* Executive Summary */}
            <div>
              <h4 className="text-lg font-heading font-semibold text-neutral-900 mb-4">
                Executive Summary
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <MapPin className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neutral-900">{reportData.stats.totalArea} ha</div>
                  <div className="text-sm text-neutral-600">Total Area</div>
                </div>
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neutral-900">{reportData.stats.totalBlocks}</div>
                  <div className="text-sm text-neutral-600">Blocks</div>
                </div>
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <Users className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neutral-900">{reportData.stats.totalWorkers}</div>
                  <div className="text-sm text-neutral-600">Workers</div>
                </div>
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neutral-900">{reportData.stats.averageYield} kg</div>
                  <div className="text-sm text-neutral-600">Avg Yield/Day</div>
                </div>
              </div>
            </div>

            {/* Block-wise Breakdown */}
            <div>
              <h4 className="text-lg font-heading font-semibold text-neutral-900 mb-4">
                Block-wise Performance
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-neutral-700">Block</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-neutral-700">Estate</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-neutral-700">Area (ha)</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-neutral-700">Trees</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-neutral-700">Health (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {reportData.blocks.slice(0, 10).map((block, index) => (
                      <tr key={block.id}>
                        <td className="px-4 py-2 text-sm text-neutral-900">{block.name}</td>
                        <td className="px-4 py-2 text-sm text-neutral-600">{block.estate?.name}</td>
                        <td className="px-4 py-2 text-sm text-neutral-900">{block.area}</td>
                        <td className="px-4 py-2 text-sm text-neutral-900">{block.treeCount}</td>
                        <td className="px-4 py-2 text-sm text-neutral-900">
                          {Math.round(block.healthScore * 100)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Worker Performance */}
            <div>
              <h4 className="text-lg font-heading font-semibold text-neutral-900 mb-4">
                Top Performing Workers
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportData.workers.slice(0, 6).map((worker, index) => (
                  <div key={worker.id} className="p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <div className="font-medium text-neutral-900">{worker.name}</div>
                        <div className="text-sm text-neutral-600">{worker.assignedBlock?.name}</div>
                        <div className="text-sm text-neutral-500">
                          Avg: {worker.averageYield?.toFixed(1) || 0} kg/day
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center py-6 border-t border-neutral-200">
              <p className="text-sm text-neutral-500">
                Generated by SPATIO SDS – RubberPanel v1.0 (Sri Lanka)
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                This report contains confidential plantation data. Distribution is restricted.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Report Templates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div className="card-hover">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-6 h-6 text-primary-600" />
            <h3 className="text-lg font-heading font-semibold text-neutral-900">
              Monthly Report
            </h3>
          </div>
          <p className="text-sm text-neutral-600 mb-4">
            Comprehensive monthly overview with yield trends, worker performance, and health metrics.
          </p>
          <Button variant="outline" className="w-full">
            Generate Monthly
          </Button>
        </div>

        <div className="card-hover">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="w-6 h-6 text-primary-600" />
            <h3 className="text-lg font-heading font-semibold text-neutral-900">
              Analytics Report
            </h3>
          </div>
          <p className="text-sm text-neutral-600 mb-4">
            Detailed analytics with charts, correlations, and predictive insights.
          </p>
          <Button variant="outline" className="w-full">
            Generate Analytics
          </Button>
        </div>

        <div className="card-hover">
          <div className="flex items-center space-x-3 mb-4">
            <MapPin className="w-6 h-6 text-primary-600" />
            <h3 className="text-lg font-heading font-semibold text-neutral-900">
              Estate Report
            </h3>
          </div>
          <p className="text-sm text-neutral-600 mb-4">
            Estate-specific report with block details, health status, and recommendations.
          </p>
          <Button variant="outline" className="w-full">
            Generate Estate
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default Reports





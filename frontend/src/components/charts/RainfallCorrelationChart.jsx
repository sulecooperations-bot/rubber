import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { format } from 'date-fns'

const RainfallCorrelationChart = ({ yieldData = [], rainfallData = [] }) => {
  const formatData = () => {
    // Combine yield and rainfall data by month
    const combinedData = []
    const months = new Set()
    
    yieldData.forEach(item => months.add(item.month))
    rainfallData.forEach(item => months.add(item.month))
    
    Array.from(months).forEach(month => {
      const yieldItem = yieldData.find(item => item.month === month)
      const rainfallItem = rainfallData.find(item => item.month === month)
      
      combinedData.push({
        month: format(new Date(month), 'MMM yyyy'),
        yield: parseFloat(yieldItem?.avgYield || 0),
        rainfall: parseFloat(rainfallItem?.rainfall || 0)
      })
    })
    
    return combinedData.sort((a, b) => new Date(a.month) - new Date(b.month))
  }

  const chartData = formatData()

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            yAxisId="yield"
            orientation="left"
            stroke="#3C7A44"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Yield (kg/day)', angle: -90, position: 'insideLeft' }}
          />
          <YAxis 
            yAxisId="rainfall"
            orientation="right"
            stroke="#3b82f6"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Rainfall (mm)', angle: 90, position: 'insideRight' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            labelStyle={{ color: '#374151', fontWeight: '600' }}
            formatter={(value, name) => [
              `${value.toFixed(1)} ${name === 'yield' ? 'kg/day' : 'mm'}`,
              name === 'yield' ? 'Yield' : 'Rainfall'
            ]}
          />
          <Legend />
          <Bar
            yAxisId="rainfall"
            dataKey="rainfall"
            fill="#3b82f6"
            opacity={0.7}
            name="Rainfall"
          />
          <Line
            yAxisId="yield"
            type="monotone"
            dataKey="yield"
            stroke="#3C7A44"
            strokeWidth={3}
            dot={{ fill: '#3C7A44', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3C7A44', strokeWidth: 2 }}
            name="Yield"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RainfallCorrelationChart





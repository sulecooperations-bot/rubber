import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

const YieldTrendChart = ({ data = [] }) => {
  const formatData = (data) => {
    return data.map(item => ({
      month: format(new Date(item.month), 'MMM yyyy'),
      yield: parseFloat(item.avgYield || 0),
      totalYield: parseFloat(item.totalYield || 0)
    }))
  }

  const chartData = formatData(data)

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            label={{ value: 'kg/day', angle: -90, position: 'insideLeft' }}
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
              `${value.toFixed(1)} kg/day`,
              name === 'yield' ? 'Average Yield' : 'Total Yield'
            ]}
          />
          <Line
            type="monotone"
            dataKey="yield"
            stroke="#3C7A44"
            strokeWidth={3}
            dot={{ fill: '#3C7A44', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3C7A44', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default YieldTrendChart






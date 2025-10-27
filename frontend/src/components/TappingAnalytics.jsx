import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const TappingAnalytics = ({ data }) => {
  const COLORS = ['#3C7A44', '#8B5E3C', '#F5E6B1', '#22c55e', '#eab308', '#ef4444']

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Yield by Worker */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-neutral-900 mb-4">
          Top Workers by Yield
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.yieldByWorker || []} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="worker.name" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                label={{ value: 'kg', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => [
                  `${value.toFixed(1)} kg`,
                  name === 'totalYield' ? 'Total Yield' : 'Average Yield'
                ]}
              />
              <Bar dataKey="totalYield" fill="#3C7A44" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Trend */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-neutral-900 mb-4">
          Daily Yield Trend
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.dailyTrend || []} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                label={{ value: 'kg', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
                formatter={(value, name) => [
                  `${value.toFixed(1)} kg`,
                  name === 'totalYield' ? 'Total Yield' : 'Records'
                ]}
              />
              <Line
                type="monotone"
                dataKey="totalYield"
                stroke="#3C7A44"
                strokeWidth={2}
                dot={{ fill: '#3C7A44', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3C7A44', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quality Distribution */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-neutral-900 mb-4">
          Quality Distribution
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <Pie
                data={data.qualityDistribution || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {(data.qualityDistribution || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => [
                  `${value} records`,
                  name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default TappingAnalytics





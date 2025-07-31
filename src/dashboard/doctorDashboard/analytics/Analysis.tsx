import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area, CartesianGrid, LineChart, Line, Legend, RadialBarChart, RadialBar
} from 'recharts';
import { Calendar, Pill, Users, TrendingUp, DollarSign, Clock, Activity, Target, Award } from 'lucide-react';

// Enhanced mock data with realistic trends
const trendData = [
  { name: 'Mon', appointments: 18, prescriptions: 14, completedAppointments: 16, revenue: 2700 },
  { name: 'Tue', appointments: 22, prescriptions: 19, completedAppointments: 21, revenue: 3150 },
  { name: 'Wed', appointments: 15, prescriptions: 12, completedAppointments: 14, revenue: 2100 },
  { name: 'Thu', appointments: 28, prescriptions: 24, completedAppointments: 26, revenue: 3900 },
  { name: 'Fri', appointments: 25, prescriptions: 21, completedAppointments: 23, revenue: 3450 },
  { name: 'Sat', apartments: 12, prescriptions: 9, completedAppointments: 11, revenue: 1650 },
  { name: 'Sun', appointments: 8, prescriptions: 6, completedAppointments: 7, revenue: 1200 },
];

const monthlyData = [
  { month: 'Jan', appointments: 445, prescriptions: 367, revenue: 66750 },
  { month: 'Feb', appointments: 478, prescriptions: 392, revenue: 71700 },
  { month: 'Mar', appointments: 512, prescriptions: 418, revenue: 76800 },
  { month: 'Apr', appointments: 489, prescriptions: 401, revenue: 73350 },
  { month: 'May', appointments: 534, prescriptions: 445, revenue: 80100 },
  { month: 'Jun', appointments: 498, prescriptions: 408, revenue: 74700 },
];

const patientSatisfactionData = [
  { name: 'Excellent', value: 52, fill: '#10B981' },
  { name: 'Good', value: 28, fill: '#3B82F6' },
  { name: 'Average', value: 15, fill: '#F59E0B' },
  { name: 'Poor', value: 5, fill: '#EF4444' },
];

const ModernAnalyticsDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedChart, setSelectedChart] = useState('bar');
  
  // Calculate metrics from mock data
  const metrics = useMemo(() => {
    const currentData = selectedTimeframe === 'week' ? trendData : monthlyData;
    const totalAppointments = currentData.reduce((sum, item) => sum + item.appointments, 0);
    const totalPrescriptions = currentData.reduce((sum, item) => sum + item.prescriptions, 0);
    const totalRevenue = currentData.reduce((sum, item) => sum + item.revenue, 0);
    const completionRate = selectedTimeframe === 'week' 
      ? (trendData.reduce((sum, item) => sum + (item.completedAppointments || item.appointments * 0.9), 0) / totalAppointments) * 100
      : 92.5;
    const avgPrescriptionsPerAppointment = totalAppointments > 0 ? (totalPrescriptions / totalAppointments) : 0;
    const uniquePatients = Math.floor(totalAppointments * 0.75);
    
    return {
      totalAppointments,
      totalPrescriptions,
      completionRate,
      avgPrescriptionsPerAppointment,
      totalRevenue,
      uniquePatients,
    };
  }, [selectedTimeframe]);

  const summaryCards = [
    {
      label: 'Total Appointments',
      value: metrics.totalAppointments.toLocaleString(),
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
      changeType: 'positive',
      description: 'vs last period'
    },
    {
      label: 'Prescriptions Written',
      value: metrics.totalPrescriptions.toLocaleString(),
      icon: Pill,
      color: 'from-emerald-500 to-emerald-600',
      change: '+8%',
      changeType: 'positive',
      description: 'vs last period'
    },
    {
      label: selectedTimeframe === 'week' ? 'Patients This Week' : 'Unique Patients',
      value: metrics.uniquePatients.toLocaleString(),
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      change: '+5%',
      changeType: 'positive',
      description: 'vs last period'
    },
    {
      label: 'Completion Rate',
      value: `${metrics.completionRate.toFixed(1)}%`,
      icon: Target,
      color: 'from-amber-500 to-amber-600',
      change: '-2%',
      changeType: 'negative',
      description: 'vs last period'
    },
    {
      label: selectedTimeframe === 'week' ? 'Revenue This Week' : 'Revenue This Period',
      value: `$${metrics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-indigo-500 to-indigo-600',
      change: '+15%',
      changeType: 'positive',
      description: 'vs last period'
    },
    {
      label: 'Avg. Prescriptions',
      value: metrics.avgPrescriptionsPerAppointment.toFixed(1),
      icon: Activity,
      color: 'from-rose-500 to-rose-600',
      change: '+3%',
      changeType: 'positive',
      description: 'per appointment'
    },
  ];

  const chartData = selectedTimeframe === 'week' ? trendData : monthlyData;

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (selectedChart) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey={selectedTimeframe === 'week' ? 'name' : 'month'} 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="appointments" 
              stroke="#4F46E5" 
              strokeWidth={3} 
              dot={{ fill: '#4F46E5', strokeWidth: 2, r: 4 }}
              name="Appointments"
            />
            <Line 
              type="monotone" 
              dataKey="prescriptions" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              name="Prescriptions"
            />
          </LineChart>
        );
      
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="colorPrescriptions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey={selectedTimeframe === 'week' ? 'name' : 'month'} 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="appointments" 
              stroke="#4F46E5" 
              strokeWidth={2}
              fill="url(#colorAppointments)" 
              name="Appointments"
            />
            <Area 
              type="monotone" 
              dataKey="prescriptions" 
              stroke="#10B981" 
              strokeWidth={2}
              fill="url(#colorPrescriptions)" 
              name="Prescriptions"
            />
          </AreaChart>
        );
      
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey={selectedTimeframe === 'week' ? 'name' : 'month'} 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Legend />
            <Bar 
              dataKey="appointments" 
              fill="#4F46E5" 
              radius={[4, 4, 0, 0]} 
              name="Appointments"
            />
            <Bar 
              dataKey="prescriptions" 
              fill="#10B981" 
              radius={[4, 4, 0, 0]} 
              name="Prescriptions"
            />
          </BarChart>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Track your performance metrics and insights</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {summaryCards.map((card, index) => (
            <div 
              key={card.label} 
              className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-500 text-sm font-medium mb-1">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">
                    {card.value}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                      card.changeType === 'positive' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {card.changeType === 'positive' ? '↗' : '↘'} {card.change}
                    </span>
                    <span className="text-gray-500 text-xs">{card.description}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Chart Section */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-white/50 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Performance Trends</h2>
              <p className="text-gray-600">Track your key metrics over time</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {/* Timeframe Selector */}
              <div className="flex bg-gray-100/80 backdrop-blur-sm rounded-xl p-1.5 border border-gray-200/50">
                {['week', 'month'].map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                      selectedTimeframe === timeframe
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                    }`}
                  >
                    {timeframe}ly
                  </button>
                ))}
              </div>

              {/* Chart Type Selector */}
              <div className="flex bg-gray-100/80 backdrop-blur-sm rounded-xl p-1.5 border border-gray-200/50">
                {[
                  { type: 'bar', icon: '📊' },
                  { type: 'line', icon: '📈' },
                  { type: 'area', icon: '📉' }
                ].map(({ type, icon }) => (
                  <button
                    key={type}
                    onClick={() => setSelectedChart(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize flex items-center gap-2 ${
                      selectedChart === type
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                    }`}
                  >
                    <span>{icon}</span>
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50/50 to-white rounded-xl p-4">
            <ResponsiveContainer width="100%" height={400}>
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row - Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Patient Satisfaction */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Patient Satisfaction</h2>
                <p className="text-gray-600 text-sm">Feedback distribution</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={patientSatisfactionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={40}
                  paddingAngle={4}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {patientSatisfactionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Performance Overview</h2>
                <p className="text-gray-600 text-sm">Key performance indicators</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="20%" 
                outerRadius="80%" 
                data={[
                  { name: 'Completion Rate', value: metrics.completionRate, fill: '#4F46E5' },
                  { name: 'Patient Satisfaction', value: 89, fill: '#10B981' },
                  { name: 'Efficiency Score', value: 94, fill: '#F59E0B' },
                ]}
              >
                <RadialBar dataKey="value" cornerRadius={10} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-white/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
              <p className="text-gray-600 text-sm">Frequently used actions</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Schedule Appointment', color: 'from-blue-500 to-blue-600' },
              { label: 'Write Prescription', color: 'from-emerald-500 to-emerald-600' },
              { label: 'View Patient Records', color: 'from-purple-500 to-purple-600' },
              { label: 'Generate Report', color: 'from-gray-500 to-gray-600' }
            ].map((action, index) => (
              <button 
                key={action.label}
                className={`bg-gradient-to-r ${action.color} hover:shadow-lg text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 hover:-translate-y-0.5 text-sm`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernAnalyticsDashboard;
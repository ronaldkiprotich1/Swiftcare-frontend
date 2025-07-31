import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, LineChart, Line, Legend,
  ComposedChart, RadialBarChart, RadialBar
} from 'recharts';
import { 
  Users, Calendar, UserCheck, CreditCard, FileText, AlertCircle,
  TrendingUp, TrendingDown, Activity, BarChart3, Target, Clock, DollarSign, Award
} from 'lucide-react';

// Enhanced Analytics Dashboard Component
const EnhancedAnalytics = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedChart, setSelectedChart] = useState('overview');

  // Mock API data (replace with real API calls)
  const mockData = {
    users: { length: 1247 },
    appointments: { appointments: Array.from({length: 834}, (_, i) => ({ 
      id: i, 
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      status: Math.random() > 0.2 ? 'completed' : 'pending'
    })) },
    doctors: { doctors: Array.from({length: 45}, (_, i) => ({ 
      id: i, 
      specialty: ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology'][Math.floor(Math.random() * 5)]
    })) },
    payments: { payments: Array.from({length: 692}, (_, i) => ({ 
      id: i, 
      amount: Math.floor(Math.random() * 500) + 50,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    })) },
    prescriptions: { data: Array.from({length: 1156}, (_, i) => ({ 
      id: i, 
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    })) },
    complaints: { complaints: Array.from({length: 23}, (_, i) => ({ 
      id: i, 
      severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
    })) }
  };

  // Calculate metrics with growth rates
  const calculateMetrics = useMemo(() => {
    const totalUsers = mockData.users?.length || 0;
    const totalAppointments = mockData.appointments?.appointments?.length || 0;
    const totalDoctors = mockData.doctors?.doctors?.length || 0;
    const totalPayments = mockData.payments?.payments?.length || 0;
    const totalPrescriptions = mockData.prescriptions?.data?.length || 0;
    const totalComplaints = mockData.complaints?.complaints?.length || 0;

    // Calculate completion rate
    const completedAppointments = mockData.appointments?.appointments?.filter(apt => apt.status === 'completed').length || 0;
    const completionRate = totalAppointments > 0 ? (completedAppointments / totalAppointments * 100) : 0;

    // Calculate total revenue
    const totalRevenue = mockData.payments?.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
    const avgRevenuePerPayment = totalPayments > 0 ? totalRevenue / totalPayments : 0;

    return {
      totalUsers,
      totalAppointments,
      totalDoctors,
      totalPayments,
      totalPrescriptions,
      totalComplaints,
      completionRate,
      totalRevenue,
      avgRevenuePerPayment,
      prescriptionRate: totalAppointments > 0 ? (totalPrescriptions / totalAppointments * 100) : 0
    };
  }, [mockData]);

  // Enhanced summary cards with growth indicators
  const summaryCards = [
    {
      label: 'Total Users',
      value: calculateMetrics.totalUsers.toLocaleString(),
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: '+12.5%',
      changeType: 'positive',
      description: 'Active users'
    },
    {
      label: 'Appointments',
      value: calculateMetrics.totalAppointments.toLocaleString(),
      icon: Calendar,
      color: 'from-emerald-500 to-emerald-600',
      change: '+8.3%',
      changeType: 'positive',
      description: 'This month'
    },
    {
      label: 'Active Doctors',
      value: calculateMetrics.totalDoctors.toLocaleString(),
      icon: UserCheck,
      color: 'from-purple-500 to-purple-600',
      change: '+2.1%',
      changeType: 'positive',
      description: 'Medical staff'
    },
    {
      label: 'Total Revenue',
      value: `$${calculateMetrics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      change: '+18.7%',
      changeType: 'positive',
      description: 'This period'
    },
    {
      label: 'Prescriptions',
      value: calculateMetrics.totalPrescriptions.toLocaleString(),
      icon: FileText,
      color: 'from-indigo-500 to-indigo-600',
      change: '+5.9%',
      changeType: 'positive',
      description: 'Written'
    },
    {
      label: 'Complaints',
      value: calculateMetrics.totalComplaints.toLocaleString(),
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      change: '-15.2%',
      changeType: 'negative',
      description: 'Active issues'
    }
  ];

  // Generate trend data based on real metrics
  const generateTrendData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      name: day,
      appointments: Math.floor(Math.random() * 50) + 20,
      prescriptions: Math.floor(Math.random() * 40) + 15,
      revenue: Math.floor(Math.random() * 5000) + 2000,
      users: Math.floor(Math.random() * 30) + 10
    }));
  };

  const trendData = generateTrendData();

  // Doctor specialty distribution
  const specialtyData = [
    { name: 'Cardiology', value: 12, fill: '#4F46E5' },
    { name: 'Neurology', value: 8, fill: '#10B981' },
    { name: 'Pediatrics', value: 10, fill: '#F59E0B' },
    { name: 'Orthopedics', value: 9, fill: '#EF4444' },
    { name: 'Dermatology', value: 6, fill: '#8B5CF6' }
  ];

  // Performance metrics for radial chart
  const performanceData = [
    { name: 'Completion Rate', value: calculateMetrics.completionRate, fill: '#4F46E5' },
    { name: 'Prescription Rate', value: calculateMetrics.prescriptionRate, fill: '#10B981' },
    { name: 'Patient Satisfaction', value: 87.5, fill: '#F59E0B' },
    { name: 'Doctor Utilization', value: 78.9, fill: '#EF4444' }
  ];

  const renderMainChart = () => {
    switch (selectedChart) {
      case 'trends':
        return (
          <ComposedChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis yAxisId="left" stroke="#6b7280" />
            <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Legend />
            <Bar yAxisId="left" dataKey="appointments" fill="#4F46E5" name="Appointments" />
            <Bar yAxisId="left" dataKey="prescriptions" fill="#10B981" name="Prescriptions" />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={3} name="Revenue ($)" />
          </ComposedChart>
        );
      
      case 'area':
        return (
          <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Legend />
            <Area type="monotone" dataKey="appointments" stroke="#4F46E5" fill="url(#colorAppointments)" name="Appointments" />
            <Area type="monotone" dataKey="prescriptions" stroke="#10B981" fill="url(#colorPrescriptions)" name="Prescriptions" />
          </AreaChart>
        );
      
      default:
        return (
          <BarChart data={summaryCards.map(card => ({ name: card.label, value: parseInt(card.value.replace(/[^0-9]/g, '')) }))} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
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
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Comprehensive overview of your healthcare platform</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {summaryCards.map((card, index) => (
            <div 
              key={card.label}
              className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-500 text-sm font-medium mb-1">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">
                    {card.value}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      card.changeType === 'positive' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {card.changeType === 'positive' ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {card.change}
                    </span>
                    <span className="text-gray-500 text-xs">{card.description}</span>
                  </div>
                </div>
                <div className={`p-4 rounded-xl bg-gradient-to-r ${card.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
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
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Platform Analytics</h2>
              <p className="text-gray-600">Detailed insights into your platform performance</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {/* Chart Type Selector */}
              <div className="flex bg-gray-100/80 backdrop-blur-sm rounded-xl p-1.5 border border-gray-200/50">
                {[
                  { type: 'overview', icon: BarChart3, label: 'Overview' },
                  { type: 'trends', icon: Activity, label: 'Trends' },
                  { type: 'area', icon: TrendingUp, label: 'Area' }
                ].map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    onClick={() => setSelectedChart(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      selectedChart === type
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50/50 to-white rounded-xl p-4">
            <ResponsiveContainer width="100%" height={400}>
              {renderMainChart()}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row - Specialty Distribution & Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Doctor Specialties */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Doctor Specialties</h2>
                <p className="text-gray-600 text-sm">Distribution by medical field</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={specialtyData}
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
                  {specialtyData.map((entry, index) => (
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
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Performance Metrics</h2>
                <p className="text-gray-600 text-sm">Key performance indicators</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="20%" 
                outerRadius="80%" 
                data={performanceData}
              >
                <RadialBar dataKey="value" cornerRadius={10} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                  formatter={(value) => [`${value.toFixed(1)}%`, 'Rate']}
                />
                <Legend />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-white/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Key Insights</h2>
              <p className="text-gray-600 text-sm">Important metrics and recommendations</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Completion Rate</h4>
              <p className="text-2xl font-bold text-blue-600">{calculateMetrics.completionRate.toFixed(1)}%</p>
              <p className="text-sm text-blue-600 mt-1">Appointment completion</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Avg Revenue</h4>
              <p className="text-2xl font-bold text-green-600">${calculateMetrics.avgRevenuePerPayment.toFixed(0)}</p>
              <p className="text-sm text-green-600 mt-1">Per transaction</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">Prescription Rate</h4>
              <p className="text-2xl font-bold text-purple-600">{calculateMetrics.prescriptionRate.toFixed(1)}%</p>
              <p className="text-sm text-purple-600 mt-1">Per appointment</p>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">Issues Rate</h4>
              <p className="text-2xl font-bold text-red-600">{((calculateMetrics.totalComplaints / calculateMetrics.totalUsers) * 100).toFixed(2)}%</p>
              <p className="text-sm text-red-600 mt-1">Complaints per user</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAnalytics;
import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area, CartesianGrid, LineChart, Line, Legend, RadialBarChart, RadialBar
} from 'recharts';
import { useSelector } from 'react-redux';
import { FaCalendar, FaPrescriptionBottle, FaUsers, FaArrowTrendUp, FaChartLine, FaClock } from 'react-icons/fa6';
import { appointmentsAPI } from '../../../features/appointments/appointmentsAPI';
import { prescriptionsAPI } from '../../../features/prescriptions/prescriptionAPI';
import type { RootState } from '../../../app/store';

// Enhanced mock data with more realistic trends
const trendData = [
  { name: 'Mon', appointments: 8, prescriptions: 6, completedAppointments: 7, revenue: 1200 },
  { name: 'Tue', appointments: 12, prescriptions: 9, completedAppointments: 11, revenue: 1800 },
  { name: 'Wed', appointments: 6, prescriptions: 4, completedAppointments: 5, revenue: 900 },
  { name: 'Thu', appointments: 15, prescriptions: 12, completedAppointments: 14, revenue: 2100 },
  { name: 'Fri', appointments: 10, prescriptions: 8, completedAppointments: 9, revenue: 1500 },
  { name: 'Sat', appointments: 7, prescriptions: 5, completedAppointments: 6, revenue: 1050 },
  { name: 'Sun', appointments: 4, prescriptions: 2, completedAppointments: 3, revenue: 600 },
];

const monthlyData = [
  { month: 'Jan', appointments: 89, prescriptions: 67, revenue: 15400 },
  { month: 'Feb', appointments: 95, prescriptions: 72, revenue: 16800 },
  { month: 'Mar', appointments: 102, prescriptions: 78, revenue: 18200 },
  { month: 'Apr', appointments: 87, prescriptions: 65, revenue: 14900 },
  { month: 'May', appointments: 110, prescriptions: 85, revenue: 19500 },
  { month: 'Jun', appointments: 98, prescriptions: 74, revenue: 17200 },
];

const patientSatisfactionData = [
  { name: 'Excellent', value: 45, fill: '#10B981' },
  { name: 'Good', value: 30, fill: '#3B82F6' },
  { name: 'Average', value: 20, fill: '#F59E0B' },
  { name: 'Poor', value: 5, fill: '#EF4444' },
];

const DoctorAnalysis = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month'>('week');
  const [selectedChart, setSelectedChart] = useState<'bar' | 'line' | 'area'>('bar');
  
  const doctorID = useSelector((state: RootState) => state.user.user?.doctorID);
  const doctorName = useSelector((state: RootState) => state.user.user?.firstName || 'Doctor');

  const { data: doctorAppointments, isLoading: appointmentsLoading } =
    appointmentsAPI.useGetAppointmentsByDoctorIdQuery(doctorID ?? 0, {
      skip: !doctorID,
    });

  const { data: doctorPrescriptions, isLoading: prescriptionsLoading } =
    prescriptionsAPI.useGetPrescriptionsByDoctorIdQuery(doctorID ?? 0, {
      skip: !doctorID,
    });

  // Calculate additional metrics
  const metrics = useMemo(() => {
    const appointments = doctorAppointments?.appointments || [];
    const prescriptions = doctorPrescriptions?.prescriptions || [];
    
    const totalAppointments = appointments.length;
    const totalPrescriptions = prescriptions.length;
    const completionRate = totalAppointments > 0 ? ((totalAppointments - 3) / totalAppointments) * 100 : 0; // Mock completed appointments
    const avgPrescriptionsPerAppointment = totalAppointments > 0 ? (totalPrescriptions / totalAppointments).toFixed(1) : '0';
    
    return {
      totalAppointments,
      totalPrescriptions,
      completionRate: Math.max(0, completionRate),
      avgPrescriptionsPerAppointment,
      totalRevenue: totalAppointments * 150, // Mock revenue calculation
      patientsThisWeek: Math.floor(totalAppointments * 0.8), // Mock unique patients
    };
  }, [doctorAppointments, doctorPrescriptions]);

  const summaryCards = [
    {
      label: 'Total Appointments',
      value: metrics.totalAppointments,
      icon: FaCalendar,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      label: 'Prescriptions Written',
      value: metrics.totalPrescriptions,
      icon: FaPrescriptionBottle,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive' as const
    },
    {
      label: 'Patients This Week',
      value: metrics.patientsThisWeek,
      icon: FaUsers,
      color: 'bg-purple-500',
      change: '+5%',
      changeType: 'positive' as const
    },
    {
      label: 'Completion Rate',
      value: `${metrics.completionRate.toFixed(1)}%`,
      icon: FaArrowTrendUp,
      color: 'bg-yellow-500',
      change: '-2%',
      changeType: 'negative' as const
    },
    {
      label: 'Revenue This Month',
      value: `$${metrics.totalRevenue.toLocaleString()}`,
      icon: FaChartLine,
      color: 'bg-indigo-500',
      change: '+15%',
      changeType: 'positive' as const
    },
    {
      label: 'Avg. Prescriptions',
      value: metrics.avgPrescriptionsPerAppointment,
      icon: FaClock,
      color: 'bg-pink-500',
      change: '+3%',
      changeType: 'positive' as const
    },
  ];

  const chartData = selectedTimeframe === 'week' ? trendData : monthlyData;

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (selectedChart) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={selectedTimeframe === 'week' ? 'name' : 'month'} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="appointments" stroke="#4F46E5" strokeWidth={3} />
            <Line type="monotone" dataKey="prescriptions" stroke="#10B981" strokeWidth={3} />
            {selectedTimeframe === 'week' && (
              <Line type="monotone" dataKey="completedAppointments" stroke="#F59E0B" strokeWidth={2} />
            )}
          </LineChart>
        );
      
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPrescriptions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey={selectedTimeframe === 'week' ? 'name' : 'month'} />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="appointments" stackId="1" stroke="#4F46E5" fill="url(#colorAppointments)" />
            <Area type="monotone" dataKey="prescriptions" stackId="1" stroke="#10B981" fill="url(#colorPrescriptions)" />
          </AreaChart>
        );
      
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={selectedTimeframe === 'week' ? 'name' : 'month'} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="appointments" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            <Bar dataKey="prescriptions" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
    }
  };

  if (appointmentsLoading || prescriptionsLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg mb-4"></div>
          <p className="text-gray-600">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, Dr. {doctorName}!</h1>
        <p className="text-gray-600">Here's your practice overview and analytics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {summaryCards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{card.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.change}
                  </span>
                  <span className="text-gray-500 text-xs ml-1">vs last period</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${card.color}`}>
                <card.icon className="text-white text-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Practice Trends</h2>
          
          <div className="flex gap-4">
            {/* Timeframe Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setSelectedTimeframe('week')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTimeframe === 'week'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setSelectedTimeframe('month')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTimeframe === 'month'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Monthly
              </button>
            </div>

            {/* Chart Type Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(['bar', 'line', 'area'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedChart(type)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                    selectedChart === type
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Bottom Row - Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Patient Satisfaction */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Patient Satisfaction</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={patientSatisfactionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
              >
                {patientSatisfactionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Performance Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={[
              { name: 'Appointments', value: metrics.completionRate, fill: '#4F46E5' },
              { name: 'Prescriptions', value: 85, fill: '#10B981' },
              { name: 'Patient Care', value: 92, fill: '#F59E0B' },
            ]}>
              <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
              <Tooltip />
              <Legend />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Schedule Appointment
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Write Prescription
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            View Patient Records
          </button>
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorAnalysis;
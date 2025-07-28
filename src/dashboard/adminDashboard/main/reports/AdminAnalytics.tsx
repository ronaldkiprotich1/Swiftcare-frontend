// import React, { useState } from 'react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   AreaChart,
//   Area,
//   PieLabelRenderProps
// } from 'recharts';
// import {
//   TrendingUp,
//   TrendingDown,
//   Users,
//   DollarSign,
//   Calendar,
//   Activity,
//   Target,
//   Award,
//   Clock,
//   MapPin,
//   BarChart2,
//   PieChart as PieChartIcon,
//   LineChart as LineChartIcon
// } from 'react-feather';

// // API imports (adjust paths as needed)
// import { useGetDetailedAppointmentsQuery } from '../../../../../features/appointments/appointmentsAPI';
// import { useGetUsersQuery } from '../../../../../features/users/';
// import { useGetDoctorsQuery } from '../../../../../features/doctors/doctorsAPI';
// import { useGetComplaintsQuery } from '../../../../reducers/complaints/complaintsAPI';
// import { useGetPrescriptionsQuery } from '../../../../reducers/prescriptions/prescriptionsAPI';
// import { useGetAllPaymentsQuery } from '../../../../reducers/payments/paymentsAPI';
// import AdminSystemReport from './AdminSystemReport';

// // Type definitions
// interface ChartData {
//   name: string;
//   value: number;
//   color?: string;
// }

// interface MonthlyData {
//   month: string;
//   revenue: number;
//   appointments: number;
// }

// interface DoctorPerformance {
//   name: string;
//   specialization: string;
//   appointments: number;
//   revenue: number;
// }

// interface Appointment {
//   status: string;
//   doctor?: { id: string };
//   totalAmount?: string;
//   appointmentDate: string;
// }

// interface Payment {
//   amount: string;
// }

// interface Doctor {
//   user: {
//     userId: string;
//     firstName: string;
//     lastName: string;
//   };
//   doctor: {
//     specialization: string;
//   };
// }

// interface Complaint {
//   status: string;
// }

// const AdminAnalytics = () => {
//   const [selectedPeriod, setSelectedPeriod] = useState<string>('6months');
//   const [showReportGenerator, setShowReportGenerator] = useState<boolean>(false);

//   // API hooks
//   const { data: appointmentsData } = useGetDetailedAppointmentsQuery();
//   const { data: usersData } = useGetUsersQuery();
//   const { data: doctorsData } = useGetDoctorsQuery();
//   const { data: complaintsData } = useGetComplaintsQuery();
//   const { data: prescriptionsData } = useGetPrescriptionsQuery();
//   const { data: paymentsData } = useGetAllPaymentsQuery();

//   // Process data for analytics
//   const processedData = React.useMemo(() => {
//     if (!appointmentsData?.data || !usersData || !doctorsData?.data) return null;

//     const appointments: Appointment[] = appointmentsData.data;
//     const users = usersData;
//     const doctors: Doctor[] = doctorsData.data;
//     const complaints: Complaint[] = complaintsData?.data || [];
//     const prescriptions = prescriptionsData?.data || [];
//     const payments: Payment[] = paymentsData?.data || [];

//     // Helper function to format currency
//     const formatCurrency = (value: number) => {
//       return new Intl.NumberFormat('en-KE', {
//         style: 'currency',
//         currency: 'KES'
//       }).format(value);
//     };

//     // Calculate overview metrics
//     const totalRevenue = payments.reduce((sum: number, payment: Payment) => 
//       sum + parseFloat(payment.amount), 0);
//     const totalAppointments = appointments.length;
//     const totalUsers = users.length;
//     const totalDoctors = doctors.length;

//     // Monthly data processing
//     const monthlyData = appointments.reduce((acc: MonthlyData[], apt: Appointment) => {
//       const month = new Date(apt.appointmentDate).toLocaleDateString('en-US', { month: 'short' });
//       const existing = acc.find(item => item.month === month);
      
//       if (existing) {
//         existing.revenue += parseFloat(apt.totalAmount || '0');
//         existing.appointments += 1;
//       } else {
//         acc.push({
//           month,
//           revenue: parseFloat(apt.totalAmount || '0'),
//           appointments: 1
//         });
//       }
//       return acc;
//     }, []);

//     // Appointment status distribution
//     const statusData: ChartData[] = [
//       { name: 'Confirmed', value: appointments.filter(apt => apt.status === 'Confirmed').length, color: '#10B981' },
//       { name: 'Pending', value: appointments.filter(apt => apt.status === 'Pending').length, color: '#F59E0B' },
//       { name: 'Cancelled', value: appointments.filter(apt => apt.status === 'Cancelled').length, color: '#EF4444' }
//     ];

//     // Doctor specialization distribution
//     const specializationData = doctors.reduce((acc: ChartData[], doctor: Doctor) => {
//       const spec = doctor.doctor.specialization;
//       const existing = acc.find(item => item.name === spec);
      
//       if (existing) {
//         existing.value += 1;
//       } else {
//         acc.push({
//           name: spec,
//           value: 1,
//           color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
//         });
//       }
//       return acc;
//     }, []);

//     // Top performing doctors
//     const doctorPerformance: DoctorPerformance[] = doctors.map((doctor: Doctor) => {
//       const doctorAppointments = appointments.filter(apt => apt.doctor?.id === doctor.user.userId);
//       const revenue = doctorAppointments.reduce((sum: number, apt: Appointment) => 
//         sum + parseFloat(apt.totalAmount || '0'), 0);
      
//       return {
//         name: `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`,
//         specialization: doctor.doctor.specialization,
//         appointments: doctorAppointments.length,
//         revenue
//       };
//     }).sort((a: DoctorPerformance, b: DoctorPerformance) => b.revenue - a.revenue).slice(0, 5);

//     // Complaint status distribution
//     const complaintStatusData: ChartData[] = [
//       { name: 'Open', value: complaints.filter(c => c.status === 'Open').length, color: '#EF4444' },
//       { name: 'In Progress', value: complaints.filter(c => c.status === 'In Progress').length, color: '#F59E0B' },
//       { name: 'Resolved', value: complaints.filter(c => c.status === 'Resolved').length, color: '#10B981' },
//       { name: 'Closed', value: complaints.filter(c => c.status === 'Closed').length, color: '#6B7280' }
//     ];

//     return {
//       overview: {
//         totalRevenue,
//         totalAppointments,
//         totalUsers,
//         totalDoctors,
//         totalComplaints: complaints.length,
//         totalPrescriptions: prescriptions.length,
//         averageAppointmentValue: totalRevenue / totalAppointments || 0,
//         revenueGrowth: 12.5,
//         appointmentGrowth: 8.3,
//         userGrowth: 15.7
//       },
//       monthlyData,
//       statusData,
//       specializationData,
//       doctorPerformance,
//       complaintStatusData,
//       formatCurrency
//     };
//   }, [appointmentsData, usersData, doctorsData, complaintsData, prescriptionsData, paymentsData]);

//   // StatCard component
//   const StatCard = ({ 
//     title, 
//     value, 
//     growth, 
//     icon: Icon, 
//     color = 'blue',
//     prefix = '',
//     suffix = '' 
//   }: {
//     title: string;
//     value: number | string;
//     growth?: number;
//     icon: React.ComponentType<{ size?: number }>;
//     color?: string;
//     prefix?: string;
//     suffix?: string;
//   }) => {
//     const isPositive = growth ? growth >= 0 : true;
//     const colorClasses = {
//       blue: 'bg-blue-50 text-blue-600 border-blue-200',
//       green: 'bg-green-50 text-green-600 border-green-200',
//       purple: 'bg-purple-50 text-purple-600 border-purple-200',
//       orange: 'bg-orange-50 text-orange-600 border-orange-200',
//       teal: 'bg-teal-50 text-teal-600 border-teal-200'
//     };

//     return (
//       <div className="bg-white rounded-lg shadow border border-gray-100 p-5 hover:shadow-md transition-shadow">
//         <div className="flex items-center justify-between mb-3">
//           <div className={`p-3 rounded-lg border ${colorClasses[color as keyof typeof colorClasses]}`}>
//             <Icon size={20} />
//           </div>
//           {growth !== undefined && (
//             <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
//               isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//             }`}>
//               {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
//               {Math.abs(growth)}%
//             </div>
//           )}
//         </div>
//         <div className="space-y-1">
//           <h3 className="text-sm font-medium text-gray-600">{title}</h3>
//           <p className="text-2xl font-bold text-gray-900">
//             {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
//           </p>
//         </div>
//       </div>
//     );
//   };

//   // Custom Tooltip component
//   const CustomTooltip = ({ active, payload, label }: {
//     active?: boolean;
//     payload?: any[];
//     label?: string;
//   }) => {
//     if (!active || !payload || !payload.length) return null;

//     return (
//       <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
//         <p className="font-medium text-gray-900">{label}</p>
//         {payload.map((entry: any, index: number) => (
//           <p key={index} className="text-sm" style={{ color: entry.color }}>
//             {entry.name}: {entry.name.includes('Revenue') && processedData ? 
//               processedData.formatCurrency(entry.value) : entry.value.toLocaleString()}
//           </p>
//         ))}
//       </div>
//     );
//   };

//   if (!processedData) {
//     return (
//       <div className="flex justify-center items-center min-h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 p-4">
//       {/* Header Section */}
//       <div className="bg-white rounded-lg shadow border p-6">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//               <BarChart2 size={24} className="text-teal-600" />
//               System Analytics Dashboard
//             </h1>
//             <p className="text-gray-600 mt-1">
//               Comprehensive insights into your healthcare management system
//             </p>
//           </div>
//           <div className="flex gap-2 flex-wrap">
//             {['1month', '3months', '6months', '1year'].map((period) => (
//               <button
//                 key={period}
//                 onClick={() => setSelectedPeriod(period)}
//                 className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
//                   selectedPeriod === period
//                     ? 'bg-teal-600 text-white'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 {period === '1month' ? '1M' : 
//                  period === '3months' ? '3M' : 
//                  period === '6months' ? '6M' : '1Y'}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//         {/* Revenue Trend Chart */}
//         <div className="bg-white rounded-lg shadow border p-5">
//           <div className="flex items-center gap-2 mb-4">
//             <LineChartIcon size={20} className="text-teal-600" />
//             <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
//           </div>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={processedData.monthlyData}>
//                 <defs>
//                   <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
//                     <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis dataKey="month" stroke="#6b7280" />
//                 <YAxis stroke="#6b7280" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area
//                   type="monotone"
//                   dataKey="revenue"
//                   stroke="#14B8A6"
//                   strokeWidth={2}
//                   fill="url(#revenueGradient)"
//                   name="Revenue"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Appointment Status Chart */}
//         <div className="bg-white rounded-lg shadow border p-5">
//           <div className="flex items-center gap-2 mb-4">
//             <PieChartIcon size={20} className="text-teal-600" />
//             <h3 className="text-lg font-semibold text-gray-900">Appointment Status</h3>
//           </div>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={processedData.statusData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={90}
//                   paddingAngle={2}
//                   dataKey="value"
//                   label={({ name, percent }: PieLabelRenderProps) => `${name} ${(percent * 100).toFixed(0)}%`}
//                 >
//                   {processedData.statusData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip formatter={(value: number) => [`${value} appointments`]} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* Report Generator Modal */}
//       {showReportGenerator && processedData && (
//         <AdminSystemReport 
//           isOpen={showReportGenerator}
//           onClose={() => setShowReportGenerator(false)}
//           data={processedData}
//         />
//       )}
//     </div>
//   );
// };

// export default AdminAnalytics;
// // src/pages/admin/Analytics.tsx
// import { useGetStatsQuery } from "../../features/analytics/analyticsAPI";
// import { BarChart, PieChart } from "../../components/Charts";
// import StatsCard from "../../components/StatsCard";

// export default function Analytics() {
//   const { data: stats, isLoading } = useGetStatsQuery();

//   return (
//     <div className="container mx-auto py-4">
//       <h1 className="text-2xl font-bold mb-6">System Analytics</h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//         <StatsCard 
//           title="Total Appointments" 
//           value={stats?.totalAppointments} 
//           icon={<FaCalendarAlt />}
//         />
//         <StatsCard 
//           title="Active Patients" 
//           value={stats?.activePatients} 
//           icon={<FaUserInjured />}
//         />
//         <StatsCard 
//           title="Revenue" 
//           value={`$${stats?.revenue.toLocaleString()}`} 
//           icon={<FaDollarSign />}
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h2 className="text-lg font-semibold mb-4">Appointments by Status</h2>
//           <PieChart data={stats?.appointmentsByStatus} />
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h2 className="text-lg font-semibold mb-4">Monthly Appointments</h2>
//           <BarChart data={stats?.monthlyAppointments} />
//         </div>
//       </div>
//     </div>
//   );
// }
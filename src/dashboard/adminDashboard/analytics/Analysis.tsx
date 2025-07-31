import {BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,PieChart,Pie,Cell,AreaChart,Area,CartesianGrid,LineChart,Line,Legend,} from 'recharts';
import { appointmentsAPI } from '../../../features/appointments/appointmentsAPI';
import { doctorsAPI } from '../../../features/doctor/doctorsAPI';

import { complaintsAPI } from '../../../features/complaint/complaintsAPI';
import { paymentsAPI } from '../../../features/payments/paymentAPI';
import { prescriptionsAPI } from '../../../features/prescriptions/prescriptionAPI';
import { usersAPI } from '../../../features/users/userAPI';

// Colors for Pie Chart
const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

const Analytics = () => {
  const { data: users } = usersAPI.useGetAllUsersQuery();
  const { data: appointment } = appointmentsAPI.useGetAppointmentsQuery();
  const { data: doctors } = doctorsAPI.useGetDoctorsQuery();
  const { data: payments } = paymentsAPI.useGetPaymentsQuery();
  const { data: prescriptions } = prescriptionsAPI.useGetPrescriptionsQuery();
  const { data: complaints } = complaintsAPI.useGetComplaintsQuery();

  const summaryData = [
    { label: 'Users', value: users?.length || 0 },
    { label: 'Appointments', value: appointment?.appointments.length || 0 },
    { label: 'Doctors', value: doctors?.length || 0 },
    { label: 'Payments', value: payments?.payments.length || 0 },
    { label: 'Prescriptions', value: prescriptions?.prescriptions.length || 0 },
    { label: 'Complaints', value: complaints?.complaints.length || 0 },
  ];

 
  const trendData = [
    { name: '05-01', uv: 40, pv: 24 },
    { name: '05-02', uv: 30, pv: 13 },
    { name: '05-03', uv: 20, pv: 98 },
    { name: '05-04', uv: 27, pv: 39 },
    { name: '05-05', uv: 18, pv: 48 },
    { name: '05-06', uv: 23, pv: 38 },
    { name: '05-07', uv: 34, pv: 43 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {summaryData.map((item) => (
          <div key={item.label} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">{item.label}</h2>
            <p className="text-2xl">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Overview Bar Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={summaryData}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Area Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Trends Area Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={trendData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="uv"
              stroke="#4F46E5"
              fillOpacity={1}
              fill="url(#colorUv)"
            />
            <Area
              type="monotone"
              dataKey="pv"
              stroke="#10B981"
              fillOpacity={1}
              fill="url(#colorPv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Performance Line Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={trendData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pv" stroke="#4F46E5" />
            <Line type="monotone" dataKey="uv" stroke="#10B981" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Data Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={summaryData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {summaryData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
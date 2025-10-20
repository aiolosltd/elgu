import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Registered', Active: 400, Inactive: 240 },
  { name: 'Verified', Verified: 300, Unverified: 139 },
];

const BusinessStatusChart = () => {
  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="name" tick={{ fontSize: 14, fill: '#374151' }} />
          <YAxis tick={{ fontSize: 14, fill: '#374151' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
            }}
          />
          <Legend />
          {/* Grouped bars for Registered */}
          <Bar dataKey="Active" fill="#4F46E5" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Inactive" fill="#60A5FA" radius={[6, 6, 0, 0]} />
          {/* Grouped bars for Verified */}
          <Bar dataKey="Verified" fill="#F59E0B" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Unverified" fill="#FBBF24" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BusinessStatusChart;

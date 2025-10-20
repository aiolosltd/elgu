import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

const data = [
  { name: 'Municipality A', Businesses: 420 },
  { name: 'Municipality B', Businesses: 310 },
  { name: 'Municipality C', Businesses: 250 },
  { name: 'Municipality D', Businesses: 190 },
  { name: 'Municipality E', Businesses: 150 },
];

const MunicipalityChart = () => {
  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 40, left: 100, bottom: 10 }}
          barSize={22}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
          <YAxis
            type="category"
            dataKey="name"
            axisLine={false}
            tickLine={false}
            width={120}
            tick={{ fontSize: 14, fill: '#374151' }}
          />
          <Tooltip
            cursor={{ fill: '#F3F4F6' }}
            contentStyle={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
            }}
          />
          <Bar
            dataKey="Businesses"
            fill="#60A5FA"
            radius={[0, 6, 6, 0]}
            background={{ fill: '#F3F4F6', radius: 6 }}
          >
            <LabelList dataKey="Businesses" position="insideRight" fill="#fff" fontSize={13} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MunicipalityChart;

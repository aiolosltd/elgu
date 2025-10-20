import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Active', value: 400 },
  { name: 'Inactive', value: 300 },
];

const COLORS = ['#0088FE', '#00C49F'];

const TotalBusinessChart = () => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={(props) => {
              const { name, percent } = props as unknown as { name: string; percent: number };
              // const { name, percent } = props as { name: string; percent: number };
              return `${name} ${(percent * 100).toFixed(0)}%`;
            }}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TotalBusinessChart;
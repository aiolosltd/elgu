import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', 'This Year': 4000, 'Last Year': 2400 },
  { name: 'Feb', 'This Year': 3000, 'Last Year': 1398 },
  { name: 'Mar', 'This Year': 2000, 'Last Year': 9800 },
  { name: 'Apr', 'This Year': 2780, 'Last Year': 3908 },
  { name: 'May', 'This Year': 1890, 'Last Year': 4800 },
  { name: 'Jun', 'This Year': 2390, 'Last Year': 3800 },
  { name: 'Jul', 'This Year': 3490, 'Last Year': 4300 },
];

const MonthlyBusinessComparisonChart = () => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="This Year" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="Last Year" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyBusinessComparisonChart;
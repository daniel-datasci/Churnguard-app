import { Bar } from 'react-chartjs-2';
import { useCustomers } from '../../context/CustomerContext';

export function HeatChart() {
  const { customers } = useCustomers();
  const plans = ['Basic', 'Pro', 'Enterprise'];
  const years = [2024, 2025];

  const vals = plans.map((p) =>
    years.map((y) => {
      const sub = customers.filter((r) => r.plan === p && r.year === y);
      return sub.length
        ? +((sub.reduce((s, r) => s + r.p365, 0) / sub.length) * 100).toFixed(1)
        : 0;
    })
  );

  const data = {
    labels: plans,
    datasets: years.map((y, i) => ({
      label: String(y),
      data: vals.map((row) => row[i]),
      backgroundColor: i === 0 ? 'rgba(201,168,124,0.55)' : 'rgba(194,84,61,0.55)',
      borderColor: i === 0 ? '#c9a87c' : '#c2543d',
      borderWidth: 1,
      borderRadius: 2,
    })),
  };

  return <Bar data={data} options={{ responsive: true, plugins: { legend: { position: 'top', labels: { font: { size: 10 } } } }, scales: { x: { grid: { display: false } }, y: { ticks: { callback: (v) => v + '%' }, grid: { color: 'rgba(180,160,140,0.04)' } } } }} />;
}
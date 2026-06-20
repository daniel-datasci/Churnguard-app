import { Line } from 'react-chartjs-2';
import { useCustomers } from '../../context/CustomerContext';

export function CohortSurvivalChart() {
  const { customers, survivalCurves } = useCustomers();
  const times = survivalCurves.times;

  const c2024 = customers.filter((r) => r.year === 2024);
  const c2025 = customers.filter((r) => r.year === 2025);

  const avgSurv = (cust) =>
    times.map((t) => cust.reduce((s, r) => s + Math.exp(-r.hazard * t), 0) / cust.length);

  const data = {
    labels: times,
    datasets: [
      {
        label: '2024',
        data: avgSurv(c2024),
        borderColor: '#c9a87c',
        backgroundColor: 'rgba(201,168,124,0.04)',
        fill: true,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: '2025',
        data: avgSurv(c2025),
        borderColor: '#c2543d',
        backgroundColor: 'rgba(194,84,61,0.04)',
        fill: true,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  return (
    <Line
      data={data}
      options={{
        responsive: true,
        plugins: { legend: { position: 'top', labels: { font: { size: 10 } } } },
        scales: {
          x: { grid: { color: 'rgba(180,160,140,0.04)' } },
          y: {
            min: 0.5, max: 1.02,
            ticks: { callback: (v) => (v * 100).toFixed(0) + '%' },
            grid: { color: 'rgba(180,160,140,0.04)' },
          },
        },
      }}
    />
  );
}
import { Line } from 'react-chartjs-2';
import { useCustomers } from '../../context/CustomerContext';

export function SurvivalChart() {
  const { survivalCurves } = useCustomers();
  const tiers = ['High', 'Medium', 'Low'];
  const colors = ['#c2543d', '#c9a87c', '#7a9e7e'];

  const data = {
    labels: survivalCurves.times,
    datasets: tiers.map((tier, i) => ({
      label: tier,
      data: survivalCurves[tier],
      borderColor: colors[i],
      backgroundColor: colors[i].replace(')', ',0.04)').replace('rgb', 'rgba'),
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      pointRadius: 0,
    })),
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
            min: 0.3, max: 1.02,
            ticks: { callback: (v) => (v * 100).toFixed(0) + '%' },
            grid: { color: 'rgba(180,160,140,0.04)' },
          },
        },
      }}
    />
  );
}
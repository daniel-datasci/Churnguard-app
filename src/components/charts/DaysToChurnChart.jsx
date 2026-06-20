import { Bar } from 'react-chartjs-2';
import { useCustomers } from '../../context/CustomerContext';

export function DaysToChurnChart() {
  const { customers } = useCustomers();
  const high = customers.filter((r) => r.tier === 'High');
  const bins = [0, 30, 60, 90, 120, 180, 270, 365, 730];
  const counts = Array(bins.length - 1).fill(0);

  high.forEach((r) => {
    for (let i = 0; i < bins.length - 1; i++) {
      if (r.left >= bins[i] && r.left < bins[i + 1]) { counts[i]++; break; }
    }
  });

  const labels = bins.slice(0, -1).map((v, i) => `${v}–${bins[i + 1]}d`);

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            data: counts,
            backgroundColor: 'rgba(194,84,61,0.6)',
            borderColor: '#c2543d',
            borderWidth: 1,
            borderRadius: 2,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: 'rgba(180,160,140,0.04)' } },
        },
      }}
    />
  );
}
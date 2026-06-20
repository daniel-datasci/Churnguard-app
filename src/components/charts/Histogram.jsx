import { Bar } from 'react-chartjs-2';
import { useCustomers } from '../../context/CustomerContext';

export function Histogram() {
  const { customers } = useCustomers();
  const bins = 10;
  const tierKeys = ['High', 'Medium', 'Low'];
  const colors = ['rgba(194,84,61,0.65)', 'rgba(201,168,124,0.65)', 'rgba(122,158,126,0.65)'];
  const edges = Array.from({ length: bins + 1 }, (_, i) => i / bins);

  const datasets = tierKeys.map((t, ti) => {
    const sub = customers.filter((r) => r.tier === t);
    const counts = Array(bins).fill(0);
    sub.forEach((r) => {
      const b = Math.min(Math.floor(r.p30 * bins), bins - 1);
      counts[b]++;
    });
    return { label: t, data: counts, backgroundColor: colors[ti], borderRadius: 1 };
  });

  const labels = edges.slice(0, -1).map((v, i) => `${(v * 100).toFixed(0)}–${(edges[i + 1] * 100).toFixed(0)}%`);

  return (
    <Bar
      data={{ labels, datasets }}
      options={{
        responsive: true,
        plugins: { legend: { position: 'top', labels: { font: { size: 10 } } } },
        scales: {
          x: { stacked: true, grid: { display: false } },
          y: { stacked: true, grid: { color: 'rgba(180,160,140,0.04)' } },
        },
      }}
    />
  );
}
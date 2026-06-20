import { Bar } from 'react-chartjs-2';
import { useCustomers } from '../../context/CustomerContext';
import { fmt$ } from '../../utils/format';

export function RevenueBarChart() {
  const { meta } = useCustomers();
  const data = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        label: 'ARR at Risk',
        data: [meta.arrByTier.Low, meta.arrByTier.Medium, meta.arrByTier.High],
        backgroundColor: [
          'rgba(122,158,126,0.12)',
          'rgba(201,168,124,0.12)',
          'rgba(194,84,61,0.12)',
        ],
        borderColor: ['#7a9e7e', '#c9a87c', '#c2543d'],
        borderWidth: 1.5,
      },
      {
        label: 'Expected Loss',
        data: [meta.lossByTier.Low, meta.lossByTier.Medium, meta.lossByTier.High],
        backgroundColor: [
          'rgba(122,158,126,0.6)',
          'rgba(201,168,124,0.6)',
          'rgba(194,84,61,0.6)',
        ],
        borderColor: ['#7a9e7e', '#c9a87c', '#c2543d'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { usePointStyle: true, pointStyle: 'circle', font: { size: 10 } } },
    },
    scales: {
      x: { grid: { display: false } },
      y: { ticks: { callback: (v) => fmt$(v) }, grid: { color: 'rgba(180,160,140,0.04)' } },
    },
  };

  return <Bar data={data} options={options} />;
}
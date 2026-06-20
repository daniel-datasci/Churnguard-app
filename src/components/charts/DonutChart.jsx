import { Doughnut } from 'react-chartjs-2';
import { useCustomers } from '../../context/CustomerContext';

export function DonutChart() {
  const { meta } = useCustomers();
  const data = {
    labels: ['High Risk', 'Medium Risk', 'Low Risk'],
    datasets: [
      {
        data: [meta.tiers.High, meta.tiers.Medium, meta.tiers.Low],
        backgroundColor: [
          'rgba(194,84,61,0.75)',
          'rgba(201,168,124,0.75)',
          'rgba(122,158,126,0.75)',
        ],
        borderColor: ['#c2543d', '#c9a87c', '#7a9e7e'],
        borderWidth: 1.5,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    cutout: '60%',
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 20, usePointStyle: true, pointStyle: 'circle', font: { size: 10 } },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw} (${(ctx.raw / meta.total * 100).toFixed(1)}%)`,
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}
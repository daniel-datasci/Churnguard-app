import { useCustomers } from '../context/CustomerContext';
import { useUIContext } from '../context/UIContext';
import { Modal } from './Modal';
import { Line } from 'react-chartjs-2';
import { fmtPct, probColor, tierColor } from '../utils/format';

export function CompareModal() {
  const { customers, survivalCurves } = useCustomers();
  const { compareIds, setCompareIds } = useUIContext();
  const open = compareIds.length === 2;
  const c1 = customers.find(c => c.id === compareIds[0]);
  const c2 = customers.find(c => c.id === compareIds[1]);

  if (!open || !c1 || !c2) return null;

  const makeChart = (customer) => (
    <Line
      data={{
        labels: survivalCurves.times,
        datasets: [{
          data: survivalCurves.times.map(t => Math.exp(-customer.hazard * t)),
          borderColor: tierColor(customer.tier),
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
        }],
      }}
      options={{ responsive: true, plugins: { legend: { display: false } } }}
    />
  );

  return (
    <Modal isOpen={open} onClose={() => setCompareIds([])}>
      <div className="modal-header">
        <h3 style={{ fontFamily: 'var(--display)', color: 'var(--cream)' }}>Compare Customers</h3>
        <button className="modal-close" onClick={() => setCompareIds([])}>✕</button>
      </div>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {[c1, c2].map((c, idx) => (
          <div key={idx} style={{ flex: 1, minWidth: 280 }}>
            <h4 style={{ fontFamily: 'var(--display)' }}>Customer #{c.id}</h4>
            <p>{c.plan} · {c.year} · {c.tier}</p>
            <div className="gauge-row">
              <div className="gauge"><div className="gauge-val" style={{ color: probColor(c.p30) }}>{fmtPct(c.p30)}</div><div className="gauge-label">30d</div></div>
              <div className="gauge"><div className="gauge-val" style={{ color: probColor(c.p90) }}>{fmtPct(c.p90)}</div><div className="gauge-label">90d</div></div>
              <div className="gauge"><div className="gauge-val" style={{ color: probColor(c.p365) }}>{fmtPct(c.p365)}</div><div className="gauge-label">1yr</div></div>
            </div>
            <div style={{ height: 120 }}>{makeChart(c)}</div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
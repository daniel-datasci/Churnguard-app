import { useCustomers } from '../context/CustomerContext';
import { useUIContext } from '../context/UIContext';
import { Modal } from './Modal';
import { fmt$, fmtPct } from '../utils/format';

export function WeeklySummaryModal() {
  const { meta, customers } = useCustomers();
  const { summaryOpen, setSummaryOpen } = useUIContext();
  const hc = meta.tiers.High;
  const hp = ((hc / meta.total) * 100).toFixed(1);
  const hs = Math.round(100 - (meta.expectedLoss / meta.arr) * 100);
  const top3 = customers.filter(r => r.tier === 'High').sort((a, b) => b.p90 - a.p90).slice(0, 3);

  return (
    <Modal isOpen={summaryOpen} onClose={() => setSummaryOpen(false)}>
      <div className="modal-header">
        <h3 style={{ fontFamily: 'var(--display)', color: 'var(--cream)' }}>Weekly Executive Summary</h3>
        <button className="modal-close" onClick={() => setSummaryOpen(false)}>✕</button>
      </div>
      <div className="modal-body">
        <div className="summary-report">
          <h2>Weekly Executive Summary</h2>
          <div className="section">
            <h3 style={{ fontFamily: 'var(--display)', color: 'var(--cream)', marginBottom: 14 }}>Key Metrics</h3>
            <div className="metric"><span>Health Score</span><strong>{hs}/100</strong></div>
            <div className="metric"><span>Active Customers</span><strong>{meta.total}</strong></div>
            <div className="metric"><span>High‑Risk</span><strong>{hc} ({hp}%)</strong></div>
            <div className="metric"><span>Total ARR</span><strong>{fmt$(meta.arr)}</strong></div>
            <div className="metric"><span>Expected Loss</span><strong style={{ color: 'var(--high)' }}>{fmt$(meta.expectedLoss)}</strong></div>
          </div>
          <div className="section">
            <h3 style={{ fontFamily: 'var(--display)', color: 'var(--cream)', marginBottom: 14 }}>Top 3 At‑Risk</h3>
            <ul>
              {top3.map(r => <li key={r.id}>#{r.id} ({r.plan}, 90d: {fmtPct(r.p90)})</li>)}
            </ul>
          </div>
          <div className="summary-actions">
            <button className="btn btn-primary" onClick={() => {
              navigator.clipboard.writeText(document.querySelector('.summary-report').innerText);
              alert('Copied!');
            }}>Copy</button>
            <button className="btn btn-ghost" onClick={() => window.print()}>Print</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
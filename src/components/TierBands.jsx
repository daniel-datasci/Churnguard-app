import { useCustomers } from '../context/CustomerContext';
import { fmt$, tierColor } from '../utils/format';

export function TierBands({ onFilter }) {
  const { meta, customers } = useCustomers();
  const defs = [
    { key: 'High', cls: 'high' },
    { key: 'Medium', cls: 'med' },
    { key: 'Low', cls: 'low' },
  ];

  return (
    <div className="tier-bands">
      {defs.map((t) => {
        const n = meta.tiers[t.key];
        const arr = meta.arrByTier[t.key];
        const loss = meta.lossByTier[t.key];
        const avgP365 = (customers
          .filter((r) => r.tier === t.key)
          .reduce((s, r) => s + r.p365, 0) / n * 100).toFixed(1);
        return (
          <div
            key={t.key}
            className={`tier-band ${t.cls}`}
            onClick={() => onFilter?.(t.key)}
          >
            <div className="tb-head">
              <span className="tb-label">{t.key} Risk</span>
            </div>
            <div className="tb-count">{n}</div>
            <div className="tb-rows" style={{ marginTop: '18px' }}>
              <div className="tb-row">
                <span className="tb-key">ARR at risk</span>
                <span className="tb-v">{fmt$(arr)}/yr</span>
              </div>
              <div className="tb-row">
                <span className="tb-key">Expected loss</span>
                <span className="tb-v" style={{ color: tierColor(t.key) }}>
                  {fmt$(loss)}/yr
                </span>
              </div>
              <div className="tb-row">
                <span className="tb-key">Avg 1-yr churn</span>
                <span className="tb-v">{avgP365}%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
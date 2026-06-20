import { useCustomers } from '../context/CustomerContext';
import { tierColor } from '../utils/format';

export function MilestoneTable() {
  const { customers } = useCustomers();
  const tiers = ['High', 'Medium', 'Low'];
  const days = [30, 90, 180, 365];

  const rows = tiers.map((t) => {
    const sub = customers.filter((r) => r.tier === t);
    const n = sub.length;
    const vals = days.map((d) =>
      ((sub.reduce((s, r) => s + r[`p${d}`], 0) / n) * 100).toFixed(1) + '%'
    );
    return { t, vals };
  });

  return (
    <table style={{ width: '100%', fontSize: '0.72rem', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ padding: '8px', textAlign: 'left', color: 'var(--muted)' }}>Tier</th>
          {days.map((d) => (
            <th key={d} style={{ padding: '8px', textAlign: 'center', color: 'var(--muted)' }}>Day {d}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.t}>
            <td style={{ padding: '8px', fontWeight: 600, color: tierColor(r.t) }}>{r.t}</td>
            {r.vals.map((v, i) => (
              <td key={i} style={{ padding: '8px', textAlign: 'center', fontFamily: 'var(--mono)' }}>{v}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
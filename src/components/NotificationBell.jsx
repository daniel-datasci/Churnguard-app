import { useState } from 'react';
import { useCustomers } from '../context/CustomerContext';
import { fmt$ } from '../utils/format';

export function NotificationBell() {
  const { meta } = useCustomers();
  const [open, setOpen] = useState(false);

  const alerts = [
    'Customer #447 – risk jumped to 68%',
    `Enterprise ARR at risk: ${fmt$(meta.arrByTier.Enterprise || 0)}`,
    '2025 cohort flagged',
  ];

  return (
    <div className="notif-bell" onClick={() => setOpen(!open)}>
      🔔
      <span className="badge">{meta.tiers.High}</span>
      {open && (
        <div className="notif-dropdown">
          {alerts.map((a, i) => (
            <div key={i} className="notif-item">{a}</div>
          ))}
        </div>
      )}
    </div>
  );
}
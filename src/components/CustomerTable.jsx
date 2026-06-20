import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomers } from '../context/CustomerContext';
import { useUIContext } from '../context/UIContext';
import { fmtPct, probColor } from '../utils/format';

export function CustomerTable({ filtered, onSelectCustomer }) {
  const { selectedCustomers, setSelectedCustomers } = useUIContext();
  const { customers } = useCustomers();

  const [page, setPage] = useState(0);
  const pageSize = 20;

  const totalPages = Math.ceil(filtered.length / pageSize);
  const start = page * pageSize;
  const rows = filtered.slice(start, start + pageSize);

  const toggleSelect = (id) => {
    const newSet = new Set(selectedCustomers);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedCustomers(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedCustomers.size === rows.length) {
      // deselect all visible rows
      const newSet = new Set(selectedCustomers);
      rows.forEach(r => newSet.delete(r.id));
      setSelectedCustomers(newSet);
    } else {
      // select all visible rows
      const newSet = new Set(selectedCustomers);
      rows.forEach(r => newSet.add(r.id));
      setSelectedCustomers(newSet);
    }
  };

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={rows.length > 0 && rows.every(r => selectedCustomers.has(r.id))}
                onChange={toggleSelectAll}
              />
            </th>
            <th>Customer</th>
            <th>Plan</th>
            <th>Cohort</th>
            <th>Tier</th>
            <th>90‑Day</th>
            <th>1‑Year</th>
            <th>Days Left</th>
            <th>MRR</th>
            <th></th>
          </tr>
        </thead>
        <AnimatePresence mode="wait">
          <tbody key={page}>
            {rows.map((r) => (
              <motion.tr
                key={r.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={selectedCustomers.has(r.id) ? 'flagged' : ''}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCustomers.has(r.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSelect(r.id);
                    }}
                  />
                  {selectedCustomers.has(r.id) && <span className="flag-badge">FLAGGED</span>}
                </td>
                <td
                  style={{ fontFamily: 'var(--mono)', cursor: 'pointer' }}
                  onClick={() => onSelectCustomer?.(r.id)}
                >
                  #{r.id}
                </td>
                <td>{r.plan}</td>
                <td>{r.year}</td>
                <td>
                  <span className={`tier-pill ${r.tier}`}>{r.tier}</span>
                </td>
                <td>
                  <div className="prob-bar">
                    <div className="pb-track">
                      <div
                        className="pb-fill"
                        style={{ width: `${r.p90 * 100}%`, background: probColor(r.p90) }}
                      />
                    </div>
                    <span className="pb-val">{fmtPct(r.p90)}</span>
                  </div>
                </td>
                <td>
                  <div className="prob-bar">
                    <div className="pb-track">
                      <div
                        className="pb-fill"
                        style={{ width: `${r.p365 * 100}%`, background: probColor(r.p365) }}
                      />
                    </div>
                    <span className="pb-val">{fmtPct(r.p365)}</span>
                  </div>
                </td>
                <td style={{ fontFamily: 'var(--mono)' }}>{r.left}d</td>
                <td style={{ fontFamily: 'var(--mono)' }}>${r.fee}</td>
                <td style={{ color: 'var(--gold)', fontSize: '0.75rem' }}>→</td>
              </motion.tr>
            ))}
          </tbody>
        </AnimatePresence>
      </table>

      {/* Pagination */}
      <div className="table-footer">
        <span>
          Showing {start + 1}–{Math.min(start + pageSize, filtered.length)} of {filtered.length}
        </span>
        <div className="pag">
          <button
            className="pag-btn"
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`pag-btn ${i === page ? 'active' : ''}`}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="pag-btn"
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
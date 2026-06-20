export function fmt$(n) {
  return n >= 1e6 ? `$${(n / 1e6).toFixed(2)}M` : `$${n.toLocaleString()}`;
}

export function fmtPct(v) {
  return `${(v * 100).toFixed(1)}%`;
}

export function tierColor(t) {
  return t === 'High' ? '#c2543d' : t === 'Medium' ? '#c9a87c' : '#7a9e7e';
}

export function probColor(v) {
  return v < 0.15 ? '#7a9e7e' : v < 0.4 ? '#c9a87c' : '#c2543d';
}
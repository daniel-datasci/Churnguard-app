// deterministic 832 customers – identical to the original
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = seed + 0x6d2b79f5 | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20240315);

function gauss(mean, sd) {
  let u1 = rand(),
    u2 = rand();
  while (u1 === 0) u1 = rand();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * sd;
}

const SC_TIMES = [
  0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 210, 240, 270, 300,
  330, 365, 400, 450, 500, 550, 600, 650, 700, 730,
];

const PLAN_DEFS = [
  { name: 'Basic', weight: 0.5, fees: [29, 39, 49] },
  { name: 'Pro', weight: 0.35, fees: [79, 99, 129, 149] },
  { name: 'Enterprise', weight: 0.15, fees: [199, 299, 399, 499] },
];

const COHORT_YEARS = [2024, 2025];
const COHORT_WEIGHTS = [0.6, 0.4];
const TENURE_RANGE = { 2024: [180, 700], 2025: [25, 380] };
const BASE_HAZARD = { 2024: 0.00035, 2025: 0.00061 };

export function generateCustomers() {
  const customers = [];

  for (let i = 1; i <= 832; i++) {
    const planRoll = rand();
    let planIdx = 0,
      cum = 0;
    for (let p = 0; p < PLAN_DEFS.length; p++) {
      cum += PLAN_DEFS[p].weight;
      if (planRoll <= cum) { planIdx = p; break; }
    }
    const plan = PLAN_DEFS[planIdx];

    const cohortRoll = rand();
    let cohortIdx = 0;
    cum = 0;
    for (let c = 0; c < COHORT_YEARS.length; c++) {
      cum += COHORT_WEIGHTS[c];
      if (cohortRoll <= cum) { cohortIdx = c; break; }
    }
    const year = COHORT_YEARS[cohortIdx];

    const [tMin, tMax] = TENURE_RANGE[year];
    const days = Math.round(tMin + rand() * (tMax - tMin));

    const baseH = BASE_HAZARD[year];
    let hazard = Math.exp(Math.log(baseH) + gauss(0, 0.45));
    hazard = Math.max(0.00004, Math.min(0.006, hazard));

    const p30 = 1 - Math.exp(-hazard * 30);
    const p90 = 1 - Math.exp(-hazard * 90);
    const p180 = 1 - Math.exp(-hazard * 180);
    const p365 = 1 - Math.exp(-hazard * 365);
    const left = Math.round(Math.log(2) / hazard);
    const leftClamped = Math.max(7, Math.min(730, left));
    const fee = plan.fees[Math.floor(rand() * plan.fees.length)];

    customers.push({
      id: i,
      plan: plan.name,
      year,
      days,
      hazard,
      p30,
      p90,
      p180,
      p365,
      left: leftClamped,
      fee,
      tier: '',
      pct: 0,
    });
  }

  // sort by p365 ascending to assign tiers
  customers.sort((a, b) => a.p365 - b.p365);
  const n = customers.length;
  for (let i = 0; i < n; i++) {
    const r = customers[i];
    if (r.p365 < 0.15) r.tier = 'Low';
    else if (r.p365 < 0.35) r.tier = 'Medium';
    else r.tier = 'High';
    r.pct = Math.round((i / (n - 1)) * 100);
  }
  customers.sort((a, b) => a.id - b.id);

  const tierCounts = { High: 0, Medium: 0, Low: 0 };
  const tierARR = { High: 0, Medium: 0, Low: 0 };
  const tierLoss = { High: 0, Medium: 0, Low: 0 };
  let totalARR = 0, totalLoss = 0;
  for (const r of customers) {
    const arr = r.fee * 12;
    const loss = arr * r.p365;
    tierCounts[r.tier]++;
    tierARR[r.tier] += arr;
    tierLoss[r.tier] += loss;
    totalARR += arr;
    totalLoss += loss;
  }

  function avgSurvival(tier, times) {
    const subset = customers.filter((r) => r.tier === tier);
    if (subset.length === 0) return times.map(() => 0);
    return times.map((t) => {
      let sum = 0;
      for (const r of subset) sum += Math.exp(-r.hazard * t);
      return sum / subset.length;
    });
  }

  const survivalCurves = {
    times: SC_TIMES,
    High: avgSurvival('High', SC_TIMES),
    Medium: avgSurvival('Medium', SC_TIMES),
    Low: avgSurvival('Low', SC_TIMES),
  };

  return {
    meta: {
      total: n,
      arr: totalARR,
      expectedLoss: totalLoss,
      tiers: tierCounts,
      arrByTier: tierARR,
      lossByTier: tierLoss,
    },
    customers,
    survivalCurves,
  };
}
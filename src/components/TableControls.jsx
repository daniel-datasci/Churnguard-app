import { useUIContext } from '../context/UIContext';

export function TableControls({ onFilterTier, onFilterPlan, onExportCSV, onShareView, onCompare, onFlag, showCompare, showFlag }) {
  const { tierFilter, setTierFilter, planFilter, setPlanFilter, searchQuery, setSearchQuery } = useUIContext();

  const handleTierChange = (tier) => {
    setTierFilter(tier);
    onFilterTier?.(tier);
  };

  const handlePlanChange = (plan) => {
    setPlanFilter(plan);
    onFilterPlan?.(plan);
  };

  return (
    <div className="explorer-controls">
      <div className="search-wrap">
        <svg width="16" height="16" viewBox="0 0 16 16">
          <circle cx="7" cy="7" r="5" stroke="#6b6058" strokeWidth="1.5" fill="none" />
          <path d="M11 11l3 3" stroke="#6b6058" strokeWidth="1.5" />
        </svg>
        <input
          type="text"
          placeholder="Search by customer ID, plan…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <button className={`filter-btn ${tierFilter === 'All' ? 'active' : ''}`} onClick={() => handleTierChange('All')}>All Tiers</button>
      <button className={`filter-btn high ${tierFilter === 'High' ? 'active' : ''}`} onClick={() => handleTierChange('High')}>High</button>
      <button className={`filter-btn med ${tierFilter === 'Medium' ? 'active' : ''}`} onClick={() => handleTierChange('Medium')}>Medium</button>
      <button className={`filter-btn low ${tierFilter === 'Low' ? 'active' : ''}`} onClick={() => handleTierChange('Low')}>Low</button>
      <button className={`filter-btn ${planFilter === 'All' ? 'active' : ''}`} onClick={() => handlePlanChange('All')}>All Plans</button>
      <button className={`filter-btn ${planFilter === 'Basic' ? 'active' : ''}`} onClick={() => handlePlanChange('Basic')}>Basic</button>
      <button className={`filter-btn ${planFilter === 'Pro' ? 'active' : ''}`} onClick={() => handlePlanChange('Pro')}>Pro</button>
      <button className={`filter-btn ${planFilter === 'Enterprise' ? 'active' : ''}`} onClick={() => handlePlanChange('Enterprise')}>Enterprise</button>
      <button className="filter-btn" onClick={onExportCSV}>Export CSV</button>
      <button className="filter-btn" onClick={onShareView}>Share View</button>
      {showCompare && <button className="filter-btn" onClick={onCompare}>Compare</button>}
      {showFlag && <button className="filter-btn" onClick={onFlag}>Flag</button>}
    </div>
  );
}
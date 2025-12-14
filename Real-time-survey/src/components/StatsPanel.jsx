const statusColors = {
  Safe: '#22c55e',
  Moderate: '#eab308',
  Polluted: '#ef4444',
}

function Stat({ label, value, unit }) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {value}
        {unit && <span className="stat-unit"> {unit}</span>}
      </div>
    </div>
  )
}

export default function StatsPanel({ bodies, selected, onSelect, current, status }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <select value={selected} onChange={(e) => onSelect?.(e.target.value)}>
          {bodies.map((wb) => (
            <option key={wb.id} value={wb.id}>{wb.name}</option>
          ))}
        </select>
        <span className="status-chip" style={{ background: statusColors[status] }}>{status}</span>
      </div>
      <div className="stats">
        <Stat label="pH" value={current.pH.toFixed(2)} />
        <Stat label="Turbidity" value={current.turbidity.toFixed(1)} unit="NTU" />
        <Stat label="Water Level" value={current.level.toFixed(2)} unit="m" />
      </div>
    </div>
  )
}

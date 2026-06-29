import { riskLabel } from '../utils/heatColor';
import './PriorityTable.css';

export default function PriorityTable({ zones, selectedZoneId, onSelectZone }) {
  if (!zones || zones.length === 0) {
    return (
      <div className="glass-panel priority-panel">
        <div className="panel-header"><div className="panel-icon-dot" /><h2>Priority Zones</h2></div>
        <p className="panel-empty">No zone data.</p>
      </div>
    );
  }

  const sorted = [...zones].sort((a, b) => b.priority_score - a.priority_score);

  return (
    <div className="glass-panel priority-panel">
      <div className="panel-header"><div className="panel-icon-dot" /><h2>Priority Zones</h2></div>
      <div className="priority-body">
        <table className="priority-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Zone</th>
              <th>Temp</th>
              <th>Risk</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((z, idx) => {
              const risk = riskLabel(z.heat_risk_index);
              return (
                <tr
                  key={z.zone_id}
                  className={`priority-row ${z.zone_id === selectedZoneId ? 'selected' : ''}`}
                  onClick={() => onSelectZone && onSelectZone(z.zone_id)}
                >
                  <td className="zone-rank">{idx + 1}</td>
                  <td className="zone-name-cell">{z.zone_name}</td>
                  <td className="temp-cell">{z.lst_celsius.toFixed(1)}°</td>
                  <td>
                    <span className={`risk-pill risk-${risk.toLowerCase()}`}>{risk}</span>
                  </td>
                  <td className="score-cell">{z.priority_score.toFixed(0)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

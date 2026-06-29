import { riskLabel } from '../utils/heatColor';
import './InsightsPanel.css';

const DRIVERS = [
  { key:'ndbi',   label:'🏢 Built-up Density',  color:'#ff4400', flip:false },
  { key:'ndvi',   label:'🌿 Vegetation Loss',    color:'#00ff88', flip:true  },
  { key:'albedo', label:'☀️ Low Albedo',          color:'#ffaa00', flip:true  },
];

export default function InsightsPanel({ zone, modelMeta }) {
  if (!zone) return (
    <div className="glass-panel insights-panel">
      <div className="panel-header"><div className="panel-icon-dot"/><h2>AI Insights</h2></div>
      <p className="panel-empty">Select a zone to see heat driver analysis.</p>
    </div>
  );

  const risk = riskLabel(zone.heat_risk_index);
  const riskCls = risk==='Critical'?'is-critical': risk==='High'?'is-high':'';

  return (
    <div className="glass-panel insights-panel">
      <div className="panel-header"><div className="panel-icon-dot"/><h2>AI Insights — {zone.zone_name}</h2></div>
      <div className="insights-body">
        <div className="kpi-trio">
          <div className={`kpi-mini ${riskCls}`}>
            <div className="kpi-mini-icon">🌡</div>
            <div className="kpi-mini-val">{zone.lst_celsius.toFixed(1)}°</div>
            <div className="kpi-mini-label">LST</div>
          </div>
          <div className={`kpi-mini ${riskCls}`}>
            <div className="kpi-mini-icon">⚠️</div>
            <div className="kpi-mini-val">{risk}</div>
            <div className="kpi-mini-label">Risk</div>
          </div>
          <div className="kpi-mini">
            <div className="kpi-mini-icon">📊</div>
            <div className="kpi-mini-val">{zone.priority_score.toFixed(0)}</div>
            <div className="kpi-mini-label">Priority</div>
          </div>
        </div>

        <p className="insight-quote">{zone.driver_insight}</p>

        <div className="drivers-title">Heat Drivers</div>
        {DRIVERS.map(d => {
          const raw = zone[d.key]??0;
          const pct = d.flip ? Math.max(0,Math.min(100,(1-raw)*100)) : Math.max(0,Math.min(100,raw*100));
          return (
            <div key={d.key} className="driver-row">
              <div className="driver-top">
                <span className="driver-label">{d.label}</span>
                <span className="driver-pct">{raw.toFixed(2)}</span>
              </div>
              <div className="driver-track">
                <div className="driver-fill" style={{width:`${pct}%`,background:d.color,boxShadow:`0 0 6px ${d.color}60`}}/>
              </div>
            </div>
          );
        })}

        <div className="raw-grid">
          <div className="raw-cell"><div className="raw-val">{zone.ndvi.toFixed(2)}</div><div className="raw-lbl">NDVI</div></div>
          <div className="raw-cell"><div className="raw-val">{zone.ndbi.toFixed(2)}</div><div className="raw-lbl">NDBI</div></div>
          <div className="raw-cell"><div className="raw-val">{zone.albedo.toFixed(2)}</div><div className="raw-lbl">Albedo</div></div>
        </div>

        {modelMeta && (
          <div className="model-footer">
            <span>Linear Regression · {modelMeta.zone_count} zones</span>
            <span>R² <span className="model-r2">{modelMeta.r_squared}</span></span>
          </div>
        )}
      </div>
    </div>
  );
}

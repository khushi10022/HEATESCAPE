import { useCityData } from '../context/CityDataContext';
import CoolingChart from '../components/CoolingChart';
import PriorityTable from '../components/PriorityTable';
import './Analysis.css';

export default function Analysis() {
  const { modelMeta, selectedZone, cooling, zones, selectedZoneId, selectZone } = useCityData();
  return (
    <div className="analysis-page">
      <div className="glass-panel model-panel">
        <div className="panel-header"><div className="panel-icon-dot"/><h2>Regression Model</h2></div>
        {modelMeta ? (
          <div className="model-body">
            <p className="model-desc">{modelMeta.model_description}</p>
            <div className="coef-grid">
              <CoefCard label="R² Fit Quality" value={modelMeta.r_squared} hl />
              <CoefCard label="NDVI Coefficient" value={modelMeta.coefficients.ndvi} />
              <CoefCard label="NDBI Coefficient" value={modelMeta.coefficients.ndbi} />
              <CoefCard label="Albedo Coefficient" value={modelMeta.coefficients.albedo} />
              <CoefCard label="Intercept" value={modelMeta.coefficients.intercept} />
              <CoefCard label="Zones in Model" value={modelMeta.zone_count} />
            </div>
            <p className="model-note">Fitted independently for {modelMeta.city} — heat drivers vary by region.</p>
          </div>
        ) : <p className="panel-empty">Loading…</p>}
      </div>
      <CoolingChart zone={selectedZone} cooling={cooling} />
      <PriorityTable zones={zones} selectedZoneId={selectedZoneId} onSelectZone={selectZone} />
    </div>
  );
}
function CoefCard({ label, value, hl }) {
  return (
    <div className={`coef-card ${hl?'coef-card-hl':''}`}>
      <span className="coef-val">{value}</span>
      <span className="coef-lbl">{label}</span>
    </div>
  );
}

import { useCityData } from '../context/CityDataContext';
import HeatMap from '../components/HeatMap';
import InsightsPanel from '../components/InsightsPanel';
import CoolingChart from '../components/CoolingChart';
import PriorityTable from '../components/PriorityTable';
import { riskLabel } from '../utils/heatColor';
import './Overview.css';

function KpiCard({ icon, value, unit, label, chip, chipType, cardType }) {
  return (
    <div className={`kpi-card ${cardType}`}>
      <div className="kpi-row-inner">
        <div className="kpi-ico">{icon}</div>
        <div className="kpi-data">
          <div className="kpi-num">{value}<span className="kpi-unit">{unit}</span></div>
          <div className="kpi-name">{label}</div>
          {chip && <div className={`kpi-chip ${chipType}`}>{chip}</div>}
        </div>
      </div>
    </div>
  );
}

export default function Overview() {
  const { zones, selectedZone, selectedZoneId, selectZone, selectedCity, modelMeta, cooling, loading } = useCityData();

  if (loading && zones.length === 0) {
    return <div className="overview-loading"><div className="loader-ring" /><span>Loading city data…</span></div>;
  }

  const avgTemp = zones.length ? (zones.reduce((s,z) => s+z.lst_celsius, 0)/zones.length).toFixed(1) : '—';
  const avgNdvi = zones.length ? (zones.reduce((s,z) => s+z.ndvi, 0)/zones.length*100).toFixed(0) : '—';
  const avgBuilt = zones.length ? (zones.reduce((s,z) => s+Math.max(0,z.ndbi), 0)/zones.length*100).toFixed(0) : '—';
  const critical = zones.filter(z => riskLabel(z.heat_risk_index) === 'Critical').length;
  const topCool = cooling[0];
  const reco = selectedZone && topCool ? topCool : null;

  return (
    <div className="overview-page">
      <div className="kpi-bar">
        <KpiCard icon="🌡" value={avgTemp} unit="°C" label="Avg Surface Temp" chip="▲ Urban Heat" chipType="danger" cardType="fire" />
        <KpiCard icon="🌿" value={avgNdvi} unit="%" label="Vegetation (NDVI)" chip="Low Coverage" chipType="safe" cardType="green" />
        <KpiCard icon="🏢" value={avgBuilt} unit="%" label="Built-up (NDBI)" chip="High Density" chipType="warn" cardType="blue" />
        <KpiCard icon="⚠️" value={critical} unit="" label="Critical Zones" chip="Needs Action" chipType="danger" cardType="amber" />
      </div>

      <div className="overview-main">
        <div className="map-panel">
          <HeatMap zones={zones} selectedZoneId={selectedZoneId} onSelectZone={selectZone}
            center={selectedCity?[selectedCity.center_lat,selectedCity.center_lon]:null}
            zoom={selectedCity?.zoom||11} />
        </div>
        <div className="right-col">
          <div style={{flexShrink:0, minHeight:280}}>
            <InsightsPanel zone={selectedZone} modelMeta={modelMeta} />
          </div>
          <div style={{flex:1,minHeight:0}}>
            <PriorityTable zones={zones} selectedZoneId={selectedZoneId} onSelectZone={selectZone} />
          </div>
        </div>
      </div>

      <div className="overview-bottom">
        {reco ? (
          <div className="ai-reco-banner">
            <div className="ai-reco-icon">🤖</div>
            <div className="ai-reco-body">
              <div className="ai-reco-eyebrow">🔥 AI Recommendation — {selectedZone?.zone_name}</div>
              <div className="ai-reco-title">{reco.material_name}</div>
              <div className="ai-reco-sub">Highest cooling impact for current zone conditions</div>
            </div>
            <div className="ai-reco-stats">
              <div className="ai-reco-stat">
                <div className="ai-reco-val">{reco.predicted_cooling_c}°C</div>
                <div className="ai-reco-key">Cooling</div>
              </div>
              <div className="ai-reco-stat">
                <div className="ai-reco-val">{modelMeta?.r_squared??'—'}</div>
                <div className="ai-reco-key">R² Score</div>
              </div>
            </div>
          </div>
        ) : <div style={{background:'var(--bg-raised)',borderRadius:'var(--r-lg)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-muted)',fontSize:13}}>Select a zone for AI recommendation</div>}
        <div style={{minHeight:0}}>
          <CoolingChart zone={selectedZone} cooling={cooling} />
        </div>
      </div>
    </div>
  );
}

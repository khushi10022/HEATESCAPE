import { useCityData } from '../context/CityDataContext';
import HeatMap from '../components/HeatMap';
import { riskLabel } from '../utils/heatColor';
import './HeatMaps.css';

export default function HeatMaps() {
  const { zones, selectedZone, selectedZoneId, selectZone, selectedCity } = useCityData();
  return (
    <div className="heatmaps-page">
      <div className="heatmaps-map">
        <HeatMap zones={zones} selectedZoneId={selectedZoneId} onSelectZone={selectZone}
          center={selectedCity?[selectedCity.center_lat,selectedCity.center_lon]:null} zoom={selectedCity?.zoom||11}/>
      </div>
      <div className="heatmaps-detail">
        <div className="glass-panel">
          <div className="panel-header"><div className="panel-icon-dot"/><h2>Zone Detail</h2></div>
          {selectedZone ? (
            <div className="zone-detail-body">
              <div className="zone-detail-name">{selectedZone.zone_name}</div>
              <div className="zone-detail-grid">
                {[['Surface Temp',`${selectedZone.lst_celsius.toFixed(1)}°C`],['Heat Risk',riskLabel(selectedZone.heat_risk_index)],
                  ['NDVI',selectedZone.ndvi.toFixed(2)],['NDBI',selectedZone.ndbi.toFixed(2)],
                  ['Albedo',selectedZone.albedo.toFixed(2)],['Priority',selectedZone.priority_score.toFixed(1)]
                ].map(([l,v])=>(
                  <div key={l} className="detail-stat">
                    <span className="detail-stat-value">{v}</span>
                    <span className="detail-stat-label">{l}</span>
                  </div>
                ))}
              </div>
              <div className="zone-coords">📍 {selectedZone.lat.toFixed(4)}, {selectedZone.lon.toFixed(4)} · {selectedZone.area_sqkm} km²</div>
            </div>
          ) : <p className="panel-empty">Click a zone on the map.</p>}
        </div>
        <div className="glass-panel" style={{flex:1}}>
          <div className="panel-header"><div className="panel-icon-dot"/><h2>All Zones ({zones.length})</h2></div>
          <div className="zone-list-body">
            {zones.map(z=>(
              <button key={z.zone_id} className={`zone-list-btn ${z.zone_id===selectedZoneId?'active':''}`} onClick={()=>selectZone(z.zone_id)}>
                <span>{z.zone_name}</span><span className="zone-list-temp">{z.lst_celsius.toFixed(1)}°C</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

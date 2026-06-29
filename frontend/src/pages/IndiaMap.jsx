import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { useCityData } from '../context/CityDataContext';
import { heatColor } from '../utils/heatColor';
import 'leaflet/dist/leaflet.css';
import './IndiaMap.css';

export default function IndiaMap() {
  const { cities, selectCity, selectedCityId } = useCityData();
  const navigate = useNavigate();
  const handlePick = (id) => { selectCity(id); navigate('/overview'); };

  return (
    <div className="india-page">
      <div className="india-map-wrap">
        <MapContainer center={[22.5,80]} zoom={5} className="india-leaflet" scrollWheelZoom>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO'/>
          {cities.map(c=>(
            <CircleMarker key={c.city_id} center={[c.center_lat,c.center_lon]}
              radius={13+(c.critical_zone_count||0)*1.5}
              pathOptions={{fillColor:heatColor(c.avg_lst_celsius),fillOpacity:0.88,
                color:c.city_id===selectedCityId?'#ffaa00':'rgba(255,255,255,0.25)',
                weight:c.city_id===selectedCityId?3:1}}
              eventHandlers={{click:()=>handlePick(c.city_id)}}>
              <Tooltip direction="top" offset={[0,-10]}>
                <strong>{c.city_name}</strong>, {c.state}<br/>Avg {c.avg_lst_celsius}°C · {c.zone_count} zones
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      <div className="india-sidebar">
        <div className="india-hero">
          <h2>INDIA HEAT MAP</h2>
          <p>Six cities monitored by AI/ML for urban heat island intensity. Click any city to explore its full dashboard.</p>
        </div>
        <div className="city-cards">
          {cities.map(c=>(
            <button key={c.city_id} className={`city-card ${c.city_id===selectedCityId?'active':''}`} onClick={()=>handlePick(c.city_id)}>
              <div className="city-card-top"><span className="city-name">{c.city_name}</span><span className="city-state">{c.state}</span></div>
              <div className="city-stats">
                {[['Avg Temp',`${c.avg_lst_celsius}°C`],['Peak',`${c.max_lst_celsius}°C`],['Zones',c.zone_count],['Critical',c.critical_zone_count]]
                  .map(([k,v])=><div key={k}><span className="city-stat-val">{v}</span><span className="city-stat-key">{k}</span></div>)}
              </div>
              <div className="city-footer">
                <span className="city-top-zone">🔥 {c.top_priority_zone}</span>
                <span className="city-r2">R² {c.model_r_squared}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useCityData } from '../context/CityDataContext';
import './TopBar.css';

export default function TopBar() {
  const { cities, selectedCity, selectedCityId, selectCity, zones, modelMeta } = useCityData();
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-title">Urban Heat Island Monitor & Mitigation</div>
        <div className="topbar-subtitle">
          AI/ML Platform · {selectedCity ? `${selectedCity.city_name}, ${selectedCity.state}` : 'Select a city'}
        </div>
      </div>
      <div className="topbar-right">
        <CitySwitcher cities={cities} value={selectedCityId} onChange={selectCity} />
        <div className="status-chip"><span className="status-value">{zones.length||'—'}</span><span className="status-label">Zones</span></div>
        <div className="status-chip"><span className="status-value">{modelMeta ? modelMeta.r_squared : '—'}</span><span className="status-label">R²</span></div>
        <div className="live-indicator"><span className="live-dot" /><span className="live-text">LIVE</span></div>
      </div>
    </header>
  );
}
function CitySwitcher({ cities, value, onChange }) {
  if (!cities?.length) return null;
  return (
    <select className="city-switcher" value={value||''} onChange={e => onChange(e.target.value)}>
      {cities.map(c => <option key={c.city_id} value={c.city_id}>{c.city_name}</option>)}
    </select>
  );
}

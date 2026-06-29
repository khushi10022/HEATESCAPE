import { useCityData } from '../context/CityDataContext';
import './Materials.css';

export default function Materials() {
  const { materials } = useCityData();
  const activeMaterials = materials.filter(m => m.category !== 'baseline');
  const maxCool = activeMaterials.length ? Math.max(...activeMaterials.map(m=>m.surface_temp_reduction_c)) : 5;
  return (
    <div className="materials-page">
      <div className="materials-header">
        <h2 style={{fontFamily:'var(--font-display)',fontSize:18,fontWeight:800,letterSpacing:'0.1em',marginBottom:6,background:'var(--grad-fire)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>COOLING MATERIALS LIBRARY</h2>
        <p style={{fontSize:13,color:'var(--text-secondary)'}}>{activeMaterials.length} materials · Ranked by cooling potential</p>
      </div>
      {activeMaterials.map(m=>(
        <div key={m.material_id} className={`mat-card cat-${m.category}`}>
          <div className="mat-card-top">
            <span className="mat-card-name">{m.name}</span>
            <span className="mat-badge">{m.category}</span>
          </div>
          <div className="mat-metrics">
            <div className="mat-metric"><span className="mat-metric-val">{m.albedo}</span><span className="mat-metric-label">Albedo</span></div>
            <div className="mat-metric"><span className="mat-metric-val">{m.surface_temp_reduction_c}°C</span><span className="mat-metric-label">Cooling</span></div>
          </div>
          <div className="mat-bar"><div className="mat-fill" style={{width:`${(m.surface_temp_reduction_c/maxCool)*100}%`}}/></div>
        </div>
      ))}
    </div>
  );
}

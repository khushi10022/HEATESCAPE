import './MaterialsTable.css';

export default function MaterialsTable({ materials }) {
  if (!materials || materials.length === 0) {
    return (
      <div className="glass-panel materials-panel">
        <div className="panel-header"><div className="panel-icon-dot" /><h2>Materials</h2></div>
        <p className="panel-empty">Loading materials…</p>
      </div>
    );
  }
  return (
    <div className="glass-panel materials-panel">
      <div className="panel-header"><div className="panel-icon-dot" /><h2>Cooling Materials</h2></div>
      <div className="materials-body">
        {materials.filter(m => m.category !== 'baseline').map((m) => (
          <div key={m.material_id} className="material-card">
            <div className="material-info">
              <span className="material-name">{m.name}</span>
              <span className="material-cat">{m.category}</span>
            </div>
            <div className="material-stats">
              <div className="mat-stat">
                <span className="mat-val">{m.albedo}</span>
                <span className="mat-label">Albedo</span>
              </div>
              <div className="mat-stat">
                <span className="mat-val">{m.surface_temp_reduction_c}°</span>
                <span className="mat-label">Cooling</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

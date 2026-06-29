import { BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,Cell,CartesianGrid,LabelList } from 'recharts';
import './CoolingChart.css';

const CAT_COL = { roof:'#ff5500', pavement:'#00c8ff', vegetation:'#00ff88' };

const CT = ({ active,payload }) => {
  if (!active||!payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{background:'rgba(5,8,15,0.96)',border:'1px solid rgba(255,85,0,0.3)',borderRadius:8,padding:'10px 14px',fontSize:12,boxShadow:'0 0 20px rgba(255,85,0,0.15)'}}>
      <div style={{color:'var(--text-primary)',fontWeight:700,marginBottom:4}}>{d.fullName}</div>
      <div style={{color:'var(--accent-amber)',fontFamily:'var(--font-mono)'}}>↓ {d.cooling}°C cooling</div>
      <div style={{color:'var(--text-muted)',marginTop:2,textTransform:'capitalize'}}>{d.category}</div>
    </div>
  );
};

export default function CoolingChart({ zone, cooling }) {
  if (!zone) return (
    <div className="glass-panel cooling-panel">
      <div className="panel-header"><div className="panel-icon-dot"/><h2>Cooling Potential</h2></div>
      <p className="panel-empty">Select a zone.</p>
    </div>
  );
  if (!cooling?.length) return (
    <div className="glass-panel cooling-panel">
      <div className="panel-header"><div className="panel-icon-dot"/><h2>Cooling Potential</h2></div>
      <p className="panel-empty">Loading…</p>
    </div>
  );

  const data = cooling.slice(0,6).map(c=>({
    name: c.material_name.length>12 ? c.material_name.slice(0,11)+'…':c.material_name,
    fullName:c.material_name, cooling:c.predicted_cooling_c, category:c.category
  }));

  return (
    <div className="glass-panel cooling-panel">
      <div className="panel-header">
        <div className="panel-icon-dot"/><h2>Cooling Strategies</h2>
        <span className="panel-subtitle">{zone.zone_name}</span>
      </div>
      <div className="cooling-body">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{top:18,right:6,left:-14,bottom:32}}>
            <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,85,0,0.08)" vertical={false}/>
            <XAxis dataKey="name" angle={-25} textAnchor="end" height={52}
              tick={{fill:'var(--text-muted)',fontSize:10}} axisLine={{stroke:'var(--border-dim)'}} tickLine={false}/>
            <YAxis tick={{fill:'var(--text-muted)',fontSize:10}} axisLine={false} tickLine={false}
              label={{value:'°C ↓',angle:-90,position:'insideLeft',fill:'var(--text-muted)',fontSize:10,dy:20}}/>
            <Tooltip content={<CT/>} cursor={{fill:'rgba(255,85,0,0.04)'}}/>
            <Bar dataKey="cooling" radius={[6,6,0,0]}>
              {data.map((e,i)=>(
                <Cell key={i} fill={CAT_COL[e.category]||'#ff7700'} fillOpacity={0.9}/>
              ))}
              <LabelList dataKey="cooling" position="top" formatter={v=>`${v}°`}
                style={{fill:'var(--text-secondary)',fontSize:10,fontFamily:'var(--font-mono)'}}/>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

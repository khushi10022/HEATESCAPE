// ClickTale-style heatmap: deep blue → cyan → green → yellow → orange → red → white-hot
const HEAT_STOPS = [
  { temp: 38, color: '#0a0a5c' },   // deep indigo - coolest
  { temp: 41, color: '#0f3cdb' },   // electric blue
  { temp: 43, color: '#00c8ff' },   // cyan
  { temp: 45, color: '#00ff88' },   // neon green
  { temp: 47, color: '#fff000' },   // yellow
  { temp: 50, color: '#ff7700' },   // orange
  { temp: 53, color: '#ff2200' },   // red
  { temp: 56, color: '#ffffff' },   // white-hot
];

export function heatColor(temp) {
  if (temp <= HEAT_STOPS[0].temp) return HEAT_STOPS[0].color;
  if (temp >= HEAT_STOPS[HEAT_STOPS.length - 1].temp) return HEAT_STOPS[HEAT_STOPS.length - 1].color;
  for (let i = 0; i < HEAT_STOPS.length - 1; i++) {
    const a = HEAT_STOPS[i], b = HEAT_STOPS[i + 1];
    if (temp >= a.temp && temp <= b.temp) {
      return lerpColor(a.color, b.color, (temp - a.temp) / (b.temp - a.temp));
    }
  }
  return HEAT_STOPS[HEAT_STOPS.length - 1].color;
}

function lerpColor(hexA, hexB, t) {
  const a = hexToRgb(hexA), b = hexToRgb(hexB);
  return `rgb(${Math.round(a.r+(b.r-a.r)*t)},${Math.round(a.g+(b.g-a.g)*t)},${Math.round(a.b+(b.b-a.b)*t)})`;
}
function hexToRgb(hex) {
  const v = hex.replace('#','');
  return { r:parseInt(v.slice(0,2),16), g:parseInt(v.slice(2,4),16), b:parseInt(v.slice(4,6),16) };
}

export function riskLabel(idx) {
  if (idx >= 75) return 'Critical';
  if (idx >= 50) return 'High';
  if (idx >= 25) return 'Moderate';
  return 'Low';
}

import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { heatColor } from '../utils/heatColor';
import 'leaflet/dist/leaflet.css';
import './HeatMap.css';

const TILES = {
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
};

export default function HeatMap({ zones, selectedZoneId, onSelectZone, center, zoom }) {
  const [tile, setTile] = useState('dark');
  if (!zones?.length) return <div className="heatmap-empty"><p>No zone data.</p></div>;

  const mapCenter = center || [zones[0].lat, zones[0].lon];
  const maxPop = Math.max(...zones.map(z => z.population), 1);

  return (
    <div className="heatmap-wrap">
      <MapContainer key={mapCenter.join(',')} center={mapCenter} zoom={zoom||11}
        scrollWheelZoom className="heatmap-container">
        <TileLayer url={TILES[tile]} attribution='&copy; CARTO &copy; OpenStreetMap' />
        {zones.map(zone => {
          const sel = zone.zone_id === selectedZoneId;
          const r = 9 + (zone.population / maxPop) * 16;
          const col = heatColor(zone.lst_celsius);
          return (
            <CircleMarker key={zone.zone_id} center={[zone.lat, zone.lon]} radius={r}
              pathOptions={{
                fillColor: col,
                fillOpacity: sel ? 1 : 0.78,
                color: sel ? '#ffaa00' : 'rgba(255,255,255,0.15)',
                weight: sel ? 3 : 1,
              }}
              eventHandlers={{ click: () => onSelectZone?.(zone.zone_id) }}
            >
              <Tooltip direction="top" offset={[0,-8]}>
                <strong>{zone.zone_name}</strong><br />
                🌡 {zone.lst_celsius.toFixed(1)}°C · Priority {zone.priority_score.toFixed(0)}
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      <div className="map-controls">
        <button className={`map-ctrl-btn ${tile==='dark'?'active':''}`} onClick={()=>setTile('dark')}>🗺 Map</button>
        <button className={`map-ctrl-btn ${tile==='satellite'?'active':''}`} onClick={()=>setTile('satellite')}>🛰 Satellite</button>
      </div>

      <div className="heatmap-legend">
        <div className="legend-title">Surface Temp — LST</div>
        <div className="legend-bar" />
        <div className="legend-scale"><span>38°C</span><span>47°C</span><span>56°C</span></div>
      </div>
    </div>
  );
}

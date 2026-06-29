import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CityDataProvider, useCityData } from './context/CityDataContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ChatWidget from './components/ChatWidget';
import Landing from './pages/Landing';
import Overview from './pages/Overview';
import HeatMaps from './pages/HeatMaps';
import Materials from './pages/Materials';
import Analysis from './pages/Analysis';
import IndiaMap from './pages/IndiaMap';
import './App.css';

const EMBERS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: `${5 + (i * 5.5) % 95}%`,
  s: `${2 + (i % 4)}px`,
  d: `${3 + (i % 4)}s`,
  delay: `${(i * 0.7) % 6}s`,
  dx: `${-20 + (i % 5) * 12}px`,
  c: ['#ff5500','#ff7700','#ffaa00','#ff2200','#ffcc00'][i % 5],
}));

function Embers() {
  return (
    <div className="embers">
      {EMBERS.map((e) => (
        <div key={e.id} className="ember" style={{
          left: e.x, '--s': e.s, '--d': e.d,
          '--delay': e.delay, '--dx': e.dx, '--c': e.c,
        }} />
      ))}
    </div>
  );
}

export default function App() {
  return (
    <CityDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/*" element={<DashboardShell />} />
        </Routes>
      </BrowserRouter>
    </CityDataProvider>
  );
}

function DashboardShell() {
  const { loadError } = useCityData();
  if (loadError) {
    return (
      <div className="app-error">
        <div className="bg-grid" />
        <Embers />
        <h1>HEATESCAPE</h1>
        <p>{loadError}</p>
        <code>cd backend && uvicorn main:app --reload --port 8000</code>
      </div>
    );
  }
  return (
    <div className="app-shell">
      <div className="bg-grid" />
      <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
      <Embers />
      <div className="scan-line" />
      <Sidebar />
      <div className="app-main">
        <TopBar />
        <div className="page-content">
          <Routes>
            <Route path="/overview" element={<Overview />} />
            <Route path="/heat-maps" element={<HeatMaps />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/india-map" element={<IndiaMap />} />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Routes>
        </div>
      </div>
      <ChatWidget />
    </div>
  );
}

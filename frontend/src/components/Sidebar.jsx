import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const NAV_ITEMS = [
  { path: '/overview',  label: 'Dashboard',   icon: '⊞' },
  { path: '/heat-maps', label: 'Heat Maps',    icon: '🌡', badge: 'LIVE' },
  { path: '/materials', label: 'Materials',    icon: '⬡' },
  { path: '/analysis',  label: 'AI Analysis',  icon: '◈' },
  { path: '/india-map', label: 'India Map',    icon: '🌏' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon-wrap">
          <div className="brand-icon-ring" />
          <div className="brand-icon">🔥</div>
        </div>
        <div className="brand-text">
          <span className="brand-name">HEATESCAPE</span>
          <span className="brand-sub">Heat Intelligence</span>
        </div>
      </div>

      <div className="sidebar-section-label">Navigation</div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </NavLink>
        ))}
      </nav>

    </aside>
  );
}

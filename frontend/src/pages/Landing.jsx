import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = root.querySelectorAll('.l-reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('l-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const goToDashboard = () => navigate('/overview');

  return (
    <div className="landing-page" ref={rootRef}>
      <nav className="l-nav">
        <div className="l-brand">
          <svg className="l-brand-mark" viewBox="0 0 30 30">
            <circle cx="15" cy="15" r="13" fill="none" stroke="#ff7700" strokeWidth="1.4" opacity="0.5" />
            <circle cx="15" cy="15" r="6.5" fill="#ff2200">
              <animate attributeName="r" values="6.5;8;6.5" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="15" cy="15" r="6.5" fill="none" stroke="#fff000" strokeWidth="0.8" opacity="0.6" />
          </svg>
          HEATESCAPE
        </div>
        <div className="l-nav-links l-nav-mobile-hide">
          <a href="#cities">Cities</a>
          <a href="#pipeline">Methodology</a>
          <a href="#materials">Materials</a>
        </div>
        <a className="l-nav-cta" href="#cta">Launch Dashboard →</a>
      </nav>

      {/* ============ HERO ============ */}
      <section className="l-hero">
        <div className="l-wrap l-hero-grid">
          <div className="l-hero-copy">
            <div className="l-eyebrow"><span className="l-dot"></span> URBAN HEAT ISLAND MONITOR · INDIA</div>
            <h1>
              <span className="l-l1">Six cities are</span>
              <span className="l-l2">quietly overheating.</span>
            </h1>
            <p className="l-lede">
              HEATESCAPE fuses satellite thermal imagery with machine learning to map exactly where Indian
              neighborhoods are getting dangerously hot — and simulates, block by block, how much cooler a roof,
              a roadway, or a tree canopy could make them.
            </p>
            <div className="l-hero-actions">
              <button className="l-btn-primary" onClick={goToDashboard}>Open the Dashboard <span>→</span></button>
              <a className="l-btn-secondary" href="#pipeline">How the model works</a>
            </div>
            <div className="l-hero-stats">
              <div className="l-hstat"><b>55.1°C</b><span>Peak LST · Delhi NCR</span></div>
              <div className="l-hstat"><b>105</b><span>Neighborhoods Modeled</span></div>
              <div className="l-hstat"><b>60</b><span>Critical Heat Zones</span></div>
              <div className="l-hstat"><b>0.998</b><span>Best-fit Model R²</span></div>
            </div>
          </div>

          <div className="l-console">
            <div className="l-console-head">
              <span className="l-ch-label">● Live Thermal Console</span>
              <span className="l-ch-sub">FEED: DELHI-NCR / 25 ZONES</span>
            </div>

            <div className="l-console-readout">
              <div className="l-readout-main">
                <b>55.1°C</b>
                <span>Peak surface temp · Okhla Industrial Area</span>
              </div>
              <div className="l-readout-side">
                <div><b>38.6°C</b><span>Lowest zone</span></div>
                <div><b>49.0°C</b><span>Median zone</span></div>
                <div><b>86.4</b><span>Top priority score</span></div>
              </div>
            </div>

            <div className="l-wave-box">
              <span className="l-tag">LST trace · 25 zones, real sensor order</span>
              <div className="l-crosshair"></div>
              <svg viewBox="0 0 1040 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="waveFillGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff7700" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#ff7700" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="waveStrokeGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#fff000" />
                    <stop offset="50%" stopColor="#ff7700" />
                    <stop offset="100%" stopColor="#ff2200" />
                  </linearGradient>
                </defs>
                <g className="l-wave-grid">
                  <line x1="0" y1="30" x2="1040" y2="30" />
                  <line x1="0" y1="60" x2="1040" y2="60" />
                  <line x1="0" y1="90" x2="1040" y2="90" />
                </g>
                <path
                  className="l-wave-fill"
                  d="M 0.0,41.5 L 21.2,16.0 L 42.4,22.0 L 63.7,39.5 L 84.9,30.0 L 106.1,14.5 L 127.3,30.5 L 148.6,45.5 L 169.8,24.0 L 191.0,37.5 L 212.2,49.0 L 233.5,28.0 L 254.7,51.0 L 275.9,31.0 L 297.1,53.0 L 318.4,45.0 L 339.6,60.0 L 360.8,64.0 L 382.0,58.5 L 403.3,67.0 L 424.5,74.5 L 445.7,84.0 L 466.9,89.5 L 488.2,93.0 L 509.4,97.0 L 530.6,41.5 L 551.8,16.0 L 573.1,22.0 L 594.3,39.5 L 615.5,30.0 L 636.7,14.5 L 658.0,30.5 L 679.2,45.5 L 700.4,24.0 L 721.6,37.5 L 742.9,49.0 L 764.1,28.0 L 785.3,51.0 L 806.5,31.0 L 827.8,53.0 L 849.0,45.0 L 870.2,60.0 L 891.4,64.0 L 912.7,58.5 L 933.9,67.0 L 955.1,74.5 L 976.3,84.0 L 997.6,89.5 L 1018.8,93.0 L 1040.0,97.0 L 1040,120 L 0,120 Z"
                />
                <path
                  className="l-wave-line"
                  d="M 0.0,41.5 L 21.2,16.0 L 42.4,22.0 L 63.7,39.5 L 84.9,30.0 L 106.1,14.5 L 127.3,30.5 L 148.6,45.5 L 169.8,24.0 L 191.0,37.5 L 212.2,49.0 L 233.5,28.0 L 254.7,51.0 L 275.9,31.0 L 297.1,53.0 L 318.4,45.0 L 339.6,60.0 L 360.8,64.0 L 382.0,58.5 L 403.3,67.0 L 424.5,74.5 L 445.7,84.0 L 466.9,89.5 L 488.2,93.0 L 509.4,97.0 L 530.6,41.5 L 551.8,16.0 L 573.1,22.0 L 594.3,39.5 L 615.5,30.0 L 636.7,14.5 L 658.0,30.5 L 679.2,45.5 L 700.4,24.0 L 721.6,37.5 L 742.9,49.0 L 764.1,28.0 L 785.3,51.0 L 806.5,31.0 L 827.8,53.0 L 849.0,45.0 L 870.2,60.0 L 891.4,64.0 L 912.7,58.5 L 933.9,67.0 L 955.1,74.5 L 976.3,84.0 L 997.6,89.5 L 1018.8,93.0 L 1040.0,97.0"
                />
              </svg>
            </div>

            <div className="l-ticker-wrap">
              <div className="l-ticker-track">
                {[...Array(2)].flatMap((_, rep) =>
                  [
                    ['Okhla Industrial Area', '55.1°C'],
                    ['Chandni Chowk', '54.8°C'],
                    ['Patna City Old Town', '54.2°C'],
                    ['Faridabad Old City', '53.6°C'],
                    ['Charminar Old City', '53.6°C'],
                    ['Noida Sector 18', '53.2°C'],
                  ].map(([name, temp], i) => (
                    <span className="l-ticker-item" key={`${rep}-${i}`}>
                      <span className="l-flag">●</span> <b>{name}</b> {temp} <span className="l-sep">·</span>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="l-console-caption" style={{ maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            <span>LST · Landsat 8/9 thermal band</span>
            <span className="l-live"><span className="l-d"></span>6 cities tracked</span>
          </div>
        </div>
      </section>

      <div className="l-wrap"><div className="l-divider"></div></div>

      {/* ============ CITY GRID ============ */}
      <section className="l-section" id="cities">
        <div className="l-wrap">
          <div className="l-section-head l-reveal">
            <div className="l-eyebrow"><span className="l-dot"></span> CITY-LEVEL DATA</div>
            <h2>Every metro, ranked by how hot it actually runs.</h2>
            <p>
              Average and peak land surface temperature pulled from satellite thermal bands, paired with
              population exposure and how many neighborhoods cross into the critical heat-risk tier.
            </p>
          </div>

          <div className="l-city-grid">
            <div className="l-city-card l-reveal" style={{ '--bar-grad': 'linear-gradient(90deg,#ff2200,#ff7700)' }}>
              <div className="l-rank">RANK 01 · BIHAR</div>
              <h3>Patna</h3>
              <div className="l-state">15 zones monitored</div>
              <div className="l-temp-row"><b style={{ color: '#ff5533' }}>50.1°C</b><span>avg LST</span></div>
              <div className="l-heatbar"><i style={{ width: '93%', background: 'linear-gradient(90deg,#ff2200,#ff7700)' }}></i></div>
              <div className="l-meta"><span>Peak <b>54.2°C</b></span><span>Critical zones <b>8/15</b></span></div>
            </div>

            <div className="l-city-card l-reveal" style={{ '--bar-grad': 'linear-gradient(90deg,#ff2200,#ff7700)' }}>
              <div className="l-rank">RANK 02 · DELHI/NCR</div>
              <h3>Delhi NCR</h3>
              <div className="l-state">25 zones monitored</div>
              <div className="l-temp-row"><b style={{ color: '#ff7733' }}>48.0°C</b><span>avg LST</span></div>
              <div className="l-heatbar"><i style={{ width: '87%', background: 'linear-gradient(90deg,#ff5500,#ff9900)' }}></i></div>
              <div className="l-meta"><span>Peak <b>55.1°C</b></span><span>Critical zones <b>13/25</b></span></div>
            </div>

            <div className="l-city-card l-reveal" style={{ '--bar-grad': 'linear-gradient(90deg,#ff7700,#ffaa00)' }}>
              <div className="l-rank">RANK 03 · TELANGANA</div>
              <h3>Hyderabad</h3>
              <div className="l-state">18 zones monitored</div>
              <div className="l-temp-row"><b style={{ color: '#ff8a3d' }}>48.2°C</b><span>avg LST</span></div>
              <div className="l-heatbar"><i style={{ width: '87%', background: 'linear-gradient(90deg,#ff5500,#ff9900)' }}></i></div>
              <div className="l-meta"><span>Peak <b>53.6°C</b></span><span>Critical zones <b>13/18</b></span></div>
            </div>

            <div className="l-city-card l-reveal" style={{ '--bar-grad': 'linear-gradient(90deg,#ffaa00,#fff000)' }}>
              <div className="l-rank">RANK 04 · WEST BENGAL</div>
              <h3>Kolkata</h3>
              <div className="l-state">15 zones monitored</div>
              <div className="l-temp-row"><b style={{ color: '#ffaa4d' }}>45.6°C</b><span>avg LST</span></div>
              <div className="l-heatbar"><i style={{ width: '78%', background: 'linear-gradient(90deg,#ffaa00,#fff000)' }}></i></div>
              <div className="l-meta"><span>Peak <b>49.6°C</b></span><span>Critical zones <b>9/15</b></span></div>
            </div>

            <div className="l-city-card l-reveal" style={{ '--bar-grad': 'linear-gradient(90deg,#ffaa00,#fff000)' }}>
              <div className="l-rank">RANK 05 · JHARKHAND</div>
              <h3>Ranchi</h3>
              <div className="l-state">12 zones monitored</div>
              <div className="l-temp-row"><b style={{ color: '#ffc266' }}>44.5°C</b><span>avg LST</span></div>
              <div className="l-heatbar"><i style={{ width: '74%', background: 'linear-gradient(90deg,#ffaa00,#fff000)' }}></i></div>
              <div className="l-meta"><span>Peak <b>49.4°C</b></span><span>Critical zones <b>6/12</b></span></div>
            </div>

            <div className="l-city-card l-reveal" style={{ '--bar-grad': 'linear-gradient(90deg,#00c8ff,#fff000)' }}>
              <div className="l-rank">RANK 06 · MAHARASHTRA</div>
              <h3>Mumbai</h3>
              <div className="l-state">20 zones monitored</div>
              <div className="l-temp-row"><b style={{ color: '#ffd966' }}>42.4°C</b><span>avg LST</span></div>
              <div className="l-heatbar"><i style={{ width: '65%', background: 'linear-gradient(90deg,#00c8ff,#fff000)' }}></i></div>
              <div className="l-meta"><span>Peak <b>46.8°C</b></span><span>Critical zones <b>11/20</b></span></div>
            </div>
          </div>
        </div>
      </section>

      <div className="l-wrap"><div className="l-divider"></div></div>

      {/* ============ PIPELINE ============ */}
      <section className="l-section" id="pipeline">
        <div className="l-wrap">
          <div className="l-section-head l-reveal">
            <div className="l-eyebrow"><span className="l-dot"></span> METHODOLOGY</div>
            <h2>From orbit to a single cooling number.</h2>
            <p>
              Three stages turn raw satellite passes into a defensible, per-neighborhood prediction of how much
              a roof, a roadway, or a canopy will actually cool things down.
            </p>
          </div>

          <div className="l-pipeline">
            <div className="l-pipe-card l-reveal">
              <svg className="l-icon" viewBox="0 0 38 38" fill="none">
                <circle cx="19" cy="19" r="3" fill="#00c8ff" />
                <ellipse cx="19" cy="19" rx="16" ry="6" stroke="#00c8ff" strokeWidth="1.4" opacity="0.6" />
                <ellipse cx="19" cy="19" rx="6" ry="16" stroke="#00c8ff" strokeWidth="1.4" opacity="0.6" />
                <circle cx="33" cy="13" r="2" fill="#fff000" />
              </svg>
              <div className="l-stage-tag">Stage 01 · Ingest</div>
              <h3>Satellite thermal capture</h3>
              <p>
                Landsat 8/9 passes are pulled through Google Earth Engine to derive land surface temperature,
                NDVI canopy density, NDBI built-up index, and surface albedo for every neighborhood.
              </p>
            </div>
            <div className="l-pipe-card l-reveal">
              <svg className="l-icon" viewBox="0 0 38 38" fill="none">
                <path d="M5 28 L13 16 L21 22 L33 8" stroke="#ff7700" strokeWidth="2" strokeLinecap="round" />
                <circle cx="13" cy="16" r="2.4" fill="#ff7700" />
                <circle cx="21" cy="22" r="2.4" fill="#ff7700" />
                <circle cx="33" cy="8" r="2.4" fill="#fff000" />
              </svg>
              <div className="l-stage-tag">Stage 02 · Model</div>
              <h3>Regression &amp; random forest</h3>
              <p>
                Linear and random-forest regressors learn how NDBI, NDVI, albedo, and vulnerability drive local
                temperature — fit to R² up to 0.998 — and assign each zone a 0–100 priority score.
              </p>
            </div>
            <div className="l-pipe-card l-reveal">
              <svg className="l-icon" viewBox="0 0 38 38" fill="none">
                <rect x="6" y="22" width="6" height="10" fill="#00ff88" opacity="0.8" />
                <rect x="16" y="14" width="6" height="18" fill="#fff000" opacity="0.85" />
                <rect x="26" y="6" width="6" height="26" fill="#ff2200" opacity="0.9" />
              </svg>
              <div className="l-stage-tag">Stage 03 · Simulate</div>
              <h3>Cooling intervention sim</h3>
              <p>
                Trained coefficients estimate the °C drop from swapping in cool roofs, reflective pavement, or
                tree canopy at the zone level — instantly, without re-running satellite analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="l-wrap"><div className="l-divider"></div></div>

      {/* ============ MATERIALS ============ */}
      <section className="l-section" id="materials">
        <div className="l-wrap">
          <div className="l-section-head l-reveal">
            <div className="l-eyebrow"><span className="l-dot"></span> COOLING MATERIALS CATALOG</div>
            <h2>What actually brings the temperature down.</h2>
            <p>
              Each intervention is scored on measured albedo, surface temperature reduction, installed cost,
              and durability — so a recommendation comes with a number attached, not just a suggestion.
            </p>
          </div>

          <div className="l-mat-strip">
            <div className="l-mat-card l-reveal">
              <div className="l-cat">Vegetation</div>
              <h4>Green Roof (Extensive)</h4>
              <div className="l-mat-stat"><b>−12.6°C</b><span>SURFACE</span></div>
              <div className="l-mat-stat"><span style={{ color: 'var(--l-text-secondary)' }}>₹1,850 / m² · 20 yr</span></div>
            </div>
            <div className="l-mat-card l-reveal">
              <div className="l-cat">Pavement</div>
              <h4>Reflective Pavement (Engineered)</h4>
              <div className="l-mat-stat"><b>−11.2°C</b><span>SURFACE</span></div>
              <div className="l-mat-stat"><span style={{ color: 'var(--l-text-secondary)' }}>₹950 / m² · 6 yr</span></div>
            </div>
            <div className="l-mat-card l-reveal">
              <div className="l-cat">Roof</div>
              <h4>Cool Roof (White Membrane)</h4>
              <div className="l-mat-stat"><b>−9.8°C</b><span>SURFACE</span></div>
              <div className="l-mat-stat"><span style={{ color: 'var(--l-text-secondary)' }}>₹540 / m² · 12 yr</span></div>
            </div>
            <div className="l-mat-card l-reveal">
              <div className="l-cat">Pavement</div>
              <h4>Cool Pavement (High-Albedo)</h4>
              <div className="l-mat-stat"><b>−8.5°C</b><span>SURFACE</span></div>
              <div className="l-mat-stat"><span style={{ color: 'var(--l-text-secondary)' }}>₹720 / m² · 7 yr</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="l-section" id="cta">
        <div className="l-wrap">
          <div className="l-cta-panel l-reveal">
            <div className="l-eyebrow" style={{ justifyContent: 'center' }}><span className="l-dot"></span> READY WHEN YOU ARE</div>
            <h2>Pick a city. See where it's burning.</h2>
            <p>
              The full dashboard drills into every zone — heatmaps, priority rankings, regression coefficients,
              and a live cooling-strategy simulator powered by Gemini.
            </p>
            <button className="l-btn-primary" onClick={goToDashboard}>Open the Dashboard <span>→</span></button>
          </div>
        </div>
      </section>

      <footer className="l-footer">
        <div className="l-wrap l-foot-row">
          <div className="l-left">
            <svg width="20" height="20" viewBox="0 0 30 30"><circle cx="15" cy="15" r="6.5" fill="#ff2200" /></svg>
            HEATESCAPE
          </div>
          <div className="l-right">URBAN HEAT ISLAND MONITOR · MULTI-CITY INDIA · LST DATA: USGS LANDSAT 8/9</div>
        </div>
      </footer>
    </div>
  );
}

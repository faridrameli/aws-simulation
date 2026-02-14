import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SERVICE_CATALOG, SERVICE_CATEGORIES, AWS_REGIONS } from '../../utils/constants';
import { useGlobalStore, useMissionStore } from '../../store';
import { MISSIONS } from '../../data/missions';

export default function TopNav() {
  const [showServices, setShowServices] = useState(false);
  const [showRegion, setShowRegion] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const region = useGlobalStore((s) => s.region);
  const setRegion = useGlobalStore((s) => s.setRegion);
  const navigate = useNavigate();
  const servicesRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) setShowServices(false);
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) setShowRegion(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filteredServices = searchQuery
    ? SERVICE_CATALOG.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SERVICE_CATALOG;

  const currentRegion = AWS_REGIONS.find((r) => r.code === region);

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/" style={styles.logo}>
          <span style={styles.awsLogo}>&#9729; aws</span>
        </Link>

        <div ref={servicesRef} style={styles.menuContainer}>
          <button
            style={styles.navBtn}
            onClick={() => { setShowServices(!showServices); setShowRegion(false); }}
          >
            Services ▾
          </button>
          {showServices && (
            <div style={styles.megaMenu}>
              <div style={styles.megaMenuSearch}>
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                  autoFocus
                />
              </div>
              <div style={styles.megaMenuGrid}>
                {searchQuery ? (
                  <div style={styles.megaMenuCol}>
                    {filteredServices.map((s) => (
                      <Link
                        key={s.path}
                        to={s.path}
                        style={styles.serviceLink}
                        onClick={() => { setShowServices(false); setSearchQuery(''); }}
                      >
                        <strong>{s.name}</strong>
                        <span style={styles.serviceSub}>{s.description}</span>
                      </Link>
                    ))}
                    {filteredServices.length === 0 && (
                      <div style={styles.noResults}>No services found</div>
                    )}
                  </div>
                ) : (
                  SERVICE_CATEGORIES.map((cat) => {
                    const services = SERVICE_CATALOG.filter((s) => s.category === cat);
                    if (services.length === 0) return null;
                    return (
                      <div key={cat} style={styles.megaMenuCol}>
                        <div style={styles.categoryTitle}>{cat}</div>
                        {services.map((s) => (
                          <Link
                            key={s.path}
                            to={s.path}
                            style={styles.serviceLink}
                            onClick={() => setShowServices(false)}
                          >
                            {s.name}
                          </Link>
                        ))}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={styles.center} ref={searchRef}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="&#128269; Search services and features"
            style={styles.globalSearch}
            onFocus={() => setShowSearch(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearch(true);
            }}
            value={searchQuery}
          />
          {showSearch && searchQuery && (
            <div style={styles.searchDropdown}>
              {filteredServices.map((s) => (
                <div
                  key={s.path}
                  style={styles.searchResult}
                  onClick={() => {
                    navigate(s.path);
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                >
                  <strong>{s.name}</strong> — {s.description}
                </div>
              ))}
              {filteredServices.length === 0 && (
                <div style={styles.noResults}>No results</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={styles.right}>
        <MissionsButton />
        <div ref={regionRef} style={styles.menuContainer}>
          <button
            style={styles.navBtn}
            onClick={() => { setShowRegion(!showRegion); setShowServices(false); }}
          >
            {currentRegion?.code || region} ▾
          </button>
          {showRegion && (
            <div style={styles.regionDropdown}>
              {AWS_REGIONS.map((r) => (
                <div
                  key={r.code}
                  style={{
                    ...styles.regionItem,
                    background: r.code === region ? '#37475a' : undefined,
                  }}
                  onClick={() => {
                    setRegion(r.code);
                    setShowRegion(false);
                  }}
                >
                  <span>{r.name}</span>
                  <span style={styles.regionCode}>{r.code}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.accountInfo}>
          <span style={styles.accountName}>SimUser @ 123456789012</span>
        </div>
      </div>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    height: 'var(--topnav-height)',
    background: '#232f3e',
    color: '#fff',
    padding: '0 16px',
    fontSize: '13px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    gap: '8px',
  },
  left: { display: 'flex', alignItems: 'center', gap: '4px' },
  center: { flex: 1, display: 'flex', justifyContent: 'center', maxWidth: '500px', margin: '0 auto' },
  right: { display: 'flex', alignItems: 'center', gap: '8px' },
  logo: { color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '16px', marginRight: '8px' },
  awsLogo: { color: '#ff9900', fontSize: '18px', letterSpacing: '1px' },
  navBtn: {
    background: 'none',
    border: '1px solid transparent',
    color: '#fff',
    padding: '4px 10px',
    fontSize: '13px',
    cursor: 'pointer',
    borderRadius: '2px',
  },
  menuContainer: { position: 'relative' as const },
  megaMenu: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    background: '#232f3e',
    border: '1px solid #445566',
    borderRadius: '0 0 4px 4px',
    minWidth: '600px',
    maxHeight: '70vh',
    overflowY: 'auto' as const,
    zIndex: 200,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  megaMenuSearch: { padding: '12px', borderBottom: '1px solid #445566' },
  searchInput: {
    width: '100%',
    padding: '6px 10px',
    background: '#1b2a3b',
    border: '1px solid #445566',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '13px',
    outline: 'none',
  },
  megaMenuGrid: { display: 'flex', flexWrap: 'wrap' as const, padding: '8px 12px', gap: '16px' },
  megaMenuCol: { minWidth: '180px', flex: '1' },
  categoryTitle: { color: '#ff9900', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' as const, marginBottom: '6px', padding: '4px 0' },
  serviceLink: { display: 'block', color: '#fff', textDecoration: 'none', padding: '3px 0', fontSize: '13px' },
  serviceSub: { display: 'block', color: '#aab7b8', fontSize: '11px' },
  noResults: { color: '#aab7b8', padding: '8px 0' },
  searchContainer: { position: 'relative' as const, width: '100%' },
  globalSearch: {
    width: '100%',
    padding: '5px 12px',
    background: '#1b2a3b',
    border: '1px solid #445566',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '13px',
    outline: 'none',
  },
  searchDropdown: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    right: 0,
    background: '#232f3e',
    border: '1px solid #445566',
    borderRadius: '0 0 4px 4px',
    maxHeight: '300px',
    overflowY: 'auto' as const,
    zIndex: 200,
  },
  searchResult: { padding: '8px 12px', color: '#fff', cursor: 'pointer', fontSize: '13px' },
  regionDropdown: {
    position: 'absolute' as const,
    top: '100%',
    right: 0,
    background: '#232f3e',
    border: '1px solid #445566',
    borderRadius: '0 0 4px 4px',
    minWidth: '300px',
    maxHeight: '400px',
    overflowY: 'auto' as const,
    zIndex: 200,
  },
  regionItem: { display: 'flex', justifyContent: 'space-between', padding: '6px 12px', color: '#fff', cursor: 'pointer', fontSize: '13px' },
  regionCode: { color: '#aab7b8' },
  accountInfo: { padding: '4px 8px' },
  accountName: { color: '#ccc', fontSize: '12px' },
};

function MissionsButton() {
  const togglePanel = useMissionStore((s) => s.togglePanel);
  const completedMissionIds = useMissionStore((s) => s.completedMissionIds);
  const remaining = MISSIONS.length - completedMissionIds.length;

  return (
    <button className="mission-nav-btn" onClick={togglePanel}>
      Missions
      {remaining > 0 && <span className="mission-nav-badge">{remaining}</span>}
    </button>
  );
}

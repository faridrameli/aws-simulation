import { Link } from 'react-router-dom';
import { SERVICE_CATALOG, SERVICE_CATEGORIES } from '../utils/constants';

export default function ConsoleDashboard() {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>AWS Management Console</h1>
        <p style={styles.heroSub}>
          AWS Console Simulation — Learn AWS without incurring costs
        </p>
      </div>

      <div style={styles.content}>
        <div style={styles.searchSection}>
          <h2 style={styles.sectionTitle}>AWS services</h2>
        </div>

        {SERVICE_CATEGORIES.map((category) => {
          const services = SERVICE_CATALOG.filter((s) => s.category === category);
          if (services.length === 0) return null;
          return (
            <div key={category} style={styles.categorySection}>
              <h3 style={styles.categoryTitle}>{category}</h3>
              <div style={styles.serviceGrid}>
                {services.map((service) => (
                  <Link key={service.path} to={service.path} style={styles.serviceCard}>
                    <div style={styles.serviceIcon}>
                      {service.name.charAt(0)}
                    </div>
                    <div>
                      <div style={styles.serviceName}>{service.name}</div>
                      <div style={styles.serviceDesc}>{service.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: 'calc(100vh - var(--topnav-height))',
  },
  hero: {
    background: 'linear-gradient(135deg, #232f3e 0%, #37475a 100%)',
    padding: '40px 32px',
    color: '#fff',
  },
  heroTitle: {
    fontSize: '28px',
    fontWeight: 700,
    marginBottom: '8px',
  },
  heroSub: {
    fontSize: '15px',
    color: '#aab7b8',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px 32px',
  },
  searchSection: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#16191f',
  },
  categorySection: {
    marginBottom: '32px',
  },
  categoryTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#545b64',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '1px solid #d5dbdb',
  },
  serviceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '12px',
  },
  serviceCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: '#fff',
    border: '1px solid #d5dbdb',
    borderRadius: '4px',
    textDecoration: 'none',
    color: '#16191f',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  serviceIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '4px',
    background: '#232f3e',
    color: '#ff9900',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '16px',
    flexShrink: 0,
  },
  serviceName: {
    fontWeight: 700,
    fontSize: '14px',
    color: '#0073bb',
  },
  serviceDesc: {
    fontSize: '12px',
    color: '#545b64',
    marginTop: '2px',
  },
};

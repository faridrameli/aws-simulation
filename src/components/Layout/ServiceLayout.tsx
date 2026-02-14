import { NavLink, Outlet } from 'react-router-dom';
import Breadcrumb from './Breadcrumb';

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

interface ServiceLayoutProps {
  serviceName: string;
  sections: NavSection[];
}

export default function ServiceLayout({ serviceName, sections }: ServiceLayoutProps) {
  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>{serviceName}</div>
        {sections.map((section) => (
          <div key={section.title} style={styles.section}>
            <div style={styles.sectionTitle}>{section.title}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  ...styles.navLink,
                  ...(isActive ? styles.navLinkActive : {}),
                })}
                end={item.path.split('/').length <= 2}
                data-mission={`${item.path.split('/')[1]}-${item.label.toLowerCase().replace(/\s+/g, '-')}-link`}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </aside>
      <main style={styles.main}>
        <Breadcrumb />
        <Outlet />
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flex: 1,
    minHeight: 'calc(100vh - var(--topnav-height))',
  },
  sidebar: {
    width: 'var(--sidebar-width)',
    minWidth: 'var(--sidebar-width)',
    background: '#fff',
    borderRight: '1px solid #d5dbdb',
    overflowY: 'auto',
    paddingBottom: '24px',
  },
  sidebarHeader: {
    padding: '12px 16px',
    fontWeight: 700,
    fontSize: '16px',
    borderBottom: '1px solid #d5dbdb',
    color: '#16191f',
  },
  section: {
    padding: '4px 0',
  },
  sectionTitle: {
    padding: '8px 16px 4px',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    color: '#545b64',
    letterSpacing: '0.5px',
  },
  navLink: {
    display: 'block',
    padding: '5px 16px 5px 24px',
    fontSize: '13px',
    color: '#16191f',
    textDecoration: 'none',
    borderLeft: '3px solid transparent',
  },
  navLinkActive: {
    background: '#f2f3f3',
    borderLeftColor: '#0073bb',
    color: '#0073bb',
    fontWeight: 700,
  },
};

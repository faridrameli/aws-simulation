import { Link } from 'react-router-dom';
import { useRDSStore } from '../../store';

export default function RDSDashboard() {
  const instances = useRDSStore((s) => s.instances);
  const snapshots = useRDSStore((s) => s.snapshots);

  const available = instances.filter((i) => i.Status === 'available').length;
  const other = instances.length - available;

  return (
    <div>
      <h1 style={{ fontSize: '22px', marginBottom: '20px' }}>RDS Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <DashCard title="DB Instances" value={instances.length} link="/rds/databases">
          <div style={{ fontSize: '12px', color: '#545b64', marginTop: '4px' }}>
            <span style={{ color: '#1d8102' }}>{available} available</span>
            {' | '}
            <span>{other} other</span>
          </div>
        </DashCard>
        <DashCard title="Snapshots" value={snapshots.length} link="/rds/snapshots" />
      </div>

      <div className="aws-panel">
        <div className="aws-panel-header">
          <h2>Resources</h2>
          <Link to="/rds/databases/create" className="aws-btn aws-btn-primary">
            Create database
          </Link>
        </div>
        <div className="aws-panel-body">
          <p style={{ color: 'var(--aws-text-secondary)' }}>
            Amazon RDS makes it easy to set up, operate, and scale a relational database in the cloud.
            Use the navigation on the left to manage your RDS resources.
          </p>
        </div>
      </div>
    </div>
  );
}

function DashCard({ title, value, link, children }: { title: string; value: number; link: string; children?: React.ReactNode }) {
  return (
    <Link to={link} style={{ textDecoration: 'none' }}>
      <div className="aws-panel" style={{ padding: '16px', cursor: 'pointer' }}>
        <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: '#16191f' }}>{value}</div>
        {children}
      </div>
    </Link>
  );
}

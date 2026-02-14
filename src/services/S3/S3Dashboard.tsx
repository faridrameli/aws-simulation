import { Link } from 'react-router-dom';
import { useS3Store } from '../../store';

export default function S3Dashboard() {
  const buckets = useS3Store((s) => s.buckets);

  const totalObjects = buckets.reduce((sum, b) => sum + b.Objects.length, 0);

  return (
    <div>
      <h1 style={{ fontSize: '22px', marginBottom: '20px' }}>S3 Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <DashCard title="Buckets" value={buckets.length} link="/s3/buckets">
          <div style={{ fontSize: '12px', color: '#545b64', marginTop: '4px' }}>
            <span>{totalObjects} objects total</span>
          </div>
        </DashCard>
      </div>

      <div className="aws-panel">
        <div className="aws-panel-header">
          <h2>Resources</h2>
          <Link to="/s3/buckets/create" className="aws-btn aws-btn-primary">
            Create bucket
          </Link>
        </div>
        <div className="aws-panel-body">
          <p style={{ color: 'var(--aws-text-secondary)' }}>
            Amazon S3 provides scalable object storage. Use the navigation on the left to manage your S3 resources.
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

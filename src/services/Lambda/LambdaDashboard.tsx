import { Link } from 'react-router-dom';
import { useLambdaStore } from '../../store';

export default function LambdaDashboard() {
  const functions = useLambdaStore((s) => s.functions);

  const activeCount = functions.filter((f) => f.State === 'Active').length;

  return (
    <div>
      <h1 style={{ fontSize: '22px', marginBottom: '20px' }}>Lambda Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <DashCard title="Functions" value={functions.length} link="/lambda/functions">
          <div style={{ fontSize: '12px', color: '#545b64', marginTop: '4px' }}>
            <span style={{ color: '#1d8102' }}>{activeCount} active</span>
          </div>
        </DashCard>
      </div>

      <div className="aws-panel">
        <div className="aws-panel-header">
          <h2>AWS Lambda</h2>
          <Link to="/lambda/functions/create" className="aws-btn aws-btn-primary">
            Create function
          </Link>
        </div>
        <div className="aws-panel-body">
          <p style={{ color: 'var(--aws-text-secondary)' }}>
            AWS Lambda lets you run code without provisioning or managing servers. You pay only for the compute time you
            consume. Use the navigation on the left to manage your Lambda resources.
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

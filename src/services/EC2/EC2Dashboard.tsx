import { Link } from 'react-router-dom';
import { useEC2Store } from '../../store';

export default function EC2Dashboard() {
  const instances = useEC2Store((s) => s.instances);
  const securityGroups = useEC2Store((s) => s.securityGroups);
  const keyPairs = useEC2Store((s) => s.keyPairs);
  const volumes = useEC2Store((s) => s.volumes);
  const elasticIPs = useEC2Store((s) => s.elasticIPs);

  const running = instances.filter((i) => i.State === 'running').length;
  const stopped = instances.filter((i) => i.State === 'stopped').length;

  return (
    <div>
      <h1 style={{ fontSize: '22px', marginBottom: '20px' }}>EC2 Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <DashCard title="Instances" value={instances.length} link="/ec2/instances">
          <div style={{ fontSize: '12px', color: '#545b64', marginTop: '4px' }}>
            <span style={{ color: '#1d8102' }}>{running} running</span>
            {' | '}
            <span>{stopped} stopped</span>
          </div>
        </DashCard>
        <DashCard title="Security Groups" value={securityGroups.length} link="/ec2/security-groups" />
        <DashCard title="Key Pairs" value={keyPairs.length} link="/ec2/key-pairs" />
        <DashCard title="Volumes" value={volumes.length} link="/ec2/volumes" />
        <DashCard title="Elastic IPs" value={elasticIPs.length} link="/ec2/elastic-ips" />
      </div>

      <div className="aws-panel">
        <div className="aws-panel-header">
          <h2>Resources</h2>
          <Link to="/ec2/instances/launch" className="aws-btn aws-btn-primary">
            Launch instance
          </Link>
        </div>
        <div className="aws-panel-body">
          <p style={{ color: 'var(--aws-text-secondary)' }}>
            Amazon EC2 provides scalable computing capacity. Use the navigation on the left to manage your EC2 resources.
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

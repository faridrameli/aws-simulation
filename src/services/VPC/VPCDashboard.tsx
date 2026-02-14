import { Link } from 'react-router-dom';
import { useVPCStore } from '../../store';

export default function VPCDashboard() {
  const vpcs = useVPCStore((s) => s.vpcs);
  const subnets = useVPCStore((s) => s.subnets);
  const routeTables = useVPCStore((s) => s.routeTables);
  const internetGateways = useVPCStore((s) => s.internetGateways);
  const natGateways = useVPCStore((s) => s.natGateways);

  return (
    <div>
      <h1 style={{ fontSize: '22px', marginBottom: '20px' }}>VPC Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <DashCard title="VPCs" value={vpcs.length} link="/vpc/vpcs" />
        <DashCard title="Subnets" value={subnets.length} link="/vpc/subnets" />
        <DashCard title="Route Tables" value={routeTables.length} link="/vpc/route-tables" />
        <DashCard title="Internet Gateways" value={internetGateways.length} link="/vpc/internet-gateways" />
        <DashCard title="NAT Gateways" value={natGateways.length} link="/vpc/nat-gateways" />
      </div>

      <div className="aws-panel">
        <div className="aws-panel-header">
          <h2>Resources</h2>
        </div>
        <div className="aws-panel-body">
          <p style={{ color: 'var(--aws-text-secondary)' }}>
            Amazon VPC lets you provision a logically isolated section of the AWS Cloud where you can launch AWS resources in a virtual network that you define. Use the navigation on the left to manage your VPC resources.
          </p>
        </div>
      </div>
    </div>
  );
}

function DashCard({ title, value, link }: { title: string; value: number; link: string }) {
  return (
    <Link to={link} style={{ textDecoration: 'none' }}>
      <div className="aws-panel" style={{ padding: '16px', cursor: 'pointer' }}>
        <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: '#16191f' }}>{value}</div>
      </div>
    </Link>
  );
}

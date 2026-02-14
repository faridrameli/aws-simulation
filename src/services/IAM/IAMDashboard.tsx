import { Link } from 'react-router-dom';
import { useIAMStore } from '../../store';

export default function IAMDashboard() {
  const users = useIAMStore((s) => s.users);
  const groups = useIAMStore((s) => s.groups);
  const roles = useIAMStore((s) => s.roles);
  const policies = useIAMStore((s) => s.policies);

  return (
    <div>
      <h1 style={{ fontSize: '22px', marginBottom: '20px' }}>IAM Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <DashCard title="Users" value={users.length} link="/iam/users" />
        <DashCard title="Groups" value={groups.length} link="/iam/groups" />
        <DashCard title="Roles" value={roles.length} link="/iam/roles" />
        <DashCard title="Policies" value={policies.length} link="/iam/policies" />
      </div>

      <div className="aws-panel">
        <div className="aws-panel-header">
          <h2>IAM Resources</h2>
        </div>
        <div className="aws-panel-body">
          <p style={{ color: 'var(--aws-text-secondary)' }}>
            AWS Identity and Access Management (IAM) enables you to manage access to AWS services and resources securely.
            Use the navigation on the left to manage your IAM resources.
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

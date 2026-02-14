import { useParams, useNavigate, Link } from 'react-router-dom';
import { useVPCStore } from '../../store';
import DetailPanel from '../../components/shared/DetailPanel';
import { KeyValueDisplay } from '../../components/shared/FormFields';
import StatusBadge from '../../components/shared/StatusBadge';

export default function VPCDetail() {
  const { vpcId } = useParams<{ vpcId: string }>();
  const vpc = useVPCStore((s) => s.vpcs.find((v) => v.VpcId === vpcId));
  const subnets = useVPCStore((s) => s.subnets.filter((sn) => sn.VpcId === vpcId));
  const routeTables = useVPCStore((s) => s.routeTables.filter((rt) => rt.VpcId === vpcId));
  const removeVPC = useVPCStore((s) => s.removeVPC);
  const navigate = useNavigate();

  if (!vpc) {
    return (
      <div className="aws-empty-state">
        <h3>VPC not found</h3>
        <p>The VPC {vpcId} does not exist.</p>
      </div>
    );
  }

  return (
    <DetailPanel
      title={vpc.Tags.find((t) => t.Key === 'Name')?.Value || vpc.VpcId}
      subtitle={vpc.VpcId}
      actions={
        <>
          <button
            className="aws-btn aws-btn-danger"
            onClick={() => {
              removeVPC(vpc.VpcId);
              navigate('/vpc/vpcs');
            }}
          >
            Delete VPC
          </button>
        </>
      }
      tabs={[
        {
          key: 'details',
          label: 'Details',
          content: (
            <KeyValueDisplay
              data={{
                'VPC ID': vpc.VpcId,
                'State': <StatusBadge status={vpc.State} />,
                'IPv4 CIDR': vpc.CidrBlock,
                'Default VPC': vpc.IsDefault ? 'Yes' : 'No',
                'DNS resolution': vpc.EnableDnsSupport ? 'Enabled' : 'Disabled',
                'DNS hostnames': vpc.EnableDnsHostnames ? 'Enabled' : 'Disabled',
                'DHCP options set': vpc.DhcpOptionsId,
              }}
            />
          ),
        },
        {
          key: 'subnets',
          label: 'Subnets',
          content: (
            <div>
              {subnets.length === 0 ? (
                <p style={{ color: 'var(--aws-text-secondary)' }}>No subnets in this VPC.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--aws-border)' }}>
                      <th style={thStyle}>Subnet ID</th>
                      <th style={thStyle}>CIDR block</th>
                      <th style={thStyle}>Availability Zone</th>
                      <th style={thStyle}>Available IPs</th>
                      <th style={thStyle}>State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subnets.map((sn) => (
                      <tr key={sn.SubnetId} style={{ borderBottom: '1px solid var(--aws-border)' }}>
                        <td style={tdStyle}>
                          <Link to={`/vpc/subnets`}>{sn.SubnetId}</Link>
                        </td>
                        <td style={tdStyle}>{sn.CidrBlock}</td>
                        <td style={tdStyle}>{sn.AvailabilityZone}</td>
                        <td style={tdStyle}>{sn.AvailableIpAddressCount}</td>
                        <td style={tdStyle}><StatusBadge status={sn.State} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ),
        },
        {
          key: 'route-tables',
          label: 'Route Tables',
          content: (
            <div>
              {routeTables.length === 0 ? (
                <p style={{ color: 'var(--aws-text-secondary)' }}>No route tables in this VPC.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--aws-border)' }}>
                      <th style={thStyle}>Route Table ID</th>
                      <th style={thStyle}>Routes</th>
                      <th style={thStyle}>Associations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routeTables.map((rt) => (
                      <tr key={rt.RouteTableId} style={{ borderBottom: '1px solid var(--aws-border)' }}>
                        <td style={tdStyle}>
                          <Link to={`/vpc/route-tables`}>{rt.RouteTableId}</Link>
                        </td>
                        <td style={tdStyle}>{rt.Routes.length}</td>
                        <td style={tdStyle}>{rt.Associations.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ),
        },
        {
          key: 'tags',
          label: 'Tags',
          content: (
            <div>
              {vpc.Tags.length === 0 ? (
                <p style={{ color: 'var(--aws-text-secondary)' }}>No tags</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--aws-border)' }}>
                      <th style={thStyle}>Key</th>
                      <th style={thStyle}>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vpc.Tags.map((tag, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--aws-border)' }}>
                        <td style={tdStyle}>{tag.Key}</td>
                        <td style={tdStyle}>{tag.Value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ),
        },
      ]}
    />
  );
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '8px',
  fontSize: '12px',
  color: '#545b64',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const tdStyle: React.CSSProperties = {
  padding: '8px',
  fontSize: '13px',
};

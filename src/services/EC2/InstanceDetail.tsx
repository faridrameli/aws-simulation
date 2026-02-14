import { useParams, useNavigate } from 'react-router-dom';
import { useEC2Store } from '../../store';
import DetailPanel from '../../components/shared/DetailPanel';
import { KeyValueDisplay } from '../../components/shared/FormFields';
import StatusBadge from '../../components/shared/StatusBadge';

export default function InstanceDetail() {
  const { instanceId } = useParams<{ instanceId: string }>();
  const instance = useEC2Store((s) => s.instances.find((i) => i.InstanceId === instanceId));
  const updateInstance = useEC2Store((s) => s.updateInstance);
  const removeInstance = useEC2Store((s) => s.removeInstance);
  const navigate = useNavigate();

  if (!instance) {
    return (
      <div className="aws-empty-state">
        <h3>Instance not found</h3>
        <p>The instance {instanceId} does not exist.</p>
      </div>
    );
  }

  return (
    <DetailPanel
      title={instance.Name || instance.InstanceId}
      subtitle={instance.InstanceId}
      actions={
        <>
          {instance.State === 'running' && (
            <button
              className="aws-btn aws-btn-secondary"
              onClick={() => updateInstance(instance.InstanceId, { State: 'stopped', PublicIpAddress: undefined })}
            >
              Stop instance
            </button>
          )}
          {instance.State === 'stopped' && (
            <button
              className="aws-btn aws-btn-secondary"
              onClick={() => updateInstance(instance.InstanceId, { State: 'running' })}
            >
              Start instance
            </button>
          )}
          <button
            className="aws-btn aws-btn-danger"
            onClick={() => {
              removeInstance(instance.InstanceId);
              navigate('/ec2/instances');
            }}
          >
            Terminate
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
                'Instance ID': instance.InstanceId,
                'Instance state': <StatusBadge status={instance.State} />,
                'Instance type': instance.InstanceType,
                'AMI ID': instance.ImageId,
                'Key pair name': instance.KeyName || '-',
                'Public IPv4 address': instance.PublicIpAddress || '-',
                'Private IPv4 address': instance.PrivateIpAddress,
                'VPC ID': instance.VpcId,
                'Subnet ID': instance.SubnetId,
                'Availability Zone': instance.AvailabilityZone,
                'Launch time': instance.LaunchTime,
                'Monitoring': instance.Monitoring,
                'Platform': instance.Platform || 'Linux/UNIX',
              }}
            />
          ),
        },
        {
          key: 'security',
          label: 'Security',
          content: (
            <div>
              <h3 style={{ marginBottom: '12px' }}>Security groups</h3>
              {instance.SecurityGroups.map((sg) => (
                <div key={sg} className="aws-tag" style={{ marginRight: '4px' }}>
                  {sg}
                </div>
              ))}
            </div>
          ),
        },
        {
          key: 'tags',
          label: 'Tags',
          content: (
            <div>
              {instance.Tags.length === 0 ? (
                <p style={{ color: 'var(--aws-text-secondary)' }}>No tags</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--aws-border)' }}>
                      <th style={{ textAlign: 'left', padding: '8px', fontSize: '12px', color: '#545b64' }}>Key</th>
                      <th style={{ textAlign: 'left', padding: '8px', fontSize: '12px', color: '#545b64' }}>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instance.Tags.map((tag, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--aws-border)' }}>
                        <td style={{ padding: '8px', fontSize: '13px' }}>{tag.Key}</td>
                        <td style={{ padding: '8px', fontSize: '13px' }}>{tag.Value}</td>
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

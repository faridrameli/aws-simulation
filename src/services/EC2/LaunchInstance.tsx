import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEC2Store, useGlobalStore } from '../../store';
import { TextField, SelectField, TagEditor, NumberField, CheckboxField } from '../../components/shared/FormFields';
import { EC2_INSTANCE_TYPES, EC2_AMIS } from '../../utils/constants';
import { generateInstanceId, generatePrivateIp, generatePublicIp } from '../../utils/idGenerator';
import type { Tag } from '../../types/aws';

export default function LaunchInstance() {
  const addInstance = useEC2Store((s) => s.addInstance);
  const securityGroups = useEC2Store((s) => s.securityGroups);
  const keyPairs = useEC2Store((s) => s.keyPairs);
  const region = useGlobalStore((s) => s.region);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [instanceType, setInstanceType] = useState('t2.micro');
  const [imageId, setImageId] = useState(EC2_AMIS[0].id);
  const [keyName, setKeyName] = useState('');
  const [selectedSGs, setSelectedSGs] = useState<string[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [numInstances, setNumInstances] = useState(1);
  const [enableMonitoring, setEnableMonitoring] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const az = `${region}a`;
    const ami = EC2_AMIS.find((a) => a.id === imageId);

    for (let i = 0; i < numInstances; i++) {
      const instanceName = numInstances > 1 ? `${name}-${i + 1}` : name;
      addInstance({
        InstanceId: generateInstanceId(),
        Name: instanceName,
        InstanceType: instanceType,
        State: 'running',
        ImageId: imageId,
        KeyName: keyName,
        SecurityGroups: selectedSGs.length > 0 ? selectedSGs : ['default'],
        SubnetId: `subnet-sim${Math.random().toString(36).substring(2, 10)}`,
        VpcId: `vpc-sim${Math.random().toString(36).substring(2, 10)}`,
        PublicIpAddress: generatePublicIp(),
        PrivateIpAddress: generatePrivateIp(),
        LaunchTime: new Date().toISOString(),
        AvailabilityZone: az,
        Tags: [{ Key: 'Name', Value: instanceName }, ...tags],
        Platform: ami?.platform === 'Windows' ? 'Windows' : undefined,
        Monitoring: enableMonitoring ? 'enabled' : 'disabled',
      });
    }

    navigate('/ec2/instances');
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', marginBottom: '20px' }}>Launch an instance</h1>

      <form onSubmit={handleSubmit} data-mission="ec2-launch-form">
        <div className="aws-panel">
          <div className="aws-panel-header"><h2>Name and tags</h2></div>
          <div className="aws-panel-body">
            <TextField
              label="Name"
              value={name}
              onChange={setName}
              placeholder="Enter a name for your instance"
              required
            />
            <TagEditor tags={tags} onChange={setTags} />
          </div>
        </div>

        <div className="aws-panel">
          <div className="aws-panel-header"><h2>Application and OS Images (Amazon Machine Image)</h2></div>
          <div className="aws-panel-body">
            <SelectField
              label="AMI"
              value={imageId}
              onChange={setImageId}
              required
              options={EC2_AMIS.map((ami) => ({
                value: ami.id,
                label: `${ami.name} (${ami.id})`,
              }))}
            />
          </div>
        </div>

        <div className="aws-panel">
          <div className="aws-panel-header"><h2>Instance type</h2></div>
          <div className="aws-panel-body">
            <SelectField
              label="Instance type"
              value={instanceType}
              onChange={setInstanceType}
              required
              options={EC2_INSTANCE_TYPES.map((t) => ({ value: t, label: t }))}
              hint="t2.micro is eligible for the free tier"
            />
          </div>
        </div>

        <div className="aws-panel">
          <div className="aws-panel-header"><h2>Key pair (login)</h2></div>
          <div className="aws-panel-body">
            <SelectField
              label="Key pair name"
              value={keyName}
              onChange={setKeyName}
              options={keyPairs.map((kp) => ({ value: kp.KeyName, label: kp.KeyName }))}
              hint="Select a key pair for SSH access"
            />
          </div>
        </div>

        <div className="aws-panel">
          <div className="aws-panel-header"><h2>Network settings</h2></div>
          <div className="aws-panel-body">
            <div className="aws-form-group">
              <label className="aws-form-label">Security groups</label>
              {securityGroups.length === 0 ? (
                <p style={{ color: 'var(--aws-text-secondary)', fontSize: '13px' }}>
                  No security groups available. A default security group will be used.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {securityGroups.map((sg) => (
                    <label key={sg.GroupId} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                      <input
                        type="checkbox"
                        checked={selectedSGs.includes(sg.GroupId)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedSGs([...selectedSGs, sg.GroupId]);
                          else setSelectedSGs(selectedSGs.filter((s) => s !== sg.GroupId));
                        }}
                      />
                      {sg.GroupName} ({sg.GroupId})
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="aws-panel">
          <div className="aws-panel-header"><h2>Advanced details</h2></div>
          <div className="aws-panel-body">
            <NumberField
              label="Number of instances"
              value={numInstances}
              onChange={setNumInstances}
              min={1}
              max={20}
            />
            <CheckboxField
              label="Enable detailed monitoring"
              checked={enableMonitoring}
              onChange={setEnableMonitoring}
              hint="Detailed monitoring provides 1-minute intervals (additional charges apply in real AWS)"
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
          <button type="button" className="aws-btn aws-btn-secondary" onClick={() => navigate('/ec2/instances')}>
            Cancel
          </button>
          <button type="submit" className="aws-btn aws-btn-primary" disabled={!name}>
            Launch instance
          </button>
        </div>
      </form>
    </div>
  );
}

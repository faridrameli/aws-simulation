import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useEC2Store } from '../../store';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import StatusBadge from '../../components/shared/StatusBadge';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import type { EC2Instance } from '../../types/aws';

export default function Instances() {
  const instances = useEC2Store((s) => s.instances);
  const updateInstance = useEC2Store((s) => s.updateInstance);
  const removeInstance = useEC2Store((s) => s.removeInstance);
  const navigate = useNavigate();
  const [selected, setSelected] = useState<EC2Instance[]>([]);
  const [showTerminate, setShowTerminate] = useState(false);

  const columns: Column<EC2Instance>[] = [
    {
      key: 'Name',
      header: 'Name',
      render: (item) => (
        <Link to={`/ec2/instances/${item.InstanceId}`} onClick={(e) => e.stopPropagation()}>
          {item.Name || '-'}
        </Link>
      ),
    },
    { key: 'InstanceId', header: 'Instance ID' },
    {
      key: 'State',
      header: 'Instance state',
      render: (item) => <StatusBadge status={item.State} />,
    },
    { key: 'InstanceType', header: 'Instance type' },
    { key: 'AvailabilityZone', header: 'Availability Zone' },
    { key: 'PublicIpAddress', header: 'Public IPv4' },
    { key: 'PrivateIpAddress', header: 'Private IPv4' },
  ];

  function handleStop() {
    selected.forEach((i) => {
      if (i.State === 'running') updateInstance(i.InstanceId, { State: 'stopped', PublicIpAddress: undefined });
    });
    setSelected([]);
  }

  function handleStart() {
    selected.forEach((i) => {
      if (i.State === 'stopped') updateInstance(i.InstanceId, { State: 'running' });
    });
    setSelected([]);
  }

  function handleTerminate() {
    selected.forEach((i) => removeInstance(i.InstanceId));
    setSelected([]);
    setShowTerminate(false);
  }

  return (
    <div>
      <ResourceTable
        columns={columns}
        data={instances as unknown as Record<string, unknown>[]}
        keyField="InstanceId"
        title="Instances"
        onRowClick={(item) => navigate(`/ec2/instances/${(item as unknown as EC2Instance).InstanceId}`)}
        onSelectionChange={(items) => setSelected(items as unknown as EC2Instance[])}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="aws-btn aws-btn-secondary aws-btn-sm"
              disabled={!selected.some((i) => i.State === 'stopped')}
              onClick={handleStart}
            >
              Start
            </button>
            <button
              className="aws-btn aws-btn-secondary aws-btn-sm"
              disabled={!selected.some((i) => i.State === 'running')}
              onClick={handleStop}
            >
              Stop
            </button>
            <button
              className="aws-btn aws-btn-danger aws-btn-sm"
              disabled={selected.length === 0}
              onClick={() => setShowTerminate(true)}
            >
              Terminate
            </button>
            <Link to="/ec2/instances/launch" className="aws-btn aws-btn-primary aws-btn-sm">
              Launch instance
            </Link>
          </div>
        }
      />

      <ConfirmDialog
        isOpen={showTerminate}
        title="Terminate instances"
        message={`Are you sure you want to terminate ${selected.length} instance(s)? This action cannot be undone.`}
        confirmLabel="Terminate"
        onConfirm={handleTerminate}
        onCancel={() => setShowTerminate(false)}
        danger
      />
    </div>
  );
}

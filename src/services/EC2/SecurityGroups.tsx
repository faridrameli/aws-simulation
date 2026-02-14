import { useState } from 'react';
import { useEC2Store } from '../../store';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import CreateResourceModal from '../../components/shared/CreateResourceModal';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { TextField, TextAreaField } from '../../components/shared/FormFields';
import { generateSecurityGroupId } from '../../utils/idGenerator';
import type { SecurityGroup } from '../../types/aws';

export default function SecurityGroups() {
  const securityGroups = useEC2Store((s) => s.securityGroups);
  const addSecurityGroup = useEC2Store((s) => s.addSecurityGroup);
  const removeSecurityGroup = useEC2Store((s) => s.removeSecurityGroup);
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<SecurityGroup[]>([]);
  const [showDelete, setShowDelete] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const columns: Column<SecurityGroup>[] = [
    { key: 'GroupName', header: 'Security group name' },
    { key: 'GroupId', header: 'Security group ID' },
    { key: 'Description', header: 'Description' },
    { key: 'VpcId', header: 'VPC ID' },
    {
      key: 'InboundRules',
      header: 'Inbound rules',
      render: (item) => <span>{item.InboundRules.length} rules</span>,
    },
  ];

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    addSecurityGroup({
      GroupId: generateSecurityGroupId(),
      GroupName: name,
      Description: description,
      VpcId: 'vpc-default',
      InboundRules: [],
      OutboundRules: [{ Protocol: '-1', PortRange: 'All', Source: '0.0.0.0/0', Description: 'Allow all outbound' }],
      Tags: [{ Key: 'Name', Value: name }],
    });
    setShowCreate(false);
    setName('');
    setDescription('');
  }

  return (
    <div>
      <ResourceTable
        columns={columns}
        data={securityGroups as unknown as Record<string, unknown>[]}
        keyField="GroupId"
        title="Security Groups"
        onSelectionChange={(items) => setSelected(items as unknown as SecurityGroup[])}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="aws-btn aws-btn-danger aws-btn-sm"
              disabled={selected.length === 0}
              onClick={() => setShowDelete(true)}
            >
              Delete
            </button>
            <button className="aws-btn aws-btn-primary aws-btn-sm" onClick={() => setShowCreate(true)}>
              Create security group
            </button>
          </div>
        }
      />

      <CreateResourceModal
        title="Create security group"
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        isValid={!!name}
      >
        <TextField label="Security group name" value={name} onChange={setName} required placeholder="my-security-group" />
        <TextAreaField label="Description" value={description} onChange={setDescription} placeholder="Description" rows={3} />
      </CreateResourceModal>

      <ConfirmDialog
        isOpen={showDelete}
        title="Delete security groups"
        message={`Delete ${selected.length} security group(s)?`}
        confirmLabel="Delete"
        onConfirm={() => {
          selected.forEach((sg) => removeSecurityGroup(sg.GroupId));
          setSelected([]);
          setShowDelete(false);
        }}
        onCancel={() => setShowDelete(false)}
        danger
      />
    </div>
  );
}

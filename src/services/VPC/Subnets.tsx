import { useState } from 'react';
import { useVPCStore, useGlobalStore } from '../../store';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import StatusBadge from '../../components/shared/StatusBadge';
import CreateResourceModal from '../../components/shared/CreateResourceModal';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { TextField, SelectField, CheckboxField } from '../../components/shared/FormFields';
import { generateSubnetId } from '../../utils/idGenerator';
import type { Subnet } from '../../types/aws';

export default function Subnets() {
  const subnets = useVPCStore((s) => s.subnets);
  const vpcs = useVPCStore((s) => s.vpcs);
  const addSubnet = useVPCStore((s) => s.addSubnet);
  const removeSubnet = useVPCStore((s) => s.removeSubnet);
  const region = useGlobalStore((s) => s.region);

  const [selected, setSelected] = useState<Subnet[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Create form state
  const [vpcId, setVpcId] = useState('');
  const [cidrBlock, setCidrBlock] = useState('');
  const [az, setAz] = useState('');
  const [autoAssignPublicIp, setAutoAssignPublicIp] = useState(false);

  const azOptions = ['a', 'b', 'c'].map((suffix) => ({
    value: `${region}${suffix}`,
    label: `${region}${suffix}`,
  }));

  const vpcOptions = vpcs.map((v) => ({
    value: v.VpcId,
    label: `${v.VpcId} (${v.CidrBlock})`,
  }));

  const columns: Column<Subnet>[] = [
    { key: 'SubnetId', header: 'Subnet ID' },
    { key: 'VpcId', header: 'VPC ID' },
    { key: 'CidrBlock', header: 'IPv4 CIDR' },
    { key: 'AvailabilityZone', header: 'Availability Zone' },
    { key: 'AvailableIpAddressCount', header: 'Available IPs' },
    {
      key: 'MapPublicIpOnLaunch',
      header: 'Auto-assign public IP',
      render: (item) => (item.MapPublicIpOnLaunch ? 'Yes' : 'No'),
    },
    {
      key: 'State',
      header: 'State',
      render: (item) => <StatusBadge status={item.State} />,
    },
  ];

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const newSubnet: Subnet = {
      SubnetId: generateSubnetId(),
      VpcId: vpcId,
      CidrBlock: cidrBlock,
      AvailabilityZone: az,
      AvailableIpAddressCount: 251,
      MapPublicIpOnLaunch: autoAssignPublicIp,
      State: 'available',
      Tags: [],
    };
    addSubnet(newSubnet);
    setShowCreate(false);
    resetForm();
  }

  function handleDelete() {
    selected.forEach((s) => removeSubnet(s.SubnetId));
    setSelected([]);
    setShowDelete(false);
  }

  function resetForm() {
    setVpcId('');
    setCidrBlock('');
    setAz('');
    setAutoAssignPublicIp(false);
  }

  return (
    <div>
      <ResourceTable
        columns={columns}
        data={subnets as unknown as Record<string, unknown>[]}
        keyField="SubnetId"
        title="Subnets"
        onSelectionChange={(items) => setSelected(items as unknown as Subnet[])}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="aws-btn aws-btn-danger aws-btn-sm"
              disabled={selected.length === 0}
              onClick={() => setShowDelete(true)}
            >
              Delete
            </button>
            <button
              className="aws-btn aws-btn-primary aws-btn-sm"
              onClick={() => setShowCreate(true)}
            >
              Create subnet
            </button>
          </div>
        }
      />

      <CreateResourceModal
        title="Create subnet"
        isOpen={showCreate}
        onClose={() => { setShowCreate(false); resetForm(); }}
        onSubmit={handleCreate}
        isValid={vpcId.length > 0 && cidrBlock.trim().length > 0 && az.length > 0}
      >
        <SelectField
          label="VPC"
          value={vpcId}
          onChange={setVpcId}
          options={vpcOptions}
          required
          hint="Select the VPC for this subnet"
        />
        <TextField
          label="IPv4 CIDR block"
          value={cidrBlock}
          onChange={setCidrBlock}
          placeholder="10.0.1.0/24"
          required
          hint="The IPv4 CIDR block for the subnet"
        />
        <SelectField
          label="Availability Zone"
          value={az}
          onChange={setAz}
          options={azOptions}
          required
          hint="The Availability Zone for this subnet"
        />
        <CheckboxField
          label="Auto-assign public IPv4 address"
          checked={autoAssignPublicIp}
          onChange={setAutoAssignPublicIp}
          hint="Automatically assign a public IPv4 address to instances launched in this subnet"
        />
      </CreateResourceModal>

      <ConfirmDialog
        isOpen={showDelete}
        title="Delete subnet"
        message={`Are you sure you want to delete ${selected.length} subnet(s)? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        danger
      />
    </div>
  );
}

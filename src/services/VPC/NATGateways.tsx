import { useState } from 'react';
import { useVPCStore } from '../../store';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import StatusBadge from '../../components/shared/StatusBadge';
import CreateResourceModal from '../../components/shared/CreateResourceModal';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { SelectField } from '../../components/shared/FormFields';
import { generateNatGatewayId, generatePublicIp } from '../../utils/idGenerator';
import type { NATGateway } from '../../types/aws';

export default function NATGateways() {
  const natGateways = useVPCStore((s) => s.natGateways);
  const subnets = useVPCStore((s) => s.subnets);
  const addNATGateway = useVPCStore((s) => s.addNATGateway);
  const removeNATGateway = useVPCStore((s) => s.removeNATGateway);

  const [selected, setSelected] = useState<NATGateway[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Create form state
  const [subnetId, setSubnetId] = useState('');

  const subnetOptions = subnets.map((s) => ({
    value: s.SubnetId,
    label: `${s.SubnetId} (${s.CidrBlock} | ${s.AvailabilityZone})`,
  }));

  const columns: Column<NATGateway>[] = [
    { key: 'NatGatewayId', header: 'NAT Gateway ID' },
    {
      key: 'State',
      header: 'State',
      render: (item) => <StatusBadge status={item.State} />,
    },
    { key: 'SubnetId', header: 'Subnet ID' },
    { key: 'ElasticIpAddress', header: 'Elastic IP address' },
    { key: 'CreateTime', header: 'Created' },
  ];

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const subnet = subnets.find((s) => s.SubnetId === subnetId);
    const newNat: NATGateway = {
      NatGatewayId: generateNatGatewayId(),
      SubnetId: subnetId,
      VpcId: subnet?.VpcId || '',
      State: 'available',
      ElasticIpAddress: generatePublicIp(),
      Tags: [],
      CreateTime: new Date().toISOString(),
    };
    addNATGateway(newNat);
    setShowCreate(false);
    setSubnetId('');
  }

  function handleDelete() {
    selected.forEach((nat) => removeNATGateway(nat.NatGatewayId));
    setSelected([]);
    setShowDelete(false);
  }

  return (
    <div>
      <ResourceTable
        columns={columns}
        data={natGateways as unknown as Record<string, unknown>[]}
        keyField="NatGatewayId"
        title="NAT Gateways"
        onSelectionChange={(items) => setSelected(items as unknown as NATGateway[])}
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
              Create NAT gateway
            </button>
          </div>
        }
      />

      <CreateResourceModal
        title="Create NAT gateway"
        isOpen={showCreate}
        onClose={() => { setShowCreate(false); setSubnetId(''); }}
        onSubmit={handleCreate}
        isValid={subnetId.length > 0}
      >
        <SelectField
          label="Subnet"
          value={subnetId}
          onChange={setSubnetId}
          options={subnetOptions}
          required
          hint="Select the subnet for this NAT gateway. An Elastic IP will be automatically allocated."
        />
      </CreateResourceModal>

      <ConfirmDialog
        isOpen={showDelete}
        title="Delete NAT gateway"
        message={`Are you sure you want to delete ${selected.length} NAT gateway(s)? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        danger
      />
    </div>
  );
}

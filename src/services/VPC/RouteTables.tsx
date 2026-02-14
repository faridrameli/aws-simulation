import { useState } from 'react';
import { useVPCStore } from '../../store';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import CreateResourceModal from '../../components/shared/CreateResourceModal';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { SelectField } from '../../components/shared/FormFields';
import { generateRouteTableId } from '../../utils/idGenerator';
import type { RouteTable } from '../../types/aws';

export default function RouteTables() {
  const routeTables = useVPCStore((s) => s.routeTables);
  const vpcs = useVPCStore((s) => s.vpcs);
  const addRouteTable = useVPCStore((s) => s.addRouteTable);
  const removeRouteTable = useVPCStore((s) => s.removeRouteTable);

  const [selected, setSelected] = useState<RouteTable[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Create form state
  const [vpcId, setVpcId] = useState('');

  const vpcOptions = vpcs.map((v) => ({
    value: v.VpcId,
    label: `${v.VpcId} (${v.CidrBlock})`,
  }));

  const columns: Column<RouteTable>[] = [
    { key: 'RouteTableId', header: 'Route Table ID' },
    { key: 'VpcId', header: 'VPC ID' },
    {
      key: 'Routes',
      header: 'Routes',
      render: (item) => String(item.Routes.length),
    },
    {
      key: 'Associations',
      header: 'Associations',
      render: (item) => String(item.Associations.length),
    },
  ];

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const selectedVpc = vpcs.find((v) => v.VpcId === vpcId);
    const newRouteTable: RouteTable = {
      RouteTableId: generateRouteTableId(),
      VpcId: vpcId,
      Routes: [
        {
          DestinationCidrBlock: selectedVpc?.CidrBlock || '10.0.0.0/16',
          GatewayId: 'local',
          State: 'active',
        },
      ],
      Associations: [],
      Tags: [],
    };
    addRouteTable(newRouteTable);
    setShowCreate(false);
    setVpcId('');
  }

  function handleDelete() {
    selected.forEach((rt) => removeRouteTable(rt.RouteTableId));
    setSelected([]);
    setShowDelete(false);
  }

  return (
    <div>
      <ResourceTable
        columns={columns}
        data={routeTables as unknown as Record<string, unknown>[]}
        keyField="RouteTableId"
        title="Route Tables"
        onSelectionChange={(items) => setSelected(items as unknown as RouteTable[])}
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
              Create route table
            </button>
          </div>
        }
      />

      <CreateResourceModal
        title="Create route table"
        isOpen={showCreate}
        onClose={() => { setShowCreate(false); setVpcId(''); }}
        onSubmit={handleCreate}
        isValid={vpcId.length > 0}
      >
        <SelectField
          label="VPC"
          value={vpcId}
          onChange={setVpcId}
          options={vpcOptions}
          required
          hint="Select the VPC for this route table"
        />
      </CreateResourceModal>

      <ConfirmDialog
        isOpen={showDelete}
        title="Delete route table"
        message={`Are you sure you want to delete ${selected.length} route table(s)? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        danger
      />
    </div>
  );
}

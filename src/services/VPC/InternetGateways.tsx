import { useState } from 'react';
import { useVPCStore } from '../../store';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import StatusBadge from '../../components/shared/StatusBadge';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import CreateResourceModal from '../../components/shared/CreateResourceModal';
import { SelectField } from '../../components/shared/FormFields';
import { generateInternetGatewayId } from '../../utils/idGenerator';
import type { InternetGateway } from '../../types/aws';

export default function InternetGateways() {
  const internetGateways = useVPCStore((s) => s.internetGateways);
  const vpcs = useVPCStore((s) => s.vpcs);
  const addInternetGateway = useVPCStore((s) => s.addInternetGateway);
  const removeInternetGateway = useVPCStore((s) => s.removeInternetGateway);

  const [selected, setSelected] = useState<InternetGateway[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showAttach, setShowAttach] = useState(false);

  // Attach form state
  const [attachVpcId, setAttachVpcId] = useState('');

  const vpcOptions = vpcs.map((v) => ({
    value: v.VpcId,
    label: `${v.VpcId} (${v.CidrBlock})`,
  }));

  const columns: Column<InternetGateway>[] = [
    { key: 'InternetGatewayId', header: 'Internet Gateway ID' },
    {
      key: 'State',
      header: 'State',
      render: (item) => {
        if (item.Attachments.length === 0) return <StatusBadge status="detached" />;
        return <StatusBadge status={item.Attachments[0].State} />;
      },
    },
    {
      key: 'VpcId',
      header: 'VPC ID',
      render: (item) => {
        if (item.Attachments.length === 0) return '-';
        return item.Attachments[0].VpcId;
      },
    },
  ];

  function handleCreate() {
    const newIgw: InternetGateway = {
      InternetGatewayId: generateInternetGatewayId(),
      Attachments: [],
      Tags: [],
    };
    addInternetGateway(newIgw);
  }

  function handleAttach(e: React.FormEvent) {
    e.preventDefault();
    if (selected.length === 1 && attachVpcId) {
      const igw = selected[0];
      const updated: InternetGateway = {
        ...igw,
        Attachments: [{ VpcId: attachVpcId, State: 'attached' }],
      };
      removeInternetGateway(igw.InternetGatewayId);
      addInternetGateway(updated);
      setSelected([]);
      setShowAttach(false);
      setAttachVpcId('');
    }
  }

  function handleDelete() {
    selected.forEach((igw) => removeInternetGateway(igw.InternetGatewayId));
    setSelected([]);
    setShowDelete(false);
  }

  return (
    <div>
      <ResourceTable
        columns={columns}
        data={internetGateways as unknown as Record<string, unknown>[]}
        keyField="InternetGatewayId"
        title="Internet Gateways"
        onSelectionChange={(items) => setSelected(items as unknown as InternetGateway[])}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="aws-btn aws-btn-secondary aws-btn-sm"
              disabled={selected.length !== 1 || selected[0].Attachments.length > 0}
              onClick={() => setShowAttach(true)}
            >
              Attach to VPC
            </button>
            <button
              className="aws-btn aws-btn-danger aws-btn-sm"
              disabled={selected.length === 0}
              onClick={() => setShowDelete(true)}
            >
              Delete
            </button>
            <button
              className="aws-btn aws-btn-primary aws-btn-sm"
              onClick={handleCreate}
            >
              Create internet gateway
            </button>
          </div>
        }
      />

      <CreateResourceModal
        title="Attach to VPC"
        isOpen={showAttach}
        onClose={() => { setShowAttach(false); setAttachVpcId(''); }}
        onSubmit={handleAttach}
        submitLabel="Attach"
        isValid={attachVpcId.length > 0}
      >
        <SelectField
          label="VPC"
          value={attachVpcId}
          onChange={setAttachVpcId}
          options={vpcOptions}
          required
          hint="Select a VPC to attach this internet gateway to"
        />
      </CreateResourceModal>

      <ConfirmDialog
        isOpen={showDelete}
        title="Delete internet gateway"
        message={`Are you sure you want to delete ${selected.length} internet gateway(s)? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        danger
      />
    </div>
  );
}

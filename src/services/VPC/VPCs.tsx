import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useVPCStore } from '../../store';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import StatusBadge from '../../components/shared/StatusBadge';
import CreateResourceModal from '../../components/shared/CreateResourceModal';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { TextField, CheckboxField, TagEditor } from '../../components/shared/FormFields';
import { generateVpcId } from '../../utils/idGenerator';
import type { VPC, Tag } from '../../types/aws';

export default function VPCs() {
  const vpcs = useVPCStore((s) => s.vpcs);
  const addVPC = useVPCStore((s) => s.addVPC);
  const removeVPC = useVPCStore((s) => s.removeVPC);
  const navigate = useNavigate();

  const [selected, setSelected] = useState<VPC[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Create form state
  const [cidrBlock, setCidrBlock] = useState('10.0.0.0/16');
  const [dnsSupport, setDnsSupport] = useState(true);
  const [dnsHostnames, setDnsHostnames] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);

  const columns: Column<VPC>[] = [
    {
      key: 'VpcId',
      header: 'VPC ID',
      render: (item) => (
        <Link to={`/vpc/vpcs/${item.VpcId}`} onClick={(e) => e.stopPropagation()}>
          {item.VpcId}
        </Link>
      ),
    },
    { key: 'CidrBlock', header: 'IPv4 CIDR' },
    {
      key: 'State',
      header: 'State',
      render: (item) => <StatusBadge status={item.State} />,
    },
    {
      key: 'IsDefault',
      header: 'Default VPC',
      render: (item) => (item.IsDefault ? 'Yes' : 'No'),
    },
    {
      key: 'Name',
      header: 'Name',
      render: (item) => {
        const nameTag = item.Tags.find((t) => t.Key === 'Name');
        return nameTag ? nameTag.Value : '-';
      },
    },
  ];

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const newVpc: VPC = {
      VpcId: generateVpcId(),
      CidrBlock: cidrBlock,
      State: 'available',
      IsDefault: false,
      DhcpOptionsId: 'dopt-default',
      Tags: tags,
      EnableDnsSupport: dnsSupport,
      EnableDnsHostnames: dnsHostnames,
    };
    addVPC(newVpc);
    setShowCreate(false);
    resetForm();
  }

  function handleDelete() {
    selected.forEach((v) => removeVPC(v.VpcId));
    setSelected([]);
    setShowDelete(false);
  }

  function resetForm() {
    setCidrBlock('10.0.0.0/16');
    setDnsSupport(true);
    setDnsHostnames(false);
    setTags([]);
  }

  return (
    <div>
      <ResourceTable
        columns={columns}
        data={vpcs as unknown as Record<string, unknown>[]}
        keyField="VpcId"
        title="Your VPCs"
        onRowClick={(item) => navigate(`/vpc/vpcs/${(item as unknown as VPC).VpcId}`)}
        onSelectionChange={(items) => setSelected(items as unknown as VPC[])}
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
              Create VPC
            </button>
          </div>
        }
      />

      <CreateResourceModal
        title="Create VPC"
        isOpen={showCreate}
        onClose={() => { setShowCreate(false); resetForm(); }}
        onSubmit={handleCreate}
        isValid={cidrBlock.trim().length > 0}
      >
        <TextField
          label="IPv4 CIDR block"
          value={cidrBlock}
          onChange={setCidrBlock}
          placeholder="10.0.0.0/16"
          required
          hint="The IPv4 network range for the VPC, in CIDR notation (e.g. 10.0.0.0/16)"
        />
        <CheckboxField
          label="Enable DNS resolution"
          checked={dnsSupport}
          onChange={setDnsSupport}
          hint="Instances in this VPC can use the Amazon-provided DNS server"
        />
        <CheckboxField
          label="Enable DNS hostnames"
          checked={dnsHostnames}
          onChange={setDnsHostnames}
          hint="Instances in this VPC receive public DNS hostnames"
        />
        <TagEditor tags={tags} onChange={setTags} />
      </CreateResourceModal>

      <ConfirmDialog
        isOpen={showDelete}
        title="Delete VPC"
        message={`Are you sure you want to delete ${selected.length} VPC(s)? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        danger
      />
    </div>
  );
}

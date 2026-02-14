import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useIAMStore } from '../../store';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import CreateResourceModal from '../../components/shared/CreateResourceModal';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { TextField, TextAreaField } from '../../components/shared/FormFields';
import { generateRoleId } from '../../utils/idGenerator';
import { generateIAMArn } from '../../utils/arnGenerator';
import type { IAMRole } from '../../types/aws';

const DEFAULT_ASSUME_ROLE_POLICY = JSON.stringify(
  {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: { Service: 'ec2.amazonaws.com' },
        Action: 'sts:AssumeRole',
      },
    ],
  },
  null,
  2
);

export default function Roles() {
  const roles = useIAMStore((s) => s.roles);
  const addRole = useIAMStore((s) => s.addRole);
  const removeRole = useIAMStore((s) => s.removeRole);
  const navigate = useNavigate();
  const [selected, setSelected] = useState<IAMRole[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [path, setPath] = useState('/');
  const [assumeRolePolicy, setAssumeRolePolicy] = useState(DEFAULT_ASSUME_ROLE_POLICY);

  const columns: Column<IAMRole>[] = [
    {
      key: 'RoleName',
      header: 'Role name',
      render: (item) => (
        <Link to={`/iam/roles/${item.RoleName}`} onClick={(e) => e.stopPropagation()}>
          {item.RoleName}
        </Link>
      ),
    },
    { key: 'RoleId', header: 'Role ID' },
    { key: 'Arn', header: 'ARN' },
    { key: 'Description', header: 'Description' },
    { key: 'CreateDate', header: 'Creation time' },
  ];

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const newRole: IAMRole = {
      RoleName: roleName,
      RoleId: generateRoleId(),
      Arn: generateIAMArn('role', roleName, path),
      CreateDate: new Date().toISOString(),
      Description: description,
      AssumeRolePolicyDocument: assumeRolePolicy,
      Policies: [],
      MaxSessionDuration: 3600,
      Tags: [],
      Path: path,
    };
    addRole(newRole);
    setShowCreate(false);
    setRoleName('');
    setDescription('');
    setPath('/');
    setAssumeRolePolicy(DEFAULT_ASSUME_ROLE_POLICY);
  }

  function handleDelete() {
    selected.forEach((r) => removeRole(r.RoleName));
    setSelected([]);
    setShowDelete(false);
  }

  return (
    <div>
      <ResourceTable
        columns={columns}
        data={roles as unknown as Record<string, unknown>[]}
        keyField="RoleName"
        title="Roles"
        onRowClick={(item) => navigate(`/iam/roles/${(item as unknown as IAMRole).RoleName}`)}
        onSelectionChange={(items) => setSelected(items as unknown as IAMRole[])}
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
              Create role
            </button>
          </div>
        }
      />

      <CreateResourceModal
        title="Create role"
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        isValid={!!roleName.trim()}
      >
        <TextField label="Role name" value={roleName} onChange={setRoleName} required placeholder="my-role" />
        <TextField label="Description" value={description} onChange={setDescription} placeholder="A description for this role" />
        <TextField label="Path" value={path} onChange={setPath} placeholder="/" hint="The path for the role. Defaults to '/'" />
        <TextAreaField
          label="Assume role policy document"
          value={assumeRolePolicy}
          onChange={setAssumeRolePolicy}
          rows={8}
          hint="The trust policy that grants an entity permission to assume the role (JSON)"
        />
      </CreateResourceModal>

      <ConfirmDialog
        isOpen={showDelete}
        title="Delete roles"
        message={`Are you sure you want to delete ${selected.length} role(s)? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        danger
      />
    </div>
  );
}

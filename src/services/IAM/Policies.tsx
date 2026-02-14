import { useState } from 'react';
import { useIAMStore } from '../../store';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import CreateResourceModal from '../../components/shared/CreateResourceModal';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { TextField, TextAreaField } from '../../components/shared/FormFields';
import { generatePolicyId } from '../../utils/idGenerator';
import { generateIAMArn } from '../../utils/arnGenerator';
import type { IAMPolicy } from '../../types/aws';

const DEFAULT_POLICY_DOCUMENT = JSON.stringify(
  {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: '*',
        Resource: '*',
      },
    ],
  },
  null,
  2
);

export default function Policies() {
  const policies = useIAMStore((s) => s.policies);
  const addPolicy = useIAMStore((s) => s.addPolicy);
  const removePolicy = useIAMStore((s) => s.removePolicy);
  const [selected, setSelected] = useState<IAMPolicy[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [policyName, setPolicyName] = useState('');
  const [description, setDescription] = useState('');
  const [policyDocument, setPolicyDocument] = useState(DEFAULT_POLICY_DOCUMENT);

  const columns: Column<IAMPolicy>[] = [
    { key: 'PolicyName', header: 'Policy name' },
    { key: 'PolicyId', header: 'Policy ID' },
    { key: 'Arn', header: 'ARN' },
    { key: 'Description', header: 'Description' },
    {
      key: 'IsAWSManaged',
      header: 'Type',
      render: (item) => <span>{item.IsAWSManaged ? 'AWS managed' : 'Customer managed'}</span>,
    },
  ];

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const newPolicy: IAMPolicy = {
      PolicyName: policyName,
      PolicyId: generatePolicyId(),
      Arn: generateIAMArn('policy', policyName),
      CreateDate: new Date().toISOString(),
      Description: description,
      IsAWSManaged: false,
      AttachedEntities: 0,
      PolicyDocument: policyDocument,
      Path: '/',
    };
    addPolicy(newPolicy);
    setShowCreate(false);
    setPolicyName('');
    setDescription('');
    setPolicyDocument(DEFAULT_POLICY_DOCUMENT);
  }

  function handleDelete() {
    selected.forEach((p) => removePolicy(p.PolicyId));
    setSelected([]);
    setShowDelete(false);
  }

  return (
    <div>
      <ResourceTable
        columns={columns}
        data={policies as unknown as Record<string, unknown>[]}
        keyField="PolicyId"
        title="Policies"
        onSelectionChange={(items) => setSelected(items as unknown as IAMPolicy[])}
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
              Create policy
            </button>
          </div>
        }
      />

      <CreateResourceModal
        title="Create policy"
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        isValid={!!policyName.trim()}
      >
        <TextField label="Policy name" value={policyName} onChange={setPolicyName} required placeholder="my-policy" />
        <TextField label="Description" value={description} onChange={setDescription} placeholder="A description for this policy" />
        <TextAreaField
          label="Policy document"
          value={policyDocument}
          onChange={setPolicyDocument}
          rows={10}
          hint="The JSON policy document that defines permissions"
        />
      </CreateResourceModal>

      <ConfirmDialog
        isOpen={showDelete}
        title="Delete policies"
        message={`Are you sure you want to delete ${selected.length} policy/policies? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        danger
      />
    </div>
  );
}

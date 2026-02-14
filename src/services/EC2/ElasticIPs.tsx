import { useState } from 'react';
import { useEC2Store } from '../../store';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { generateAllocationId, generatePublicIp } from '../../utils/idGenerator';
import type { ElasticIP } from '../../types/aws';

export default function ElasticIPs() {
  const elasticIPs = useEC2Store((s) => s.elasticIPs);
  const addElasticIP = useEC2Store((s) => s.addElasticIP);
  const removeElasticIP = useEC2Store((s) => s.removeElasticIP);
  const [selected, setSelected] = useState<ElasticIP[]>([]);
  const [showRelease, setShowRelease] = useState(false);

  const columns: Column<ElasticIP>[] = [
    { key: 'PublicIp', header: 'Allocated IPv4 address' },
    { key: 'AllocationId', header: 'Allocation ID' },
    { key: 'InstanceId', header: 'Associated instance' },
    { key: 'Domain', header: 'Scope' },
  ];

  function handleAllocate() {
    addElasticIP({
      AllocationId: generateAllocationId(),
      PublicIp: generatePublicIp(),
      Domain: 'vpc',
      Tags: [],
    });
  }

  return (
    <div>
      <ResourceTable
        columns={columns}
        data={elasticIPs as unknown as Record<string, unknown>[]}
        keyField="AllocationId"
        title="Elastic IP addresses"
        onSelectionChange={(items) => setSelected(items as unknown as ElasticIP[])}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="aws-btn aws-btn-danger aws-btn-sm"
              disabled={selected.length === 0}
              onClick={() => setShowRelease(true)}
            >
              Release
            </button>
            <button className="aws-btn aws-btn-primary aws-btn-sm" onClick={handleAllocate}>
              Allocate Elastic IP address
            </button>
          </div>
        }
      />

      <ConfirmDialog
        isOpen={showRelease}
        title="Release Elastic IP addresses"
        message={`Release ${selected.length} Elastic IP address(es)?`}
        confirmLabel="Release"
        onConfirm={() => {
          selected.forEach((eip) => removeElasticIP(eip.AllocationId));
          setSelected([]);
          setShowRelease(false);
        }}
        onCancel={() => setShowRelease(false)}
        danger
      />
    </div>
  );
}

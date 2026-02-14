import { useECSStore } from '../../store';
import type { ECSTaskDefinition } from '../../types/aws';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';

export default function TaskDefinitions() {
  const taskDefinitions = useECSStore((s) => s.taskDefinitions);

  const columns: Column<ECSTaskDefinition>[] = [
    { key: 'Family', header: 'Family', render: (item) => <span style={{ color: '#0073bb', fontWeight: 700 }}>{item.Family}:{item.Revision}</span> },
    { key: 'Status', header: 'Status', render: (item) => <span style={{ color: item.Status === 'ACTIVE' ? '#1d8102' : '#687078', fontWeight: 700 }}>{item.Status}</span> },
    { key: 'NetworkMode', header: 'Network mode' },
    { key: 'Cpu', header: 'CPU' },
    { key: 'Memory', header: 'Memory' },
    { key: 'Containers', header: 'Containers', render: (item) => String(item.ContainerDefinitions.length) },
  ];

  return (
    <ResourceTable
      columns={columns}
      data={taskDefinitions as unknown as Record<string, unknown>[]}
      keyField="TaskDefinitionArn"
      title="Task definitions"
      selectable={false}
      emptyMessage="No task definitions"
    />
  );
}

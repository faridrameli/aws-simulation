import { useCloudWatchStore } from '../../store';
import type { CloudWatchDashboard } from '../../types/aws';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';

export default function Dashboards() {
  const dashboards = useCloudWatchStore((s) => s.dashboards);

  const columns: Column<CloudWatchDashboard>[] = [
    { key: 'DashboardName', header: 'Dashboard name', render: (item) => <span style={{ color: '#0073bb', fontWeight: 700 }}>{item.DashboardName}</span> },
    { key: 'LastModified', header: 'Last modified', render: (item) => new Date(item.LastModified).toLocaleString() },
    { key: 'Size', header: 'Size (bytes)' },
  ];

  return (
    <ResourceTable
      columns={columns}
      data={dashboards as unknown as Record<string, unknown>[]}
      keyField="DashboardName"
      title="Dashboards"
      selectable={false}
    />
  );
}

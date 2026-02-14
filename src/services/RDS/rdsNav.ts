import type { NavSection } from '../../components/Layout/ServiceLayout';

export const rdsNav: NavSection[] = [
  {
    title: 'RDS Dashboard',
    items: [{ label: 'Dashboard', path: '/rds' }],
  },
  {
    title: 'Databases',
    items: [
      { label: 'DB Instances', path: '/rds/databases' },
      { label: 'Snapshots', path: '/rds/snapshots' },
    ],
  },
];

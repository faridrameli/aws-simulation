import type { NavSection } from '../../components/Layout/ServiceLayout';

export const s3Nav: NavSection[] = [
  {
    title: 'S3 Dashboard',
    items: [{ label: 'Dashboard', path: '/s3' }],
  },
  {
    title: 'Storage',
    items: [{ label: 'Buckets', path: '/s3/buckets' }],
  },
];

import type { NavSection } from '../../components/Layout/ServiceLayout';

export const ec2Nav: NavSection[] = [
  {
    title: 'EC2 Dashboard',
    items: [{ label: 'Dashboard', path: '/ec2' }],
  },
  {
    title: 'Instances',
    items: [
      { label: 'Instances', path: '/ec2/instances' },
      { label: 'Launch Templates', path: '/ec2/instances' },
    ],
  },
  {
    title: 'Images',
    items: [{ label: 'AMIs', path: '/ec2/instances' }],
  },
  {
    title: 'Elastic Block Store',
    items: [
      { label: 'Volumes', path: '/ec2/volumes' },
      { label: 'Snapshots', path: '/ec2/volumes' },
    ],
  },
  {
    title: 'Network & Security',
    items: [
      { label: 'Security Groups', path: '/ec2/security-groups' },
      { label: 'Key Pairs', path: '/ec2/key-pairs' },
      { label: 'Elastic IPs', path: '/ec2/elastic-ips' },
    ],
  },
];

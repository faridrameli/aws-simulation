import type { NavSection } from '../../components/Layout/ServiceLayout';

export const vpcNav: NavSection[] = [
  {
    title: 'VPC Dashboard',
    items: [{ label: 'Dashboard', path: '/vpc' }],
  },
  {
    title: 'Virtual private cloud',
    items: [
      { label: 'Your VPCs', path: '/vpc/vpcs' },
      { label: 'Subnets', path: '/vpc/subnets' },
      { label: 'Route Tables', path: '/vpc/route-tables' },
      { label: 'Internet Gateways', path: '/vpc/internet-gateways' },
      { label: 'NAT Gateways', path: '/vpc/nat-gateways' },
    ],
  },
];

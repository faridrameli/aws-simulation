import type { NavSection } from '../../components/Layout/ServiceLayout';

export const iamNav: NavSection[] = [
  {
    title: 'IAM Dashboard',
    items: [{ label: 'Dashboard', path: '/iam' }],
  },
  {
    title: 'Access management',
    items: [
      { label: 'Users', path: '/iam/users' },
      { label: 'Groups', path: '/iam/groups' },
      { label: 'Roles', path: '/iam/roles' },
      { label: 'Policies', path: '/iam/policies' },
    ],
  },
];

import type { NavSection } from '../../components/Layout/ServiceLayout';

export const lambdaNav: NavSection[] = [
  {
    title: 'Dashboard',
    items: [{ label: 'Dashboard', path: '/lambda' }],
  },
  {
    title: 'Functions',
    items: [{ label: 'Functions', path: '/lambda/functions' }],
  },
  {
    title: 'Additional resources',
    items: [{ label: 'Layers', path: '/lambda/layers' }],
  },
];

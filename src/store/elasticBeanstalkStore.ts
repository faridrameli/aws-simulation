import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EBApplication } from '../types/aws';

interface ElasticBeanstalkState {
  applications: EBApplication[];
  addApplication: (app: EBApplication) => void;
  removeApplication: (name: string) => void;
  updateApplication: (name: string, updates: Partial<EBApplication>) => void;
}

export const useElasticBeanstalkStore = create<ElasticBeanstalkState>()(
  persist(
    (set) => ({
      applications: [],
      addApplication: (app) => set((s) => ({ applications: [...s.applications, app] })),
      removeApplication: (name) => set((s) => ({ applications: s.applications.filter((a) => a.ApplicationName !== name) })),
      updateApplication: (name, updates) =>
        set((s) => ({
          applications: s.applications.map((a) => (a.ApplicationName === name ? { ...a, ...updates } : a)),
        })),
    }),
    { name: 'aws-sim-elasticbeanstalk' }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HostedZone } from '../types/aws';

interface Route53State {
  hostedZones: HostedZone[];
  addHostedZone: (zone: HostedZone) => void;
  removeHostedZone: (id: string) => void;
  updateHostedZone: (id: string, updates: Partial<HostedZone>) => void;
}

export const useRoute53Store = create<Route53State>()(
  persist(
    (set) => ({
      hostedZones: [],
      addHostedZone: (zone) => set((s) => ({ hostedZones: [...s.hostedZones, zone] })),
      removeHostedZone: (id) => set((s) => ({ hostedZones: s.hostedZones.filter((z) => z.Id !== id) })),
      updateHostedZone: (id, updates) =>
        set((s) => ({
          hostedZones: s.hostedZones.map((z) => (z.Id === id ? { ...z, ...updates } : z)),
        })),
    }),
    { name: 'aws-sim-route53' }
  )
);

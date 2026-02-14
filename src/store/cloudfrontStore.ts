import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CFDistribution } from '../types/aws';

interface CloudFrontState {
  distributions: CFDistribution[];
  addDistribution: (distribution: CFDistribution) => void;
  removeDistribution: (id: string) => void;
  updateDistribution: (id: string, updates: Partial<CFDistribution>) => void;
}

export const useCloudFrontStore = create<CloudFrontState>()(
  persist(
    (set) => ({
      distributions: [],
      addDistribution: (distribution) => set((s) => ({ distributions: [...s.distributions, distribution] })),
      removeDistribution: (id) => set((s) => ({ distributions: s.distributions.filter((d) => d.DistributionId !== id) })),
      updateDistribution: (id, updates) =>
        set((s) => ({
          distributions: s.distributions.map((d) => (d.DistributionId === id ? { ...d, ...updates } : d)),
        })),
    }),
    { name: 'aws-sim-cloudfront' }
  )
);

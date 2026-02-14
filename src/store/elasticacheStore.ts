import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ElastiCacheCluster } from '../types/aws';

interface ElastiCacheState {
  clusters: ElastiCacheCluster[];
  addCluster: (cluster: ElastiCacheCluster) => void;
  removeCluster: (id: string) => void;
  updateCluster: (id: string, updates: Partial<ElastiCacheCluster>) => void;
}

export const useElastiCacheStore = create<ElastiCacheState>()(
  persist(
    (set) => ({
      clusters: [],
      addCluster: (cluster) => set((s) => ({ clusters: [...s.clusters, cluster] })),
      removeCluster: (id) => set((s) => ({ clusters: s.clusters.filter((c) => c.CacheClusterId !== id) })),
      updateCluster: (id, updates) =>
        set((s) => ({
          clusters: s.clusters.map((c) => (c.CacheClusterId === id ? { ...c, ...updates } : c)),
        })),
    }),
    { name: 'aws-sim-elasticache' }
  )
);

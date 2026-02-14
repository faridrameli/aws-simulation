import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EKSCluster, EKSNodeGroup } from '../types/aws';

interface EKSState {
  clusters: EKSCluster[];
  nodeGroups: EKSNodeGroup[];
  addCluster: (cluster: EKSCluster) => void;
  removeCluster: (name: string) => void;
  addNodeGroup: (nodeGroup: EKSNodeGroup) => void;
  removeNodeGroup: (name: string) => void;
}

export const useEKSStore = create<EKSState>()(
  persist(
    (set) => ({
      clusters: [],
      nodeGroups: [],
      addCluster: (cluster) => set((s) => ({ clusters: [...s.clusters, cluster] })),
      removeCluster: (name) => set((s) => ({ clusters: s.clusters.filter((c) => c.ClusterName !== name) })),
      addNodeGroup: (nodeGroup) => set((s) => ({ nodeGroups: [...s.nodeGroups, nodeGroup] })),
      removeNodeGroup: (name) => set((s) => ({ nodeGroups: s.nodeGroups.filter((ng) => ng.NodegroupName !== name) })),
    }),
    { name: 'aws-sim-eks' }
  )
);

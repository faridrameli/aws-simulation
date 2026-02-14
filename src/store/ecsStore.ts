import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ECSCluster, ECSService, ECSTaskDefinition } from '../types/aws';

interface ECSState {
  clusters: ECSCluster[];
  services: ECSService[];
  taskDefinitions: ECSTaskDefinition[];
  addCluster: (cluster: ECSCluster) => void;
  removeCluster: (name: string) => void;
  addService: (service: ECSService) => void;
  removeService: (name: string) => void;
  addTaskDefinition: (td: ECSTaskDefinition) => void;
  removeTaskDefinition: (arn: string) => void;
}

export const useECSStore = create<ECSState>()(
  persist(
    (set) => ({
      clusters: [],
      services: [],
      taskDefinitions: [],
      addCluster: (cluster) => set((s) => ({ clusters: [...s.clusters, cluster] })),
      removeCluster: (name) => set((s) => ({ clusters: s.clusters.filter((c) => c.ClusterName !== name) })),
      addService: (service) => set((s) => ({ services: [...s.services, service] })),
      removeService: (name) => set((s) => ({ services: s.services.filter((svc) => svc.ServiceName !== name) })),
      addTaskDefinition: (td) => set((s) => ({ taskDefinitions: [...s.taskDefinitions, td] })),
      removeTaskDefinition: (arn) => set((s) => ({ taskDefinitions: s.taskDefinitions.filter((td) => td.TaskDefinitionArn !== arn) })),
    }),
    { name: 'aws-sim-ecs' }
  )
);

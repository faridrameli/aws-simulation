import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RDSInstance, RDSSnapshot } from '../types/aws';

interface RDSState {
  instances: RDSInstance[];
  snapshots: RDSSnapshot[];
  addInstance: (instance: RDSInstance) => void;
  updateInstance: (id: string, updates: Partial<RDSInstance>) => void;
  removeInstance: (id: string) => void;
  addSnapshot: (snapshot: RDSSnapshot) => void;
  removeSnapshot: (id: string) => void;
}

export const useRDSStore = create<RDSState>()(
  persist(
    (set) => ({
      instances: [],
      snapshots: [],
      addInstance: (instance) => set((s) => ({ instances: [...s.instances, instance] })),
      updateInstance: (id, updates) =>
        set((s) => ({ instances: s.instances.map((i) => (i.DBInstanceIdentifier === id ? { ...i, ...updates } : i)) })),
      removeInstance: (id) => set((s) => ({ instances: s.instances.filter((i) => i.DBInstanceIdentifier !== id) })),
      addSnapshot: (snapshot) => set((s) => ({ snapshots: [...s.snapshots, snapshot] })),
      removeSnapshot: (id) => set((s) => ({ snapshots: s.snapshots.filter((sn) => sn.DBSnapshotIdentifier !== id) })),
    }),
    { name: 'aws-sim-rds' }
  )
);

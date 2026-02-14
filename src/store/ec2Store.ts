import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EC2Instance, SecurityGroup, KeyPair, ElasticIP, Volume } from '../types/aws';

interface EC2State {
  instances: EC2Instance[];
  securityGroups: SecurityGroup[];
  keyPairs: KeyPair[];
  elasticIPs: ElasticIP[];
  volumes: Volume[];
  addInstance: (instance: EC2Instance) => void;
  updateInstance: (id: string, updates: Partial<EC2Instance>) => void;
  removeInstance: (id: string) => void;
  addSecurityGroup: (sg: SecurityGroup) => void;
  removeSecurityGroup: (id: string) => void;
  updateSecurityGroup: (id: string, updates: Partial<SecurityGroup>) => void;
  addKeyPair: (kp: KeyPair) => void;
  removeKeyPair: (id: string) => void;
  addElasticIP: (eip: ElasticIP) => void;
  removeElasticIP: (id: string) => void;
  addVolume: (vol: Volume) => void;
  removeVolume: (id: string) => void;
}

export const useEC2Store = create<EC2State>()(
  persist(
    (set) => ({
      instances: [],
      securityGroups: [],
      keyPairs: [],
      elasticIPs: [],
      volumes: [],
      addInstance: (instance) => set((s) => ({ instances: [...s.instances, instance] })),
      updateInstance: (id, updates) =>
        set((s) => ({
          instances: s.instances.map((i) => (i.InstanceId === id ? { ...i, ...updates } : i)),
        })),
      removeInstance: (id) => set((s) => ({ instances: s.instances.filter((i) => i.InstanceId !== id) })),
      addSecurityGroup: (sg) => set((s) => ({ securityGroups: [...s.securityGroups, sg] })),
      removeSecurityGroup: (id) => set((s) => ({ securityGroups: s.securityGroups.filter((sg) => sg.GroupId !== id) })),
      updateSecurityGroup: (id, updates) =>
        set((s) => ({
          securityGroups: s.securityGroups.map((sg) => (sg.GroupId === id ? { ...sg, ...updates } : sg)),
        })),
      addKeyPair: (kp) => set((s) => ({ keyPairs: [...s.keyPairs, kp] })),
      removeKeyPair: (id) => set((s) => ({ keyPairs: s.keyPairs.filter((kp) => kp.KeyPairId !== id) })),
      addElasticIP: (eip) => set((s) => ({ elasticIPs: [...s.elasticIPs, eip] })),
      removeElasticIP: (id) => set((s) => ({ elasticIPs: s.elasticIPs.filter((e) => e.AllocationId !== id) })),
      addVolume: (vol) => set((s) => ({ volumes: [...s.volumes, vol] })),
      removeVolume: (id) => set((s) => ({ volumes: s.volumes.filter((v) => v.VolumeId !== id) })),
    }),
    { name: 'aws-sim-ec2' }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IAMUser, IAMGroup, IAMRole, IAMPolicy } from '../types/aws';

interface IAMState {
  users: IAMUser[];
  groups: IAMGroup[];
  roles: IAMRole[];
  policies: IAMPolicy[];
  addUser: (user: IAMUser) => void;
  updateUser: (name: string, updates: Partial<IAMUser>) => void;
  removeUser: (name: string) => void;
  addGroup: (group: IAMGroup) => void;
  updateGroup: (name: string, updates: Partial<IAMGroup>) => void;
  removeGroup: (name: string) => void;
  addRole: (role: IAMRole) => void;
  updateRole: (name: string, updates: Partial<IAMRole>) => void;
  removeRole: (name: string) => void;
  addPolicy: (policy: IAMPolicy) => void;
  removePolicy: (id: string) => void;
}

export const useIAMStore = create<IAMState>()(
  persist(
    (set) => ({
      users: [],
      groups: [],
      roles: [],
      policies: [],
      addUser: (user) => set((s) => ({ users: [...s.users, user] })),
      updateUser: (name, updates) =>
        set((s) => ({ users: s.users.map((u) => (u.UserName === name ? { ...u, ...updates } : u)) })),
      removeUser: (name) => set((s) => ({ users: s.users.filter((u) => u.UserName !== name) })),
      addGroup: (group) => set((s) => ({ groups: [...s.groups, group] })),
      updateGroup: (name, updates) =>
        set((s) => ({ groups: s.groups.map((g) => (g.GroupName === name ? { ...g, ...updates } : g)) })),
      removeGroup: (name) => set((s) => ({ groups: s.groups.filter((g) => g.GroupName !== name) })),
      addRole: (role) => set((s) => ({ roles: [...s.roles, role] })),
      updateRole: (name, updates) =>
        set((s) => ({ roles: s.roles.map((r) => (r.RoleName === name ? { ...r, ...updates } : r)) })),
      removeRole: (name) => set((s) => ({ roles: s.roles.filter((r) => r.RoleName !== name) })),
      addPolicy: (policy) => set((s) => ({ policies: [...s.policies, policy] })),
      removePolicy: (id) => set((s) => ({ policies: s.policies.filter((p) => p.PolicyId !== id) })),
    }),
    { name: 'aws-sim-iam' }
  )
);

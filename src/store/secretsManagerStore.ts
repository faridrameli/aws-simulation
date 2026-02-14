import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Secret } from '../types/aws';

interface SecretsManagerState {
  secrets: Secret[];
  addSecret: (secret: Secret) => void;
  removeSecret: (id: string) => void;
  updateSecret: (id: string, updates: Partial<Secret>) => void;
}

export const useSecretsManagerStore = create<SecretsManagerState>()(
  persist(
    (set) => ({
      secrets: [],
      addSecret: (secret) => set((s) => ({ secrets: [...s.secrets, secret] })),
      removeSecret: (id) => set((s) => ({ secrets: s.secrets.filter((s2) => s2.SecretId !== id) })),
      updateSecret: (id, updates) =>
        set((s) => ({
          secrets: s.secrets.map((s2) => (s2.SecretId === id ? { ...s2, ...updates } : s2)),
        })),
    }),
    { name: 'aws-sim-secretsmanager' }
  )
);

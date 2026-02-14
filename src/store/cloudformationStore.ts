import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CFStack } from '../types/aws';

interface CloudFormationState {
  stacks: CFStack[];
  addStack: (stack: CFStack) => void;
  removeStack: (id: string) => void;
  updateStack: (id: string, updates: Partial<CFStack>) => void;
}

export const useCloudFormationStore = create<CloudFormationState>()(
  persist(
    (set) => ({
      stacks: [],
      addStack: (stack) => set((s) => ({ stacks: [...s.stacks, stack] })),
      removeStack: (id) => set((s) => ({ stacks: s.stacks.filter((st) => st.StackId !== id) })),
      updateStack: (id, updates) =>
        set((s) => ({
          stacks: s.stacks.map((st) => (st.StackId === id ? { ...st, ...updates } : st)),
        })),
    }),
    { name: 'aws-sim-cloudformation' }
  )
);

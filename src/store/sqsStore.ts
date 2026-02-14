import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SQSQueue } from '../types/aws';

interface SQSState {
  queues: SQSQueue[];
  addQueue: (queue: SQSQueue) => void;
  removeQueue: (url: string) => void;
  updateQueue: (url: string, updates: Partial<SQSQueue>) => void;
}

export const useSQSStore = create<SQSState>()(
  persist(
    (set) => ({
      queues: [],
      addQueue: (queue) => set((s) => ({ queues: [...s.queues, queue] })),
      removeQueue: (url) => set((s) => ({ queues: s.queues.filter((q) => q.QueueUrl !== url) })),
      updateQueue: (url, updates) =>
        set((s) => ({
          queues: s.queues.map((q) => (q.QueueUrl === url ? { ...q, ...updates } : q)),
        })),
    }),
    { name: 'aws-sim-sqs' }
  )
);

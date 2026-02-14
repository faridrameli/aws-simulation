import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SNSTopic } from '../types/aws';

interface SNSState {
  topics: SNSTopic[];
  addTopic: (topic: SNSTopic) => void;
  removeTopic: (arn: string) => void;
  updateTopic: (arn: string, updates: Partial<SNSTopic>) => void;
}

export const useSNSStore = create<SNSState>()(
  persist(
    (set) => ({
      topics: [],
      addTopic: (topic) => set((s) => ({ topics: [...s.topics, topic] })),
      removeTopic: (arn) => set((s) => ({ topics: s.topics.filter((t) => t.TopicArn !== arn) })),
      updateTopic: (arn, updates) =>
        set((s) => ({
          topics: s.topics.map((t) => (t.TopicArn === arn ? { ...t, ...updates } : t)),
        })),
    }),
    { name: 'aws-sim-sns' }
  )
);

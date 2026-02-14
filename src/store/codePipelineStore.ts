import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Pipeline } from '../types/aws';

interface CodePipelineState {
  pipelines: Pipeline[];
  addPipeline: (pipeline: Pipeline) => void;
  removePipeline: (name: string) => void;
  updatePipeline: (name: string, updates: Partial<Pipeline>) => void;
}

export const useCodePipelineStore = create<CodePipelineState>()(
  persist(
    (set) => ({
      pipelines: [],
      addPipeline: (pipeline) => set((s) => ({ pipelines: [...s.pipelines, pipeline] })),
      removePipeline: (name) => set((s) => ({ pipelines: s.pipelines.filter((p) => p.PipelineName !== name) })),
      updatePipeline: (name, updates) =>
        set((s) => ({
          pipelines: s.pipelines.map((p) => (p.PipelineName === name ? { ...p, ...updates } : p)),
        })),
    }),
    { name: 'aws-sim-codepipeline' }
  )
);

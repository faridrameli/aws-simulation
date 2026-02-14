import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LambdaFunction, LambdaLayer } from '../types/aws';

interface LambdaState {
  functions: LambdaFunction[];
  layers: LambdaLayer[];
  addFunction: (fn: LambdaFunction) => void;
  updateFunction: (name: string, updates: Partial<LambdaFunction>) => void;
  removeFunction: (name: string) => void;
  addLayer: (layer: LambdaLayer) => void;
  removeLayer: (name: string) => void;
}

export const useLambdaStore = create<LambdaState>()(
  persist(
    (set) => ({
      functions: [],
      layers: [],
      addFunction: (fn) => set((s) => ({ functions: [...s.functions, fn] })),
      updateFunction: (name, updates) =>
        set((s) => ({
          functions: s.functions.map((f) => (f.FunctionName === name ? { ...f, ...updates } : f)),
        })),
      removeFunction: (name) => set((s) => ({ functions: s.functions.filter((f) => f.FunctionName !== name) })),
      addLayer: (layer) => set((s) => ({ layers: [...s.layers, layer] })),
      removeLayer: (name) => set((s) => ({ layers: s.layers.filter((l) => l.LayerName !== name) })),
    }),
    { name: 'aws-sim-lambda' }
  )
);

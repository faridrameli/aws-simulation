import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { APIGatewayAPI } from '../types/aws';

interface APIGatewayState {
  apis: APIGatewayAPI[];
  addAPI: (api: APIGatewayAPI) => void;
  removeAPI: (id: string) => void;
  updateAPI: (id: string, updates: Partial<APIGatewayAPI>) => void;
}

export const useAPIGatewayStore = create<APIGatewayState>()(
  persist(
    (set) => ({
      apis: [],
      addAPI: (api) => set((s) => ({ apis: [...s.apis, api] })),
      removeAPI: (id) => set((s) => ({ apis: s.apis.filter((a) => a.ApiId !== id) })),
      updateAPI: (id, updates) =>
        set((s) => ({
          apis: s.apis.map((a) => (a.ApiId === id ? { ...a, ...updates } : a)),
        })),
    }),
    { name: 'aws-sim-apigateway' }
  )
);

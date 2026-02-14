import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DynamoDBTable } from '../types/aws';

interface DynamoState {
  tables: DynamoDBTable[];
  addTable: (table: DynamoDBTable) => void;
  removeTable: (name: string) => void;
  updateTable: (name: string, updates: Partial<DynamoDBTable>) => void;
}

export const useDynamoStore = create<DynamoState>()(
  persist(
    (set) => ({
      tables: [],
      addTable: (table) => set((s) => ({ tables: [...s.tables, table] })),
      removeTable: (name) => set((s) => ({ tables: s.tables.filter((t) => t.TableName !== name) })),
      updateTable: (name, updates) =>
        set((s) => ({
          tables: s.tables.map((t) => (t.TableName === name ? { ...t, ...updates } : t)),
        })),
    }),
    { name: 'aws-sim-dynamodb' }
  )
);

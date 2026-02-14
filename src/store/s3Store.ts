import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { S3Bucket, S3Object } from '../types/aws';

interface S3State {
  buckets: S3Bucket[];
  addBucket: (bucket: S3Bucket) => void;
  removeBucket: (name: string) => void;
  updateBucket: (name: string, updates: Partial<S3Bucket>) => void;
  addObject: (bucketName: string, obj: S3Object) => void;
  removeObject: (bucketName: string, key: string) => void;
}

export const useS3Store = create<S3State>()(
  persist(
    (set) => ({
      buckets: [],
      addBucket: (bucket) => set((s) => ({ buckets: [...s.buckets, bucket] })),
      removeBucket: (name) => set((s) => ({ buckets: s.buckets.filter((b) => b.Name !== name) })),
      updateBucket: (name, updates) =>
        set((s) => ({
          buckets: s.buckets.map((b) => (b.Name === name ? { ...b, ...updates } : b)),
        })),
      addObject: (bucketName, obj) =>
        set((s) => ({
          buckets: s.buckets.map((b) =>
            b.Name === bucketName ? { ...b, Objects: [...b.Objects, obj] } : b
          ),
        })),
      removeObject: (bucketName, key) =>
        set((s) => ({
          buckets: s.buckets.map((b) =>
            b.Name === bucketName ? { ...b, Objects: b.Objects.filter((o) => o.Key !== key) } : b
          ),
        })),
    }),
    { name: 'aws-sim-s3' }
  )
);

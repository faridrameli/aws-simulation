import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_REGION } from '../utils/constants';

interface GlobalState {
  region: string;
  setRegion: (region: string) => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      region: DEFAULT_REGION,
      setRegion: (region) => set({ region }),
    }),
    { name: 'aws-sim-global' }
  )
);

// Re-export all stores
export { useEC2Store } from './ec2Store';
export { useS3Store } from './s3Store';
export { useLambdaStore } from './lambdaStore';
export { useIAMStore } from './iamStore';
export { useRDSStore } from './rdsStore';
export { useVPCStore } from './vpcStore';
export { useDynamoStore } from './dynamoStore';
export { useCloudWatchStore } from './cloudwatchStore';
export { useRoute53Store } from './route53Store';
export { useCloudFormationStore } from './cloudformationStore';
export { useSNSStore } from './snsStore';
export { useSQSStore } from './sqsStore';
export { useECSStore } from './ecsStore';
export { useEKSStore } from './eksStore';
export { useAPIGatewayStore } from './apiGatewayStore';
export { useElasticBeanstalkStore } from './elasticBeanstalkStore';
export { useCodePipelineStore } from './codePipelineStore';
export { useSecretsManagerStore } from './secretsManagerStore';
export { useCloudFrontStore } from './cloudfrontStore';
export { useElastiCacheStore } from './elasticacheStore';

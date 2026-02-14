import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  useMissionStore,
  useEC2Store,
  useS3Store,
  useIAMStore,
  useVPCStore,
  useLambdaStore,
  useRDSStore,
  useDynamoStore,
  useCloudWatchStore,
  useSNSStore,
  useSQSStore,
  useRoute53Store,
  useSecretsManagerStore,
} from '../../store';
import { MISSIONS } from '../../data/missions';

export default function useMissionValidator() {
  const location = useLocation();
  const activeMissionId = useMissionStore((s) => s.activeMissionId);
  const currentStepIndex = useMissionStore((s) => s.currentStepIndex);
  const advanceStep = useMissionStore((s) => s.advanceStep);
  const stepStartCounts = useMissionStore((s) => s.stepStartCounts);
  const setStepStartCounts = useMissionStore((s) => s.setStepStartCounts);

  // Store counts for validation
  const ec2Count = useEC2Store((s) => s.instances.length);
  const s3Count = useS3Store((s) => s.buckets.length);
  const iamCount = useIAMStore((s) => s.users.length);
  const vpcCount = useVPCStore((s) => s.vpcs.length);
  const subnetCount = useVPCStore((s) => s.subnets.length);
  const lambdaCount = useLambdaStore((s) => s.functions.length);
  const rdsCount = useRDSStore((s) => s.instances.length);
  const dynamoCount = useDynamoStore((s) => s.tables.length);
  const cwAlarmCount = useCloudWatchStore((s) => s.alarms.length);
  const snsCount = useSNSStore((s) => s.topics.length);
  const sqsCount = useSQSStore((s) => s.queues.length);
  const route53Count = useRoute53Store((s) => s.hostedZones.length);
  const secretsCount = useSecretsManagerStore((s) => s.secrets.length);

  // Derive current mission/step directly (no getState())
  const mission = activeMissionId ? MISSIONS.find((m) => m.id === activeMissionId) : null;
  const step = mission ? mission.steps[currentStepIndex] : null;

  // Prevent double-advancing in React strict mode
  const advancingRef = useRef(false);

  function getStoreCount(storeKey: string, property: string): number {
    if (storeKey === 'ec2' && property === 'instances') return ec2Count;
    if (storeKey === 's3' && property === 'buckets') return s3Count;
    if (storeKey === 'iam' && property === 'users') return iamCount;
    if (storeKey === 'vpc' && property === 'vpcs') return vpcCount;
    if (storeKey === 'vpc' && property === 'subnets') return subnetCount;
    if (storeKey === 'lambda' && property === 'functions') return lambdaCount;
    if (storeKey === 'rds' && property === 'instances') return rdsCount;
    if (storeKey === 'dynamodb' && property === 'tables') return dynamoCount;
    if (storeKey === 'cloudwatch' && property === 'alarms') return cwAlarmCount;
    if (storeKey === 'sns' && property === 'topics') return snsCount;
    if (storeKey === 'sqs' && property === 'queues') return sqsCount;
    if (storeKey === 'route53' && property === 'hostedZones') return route53Count;
    if (storeKey === 'secretsmanager' && property === 'secrets') return secretsCount;
    return 0;
  }

  // Snapshot counts when entering a storeCheck step
  useEffect(() => {
    if (!step || step.validation.type !== 'storeCheck') return;
    const { storeKey, storeProperty } = step.validation;
    if (!storeKey || !storeProperty) return;
    const key = `${storeKey}.${storeProperty}`;
    if (!(key in stepStartCounts)) {
      const count = getStoreCount(storeKey, storeProperty);
      setStepStartCounts({ ...stepStartCounts, [key]: count });
    }
  }, [activeMissionId, currentStepIndex]);

  // Route-based validation
  useEffect(() => {
    if (!step || step.validation.type !== 'route' || !step.validation.route) return;
    if (advancingRef.current) return;
    if (location.pathname === step.validation.route) {
      advancingRef.current = true;
      advanceStep();
      setTimeout(() => { advancingRef.current = false; }, 50);
    }
  }, [location.pathname, activeMissionId, currentStepIndex, step, advanceStep]);

  // Store-based validation
  useEffect(() => {
    if (!step || step.validation.type !== 'storeCheck') return;
    const { storeKey, storeProperty, expectedCountIncrease } = step.validation;
    if (!storeKey || !storeProperty) return;
    if (advancingRef.current) return;
    const key = `${storeKey}.${storeProperty}`;
    const startCount = stepStartCounts[key];
    if (startCount === undefined) return;
    const currentCount = getStoreCount(storeKey, storeProperty);
    if (expectedCountIncrease && currentCount > startCount) {
      advancingRef.current = true;
      advanceStep();
      setTimeout(() => { advancingRef.current = false; }, 50);
    }
  }, [ec2Count, s3Count, iamCount, vpcCount, subnetCount, lambdaCount, rdsCount, dynamoCount, cwAlarmCount, snsCount, sqsCount, route53Count, secretsCount, activeMissionId, currentStepIndex, stepStartCounts, step, advanceStep]);
}

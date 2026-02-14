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
  useCloudFormationStore,
  useECSStore,
  useEKSStore,
  useAPIGatewayStore,
  useCloudFrontStore,
  useElasticBeanstalkStore,
  useCodePipelineStore,
  useElastiCacheStore,
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
  const cfnCount = useCloudFormationStore((s) => s.stacks.length);
  const ecsCount = useECSStore((s) => s.clusters.length);
  const eksCount = useEKSStore((s) => s.clusters.length);
  const apigwCount = useAPIGatewayStore((s) => s.apis.length);
  const cloudfrontCount = useCloudFrontStore((s) => s.distributions.length);
  const ebCount = useElasticBeanstalkStore((s) => s.applications.length);
  const cpCount = useCodePipelineStore((s) => s.pipelines.length);
  const ecacheCount = useElastiCacheStore((s) => s.clusters.length);

  // Derive current mission/step directly
  const mission = activeMissionId ? MISSIONS.find((m) => m.id === activeMissionId) : null;
  const step = mission ? mission.steps[currentStepIndex] : null;

  const advancingRef = useRef(false);

  function getStoreCount(storeKey: string, property: string): number {
    const key = `${storeKey}.${property}`;
    const map: Record<string, number> = {
      'ec2.instances': ec2Count,
      's3.buckets': s3Count,
      'iam.users': iamCount,
      'vpc.vpcs': vpcCount,
      'vpc.subnets': subnetCount,
      'lambda.functions': lambdaCount,
      'rds.instances': rdsCount,
      'dynamodb.tables': dynamoCount,
      'cloudwatch.alarms': cwAlarmCount,
      'sns.topics': snsCount,
      'sqs.queues': sqsCount,
      'route53.hostedZones': route53Count,
      'secretsmanager.secrets': secretsCount,
      'cloudformation.stacks': cfnCount,
      'ecs.clusters': ecsCount,
      'eks.clusters': eksCount,
      'apigateway.apis': apigwCount,
      'cloudfront.distributions': cloudfrontCount,
      'elasticbeanstalk.applications': ebCount,
      'codepipeline.pipelines': cpCount,
      'elasticache.clusters': ecacheCount,
    };
    return map[key] ?? 0;
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
  }, [ec2Count, s3Count, iamCount, vpcCount, subnetCount, lambdaCount, rdsCount, dynamoCount, cwAlarmCount, snsCount, sqsCount, route53Count, secretsCount, cfnCount, ecsCount, eksCount, apigwCount, cloudfrontCount, ebCount, cpCount, ecacheCount, activeMissionId, currentStepIndex, stepStartCounts, step, advanceStep]);
}

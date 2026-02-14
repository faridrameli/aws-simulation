// Common types
export interface Tag {
  Key: string;
  Value: string;
}

export type Region = string;

// EC2 Types
export interface EC2Instance {
  InstanceId: string;
  InstanceType: string;
  State: 'running' | 'stopped' | 'pending' | 'terminated' | 'stopping' | 'shutting-down';
  Name: string;
  ImageId: string;
  KeyName: string;
  SecurityGroups: string[];
  SubnetId: string;
  VpcId: string;
  PublicIpAddress?: string;
  PrivateIpAddress: string;
  LaunchTime: string;
  AvailabilityZone: string;
  Tags: Tag[];
  Platform?: string;
  Monitoring: 'enabled' | 'disabled';
}

export interface SecurityGroup {
  GroupId: string;
  GroupName: string;
  Description: string;
  VpcId: string;
  InboundRules: SecurityGroupRule[];
  OutboundRules: SecurityGroupRule[];
  Tags: Tag[];
}

export interface SecurityGroupRule {
  Protocol: string;
  PortRange: string;
  Source: string;
  Description: string;
}

export interface KeyPair {
  KeyPairId: string;
  KeyName: string;
  KeyType: 'rsa' | 'ed25519';
  CreatedTime: string;
  Tags: Tag[];
}

export interface ElasticIP {
  AllocationId: string;
  PublicIp: string;
  AssociationId?: string;
  InstanceId?: string;
  Domain: 'vpc';
  Tags: Tag[];
}

export interface Volume {
  VolumeId: string;
  Size: number;
  VolumeType: 'gp2' | 'gp3' | 'io1' | 'io2' | 'st1' | 'sc1' | 'standard';
  State: 'available' | 'in-use' | 'creating' | 'deleting';
  AvailabilityZone: string;
  Encrypted: boolean;
  AttachedTo?: string;
  CreateTime: string;
  Tags: Tag[];
}

// S3 Types
export interface S3Bucket {
  Name: string;
  CreationDate: string;
  Region: string;
  Versioning: 'Enabled' | 'Suspended' | 'Disabled';
  PublicAccess: boolean;
  Encryption: 'AES256' | 'aws:kms' | 'None';
  Tags: Tag[];
  Objects: S3Object[];
}

export interface S3Object {
  Key: string;
  Size: number;
  LastModified: string;
  StorageClass: 'STANDARD' | 'INTELLIGENT_TIERING' | 'GLACIER' | 'DEEP_ARCHIVE';
  ContentType: string;
}

// Lambda Types
export interface LambdaFunction {
  FunctionName: string;
  FunctionArn: string;
  Runtime: string;
  Handler: string;
  Description: string;
  MemorySize: number;
  Timeout: number;
  LastModified: string;
  CodeSize: number;
  State: 'Active' | 'Pending' | 'Inactive' | 'Failed';
  Role: string;
  Environment: Record<string, string>;
  Tags: Tag[];
  Layers: string[];
}

export interface LambdaLayer {
  LayerName: string;
  LayerArn: string;
  Description: string;
  CompatibleRuntimes: string[];
  CreatedDate: string;
  Version: number;
}

// IAM Types
export interface IAMUser {
  UserName: string;
  UserId: string;
  Arn: string;
  CreateDate: string;
  PasswordLastUsed?: string;
  Groups: string[];
  Policies: string[];
  AccessKeys: IAMAccessKey[];
  MFAEnabled: boolean;
  Tags: Tag[];
  Path: string;
}

export interface IAMAccessKey {
  AccessKeyId: string;
  Status: 'Active' | 'Inactive';
  CreateDate: string;
}

export interface IAMGroup {
  GroupName: string;
  GroupId: string;
  Arn: string;
  CreateDate: string;
  Users: string[];
  Policies: string[];
  Path: string;
}

export interface IAMRole {
  RoleName: string;
  RoleId: string;
  Arn: string;
  CreateDate: string;
  Description: string;
  AssumeRolePolicyDocument: string;
  Policies: string[];
  MaxSessionDuration: number;
  Tags: Tag[];
  Path: string;
}

export interface IAMPolicy {
  PolicyName: string;
  PolicyId: string;
  Arn: string;
  CreateDate: string;
  Description: string;
  IsAWSManaged: boolean;
  AttachedEntities: number;
  PolicyDocument: string;
  Path: string;
}

// RDS Types
export interface RDSInstance {
  DBInstanceIdentifier: string;
  DBInstanceClass: string;
  Engine: string;
  EngineVersion: string;
  Status: 'available' | 'creating' | 'deleting' | 'stopped' | 'starting' | 'stopping' | 'modifying';
  MasterUsername: string;
  Endpoint: string;
  Port: number;
  AllocatedStorage: number;
  MultiAZ: boolean;
  StorageType: 'gp2' | 'gp3' | 'io1' | 'standard';
  VpcId: string;
  AvailabilityZone: string;
  CreatedTime: string;
  BackupRetentionPeriod: number;
  PubliclyAccessible: boolean;
  StorageEncrypted: boolean;
  Tags: Tag[];
}

export interface RDSSnapshot {
  DBSnapshotIdentifier: string;
  DBInstanceIdentifier: string;
  SnapshotCreateTime: string;
  Engine: string;
  Status: 'available' | 'creating';
  AllocatedStorage: number;
  SnapshotType: 'manual' | 'automated';
  Tags: Tag[];
}

// VPC Types
export interface VPC {
  VpcId: string;
  CidrBlock: string;
  State: 'available' | 'pending';
  IsDefault: boolean;
  DhcpOptionsId: string;
  Tags: Tag[];
  EnableDnsSupport: boolean;
  EnableDnsHostnames: boolean;
}

export interface Subnet {
  SubnetId: string;
  VpcId: string;
  CidrBlock: string;
  AvailabilityZone: string;
  AvailableIpAddressCount: number;
  MapPublicIpOnLaunch: boolean;
  State: 'available' | 'pending';
  Tags: Tag[];
}

export interface RouteTable {
  RouteTableId: string;
  VpcId: string;
  Routes: Route[];
  Associations: string[];
  Tags: Tag[];
}

export interface Route {
  DestinationCidrBlock: string;
  GatewayId?: string;
  NatGatewayId?: string;
  State: 'active' | 'blackhole';
}

export interface InternetGateway {
  InternetGatewayId: string;
  Attachments: { VpcId: string; State: string }[];
  Tags: Tag[];
}

export interface NATGateway {
  NatGatewayId: string;
  SubnetId: string;
  VpcId: string;
  State: 'available' | 'pending' | 'deleting' | 'deleted' | 'failed';
  ElasticIpAddress: string;
  Tags: Tag[];
  CreateTime: string;
}

// DynamoDB Types
export interface DynamoDBTable {
  TableName: string;
  TableStatus: 'ACTIVE' | 'CREATING' | 'DELETING' | 'UPDATING';
  TableArn: string;
  CreationDateTime: string;
  KeySchema: { AttributeName: string; KeyType: 'HASH' | 'RANGE' }[];
  AttributeDefinitions: { AttributeName: string; AttributeType: 'S' | 'N' | 'B' }[];
  BillingMode: 'PAY_PER_REQUEST' | 'PROVISIONED';
  ReadCapacityUnits?: number;
  WriteCapacityUnits?: number;
  ItemCount: number;
  TableSizeBytes: number;
  Tags: Tag[];
  Items: Record<string, unknown>[];
}

// CloudWatch Types
export interface CloudWatchAlarm {
  AlarmName: string;
  AlarmArn: string;
  AlarmDescription: string;
  MetricName: string;
  Namespace: string;
  Statistic: string;
  Period: number;
  EvaluationPeriods: number;
  Threshold: number;
  ComparisonOperator: string;
  State: 'OK' | 'ALARM' | 'INSUFFICIENT_DATA';
  ActionsEnabled: boolean;
  Tags: Tag[];
}

export interface CloudWatchLogGroup {
  LogGroupName: string;
  Arn: string;
  CreationTime: string;
  RetentionInDays: number | null;
  StoredBytes: number;
  Tags: Tag[];
}

export interface CloudWatchDashboard {
  DashboardName: string;
  DashboardArn: string;
  LastModified: string;
  Size: number;
}

// Route 53 Types
export interface HostedZone {
  Id: string;
  Name: string;
  Type: 'Public' | 'Private';
  RecordSetCount: number;
  Comment: string;
  Records: DNSRecord[];
  Tags: Tag[];
}

export interface DNSRecord {
  Name: string;
  Type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'NS' | 'PTR' | 'SOA' | 'SRV' | 'TXT';
  TTL: number;
  Value: string;
}

// CloudFormation Types
export interface CFStack {
  StackName: string;
  StackId: string;
  StackStatus: 'CREATE_COMPLETE' | 'CREATE_IN_PROGRESS' | 'CREATE_FAILED' |
    'DELETE_COMPLETE' | 'DELETE_IN_PROGRESS' | 'DELETE_FAILED' |
    'UPDATE_COMPLETE' | 'UPDATE_IN_PROGRESS' | 'UPDATE_FAILED' |
    'ROLLBACK_COMPLETE' | 'ROLLBACK_IN_PROGRESS';
  CreationTime: string;
  LastUpdatedTime?: string;
  Description: string;
  Template: string;
  Parameters: { Key: string; Value: string }[];
  Outputs: { Key: string; Value: string; Description: string }[];
  Tags: Tag[];
}

// SNS Types
export interface SNSTopic {
  TopicArn: string;
  TopicName: string;
  DisplayName: string;
  SubscriptionCount: number;
  Subscriptions: SNSSubscription[];
  Tags: Tag[];
  CreatedTime: string;
}

export interface SNSSubscription {
  SubscriptionArn: string;
  Protocol: 'email' | 'sms' | 'http' | 'https' | 'sqs' | 'lambda';
  Endpoint: string;
  Status: 'Confirmed' | 'PendingConfirmation';
}

// SQS Types
export interface SQSQueue {
  QueueUrl: string;
  QueueName: string;
  QueueArn: string;
  Type: 'Standard' | 'FIFO';
  VisibilityTimeout: number;
  MessageRetentionPeriod: number;
  MaxMessageSize: number;
  DelaySeconds: number;
  MessagesAvailable: number;
  MessagesInFlight: number;
  CreatedTimestamp: string;
  Tags: Tag[];
}

// ECS Types
export interface ECSCluster {
  ClusterName: string;
  ClusterArn: string;
  Status: 'ACTIVE' | 'PROVISIONING' | 'DEPROVISIONING' | 'FAILED' | 'INACTIVE';
  RegisteredContainerInstances: number;
  RunningTasksCount: number;
  PendingTasksCount: number;
  ActiveServicesCount: number;
  Tags: Tag[];
}

export interface ECSService {
  ServiceName: string;
  ServiceArn: string;
  ClusterArn: string;
  Status: 'ACTIVE' | 'DRAINING' | 'INACTIVE';
  DesiredCount: number;
  RunningCount: number;
  TaskDefinition: string;
  LaunchType: 'EC2' | 'FARGATE';
  CreatedAt: string;
  Tags: Tag[];
}

export interface ECSTaskDefinition {
  TaskDefinitionArn: string;
  Family: string;
  Revision: number;
  Status: 'ACTIVE' | 'INACTIVE';
  Cpu: string;
  Memory: string;
  NetworkMode: 'awsvpc' | 'bridge' | 'host' | 'none';
  ContainerDefinitions: { Name: string; Image: string; Cpu: number; Memory: number; PortMappings: { ContainerPort: number; HostPort: number; Protocol: string }[] }[];
  Tags: Tag[];
}

// EKS Types
export interface EKSCluster {
  ClusterName: string;
  ClusterArn: string;
  Version: string;
  Status: 'ACTIVE' | 'CREATING' | 'DELETING' | 'FAILED' | 'UPDATING';
  Endpoint: string;
  RoleArn: string;
  VpcId: string;
  SubnetIds: string[];
  CreatedAt: string;
  Tags: Tag[];
}

export interface EKSNodeGroup {
  NodegroupName: string;
  NodegroupArn: string;
  ClusterName: string;
  Status: 'ACTIVE' | 'CREATING' | 'DELETING' | 'DEGRADED' | 'UPDATING';
  InstanceTypes: string[];
  DesiredSize: number;
  MinSize: number;
  MaxSize: number;
  AmiType: string;
  Tags: Tag[];
}

// API Gateway Types
export interface APIGatewayAPI {
  ApiId: string;
  Name: string;
  Description: string;
  Protocol: 'REST' | 'HTTP' | 'WEBSOCKET';
  CreatedDate: string;
  Endpoint: string;
  Stages: APIGatewayStage[];
  Routes: APIGatewayRoute[];
  Tags: Tag[];
}

export interface APIGatewayStage {
  StageName: string;
  Description: string;
  DeploymentId: string;
  CreatedDate: string;
}

export interface APIGatewayRoute {
  RouteId: string;
  RouteKey: string;
  Method: string;
  Path: string;
  Integration: string;
}

// Elastic Beanstalk Types
export interface EBApplication {
  ApplicationName: string;
  ApplicationArn: string;
  Description: string;
  DateCreated: string;
  DateUpdated: string;
  Environments: EBEnvironment[];
  Tags: Tag[];
}

export interface EBEnvironment {
  EnvironmentId: string;
  EnvironmentName: string;
  ApplicationName: string;
  SolutionStackName: string;
  Status: 'Ready' | 'Launching' | 'Updating' | 'Terminating' | 'Terminated';
  Health: 'Green' | 'Yellow' | 'Red' | 'Grey';
  CNAME: string;
  DateCreated: string;
  Tags: Tag[];
}

// CodePipeline Types
export interface Pipeline {
  PipelineName: string;
  PipelineArn: string;
  CreatedAt: string;
  UpdatedAt: string;
  Stages: PipelineStage[];
  Tags: Tag[];
}

export interface PipelineStage {
  StageName: string;
  Actions: PipelineAction[];
  Status: 'Succeeded' | 'Failed' | 'InProgress' | 'Stopped';
}

export interface PipelineAction {
  ActionName: string;
  ActionType: string;
  Provider: string;
  Status: 'Succeeded' | 'Failed' | 'InProgress';
}

// Secrets Manager Types
export interface Secret {
  SecretId: string;
  Name: string;
  Description: string;
  SecretArn: string;
  CreatedDate: string;
  LastChangedDate: string;
  LastAccessedDate?: string;
  RotationEnabled: boolean;
  SecretValue: string;
  Tags: Tag[];
}

// CloudFront Types
export interface CFDistribution {
  DistributionId: string;
  DomainName: string;
  Status: 'Deployed' | 'InProgress';
  Enabled: boolean;
  Origins: { DomainName: string; Id: string; OriginPath: string }[];
  DefaultCacheBehavior: string;
  PriceClass: 'PriceClass_All' | 'PriceClass_200' | 'PriceClass_100';
  Comment: string;
  LastModifiedTime: string;
  Tags: Tag[];
}

// ElastiCache Types
export interface ElastiCacheCluster {
  CacheClusterId: string;
  CacheClusterStatus: 'available' | 'creating' | 'deleting' | 'modifying' | 'rebooting';
  Engine: 'redis' | 'memcached';
  EngineVersion: string;
  CacheNodeType: string;
  NumCacheNodes: number;
  PreferredAvailabilityZone: string;
  CacheClusterCreateTime: string;
  Tags: Tag[];
}

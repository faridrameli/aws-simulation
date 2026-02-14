export const AWS_REGIONS = [
  { code: 'us-east-1', name: 'US East (N. Virginia)' },
  { code: 'us-east-2', name: 'US East (Ohio)' },
  { code: 'us-west-1', name: 'US West (N. California)' },
  { code: 'us-west-2', name: 'US West (Oregon)' },
  { code: 'eu-west-1', name: 'Europe (Ireland)' },
  { code: 'eu-west-2', name: 'Europe (London)' },
  { code: 'eu-west-3', name: 'Europe (Paris)' },
  { code: 'eu-central-1', name: 'Europe (Frankfurt)' },
  { code: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)' },
  { code: 'ap-northeast-2', name: 'Asia Pacific (Seoul)' },
  { code: 'ap-southeast-1', name: 'Asia Pacific (Singapore)' },
  { code: 'ap-southeast-2', name: 'Asia Pacific (Sydney)' },
  { code: 'ap-south-1', name: 'Asia Pacific (Mumbai)' },
  { code: 'sa-east-1', name: 'South America (São Paulo)' },
  { code: 'ca-central-1', name: 'Canada (Central)' },
] as const;

export const DEFAULT_REGION = 'us-east-1';

export const ACCOUNT_ID = '123456789012';

export const EC2_INSTANCE_TYPES = [
  't2.micro', 't2.small', 't2.medium', 't2.large', 't2.xlarge', 't2.2xlarge',
  't3.micro', 't3.small', 't3.medium', 't3.large', 't3.xlarge', 't3.2xlarge',
  'm5.large', 'm5.xlarge', 'm5.2xlarge', 'm5.4xlarge',
  'c5.large', 'c5.xlarge', 'c5.2xlarge', 'c5.4xlarge',
  'r5.large', 'r5.xlarge', 'r5.2xlarge',
  'g4dn.xlarge', 'g4dn.2xlarge',
  'p3.2xlarge', 'p3.8xlarge',
] as const;

export const EC2_AMIS = [
  { id: 'ami-0abcdef1234567890', name: 'Amazon Linux 2023 AMI', platform: 'Linux' },
  { id: 'ami-0123456789abcdef0', name: 'Amazon Linux 2 AMI', platform: 'Linux' },
  { id: 'ami-0fedcba987654321f', name: 'Ubuntu Server 22.04 LTS', platform: 'Linux' },
  { id: 'ami-0aabbccdd11223344', name: 'Ubuntu Server 20.04 LTS', platform: 'Linux' },
  { id: 'ami-0112233445566778f', name: 'Red Hat Enterprise Linux 9', platform: 'Linux' },
  { id: 'ami-0998877665544332f', name: 'SUSE Linux Enterprise Server 15', platform: 'Linux' },
  { id: 'ami-0deadbeef00000001', name: 'Microsoft Windows Server 2022 Base', platform: 'Windows' },
  { id: 'ami-0deadbeef00000002', name: 'Microsoft Windows Server 2019 Base', platform: 'Windows' },
  { id: 'ami-0cafebabe00000001', name: 'Debian 12', platform: 'Linux' },
] as const;

export const RDS_ENGINES = [
  { engine: 'mysql', versions: ['8.0.35', '8.0.33', '5.7.44'] },
  { engine: 'postgres', versions: ['16.1', '15.4', '14.9', '13.13'] },
  { engine: 'mariadb', versions: ['10.11.6', '10.6.16', '10.5.23'] },
  { engine: 'oracle-ee', versions: ['19.0.0.0'] },
  { engine: 'sqlserver-ex', versions: ['16.00', '15.00', '14.00'] },
  { engine: 'aurora-mysql', versions: ['3.04.1', '2.12.1'] },
  { engine: 'aurora-postgresql', versions: ['15.4', '14.9'] },
] as const;

export const RDS_INSTANCE_CLASSES = [
  'db.t3.micro', 'db.t3.small', 'db.t3.medium', 'db.t3.large',
  'db.m5.large', 'db.m5.xlarge', 'db.m5.2xlarge',
  'db.r5.large', 'db.r5.xlarge', 'db.r5.2xlarge',
] as const;

export const LAMBDA_RUNTIMES = [
  'nodejs20.x', 'nodejs18.x',
  'python3.12', 'python3.11', 'python3.10', 'python3.9',
  'java21', 'java17', 'java11',
  'dotnet8', 'dotnet6',
  'ruby3.3', 'ruby3.2',
  'go1.x',
  'provided.al2023', 'provided.al2',
] as const;

export const ELASTICACHE_NODE_TYPES = [
  'cache.t3.micro', 'cache.t3.small', 'cache.t3.medium',
  'cache.m5.large', 'cache.m5.xlarge',
  'cache.r5.large', 'cache.r5.xlarge',
] as const;

export const SERVICE_CATALOG = [
  { name: 'EC2', fullName: 'Elastic Compute Cloud', path: '/ec2', category: 'Compute', description: 'Virtual servers in the cloud' },
  { name: 'S3', fullName: 'Simple Storage Service', path: '/s3', category: 'Storage', description: 'Scalable storage in the cloud' },
  { name: 'Lambda', fullName: 'Lambda', path: '/lambda', category: 'Compute', description: 'Run code without thinking about servers' },
  { name: 'IAM', fullName: 'Identity and Access Management', path: '/iam', category: 'Security, Identity, & Compliance', description: 'Manage access to AWS resources' },
  { name: 'RDS', fullName: 'Relational Database Service', path: '/rds', category: 'Database', description: 'Managed relational database service' },
  { name: 'VPC', fullName: 'Virtual Private Cloud', path: '/vpc', category: 'Networking & Content Delivery', description: 'Isolated cloud resources' },
  { name: 'DynamoDB', fullName: 'DynamoDB', path: '/dynamodb', category: 'Database', description: 'Managed NoSQL database' },
  { name: 'CloudWatch', fullName: 'CloudWatch', path: '/cloudwatch', category: 'Management & Governance', description: 'Monitor resources and applications' },
  { name: 'Route 53', fullName: 'Route 53', path: '/route53', category: 'Networking & Content Delivery', description: 'Scalable DNS and domain name registration' },
  { name: 'CloudFormation', fullName: 'CloudFormation', path: '/cloudformation', category: 'Management & Governance', description: 'Create and manage resources with templates' },
  { name: 'SNS', fullName: 'Simple Notification Service', path: '/sns', category: 'Application Integration', description: 'Pub/sub messaging and mobile notifications' },
  { name: 'SQS', fullName: 'Simple Queue Service', path: '/sqs', category: 'Application Integration', description: 'Managed message queues' },
  { name: 'ECS', fullName: 'Elastic Container Service', path: '/ecs', category: 'Containers', description: 'Run and manage Docker containers' },
  { name: 'EKS', fullName: 'Elastic Kubernetes Service', path: '/eks', category: 'Containers', description: 'Managed Kubernetes service' },
  { name: 'API Gateway', fullName: 'API Gateway', path: '/apigateway', category: 'Networking & Content Delivery', description: 'Build, deploy, and manage APIs' },
  { name: 'Elastic Beanstalk', fullName: 'Elastic Beanstalk', path: '/elasticbeanstalk', category: 'Compute', description: 'Deploy and scale web applications' },
  { name: 'CodePipeline', fullName: 'CodePipeline', path: '/codepipeline', category: 'Developer Tools', description: 'Automate continuous delivery pipelines' },
  { name: 'Secrets Manager', fullName: 'Secrets Manager', path: '/secretsmanager', category: 'Security, Identity, & Compliance', description: 'Rotate, manage, and retrieve secrets' },
  { name: 'CloudFront', fullName: 'CloudFront', path: '/cloudfront', category: 'Networking & Content Delivery', description: 'Global content delivery network' },
  { name: 'ElastiCache', fullName: 'ElastiCache', path: '/elasticache', category: 'Database', description: 'In-memory caching service' },
] as const;

export const SERVICE_CATEGORIES = [
  'Compute',
  'Storage',
  'Database',
  'Networking & Content Delivery',
  'Security, Identity, & Compliance',
  'Management & Governance',
  'Application Integration',
  'Containers',
  'Developer Tools',
] as const;

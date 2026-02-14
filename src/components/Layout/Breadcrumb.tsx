import { Link, useLocation } from 'react-router-dom';

const nameMap: Record<string, string> = {
  ec2: 'EC2',
  s3: 'S3',
  lambda: 'Lambda',
  iam: 'IAM',
  rds: 'RDS',
  vpc: 'VPC',
  dynamodb: 'DynamoDB',
  cloudwatch: 'CloudWatch',
  route53: 'Route 53',
  cloudformation: 'CloudFormation',
  sns: 'SNS',
  sqs: 'SQS',
  ecs: 'ECS',
  eks: 'EKS',
  apigateway: 'API Gateway',
  elasticbeanstalk: 'Elastic Beanstalk',
  codepipeline: 'CodePipeline',
  secretsmanager: 'Secrets Manager',
  cloudfront: 'CloudFront',
  elasticache: 'ElastiCache',
  instances: 'Instances',
  'security-groups': 'Security Groups',
  'key-pairs': 'Key Pairs',
  'elastic-ips': 'Elastic IPs',
  volumes: 'Volumes',
  buckets: 'Buckets',
  functions: 'Functions',
  layers: 'Layers',
  users: 'Users',
  groups: 'Groups',
  roles: 'Roles',
  policies: 'Policies',
  databases: 'Databases',
  snapshots: 'Snapshots',
  vpcs: 'VPCs',
  subnets: 'Subnets',
  'route-tables': 'Route Tables',
  'internet-gateways': 'Internet Gateways',
  'nat-gateways': 'NAT Gateways',
  tables: 'Tables',
  alarms: 'Alarms',
  'log-groups': 'Log Groups',
  dashboards: 'Dashboards',
  'hosted-zones': 'Hosted Zones',
  stacks: 'Stacks',
  topics: 'Topics',
  queues: 'Queues',
  clusters: 'Clusters',
  services: 'Services',
  'task-definitions': 'Task Definitions',
  'node-groups': 'Node Groups',
  apis: 'APIs',
  applications: 'Applications',
  environments: 'Environments',
  pipelines: 'Pipelines',
  secrets: 'Secrets',
  distributions: 'Distributions',
  launch: 'Launch Instance',
  create: 'Create',
};

export default function Breadcrumb() {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);

  if (parts.length === 0) return null;

  return (
    <div className="aws-breadcrumb">
      <Link to="/">AWS Console</Link>
      {parts.map((part, i) => {
        const path = '/' + parts.slice(0, i + 1).join('/');
        const label = nameMap[part] || decodeURIComponent(part);
        const isLast = i === parts.length - 1;

        return (
          <span key={path}>
            <span className="aws-breadcrumb-separator">/</span>
            {isLast ? (
              <span>{label}</span>
            ) : (
              <Link to={path}>{label}</Link>
            )}
          </span>
        );
      })}
    </div>
  );
}

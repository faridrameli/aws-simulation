import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopNav from './components/Layout/TopNav';
import ServiceLayout from './components/Layout/ServiceLayout';
import type { NavSection } from './components/Layout/ServiceLayout';
import ConsoleDashboard from './pages/ConsoleDashboard';

// EC2
import EC2Dashboard from './services/EC2/EC2Dashboard';
import Instances from './services/EC2/Instances';
import InstanceDetail from './services/EC2/InstanceDetail';
import LaunchInstance from './services/EC2/LaunchInstance';
import SecurityGroups from './services/EC2/SecurityGroups';
import KeyPairs from './services/EC2/KeyPairs';
import ElasticIPs from './services/EC2/ElasticIPs';

// S3
import S3Dashboard from './services/S3/S3Dashboard';
import Buckets from './services/S3/Buckets';
import BucketDetail from './services/S3/BucketDetail';
import CreateBucket from './services/S3/CreateBucket';

// Lambda
import LambdaDashboard from './services/Lambda/LambdaDashboard';
import Functions from './services/Lambda/Functions';
import FunctionDetail from './services/Lambda/FunctionDetail';
import CreateFunction from './services/Lambda/CreateFunction';

// IAM
import IAMDashboard from './services/IAM/IAMDashboard';
import Users from './services/IAM/Users';
import UserDetail from './services/IAM/UserDetail';
import Groups from './services/IAM/Groups';
import Roles from './services/IAM/Roles';
import Policies from './services/IAM/Policies';

// RDS
import RDSDashboard from './services/RDS/RDSDashboard';
import Databases from './services/RDS/Databases';
import DatabaseDetail from './services/RDS/DatabaseDetail';
import CreateDatabase from './services/RDS/CreateDatabase';

// VPC
import VPCDashboard from './services/VPC/VPCDashboard';
import VPCs from './services/VPC/VPCs';
import VPCDetail from './services/VPC/VPCDetail';
import Subnets from './services/VPC/Subnets';
import RouteTables from './services/VPC/RouteTables';
import InternetGateways from './services/VPC/InternetGateways';
import NATGateways from './services/VPC/NATGateways';

// DynamoDB
import DynamoDBDashboard from './services/DynamoDB/DynamoDBDashboard';
import DynamoDBTables from './services/DynamoDB/Tables';

// CloudWatch
import CloudWatchDashboard from './services/CloudWatch/CloudWatchDashboard';
import CWAlarms from './services/CloudWatch/Alarms';
import CWLogGroups from './services/CloudWatch/LogGroups';
import CWDashboards from './services/CloudWatch/Dashboards';

// Route 53
import Route53Dashboard from './services/Route53/Route53Dashboard';
import HostedZones from './services/Route53/HostedZones';

// CloudFormation
import CloudFormationDashboard from './services/CloudFormation/CloudFormationDashboard';
import CFStacks from './services/CloudFormation/Stacks';

// SNS
import SNSDashboard from './services/SNS/SNSDashboard';
import SNSTopics from './services/SNS/Topics';

// SQS
import SQSDashboard from './services/SQS/SQSDashboard';
import SQSQueues from './services/SQS/Queues';

// ECS
import ECSDashboard from './services/ECS/ECSDashboard';
import ECSClusters from './services/ECS/Clusters';
import ECSTaskDefinitions from './services/ECS/TaskDefinitions';

// EKS
import EKSDashboard from './services/EKS/EKSDashboard';
import EKSClusters from './services/EKS/EKSClusters';

// API Gateway
import APIGatewayDashboard from './services/APIGateway/APIGatewayDashboard';
import APIGatewayAPIs from './services/APIGateway/APIs';

// Elastic Beanstalk
import ElasticBeanstalkDashboard from './services/ElasticBeanstalk/ElasticBeanstalkDashboard';
import EBApplications from './services/ElasticBeanstalk/Applications';

// CodePipeline
import CodePipelineDashboard from './services/CodePipeline/CodePipelineDashboard';
import CPPipelines from './services/CodePipeline/Pipelines';

// Secrets Manager
import SecretsManagerDashboard from './services/SecretsManager/SecretsManagerDashboard';
import SMSecrets from './services/SecretsManager/Secrets';

// CloudFront
import CloudFrontDashboard from './services/CloudFront/CloudFrontDashboard';
import CFDistributions from './services/CloudFront/Distributions';

// ElastiCache
import ElastiCacheDashboard from './services/ElastiCache/ElastiCacheDashboard';
import ElastiCacheClusters from './services/ElastiCache/ElastiCacheClusters';

// Nav configurations
const ec2Nav: NavSection[] = [
  {
    title: 'Instances',
    items: [
      { label: 'Dashboard', path: '/ec2' },
      { label: 'Instances', path: '/ec2/instances' },
      { label: 'Launch Instance', path: '/ec2/instances/launch' },
    ],
  },
  {
    title: 'Network & Security',
    items: [
      { label: 'Security Groups', path: '/ec2/security-groups' },
      { label: 'Key Pairs', path: '/ec2/key-pairs' },
      { label: 'Elastic IPs', path: '/ec2/elastic-ips' },
    ],
  },
];

const s3Nav: NavSection[] = [
  {
    title: 'Amazon S3',
    items: [
      { label: 'Dashboard', path: '/s3' },
      { label: 'Buckets', path: '/s3/buckets' },
    ],
  },
];

const lambdaNav: NavSection[] = [
  {
    title: 'AWS Lambda',
    items: [
      { label: 'Dashboard', path: '/lambda' },
      { label: 'Functions', path: '/lambda/functions' },
    ],
  },
];

const iamNav: NavSection[] = [
  {
    title: 'Access management',
    items: [
      { label: 'Dashboard', path: '/iam' },
      { label: 'Users', path: '/iam/users' },
      { label: 'User groups', path: '/iam/groups' },
      { label: 'Roles', path: '/iam/roles' },
      { label: 'Policies', path: '/iam/policies' },
    ],
  },
];

const rdsNav: NavSection[] = [
  {
    title: 'Amazon RDS',
    items: [
      { label: 'Dashboard', path: '/rds' },
      { label: 'Databases', path: '/rds/databases' },
    ],
  },
];

const vpcNav: NavSection[] = [
  {
    title: 'Virtual Private Cloud',
    items: [
      { label: 'Dashboard', path: '/vpc' },
      { label: 'Your VPCs', path: '/vpc/vpcs' },
      { label: 'Subnets', path: '/vpc/subnets' },
      { label: 'Route Tables', path: '/vpc/route-tables' },
      { label: 'Internet Gateways', path: '/vpc/internet-gateways' },
      { label: 'NAT Gateways', path: '/vpc/nat-gateways' },
    ],
  },
];

const dynamoNav: NavSection[] = [
  {
    title: 'DynamoDB',
    items: [
      { label: 'Dashboard', path: '/dynamodb' },
      { label: 'Tables', path: '/dynamodb/tables' },
    ],
  },
];

const cloudwatchNav: NavSection[] = [
  {
    title: 'CloudWatch',
    items: [
      { label: 'Dashboard', path: '/cloudwatch' },
      { label: 'Alarms', path: '/cloudwatch/alarms' },
      { label: 'Log groups', path: '/cloudwatch/log-groups' },
      { label: 'Dashboards', path: '/cloudwatch/dashboards' },
    ],
  },
];

const route53Nav: NavSection[] = [
  {
    title: 'Route 53',
    items: [
      { label: 'Dashboard', path: '/route53' },
      { label: 'Hosted zones', path: '/route53/hosted-zones' },
    ],
  },
];

const cfnNav: NavSection[] = [
  {
    title: 'CloudFormation',
    items: [
      { label: 'Dashboard', path: '/cloudformation' },
      { label: 'Stacks', path: '/cloudformation/stacks' },
    ],
  },
];

const snsNav: NavSection[] = [
  {
    title: 'SNS',
    items: [
      { label: 'Dashboard', path: '/sns' },
      { label: 'Topics', path: '/sns/topics' },
    ],
  },
];

const sqsNav: NavSection[] = [
  {
    title: 'SQS',
    items: [
      { label: 'Dashboard', path: '/sqs' },
      { label: 'Queues', path: '/sqs/queues' },
    ],
  },
];

const ecsNav: NavSection[] = [
  {
    title: 'ECS',
    items: [
      { label: 'Dashboard', path: '/ecs' },
      { label: 'Clusters', path: '/ecs/clusters' },
      { label: 'Task Definitions', path: '/ecs/task-definitions' },
    ],
  },
];

const eksNav: NavSection[] = [
  {
    title: 'EKS',
    items: [
      { label: 'Dashboard', path: '/eks' },
      { label: 'Clusters', path: '/eks/clusters' },
    ],
  },
];

const apiGwNav: NavSection[] = [
  {
    title: 'API Gateway',
    items: [
      { label: 'Dashboard', path: '/apigateway' },
      { label: 'APIs', path: '/apigateway/apis' },
    ],
  },
];

const ebNav: NavSection[] = [
  {
    title: 'Elastic Beanstalk',
    items: [
      { label: 'Dashboard', path: '/elasticbeanstalk' },
      { label: 'Applications', path: '/elasticbeanstalk/applications' },
    ],
  },
];

const cpNav: NavSection[] = [
  {
    title: 'CodePipeline',
    items: [
      { label: 'Dashboard', path: '/codepipeline' },
      { label: 'Pipelines', path: '/codepipeline/pipelines' },
    ],
  },
];

const smNav: NavSection[] = [
  {
    title: 'Secrets Manager',
    items: [
      { label: 'Dashboard', path: '/secretsmanager' },
      { label: 'Secrets', path: '/secretsmanager/secrets' },
    ],
  },
];

const cfNav: NavSection[] = [
  {
    title: 'CloudFront',
    items: [
      { label: 'Dashboard', path: '/cloudfront' },
      { label: 'Distributions', path: '/cloudfront/distributions' },
    ],
  },
];

const ecacheNav: NavSection[] = [
  {
    title: 'ElastiCache',
    items: [
      { label: 'Dashboard', path: '/elasticache' },
      { label: 'Clusters', path: '/elasticache/clusters' },
    ],
  },
];

export default function App() {
  return (
    <BrowserRouter>
      <TopNav />
      <Routes>
        <Route path="/" element={<ConsoleDashboard />} />

        {/* EC2 */}
        <Route path="/ec2" element={<ServiceLayout serviceName="EC2" sections={ec2Nav} />}>
          <Route index element={<EC2Dashboard />} />
          <Route path="instances" element={<Instances />} />
          <Route path="instances/launch" element={<LaunchInstance />} />
          <Route path="instances/:id" element={<InstanceDetail />} />
          <Route path="security-groups" element={<SecurityGroups />} />
          <Route path="key-pairs" element={<KeyPairs />} />
          <Route path="elastic-ips" element={<ElasticIPs />} />
        </Route>

        {/* S3 */}
        <Route path="/s3" element={<ServiceLayout serviceName="S3" sections={s3Nav} />}>
          <Route index element={<S3Dashboard />} />
          <Route path="buckets" element={<Buckets />} />
          <Route path="buckets/create" element={<CreateBucket />} />
          <Route path="buckets/:name" element={<BucketDetail />} />
        </Route>

        {/* Lambda */}
        <Route path="/lambda" element={<ServiceLayout serviceName="Lambda" sections={lambdaNav} />}>
          <Route index element={<LambdaDashboard />} />
          <Route path="functions" element={<Functions />} />
          <Route path="functions/create" element={<CreateFunction />} />
          <Route path="functions/:name" element={<FunctionDetail />} />
        </Route>

        {/* IAM */}
        <Route path="/iam" element={<ServiceLayout serviceName="IAM" sections={iamNav} />}>
          <Route index element={<IAMDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:name" element={<UserDetail />} />
          <Route path="groups" element={<Groups />} />
          <Route path="roles" element={<Roles />} />
          <Route path="policies" element={<Policies />} />
        </Route>

        {/* RDS */}
        <Route path="/rds" element={<ServiceLayout serviceName="RDS" sections={rdsNav} />}>
          <Route index element={<RDSDashboard />} />
          <Route path="databases" element={<Databases />} />
          <Route path="databases/create" element={<CreateDatabase />} />
          <Route path="databases/:id" element={<DatabaseDetail />} />
        </Route>

        {/* VPC */}
        <Route path="/vpc" element={<ServiceLayout serviceName="VPC" sections={vpcNav} />}>
          <Route index element={<VPCDashboard />} />
          <Route path="vpcs" element={<VPCs />} />
          <Route path="vpcs/:id" element={<VPCDetail />} />
          <Route path="subnets" element={<Subnets />} />
          <Route path="route-tables" element={<RouteTables />} />
          <Route path="internet-gateways" element={<InternetGateways />} />
          <Route path="nat-gateways" element={<NATGateways />} />
        </Route>

        {/* DynamoDB */}
        <Route path="/dynamodb" element={<ServiceLayout serviceName="DynamoDB" sections={dynamoNav} />}>
          <Route index element={<DynamoDBDashboard />} />
          <Route path="tables" element={<DynamoDBTables />} />
        </Route>

        {/* CloudWatch */}
        <Route path="/cloudwatch" element={<ServiceLayout serviceName="CloudWatch" sections={cloudwatchNav} />}>
          <Route index element={<CloudWatchDashboard />} />
          <Route path="alarms" element={<CWAlarms />} />
          <Route path="log-groups" element={<CWLogGroups />} />
          <Route path="dashboards" element={<CWDashboards />} />
        </Route>

        {/* Route 53 */}
        <Route path="/route53" element={<ServiceLayout serviceName="Route 53" sections={route53Nav} />}>
          <Route index element={<Route53Dashboard />} />
          <Route path="hosted-zones" element={<HostedZones />} />
        </Route>

        {/* CloudFormation */}
        <Route path="/cloudformation" element={<ServiceLayout serviceName="CloudFormation" sections={cfnNav} />}>
          <Route index element={<CloudFormationDashboard />} />
          <Route path="stacks" element={<CFStacks />} />
        </Route>

        {/* SNS */}
        <Route path="/sns" element={<ServiceLayout serviceName="SNS" sections={snsNav} />}>
          <Route index element={<SNSDashboard />} />
          <Route path="topics" element={<SNSTopics />} />
        </Route>

        {/* SQS */}
        <Route path="/sqs" element={<ServiceLayout serviceName="SQS" sections={sqsNav} />}>
          <Route index element={<SQSDashboard />} />
          <Route path="queues" element={<SQSQueues />} />
        </Route>

        {/* ECS */}
        <Route path="/ecs" element={<ServiceLayout serviceName="ECS" sections={ecsNav} />}>
          <Route index element={<ECSDashboard />} />
          <Route path="clusters" element={<ECSClusters />} />
          <Route path="task-definitions" element={<ECSTaskDefinitions />} />
        </Route>

        {/* EKS */}
        <Route path="/eks" element={<ServiceLayout serviceName="EKS" sections={eksNav} />}>
          <Route index element={<EKSDashboard />} />
          <Route path="clusters" element={<EKSClusters />} />
        </Route>

        {/* API Gateway */}
        <Route path="/apigateway" element={<ServiceLayout serviceName="API Gateway" sections={apiGwNav} />}>
          <Route index element={<APIGatewayDashboard />} />
          <Route path="apis" element={<APIGatewayAPIs />} />
        </Route>

        {/* Elastic Beanstalk */}
        <Route path="/elasticbeanstalk" element={<ServiceLayout serviceName="Elastic Beanstalk" sections={ebNav} />}>
          <Route index element={<ElasticBeanstalkDashboard />} />
          <Route path="applications" element={<EBApplications />} />
        </Route>

        {/* CodePipeline */}
        <Route path="/codepipeline" element={<ServiceLayout serviceName="CodePipeline" sections={cpNav} />}>
          <Route index element={<CodePipelineDashboard />} />
          <Route path="pipelines" element={<CPPipelines />} />
        </Route>

        {/* Secrets Manager */}
        <Route path="/secretsmanager" element={<ServiceLayout serviceName="Secrets Manager" sections={smNav} />}>
          <Route index element={<SecretsManagerDashboard />} />
          <Route path="secrets" element={<SMSecrets />} />
        </Route>

        {/* CloudFront */}
        <Route path="/cloudfront" element={<ServiceLayout serviceName="CloudFront" sections={cfNav} />}>
          <Route index element={<CloudFrontDashboard />} />
          <Route path="distributions" element={<CFDistributions />} />
        </Route>

        {/* ElastiCache */}
        <Route path="/elasticache" element={<ServiceLayout serviceName="ElastiCache" sections={ecacheNav} />}>
          <Route index element={<ElastiCacheDashboard />} />
          <Route path="clusters" element={<ElastiCacheClusters />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

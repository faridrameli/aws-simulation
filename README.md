# AWS Management Console Simulation

A browser-based simulation of the AWS Management Console built for learning purposes. Explore and interact with 20 AWS services without needing an AWS account or incurring any costs.

## What is this?

This project replicates the look and feel of the real AWS Console. You can create, view, and manage simulated AWS resources to understand how each service works before using the real thing. All data is stored locally in your browser via localStorage.

## Simulated Services

**Compute**
- EC2 (Elastic Compute Cloud) - Launch instances, manage security groups, key pairs, elastic IPs
- Lambda - Create and manage serverless functions
- Elastic Beanstalk - Deploy and manage web applications

**Storage**
- S3 (Simple Storage Service) - Create buckets and manage objects

**Database**
- RDS (Relational Database Service) - Create and manage relational databases
- DynamoDB - Create and manage NoSQL tables
- ElastiCache - Create Redis and Memcached clusters

**Networking & Content Delivery**
- VPC (Virtual Private Cloud) - Manage VPCs, subnets, route tables, gateways
- Route 53 - Manage DNS hosted zones and records
- CloudFront - Create CDN distributions
- API Gateway - Build REST, HTTP, and WebSocket APIs

**Security, Identity & Compliance**
- IAM (Identity and Access Management) - Manage users, groups, roles, and policies
- Secrets Manager - Store and manage secrets

**Management & Governance**
- CloudWatch - Create alarms, log groups, and dashboards
- CloudFormation - Manage infrastructure as code stacks

**Application Integration**
- SNS (Simple Notification Service) - Create topics and subscriptions
- SQS (Simple Queue Service) - Create standard and FIFO queues

**Containers**
- ECS (Elastic Container Service) - Manage clusters and task definitions
- EKS (Elastic Kubernetes Service) - Manage Kubernetes clusters

**Developer Tools**
- CodePipeline - Create CI/CD pipelines

## Getting Started

```bash
# Install dependencies
yarn

# Start the development server
yarn start
```

Open http://localhost:5173 in your browser.

## Tech Stack

- React 19 + TypeScript
- Vite
- React Router
- Zustand (state management with localStorage persistence)

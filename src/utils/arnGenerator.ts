import { ACCOUNT_ID } from './constants';

export function generateArn(
  service: string,
  region: string,
  resourceType: string,
  resourceId: string
): string {
  // Some services are global (no region)
  const regionPart = ['iam', 's3', 'route53', 'cloudfront'].includes(service) ? '' : region;

  // Some resources use different separators
  if (resourceType) {
    return `arn:aws:${service}:${regionPart}:${ACCOUNT_ID}:${resourceType}/${resourceId}`;
  }
  return `arn:aws:${service}:${regionPart}:${ACCOUNT_ID}:${resourceId}`;
}

export function generateLambdaArn(region: string, functionName: string): string {
  return `arn:aws:lambda:${region}:${ACCOUNT_ID}:function:${functionName}`;
}

export function generateIAMArn(resourceType: string, resourceName: string, path: string = '/'): string {
  return `arn:aws:iam::${ACCOUNT_ID}:${resourceType}${path}${resourceName}`;
}

export function generateTopicArn(region: string, topicName: string): string {
  return `arn:aws:sns:${region}:${ACCOUNT_ID}:${topicName}`;
}

export function generateQueueArn(region: string, queueName: string): string {
  return `arn:aws:sqs:${region}:${ACCOUNT_ID}:${queueName}`;
}

export function generateTableArn(region: string, tableName: string): string {
  return `arn:aws:dynamodb:${region}:${ACCOUNT_ID}:table/${tableName}`;
}

export function generateClusterArn(service: string, region: string, clusterName: string): string {
  return `arn:aws:${service}:${region}:${ACCOUNT_ID}:cluster/${clusterName}`;
}

export function generateLogGroupArn(region: string, logGroupName: string): string {
  return `arn:aws:logs:${region}:${ACCOUNT_ID}:log-group:${logGroupName}`;
}

// Convenience wrapper: generateARN('service', 'resource-path') with default region
export function generateARN(service: string, resource: string, region: string = 'us-east-1'): string {
  const globalServices = ['iam', 's3', 'route53', 'cloudfront'];
  const regionPart = globalServices.includes(service) ? '' : region;
  return `arn:aws:${service}:${regionPart}:${ACCOUNT_ID}:${resource}`;
}

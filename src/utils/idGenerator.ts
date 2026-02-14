import { v4 as uuidv4 } from 'uuid';

function hexChars(length: number): string {
  return uuidv4().replace(/-/g, '').substring(0, length);
}

export function generateInstanceId(): string {
  return `i-${hexChars(17)}`;
}

export function generateSecurityGroupId(): string {
  return `sg-${hexChars(17)}`;
}

export function generateKeyPairId(): string {
  return `key-${hexChars(17)}`;
}

export function generateVpcId(): string {
  return `vpc-${hexChars(17)}`;
}

export function generateSubnetId(): string {
  return `subnet-${hexChars(17)}`;
}

export function generateRouteTableId(): string {
  return `rtb-${hexChars(17)}`;
}

export function generateInternetGatewayId(): string {
  return `igw-${hexChars(17)}`;
}

export function generateNatGatewayId(): string {
  return `nat-${hexChars(17)}`;
}

export function generateVolumeId(): string {
  return `vol-${hexChars(17)}`;
}

export function generateAllocationId(): string {
  return `eipalloc-${hexChars(17)}`;
}

export function generateDBInstanceId(): string {
  return `db-${hexChars(26).toUpperCase()}`;
}

export function generateStackId(): string {
  return uuidv4();
}

export function generateDistributionId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'E';
  for (let i = 0; i < 13; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateUserId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'AIDA';
  for (let i = 0; i < 17; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateRoleId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'AROA';
  for (let i = 0; i < 17; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateGroupId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'AGPA';
  for (let i = 0; i < 17; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generatePolicyId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ANPA';
  for (let i = 0; i < 17; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateAccessKeyId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'AKIA';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateApiId(): string {
  return hexChars(10);
}

export function generateCacheClusterId(): string {
  return `cluster-${hexChars(8)}`;
}

export function generateHostedZoneId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'Z';
  for (let i = 0; i < 13; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generatePrivateIp(): string {
  return `10.0.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 254) + 1}`;
}

export function generatePublicIp(): string {
  return `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

// Convenience wrapper for generating IDs by resource type
export function generateId(resourceType: string): string {
  const generators: Record<string, () => string> = {
    instance: generateInstanceId,
    sg: generateSecurityGroupId,
    keypair: generateKeyPairId,
    vpc: generateVpcId,
    subnet: generateSubnetId,
    rtb: generateRouteTableId,
    igw: generateInternetGatewayId,
    nat: generateNatGatewayId,
    volume: generateVolumeId,
    eip: generateAllocationId,
    db: generateDBInstanceId,
    stack: generateStackId,
    cloudfront: generateDistributionId,
    user: generateUserId,
    role: generateRoleId,
    group: generateGroupId,
    policy: generatePolicyId,
    accesskey: generateAccessKeyId,
    apigateway: generateApiId,
    cache: generateCacheClusterId,
    hostedzone: generateHostedZoneId,
  };
  const gen = generators[resourceType];
  if (gen) return gen();
  return hexChars(17);
}

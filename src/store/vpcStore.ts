import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { VPC, Subnet, RouteTable, InternetGateway, NATGateway } from '../types/aws';

interface VPCState {
  vpcs: VPC[];
  subnets: Subnet[];
  routeTables: RouteTable[];
  internetGateways: InternetGateway[];
  natGateways: NATGateway[];
  addVPC: (vpc: VPC) => void;
  removeVPC: (id: string) => void;
  addSubnet: (subnet: Subnet) => void;
  removeSubnet: (id: string) => void;
  addRouteTable: (rt: RouteTable) => void;
  removeRouteTable: (id: string) => void;
  addInternetGateway: (igw: InternetGateway) => void;
  removeInternetGateway: (id: string) => void;
  addNATGateway: (nat: NATGateway) => void;
  removeNATGateway: (id: string) => void;
}

export const useVPCStore = create<VPCState>()(
  persist(
    (set) => ({
      vpcs: [],
      subnets: [],
      routeTables: [],
      internetGateways: [],
      natGateways: [],
      addVPC: (vpc) => set((s) => ({ vpcs: [...s.vpcs, vpc] })),
      removeVPC: (id) => set((s) => ({ vpcs: s.vpcs.filter((v) => v.VpcId !== id) })),
      addSubnet: (subnet) => set((s) => ({ subnets: [...s.subnets, subnet] })),
      removeSubnet: (id) => set((s) => ({ subnets: s.subnets.filter((s2) => s2.SubnetId !== id) })),
      addRouteTable: (rt) => set((s) => ({ routeTables: [...s.routeTables, rt] })),
      removeRouteTable: (id) => set((s) => ({ routeTables: s.routeTables.filter((r) => r.RouteTableId !== id) })),
      addInternetGateway: (igw) => set((s) => ({ internetGateways: [...s.internetGateways, igw] })),
      removeInternetGateway: (id) => set((s) => ({ internetGateways: s.internetGateways.filter((i) => i.InternetGatewayId !== id) })),
      addNATGateway: (nat) => set((s) => ({ natGateways: [...s.natGateways, nat] })),
      removeNATGateway: (id) => set((s) => ({ natGateways: s.natGateways.filter((n) => n.NatGatewayId !== id) })),
    }),
    { name: 'aws-sim-vpc' }
  )
);

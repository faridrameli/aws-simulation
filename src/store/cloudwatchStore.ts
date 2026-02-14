import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CloudWatchAlarm, CloudWatchLogGroup, CloudWatchDashboard } from '../types/aws';

interface CloudWatchState {
  alarms: CloudWatchAlarm[];
  logGroups: CloudWatchLogGroup[];
  dashboards: CloudWatchDashboard[];
  addAlarm: (alarm: CloudWatchAlarm) => void;
  removeAlarm: (name: string) => void;
  addLogGroup: (logGroup: CloudWatchLogGroup) => void;
  removeLogGroup: (name: string) => void;
  addDashboard: (dashboard: CloudWatchDashboard) => void;
  removeDashboard: (name: string) => void;
}

export const useCloudWatchStore = create<CloudWatchState>()(
  persist(
    (set) => ({
      alarms: [],
      logGroups: [],
      dashboards: [],
      addAlarm: (alarm) => set((s) => ({ alarms: [...s.alarms, alarm] })),
      removeAlarm: (name) => set((s) => ({ alarms: s.alarms.filter((a) => a.AlarmName !== name) })),
      addLogGroup: (logGroup) => set((s) => ({ logGroups: [...s.logGroups, logGroup] })),
      removeLogGroup: (name) => set((s) => ({ logGroups: s.logGroups.filter((lg) => lg.LogGroupName !== name) })),
      addDashboard: (dashboard) => set((s) => ({ dashboards: [...s.dashboards, dashboard] })),
      removeDashboard: (name) => set((s) => ({ dashboards: s.dashboards.filter((d) => d.DashboardName !== name) })),
    }),
    { name: 'aws-sim-cloudwatch' }
  )
);

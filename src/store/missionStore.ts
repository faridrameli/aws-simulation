import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MISSIONS } from '../data/missions';

interface MissionState {
  activeMissionId: string | null;
  currentStepIndex: number;
  completedMissionIds: string[];
  showPanel: boolean;
  toast: { message: string; visible: boolean };
  // Snapshot counts for store-based validation
  stepStartCounts: Record<string, number>;

  startMission: (missionId: string) => void;
  advanceStep: () => void;
  completeMission: () => void;
  abandonMission: () => void;
  togglePanel: () => void;
  closePanel: () => void;
  showToast: (message: string) => void;
  hideToast: () => void;
  setStepStartCounts: (counts: Record<string, number>) => void;
  resetProgress: () => void;
}

export const useMissionStore = create<MissionState>()(
  persist(
    (set, get) => ({
      activeMissionId: null,
      currentStepIndex: 0,
      completedMissionIds: [],
      showPanel: false,
      toast: { message: '', visible: false },
      stepStartCounts: {},

      startMission: (missionId) => set({
        activeMissionId: missionId,
        currentStepIndex: 0,
        showPanel: false,
        stepStartCounts: {},
      }),

      advanceStep: () => {
        const { activeMissionId, currentStepIndex } = get();
        if (!activeMissionId) return;
        const mission = MISSIONS.find((m) => m.id === activeMissionId);
        if (!mission) return;

        if (currentStepIndex >= mission.steps.length - 1) {
          get().completeMission();
        } else {
          set({ currentStepIndex: currentStepIndex + 1 });
          get().showToast('Step completed!');
        }
      },

      completeMission: () => {
        const { activeMissionId, completedMissionIds } = get();
        if (!activeMissionId) return;
        const updated = completedMissionIds.includes(activeMissionId)
          ? completedMissionIds
          : [...completedMissionIds, activeMissionId];
        set({
          activeMissionId: null,
          currentStepIndex: 0,
          completedMissionIds: updated,
          stepStartCounts: {},
        });
        get().showToast('Mission completed!');
      },

      abandonMission: () => set({
        activeMissionId: null,
        currentStepIndex: 0,
        stepStartCounts: {},
      }),

      togglePanel: () => set((s) => ({ showPanel: !s.showPanel })),
      closePanel: () => set({ showPanel: false }),

      showToast: (message) => {
        set({ toast: { message, visible: true } });
        setTimeout(() => get().hideToast(), 3000);
      },
      hideToast: () => set({ toast: { message: '', visible: false } }),

      setStepStartCounts: (counts) => set({ stepStartCounts: counts }),

      resetProgress: () => set({
        activeMissionId: null,
        currentStepIndex: 0,
        completedMissionIds: [],
        stepStartCounts: {},
      }),
    }),
    {
      name: 'aws-sim-missions',
      partialize: (state) => ({
        completedMissionIds: state.completedMissionIds,
      }),
    }
  )
);

// Helper to get current mission and step
export function getActiveMission() {
  const { activeMissionId, currentStepIndex } = useMissionStore.getState();
  if (!activeMissionId) return null;
  const mission = MISSIONS.find((m) => m.id === activeMissionId);
  if (!mission) return null;
  return { mission, step: mission.steps[currentStepIndex], stepIndex: currentStepIndex };
}

import { useMissionStore } from '../../store';
import { MISSIONS } from '../../data/missions';

export default function MissionPanel() {
  const showPanel = useMissionStore((s) => s.showPanel);
  const closePanel = useMissionStore((s) => s.closePanel);
  const activeMissionId = useMissionStore((s) => s.activeMissionId);
  const completedMissionIds = useMissionStore((s) => s.completedMissionIds);
  const currentStepIndex = useMissionStore((s) => s.currentStepIndex);
  const startMission = useMissionStore((s) => s.startMission);
  const abandonMission = useMissionStore((s) => s.abandonMission);
  const resetProgress = useMissionStore((s) => s.resetProgress);

  if (!showPanel) return null;

  return (
    <>
      <div className="mission-panel-overlay" onClick={closePanel} />
      <div className="mission-panel">
        <div className="mission-panel-header">
          <h2>Missions</h2>
          <button className="mission-panel-close" onClick={closePanel}>&times;</button>
        </div>

        <div className="mission-panel-body">
          <p style={{ fontSize: '13px', color: 'var(--aws-text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
            Complete guided missions to learn AWS services step by step. Each mission walks you through real actions in the console.
          </p>

          {MISSIONS.map((mission) => {
            const isCompleted = completedMissionIds.includes(mission.id);
            const isActive = activeMissionId === mission.id;
            const progress = isActive ? currentStepIndex / mission.steps.length : isCompleted ? 1 : 0;

            return (
              <div
                key={mission.id}
                className={`mission-card ${isCompleted ? 'mission-card-completed' : ''} ${isActive ? 'mission-card-active' : ''}`}
                onClick={() => {
                  if (!isActive && !isCompleted) {
                    startMission(mission.id);
                    closePanel();
                  }
                }}
              >
                <div className="mission-card-header">
                  <span className="mission-card-title">{mission.title}</span>
                  <span className={`mission-card-badge mission-card-badge-${mission.difficulty}`}>
                    {mission.difficulty}
                  </span>
                </div>

                <div className="mission-card-desc">{mission.description}</div>

                <div className="mission-card-footer">
                  <span className="mission-card-steps">{mission.steps.length} steps</span>
                  {isCompleted && (
                    <span className="mission-card-status mission-card-status-completed">Completed</span>
                  )}
                  {isActive && (
                    <span className="mission-card-status mission-card-status-active">
                      Step {currentStepIndex + 1}/{mission.steps.length}
                    </span>
                  )}
                </div>

                {(isActive || isCompleted) && (
                  <div className="mission-progress">
                    <div className="mission-progress-fill" style={{ width: `${progress * 100}%` }} />
                  </div>
                )}

                {isActive && (
                  <div style={{ marginTop: '8px' }}>
                    <button
                      className="aws-btn aws-btn-secondary aws-btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        abandonMission();
                      }}
                    >
                      Abandon mission
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {completedMissionIds.length > 0 && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--aws-border)' }}>
              <button
                className="aws-btn aws-btn-secondary aws-btn-sm"
                onClick={resetProgress}
                style={{ fontSize: '12px' }}
              >
                Reset all progress
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

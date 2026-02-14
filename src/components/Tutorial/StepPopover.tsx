import { useEffect, useState, useCallback } from 'react';
import { useMissionStore } from '../../store';
import { MISSIONS } from '../../data/missions';

export default function StepPopover() {
  const activeMissionId = useMissionStore((s) => s.activeMissionId);
  const currentStepIndex = useMissionStore((s) => s.currentStepIndex);
  const advanceStep = useMissionStore((s) => s.advanceStep);
  const abandonMission = useMissionStore((s) => s.abandonMission);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [arrowSide, setArrowSide] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom');

  const mission = activeMissionId ? MISSIONS.find((m) => m.id === activeMissionId) : null;
  const step = mission ? mission.steps[currentStepIndex] : null;

  const updatePosition = useCallback(() => {
    if (!step) {
      setPosition(null);
      return;
    }
    const el = document.querySelector(step.targetSelector);
    if (!el) {
      setPosition(null);
      return;
    }

    const rect = el.getBoundingClientRect();
    const popoverWidth = 320;
    const popoverHeight = 220;
    const gap = 16;
    const preferred = step.popoverPosition;

    let top = 0;
    let left = 0;
    let arrow: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

    if (preferred === 'bottom') {
      top = rect.bottom + gap;
      left = rect.left + rect.width / 2 - popoverWidth / 2;
      arrow = 'top';
    } else if (preferred === 'top') {
      top = rect.top - popoverHeight - gap;
      left = rect.left + rect.width / 2 - popoverWidth / 2;
      arrow = 'bottom';
    } else if (preferred === 'right') {
      top = rect.top + rect.height / 2 - popoverHeight / 2;
      left = rect.right + gap;
      arrow = 'left';
    } else if (preferred === 'left') {
      top = rect.top + rect.height / 2 - popoverHeight / 2;
      left = rect.left - popoverWidth - gap;
      arrow = 'right';
    }

    // If popover would go off-screen, try opposite side
    if (preferred === 'bottom' && top + popoverHeight > window.innerHeight - 8) {
      top = rect.top - popoverHeight - gap;
      arrow = 'bottom';
    } else if (preferred === 'top' && top < 8) {
      top = rect.bottom + gap;
      arrow = 'top';
    } else if (preferred === 'right' && left + popoverWidth > window.innerWidth - 8) {
      left = rect.left - popoverWidth - gap;
      arrow = 'right';
    } else if (preferred === 'left' && left < 8) {
      left = rect.right + gap;
      arrow = 'left';
    }

    // Final clamp to viewport
    left = Math.max(8, Math.min(left, window.innerWidth - popoverWidth - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - popoverHeight - 8));

    setPosition({ top, left });
    setArrowSide(arrow);
  }, [step]);

  useEffect(() => {
    if (!activeMissionId) return;
    const initialTimer = setTimeout(updatePosition, 100);
    const interval = setInterval(updatePosition, 500);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [activeMissionId, currentStepIndex, updatePosition]);

  if (!mission || !step || !position) return null;

  const isLastStep = currentStepIndex >= mission.steps.length - 1;
  const isClickValidation = step.validation.type === 'click';

  return (
    <div className="step-popover" style={{ top: position.top, left: position.left }}>
      <div className={`step-popover-arrow step-popover-arrow-${arrowSide}`} />

      <div className="step-popover-header">
        <span className="step-popover-step-num">Step {currentStepIndex + 1} of {mission.steps.length}</span>
        <button className="step-popover-close" onClick={abandonMission}>&times;</button>
      </div>

      <div className="step-popover-title">{step.title}</div>
      <div className="step-popover-desc">{step.description}</div>

      <div className="step-popover-footer">
        <span className="step-popover-progress">{mission.title}</span>
        <div className="step-popover-actions">
          {isClickValidation && (
            <button
              className="aws-btn aws-btn-primary aws-btn-sm"
              onClick={advanceStep}
            >
              {isLastStep ? 'Finish' : 'Next'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

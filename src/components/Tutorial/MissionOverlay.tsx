import { useEffect, useState, useCallback, useRef } from 'react';
import { useMissionStore } from '../../store';
import { MISSIONS } from '../../data/missions';

export default function MissionOverlay() {
  const activeMissionId = useMissionStore((s) => s.activeMissionId);
  const currentStepIndex = useMissionStore((s) => s.currentStepIndex);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const hasScrolled = useRef(false);

  const mission = activeMissionId ? MISSIONS.find((m) => m.id === activeMissionId) : null;
  const step = mission ? mission.steps[currentStepIndex] : null;

  const updateRect = useCallback(() => {
    if (!step) {
      setRect(null);
      return;
    }
    // Hide highlight when a modal is open (user clicked the button, now filling a form)
    if (document.querySelector('.aws-modal-overlay')) {
      setRect(null);
      return;
    }
    const el = document.querySelector(step.targetSelector);
    if (el) {
      // Scroll into view once per step if element is off-screen
      if (!hasScrolled.current) {
        const r = el.getBoundingClientRect();
        if (r.top < 0 || r.bottom > window.innerHeight) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        hasScrolled.current = true;
      }
      setRect(el.getBoundingClientRect());
    } else {
      setRect(null);
    }
  }, [step]);

  useEffect(() => {
    hasScrolled.current = false;
  }, [activeMissionId, currentStepIndex]);

  useEffect(() => {
    if (!activeMissionId) {
      setRect(null);
      return;
    }
    // Small delay to let new page render before looking for elements
    const initialTimer = setTimeout(updateRect, 150);
    const interval = setInterval(updateRect, 500);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [activeMissionId, currentStepIndex, updateRect]);

  if (!activeMissionId || !rect) return null;

  const padding = 6;

  return (
    <div
      className="mission-highlight-ring"
      style={{
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      }}
    />
  );
}

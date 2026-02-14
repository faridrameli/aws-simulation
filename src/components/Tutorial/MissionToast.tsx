import { useMissionStore } from '../../store';

export default function MissionToast() {
  const toast = useMissionStore((s) => s.toast);

  if (!toast.visible) return null;

  return (
    <div className="mission-toast">
      <span className="mission-toast-icon">&#9733;</span>
      {toast.message}
    </div>
  );
}

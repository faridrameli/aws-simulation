interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toLowerCase().replace(/[_ ]/g, '-');
  return (
    <span className={`aws-status aws-status-${normalized}`}>
      <span className="aws-status-dot" />
      {status}
    </span>
  );
}

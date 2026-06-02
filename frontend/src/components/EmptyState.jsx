import { PackageOpen } from 'lucide-react';

export function EmptyState({ title = 'No data available', description, icon: Icon = PackageOpen, action }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon size={39} aria-hidden="true" />
      </span>
      <strong>{title}</strong>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}

import { Inbox } from 'lucide-react';

export function EmptyState({ title = 'No data available' }) {
  return (
    <div className="empty-state">
      <Inbox size={30} aria-hidden="true" />
      <strong>{title}</strong>
    </div>
  );
}

import { Plus } from 'lucide-react';

export function PageHeader({ eyebrow, title, description, actionLabel, actionIcon: ActionIcon = Plus, onAction }) {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <span>{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {onAction && (
        <button type="button" onClick={onAction}>
          <ActionIcon size={17} aria-hidden="true" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

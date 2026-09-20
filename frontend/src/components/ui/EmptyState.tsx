import React from 'react';
import { Button } from './Button';
import './EmptyState.css';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => (
  <div className="empty-state">
    <div className="empty-state-icon">{icon}</div>
    <h3 className="empty-state-title">{title}</h3>
    <p className="empty-state-description">{description}</p>
    {actionLabel && onAction && (
      <Button variant="primary" onClick={onAction} className="empty-state-action">
        {actionLabel}
      </Button>
    )}
  </div>
);

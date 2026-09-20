import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '16px',
  borderRadius = 'var(--radius-sm)',
  className = '',
}) => (
  <div
    className={`skeleton ${className}`}
    style={{ width, height, borderRadius }}
    aria-hidden="true"
  />
);

export const SkeletonRow: React.FC = () => (
  <div className="skeleton-row">
    <Skeleton width="40%" height="14px" />
    <Skeleton width="80px" height="14px" />
    <Skeleton width="100px" height="14px" />
    <Skeleton width="60px" height="14px" />
  </div>
);

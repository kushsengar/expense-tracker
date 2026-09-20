import React from 'react';
import './PageHeader.css';

interface PageHeaderProps {
  title: string;
  action?: React.ReactNode;
  subtitle?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, action, subtitle }) => (
  <div className="page-header">
    <div className="page-header-text">
      <h1>{title}</h1>
      {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
    </div>
    {action && <div className="page-header-action">{action}</div>}
  </div>
);

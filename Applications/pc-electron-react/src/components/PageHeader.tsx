import React from 'react';
import { Button } from '@/components/ui/button';

export interface PageHeaderProps {
  title: string | JSX.Element;
  action?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };
  subtitle?: string;
  children?: React.ReactNode;
}

// Header de page avec un titre et possibilité d'un sous-titre et d'un bouton d'action
export function PageHeader({
  title,
  action,
  subtitle,
  children,
}: PageHeaderProps): React.JSX.Element {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && (
          <h2 className="text-xl font-medium text-gray-600">{subtitle}</h2>
        )}
      </div>
      <div className="flex gap-2">
        {action && (
          <Button onClick={action.onClick}>
            {action.icon}
            {action.label}
          </Button>
        )}
        {children}
      </div>
    </div>
  );
}

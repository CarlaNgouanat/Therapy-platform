import React from 'react';

// Interface du composant
export interface DataCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card pour un fond blanc avec des bords arrondis
 * @param param0 Données du composant
 * @returns Renvoie un composant
 */
export function DataCard({
  children,
  className = '',
}: DataCardProps): React.JSX.Element {
  return (
    <div className={`bg-white p-4 rounded-lg ${className}`}>{children}</div>
  );
}

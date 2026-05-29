import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { BindIdManager } from '@/utils/BindIdManager';

// Interface du composant
export interface SearchBarProps {
  id: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Barre de recherche simple avec icône
 * @param dataComponent Données de la barre de recherche
 * @returns Retour d'un composant
 */
export function SearchBar(dataComponent: SearchBarProps): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-SearchBar'
  );

  // --- COMPOSANT ---
  return (
    <div
      id={bindId.bindId(1, 'Container')}
      className={`relative ${dataComponent.className}`}
    >
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        id={bindId.bindId(2, 'Input')}
        placeholder={dataComponent.placeholder}
        value={dataComponent.value}
        onChange={(e) => dataComponent.onChange(e.target.value)}
        className="pl-10 bg-white"
      />
    </div>
  );
}

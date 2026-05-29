import { BindIdManager } from '@/utils/BindIdManager';
import { InterestModel } from '@shared/models/InterestModel';
import React from 'react';
import { TemplateItemPatient } from './TemplateItemPatient';

// Interface du composant
export interface InterestChipProps {
  id: string;
  label: string;
  values: InterestModel[];
}

/**
 * Chip pour afficher des centres d'intérêts
 * @param dataComponent Données du composant
 * @returns Renvoie un composant
 */
export function InterestChipItemPatient(
  dataComponent: InterestChipProps
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-InterestChip'
  );

  // --- COMPOSANT ---
  return (
    <TemplateItemPatient
      id={bindId.bindId(1, 'TemplateItemPatient')}
      label={dataComponent.label}
      child={
        <div
          id={bindId.bindId(2, 'InterestContainre')}
          className="flex flex-wrap gap-3 w-full"
        >
          {dataComponent.values.length > 0 ? (
            dataComponent.values.map((value: InterestModel) => (
              <p
                key={value.id}
                id={bindId.bindId(3, 'Interest-' + value.id)}
                className="px-5 py-3 text-base text-[#1880D9] font-bold border-1 border-[#D1E6F7] rounded-full"
              >
                {value.name}
              </p>
            ))
          ) : (
            <p className="text-base">Aucun intérêt renseigné</p>
          )}
        </div>
      }
    />
  );
}

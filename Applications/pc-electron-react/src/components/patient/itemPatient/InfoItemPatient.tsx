import { BindIdManager } from '@/utils/BindIdManager';
import { TemplateItemPatient } from './TemplateItemPatient';

// Interface du composant
export interface InfoItemComponent {
  id: string;
  label: string;
  value: string;
}

/**
 * Élément d'information (pour le profil patient)
 * @param dataComponent Données du composant
 * @returns Renvoie un composant
 */
export function InfoItemPatient(
  dataComponent: InfoItemComponent
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-InfoItemPatient'
  );

  // --- COMPOSANT ---
  return (
    <TemplateItemPatient
      id={bindId.bindId(1, 'TemplateItemPatient')}
      label={dataComponent.label}
      child={<p className="text-base w-full">{dataComponent.value}</p>}
    />
  );
}

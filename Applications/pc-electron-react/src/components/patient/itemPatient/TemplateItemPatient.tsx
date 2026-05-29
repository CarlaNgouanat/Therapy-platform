import { BindIdManager } from '@/utils/BindIdManager';

// Interface du composant
export interface InfoItemComponent {
  id: string;
  label: string;
  child: JSX.Element;
}

/**
 * Template pour l'affichage d'une information sur le profil
 * @param dataComponent Données du composant
 * @returns Renvoie un composant
 */
export function TemplateItemPatient(
  dataComponent: InfoItemComponent
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-TemplateItemPatient'
  );

  // --- COMPOSANT ---
  return (
    <div
      id={bindId.bindId(1, 'Container')}
      className="flex flex-col gap-2 w-full"
    >
      <h3 id={bindId.bindId(1, 'Title')} className="font-bold text-base w-full">
        {dataComponent.label}
      </h3>
      {dataComponent.child}
    </div>
  );
}

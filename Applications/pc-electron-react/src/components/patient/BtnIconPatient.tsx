import { Button } from '@/components/ui/button';
import { BindIdManager } from '@/utils/BindIdManager';

// Interface du compsant
export interface BtnIconPatientComponent {
  id: string;
  label: string;
  icon: JSX.Element;
  onClick: () => void;
}

/**
 * Composant d'un bouton
 * @param dataComponent Données du composant
 * @returns Renvoie un composant
 */
export function BtnIconPatient(
  dataComponent: BtnIconPatientComponent
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-BtnIconPatient'
  );

  // --- COMPOSANT ---
  return (
    <Button
      id={bindId.bindId(1, 'Button')}
      className="w-8 h-8 flex justify-center items-center rounded-sm"
      variant="ghost"
      onClick={dataComponent.onClick}
      title={dataComponent.label}
    >
      {dataComponent.icon}
    </Button>
  );
}

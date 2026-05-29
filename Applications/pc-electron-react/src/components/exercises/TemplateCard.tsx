import { BindIdManager } from '@/utils/BindIdManager';

// Inteface du composant
export interface TemplateCardType {
  id: string;
  child: JSX.Element;
}

/**
 * Template standard d'une carte
 * @param template Interface avec le contenu de la carte
 * @returns Renvoie un composant
 */
export function TemplateCard(template: TemplateCardType): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    template.id + '-TemplateCard'
  );

  // --- COMPONENT ---
  return (
    <div
      id={bindId.bindId(1, 'TemplateContainer')}
      className="h-[300px] w-[235px] shadow-sm rounded-lg overflow-hidden scale-100 hover:scale-105 transition-all"
    >
      {template.child}
    </div>
  );
}

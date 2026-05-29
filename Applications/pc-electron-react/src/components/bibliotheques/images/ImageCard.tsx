import { TemplateCard } from '@/components/exercises/TemplateCard';
import { BindIdManager } from '@/utils/BindIdManager';
import { ResourceModel } from '@shared/models/ResourceModel';

// Inteface du composant
export interface ImageCardComponent {
  id: string;
  image: ResourceModel;
  onClick: () => void;
}

/**
 * Composant d'une carte avec une image (preview)
 * @param dataComponent Données du composant
 * @returns Renvoie un composant
 */
export function ImageCard(
  dataComponent: ImageCardComponent
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-ImageCard'
  );

  // --- COMPOSANT ---
  return (
    <TemplateCard
      id=""
      child={
        <button
          id={bindId.bindId(2, 'ButtonAdd')}
          className="w-full h-full grid grid-row-[auto_1fr] bg-[#f1f2f3]"
          onClick={() => dataComponent.onClick()}
        >
          <div className="w-full h-full">
            <img
              src={dataComponent.image.filePath}
              id={bindId.bindId(4, 'Img')}
              alt="pizza"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="w-full flex flex-col py-2 px-3 bg-white">
            <p id={bindId.bindId(4, 'Name')} className="text-left text-lg">
              {dataComponent.image.name}
            </p>
          </div>
        </button>
      }
    ></TemplateCard>
  );
}

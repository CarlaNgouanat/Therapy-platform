import { TemplateCard } from '@/components/exercises/TemplateCard';
import { BindIdManager } from '@/utils/BindIdManager';
import { ExerciseModel } from '@shared/models/ExerciseModel';
import pizza from '@/assets/pizza.jpg';

// Interface button
export interface CardButtonComponent {
  icon: JSX.Element;
  onClick: () => void;
}

// Inteface du composant
export interface CardExerciseComponent {
  id: string;
  exercise: ExerciseModel;
  onClick: () => void;
  buttons: CardButtonComponent[];
}

/**
 * Composant d'une carte avec un exercise
 * @param dataComponent Données du composant
 * @returns Renvoie un composant
 */
export function TemplateCardExercise(
  dataComponent: CardExerciseComponent
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-TemplateCardExercise'
  );

  // --- COMPOSANT ---
  return (
    <TemplateCard
      id={bindId.bindId(1, 'TemplateCard')}
      child={
        <button
          id={bindId.bindId(2, 'ButtonAdd')}
          className="w-full h-full grid grid-row-[auto_1fr] bg-[#f1f2f3]"
          onClick={() => dataComponent.onClick()}
        >
          <div id={bindId.bindId(3, 'ImgContainer')} className="w-full h-full">
            <img
              src={pizza}
              id={bindId.bindId(4, 'Img')}
              alt="pizza"
              className="w-full h-full object-contain"
            />
          </div>
          <div
            id={bindId.bindId(3, 'DetailContainer')}
            className="w-full flex flex-col py-2 px-3 bg-white"
          >
            <p id={bindId.bindId(4, 'Name')} className="text-left text-lg">
              {dataComponent.exercise.name}
            </p>
            <div className="flex justify-between items-center">
              <p
                id={bindId.bindId(4, 'Model')}
                className="text-left italic text-sm"
              >
                {dataComponent.exercise.model}
              </p>
              <div className="flex justify-end items-center gap-2">
                {dataComponent.buttons.map(
                  (button: CardButtonComponent, index: number) => (
                    <button
                      key={index}
                      onClick={button.onClick}
                      className="w-5 h-5 flex justify-center items-center"
                    >
                      {button.icon}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </button>
      }
    ></TemplateCard>
  );
}

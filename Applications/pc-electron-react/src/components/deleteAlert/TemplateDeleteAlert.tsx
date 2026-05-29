import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { Trash2Icon, X } from 'lucide-react';
import { BindIdManager } from '@/utils/BindIdManager';

// Interface du composant
export interface TemplateDeleteAlertComponent {
  id: string;
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

// --- COMPONENT ---

/**
 * Dialogue template pour confirmation de suppression
 * @param dataComponent Données du composant
 * @returns Renvoie un composant
 */
export function TemplateDeleteAlert(
  dataComponent: TemplateDeleteAlertComponent
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-ExerciseDialog'
  );

  // --- COMPOSANT ---
  return (
    <Dialog open={dataComponent.isOpen} onOpenChange={dataComponent.onClose}>
      <DialogContent
        id={bindId.bindId(1, 'DialogContent')}
        className="bg-white"
      >
        <DialogHeader id={bindId.bindId(2, 'HeaderContent')}>
          <DialogTitle id={bindId.bindId(3, 'Title')}>
            <h1
              id={bindId.bindId(4, 'TitleText')}
              className="text-2xl font-bold"
            >
              {dataComponent.title}
            </h1>
          </DialogTitle>
          <DialogDescription id={bindId.bindId(3, 'Description')}>
            <p id={bindId.bindId(4, 'Text')} className="text-base">
              {dataComponent.description}
            </p>
          </DialogDescription>
        </DialogHeader>
        <div
          id={bindId.bindId(2, 'BtnContainer')}
          className="flex justify-center items-center gap-12"
        >
          <Button
            id={bindId.bindId(3, 'CloseBtn')}
            variant="outline"
            onClick={() => dataComponent.onClose()}
            className="w-19"
          >
            <X />
          </Button>
          <Button
            id={bindId.bindId(3, 'CheckBtn')}
            variant="destructive"
            onClick={() => dataComponent.onDelete()}
            className="w-19"
          >
            <Trash2Icon />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

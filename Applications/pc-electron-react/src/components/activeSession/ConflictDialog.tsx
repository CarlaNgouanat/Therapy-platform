import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BindIdManager } from '@/utils/BindIdManager';
import { SessionModel } from '@shared/models/SessionModel';
import { Button } from '../ui/button';
import { Check, X } from 'lucide-react';
import { SESSION_START_CONFLICT_MESSAGE } from '@/constants/SessionMessages';

// Interface du composant
export interface PatientDialogComponent {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onStartAnyway: (session: SessionModel | null) => void;
  conflictSession: SessionModel | null;
}

// --- COMPONENT ---

/**
 * Dialogue pour afficher qu'une session existe déjà
 * @param dataComponent Données du composant
 * @returns Renvoie un composant
 */
export default function ConflictDialog(
  dataComponent: PatientDialogComponent
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-ConflictDialog'
  );

  return (
    <Dialog open={dataComponent.isOpen} onOpenChange={dataComponent.onClose}>
      <DialogContent
        id={bindId.bindId(1, 'DialogContent')}
        className="bg-white"
      >
        <DialogHeader id={bindId.bindId(2, 'HeaderContent')}>
          <DialogTitle id={bindId.bindId(3, 'TitleContent')}>
            <h1
              id={bindId.bindId(4, 'TitleText')}
              className="text-2xl font-bold"
            >
              Une séance est déjà en cours
            </h1>
          </DialogTitle>
          <DialogDescription id={bindId.bindId(3, 'Description')}>
            <p id={bindId.bindId(4, 'Text')} className="text-base">
              {SESSION_START_CONFLICT_MESSAGE}
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
            onClick={() =>
              dataComponent.onStartAnyway(dataComponent.conflictSession)
            }
            className="w-19"
          >
            <Check />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

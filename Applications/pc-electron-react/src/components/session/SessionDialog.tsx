import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { BindIdManager } from '@/utils/BindIdManager';
import { useEffect, useState } from 'react';
import { SessionModel } from '@shared/models/SessionModel';
import { formatTime } from '@/utils/DateUtils';
import {
  DateFormComponent,
  TextareaFormComponent,
  TimeFormComponent,
} from '../form/FormComponent';
import { Check, X } from 'lucide-react';

// Interface du composant
export interface SessionDialogComponent {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: SessionModel) => void;
  initialSession: SessionModel | null;
}

// --- FONCTION ---

/**
 * Vérification des champs du formulaire
 * @param date Date de la session
 * @param time Heure de la session
 * @returns Renvoie vrai si les champs sont correctes
 */
function isFormValid(date: Date | undefined, time: string | undefined) {
  const checkDate: boolean = date !== undefined;
  const checkTime: boolean = time !== undefined;
  return checkDate && checkTime;
}

// --- COMPONENT ---

/**
 * Dialogue pour ajouter ou modifier un patient
 * @param dataComponent Données du composant
 * @returns Renvoie un composant
 */
export function SessionDialog(
  dataComponent: SessionDialogComponent
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-AddSessionDialog'
  );

  // --- VARIABLES ---
  const [id, setId] = useState(-1);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState<string>('');

  // --- SAVE DATA ---
  const handleSave = () => {
    if (!isFormValid(date, time)) return;
    if (date === undefined || time === undefined) return;
    // Création de l'heure à sauvegarder
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const combinedDate = new Date(date);
    combinedDate.setHours(hours || 0, minutes || 0, seconds || 0);

    dataComponent.onSave({
      id: id,
      notes: notes,
      date: combinedDate,
    } as SessionModel);
    dataComponent.onClose();
  };

  // --- USE EFFECT ---
  useEffect(() => {
    setId(-1);
    setDate(undefined);
    setTime(undefined);
    setNotes('');

    if (dataComponent.initialSession !== null) {
      setId(dataComponent.initialSession.id);
      setDate(dataComponent.initialSession.date);
      setTime(formatTime(dataComponent.initialSession.date));
      setNotes(dataComponent.initialSession.notes);
    }
  }, [dataComponent.isOpen, dataComponent.initialSession]);

  // --- COMPOSANT ---
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
              {dataComponent.initialSession === undefined
                ? 'Ajouter une séance'
                : 'Modifier la séance'}
            </h1>
          </DialogTitle>
        </DialogHeader>
        <div
          id={bindId.bindId(2, 'InputContainer')}
          className="grid grid-cols-2 gap-6 py-4"
        >
          <DateFormComponent
            id={bindId.bindId(3, 'InputDate')}
            label="Date"
            value={date}
            onChange={(date: Date | undefined) => setDate(date)}
            disabledDates={(date) =>
              date < new Date(new Date().setHours(0, 0, 0, 0))
            }
          />
          <TimeFormComponent
            id={bindId.bindId(3, 'InputTime')}
            label="Heure"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabledDates={(date) =>
              date < new Date(new Date().setHours(0, 0, 0, 0))
            }
          />
        </div>
        <TextareaFormComponent
          id={bindId.bindId(3, 'InputDetails')}
          className="w-full"
          label="Notes sur la séance"
          placeholder=""
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
        />
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
            onClick={handleSave}
            disabled={!isFormValid}
            className="w-19"
          >
            <Check />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

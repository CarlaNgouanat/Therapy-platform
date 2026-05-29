// Base
import React, { useEffect, useState } from 'react';
// Importation des routes de la sidebar
// Composants shadcn/ui
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, CircleDotIcon } from 'lucide-react';
import { ActiveSessionPatientModel } from '@shared/models/ActiveSessionPatientModel';
import { BindIdManager } from '@/utils/BindIdManager';

// Interface du composant
export interface ActiveSessionDialogComponent {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (patientId: string, sessionId: string) => void;
  activeSession: ActiveSessionPatientModel | null;
}

// Disposition générale de l'application avec la sidebar à gauche et le contenu à droite (ainsi qu'un header pour un bouton retour lorsque nécessaire)
export default function ActiveSessionDialog(
  dataComponent: ActiveSessionDialogComponent
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-ActiveSessionDialog'
  );

  // --- DATA ---
  const [firstname, setFirstname] = useState<string>('');
  const [lastname, setLastname] = useState<string>('');
  const [patientId, setPatientId] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');

  // --- USEEFFECT ---

  // Récupération des informations de la session active
  useEffect(() => {
    if (dataComponent.activeSession !== null) {
      setFirstname(dataComponent.activeSession.patient.firstName);
      setLastname(dataComponent.activeSession.patient.lastName);
      setPatientId(String(dataComponent.activeSession.patient.id));
      setSessionId(String(dataComponent.activeSession.id));
    } else {
      setFirstname('');
      setLastname('');
      setPatientId('');
      setSessionId('');
    }
  }, [dataComponent.activeSession]);

  return (
    <Dialog open={dataComponent.isOpen} onOpenChange={dataComponent.onClose}>
      <DialogContent
        id={bindId.bindId(1, 'DialogContent')}
        className="sm:max-w-md"
      >
        <DialogHeader id={bindId.bindId(2, 'HeaderDialog')}>
          <DialogTitle
            id={bindId.bindId(3, 'TitleContainer')}
            className="flex items-center gap-2"
          >
            <CircleDotIcon className="w-5 h-5 text-blue-600 animate-pulse" />
            <p id={bindId.bindId(4, 'Title')}>Séance en cours</p>
          </DialogTitle>
          <DialogDescription
            id={bindId.bindId(3, 'DescriptionContainer')}
            className="pt-2"
          >
            <p id={bindId.bindId(4, 'Description')}>
              Une séance est actuellement active. Voulez-vous la reprendre ?
            </p>
          </DialogDescription>
        </DialogHeader>

        <div id={bindId.bindId(2, 'PatientMainContainer')} className="py-2">
          <div
            id={bindId.bindId(3, 'Container')}
            className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex items-center justify-between"
          >
            <p id={bindId.bindId(4, 'PatientData')} className="flex flex-col">
              <span
                id={bindId.bindId(5, 'Patient')}
                className="text-xs text-blue-600 font-medium uppercase tracking-wider"
              >
                Patient
              </span>
              <span
                id={bindId.bindId(5, 'PatientName')}
                className="font-semibold text-lg text-gray-900"
              >
                {firstname} {lastname}
              </span>
            </p>
            <p
              id={bindId.bindId(4, 'PatientNameFirstLetter')}
              className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs"
            >
              {firstname.charAt(0)}
              {lastname.charAt(0)}
            </p>
          </div>
        </div>

        <DialogFooter
          id={bindId.bindId(2, 'DialogFooter')}
          className="flex sm:justify-between gap-2 sm:gap-0"
        >
          <Button
            id={bindId.bindId(3, 'DenyButton')}
            variant="ghost"
            onClick={dataComponent.onClose}
            className="text-gray-500 hover:text-gray-900"
          >
            <p id={bindId.bindId(4, 'Label')}>Plus tard</p>
          </Button>
          <Button
            id={bindId.bindId(3, 'AcceptButton')}
            onClick={() => dataComponent.onNavigate(patientId, sessionId)}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <ArrowLeftIcon className="w-4 h-4 rotate-180" />
            <p id={bindId.bindId(4, 'Label')}>Reprendre</p>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

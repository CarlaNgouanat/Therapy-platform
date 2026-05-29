import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InterestModel } from '@shared/models/InterestModel';
import { PatientWithInterestsModel } from '@shared/models/PatientWithInterestsModel';
import { PatientGender } from '@shared/types/PatientGender';
import { BindIdManager } from '@/utils/BindIdManager';
import {
  DateFormComponent,
  InputFormComponent,
  InterestsComboBoxFormComponent,
  SelectFormComponent,
  TextareaFormComponent,
} from '@/components/form/FormComponent';
import { Check, X } from 'lucide-react';

type GenderType = PatientGender | 'EMPTY' | '';

export interface PatientDialogComponent {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: PatientWithInterestsModel) => void;
  initialPatient?: PatientWithInterestsModel;
}

// --- FONCTION ---

/**
 * Vérification des champs du formulaire
 * @param firstname Prénom du patient
 * @param lastname Nom du patient
 * @param birthDate Date de naissance
 * @param gender Genre
 * @returns Renvoie vrai si les champs sont correctes
 */
function isFormValid(
  firstname: string,
  lastname: string,
  birthDate: Date,
  gender: GenderType
) {
  const checkFirstname: boolean = firstname !== '';
  const checkLastname: boolean = lastname !== '';
  const checkBirth: boolean = birthDate.toLocaleDateString() !== '';
  const checkGender: boolean = gender !== '' && gender !== 'EMPTY';
  return checkFirstname && checkLastname && checkBirth && checkGender;
}

// --- COMPONENT ---

/**
 * Dialogue pour ajouter ou modifier un patient
 * @param dataComponent Données du composant
 * @returns Renvoie un composant
 */
export default function PatientDialog(
  dataComponent: PatientDialogComponent
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-PatientDialog'
  );

  const [id, setId] = useState(-1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState('');
  const [gender, setGender] = useState<PatientGender>('MALE');
  const [interests, setInterests] = useState<InterestModel[]>([]);
  const [createdAt, setCreatedAt] = useState<Date>(new Date());

  // --- SAVE DATA ---
  const handleSave = () => {
    if (!isFormValid(firstName, lastName, birthDate, gender)) return;
    dataComponent.onSave({
      id: id,
      firstName: firstName,
      lastName: lastName,
      birthDate: birthDate,
      gender: gender,
      interests: interests,
      notes: notes,
      createdAt: createdAt,
    } as PatientWithInterestsModel);
    dataComponent.onClose();
  };

  // --- USE EFFECT ---
  useEffect(() => {
    setId(-1);
    setFirstName('');
    setLastName('');
    setBirthDate(new Date());
    setGender('MALE');
    setInterests([]);
    setNotes('');
    setCreatedAt(new Date());

    if (dataComponent.initialPatient !== undefined) {
      setId(dataComponent.initialPatient.id);
      setFirstName(dataComponent.initialPatient.firstName);
      setLastName(dataComponent.initialPatient.lastName);
      setBirthDate(dataComponent.initialPatient.birthDate);
      setGender(dataComponent.initialPatient.gender);
      setInterests(dataComponent.initialPatient.interests);
      setNotes(dataComponent.initialPatient.notes);
      setCreatedAt(dataComponent.initialPatient.createdAt);
    }
  }, [dataComponent.isOpen, dataComponent.initialPatient]);

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
              {dataComponent.initialPatient === undefined
                ? 'Ajouter un patient'
                : 'Modifier le patient'}
            </h1>
          </DialogTitle>
        </DialogHeader>
        <div
          id={bindId.bindId(2, 'InputContainer')}
          className="flex flex-col gap-6 py-4"
        >
          <InputFormComponent
            id={bindId.bindId(3, 'InputLastname')}
            label="Nom"
            displayRequire={true}
            placeholder="Nom du patient"
            className="w-full"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <InputFormComponent
            id={bindId.bindId(3, 'InputFirstname')}
            label="Prénom"
            displayRequire={true}
            placeholder="Prénom du patient"
            className="w-full"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <DateFormComponent
            id={bindId.bindId(3, 'InputBirthdate')}
            label="Date de naissance"
            displayRequire={true}
            value={birthDate}
            onChange={(date: Date | undefined) => {
              if (date) {
                setBirthDate(date);
              }
            }}
            disabledDates={(date) => date > new Date()}
          />
          <SelectFormComponent
            id={bindId.bindId(3, 'InputGender')}
            label="Genre"
            displayRequire={true}
            className="w-full"
            placeholder="Genre du patient"
            value={gender}
            onChange={(e) => setGender(e.target.value as PatientGender)}
            options={[
              { value: 'EMPTY', label: 'Aucun genre' },
              { value: 'MALE', label: 'Homme' },
              { value: 'FEMALE', label: 'Femme' },
              { value: 'OTHER', label: 'Autre' },
            ]}
          />
          <InterestsComboBoxFormComponent
            id={bindId.bindId(3, 'InputInterest')}
            title="Centres d'intérêts"
            className="w-full"
            value={interests}
            onChange={setInterests}
          />
          <TextareaFormComponent
            id={bindId.bindId(3, 'InputDetails')}
            className="w-full"
            title="Informations complémentaires"
            placeholder=""
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </div>
        <div
          id={bindId.bindId(2, 'BtnContainer')}
          className="flex items-center justify-center gap-12"
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
            disabled={!isFormValid(firstName, lastName, birthDate, gender)}
            className="w-19"
          >
            <Check />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

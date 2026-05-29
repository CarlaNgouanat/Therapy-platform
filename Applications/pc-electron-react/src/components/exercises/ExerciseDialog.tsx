import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { InterestModel } from '@shared/models/InterestModel';
import { ExerciseWithInterestsModel } from '@shared/models/ExerciseWithInterestsModel';
import { ExerciseType } from '@shared/types/ExerciseType';
import { Check, X } from 'lucide-react';
import {
  InputFormComponent,
  SelectFormComponent,
} from '@/components/form/FormComponent';
import { BindIdManager } from '@/utils/BindIdManager';

type ModelType = ExerciseType | 'EMPTY' | '';

export interface ExerciseDialogComponent {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (exercise: ExerciseWithInterestsModel) => void;
  initialExercise?: ExerciseWithInterestsModel;
}

function isFormValid(name: string, model: ModelType) {
  const checkName: boolean = name !== '';
  const checkModel: boolean = model !== '' && model !== 'EMPTY';
  return checkName && checkModel;
}

export default function ExerciseDialog(
  dataComponent: ExerciseDialogComponent
): React.JSX.Element {
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-ExerciseDialog'
  );

  const [id, setId] = useState(-1);
  const [name, setName] = useState('');
  const [model, setModel] = useState<ModelType>('');
  const [patiendId, setPatientId] = useState<number | null>(null);
  const [createdAt, setCreatedAt] = useState<Date>(new Date());
  const [data, setData] = useState({});
  const [interests, setInterests] = useState<InterestModel[]>([]);

  const handleSave = () => {
    if (!isFormValid(name, model)) return;
    dataComponent.onSave({
      id: id,
      name: name,
      model: model,
      patientId: patiendId,
      createdAt: createdAt,
      data: data,
      interests: interests,
    } as ExerciseWithInterestsModel);
    dataComponent.onClose();
  };

  useEffect(() => {
    setId(-1);
    setName('');
    setModel('');
    setPatientId(null);
    setCreatedAt(new Date());
    setData({});
    setInterests([]);

    if (dataComponent.initialExercise !== undefined) {
      setId(dataComponent.initialExercise.id);
      setName(dataComponent.initialExercise.name);
      setModel(dataComponent.initialExercise.model);
      setPatientId(dataComponent.initialExercise.patientId);
      setCreatedAt(dataComponent.initialExercise.createdAt);
      setData(dataComponent.initialExercise.data);
      setInterests(dataComponent.initialExercise.interests);
    }
  }, [dataComponent.isOpen, dataComponent.initialExercise]);

  return (
    <Dialog open={dataComponent.isOpen} onOpenChange={dataComponent.onClose}>
      <DialogContent
        id={bindId.bindId(1, 'DialogContent')}
        className="bg-white"
      >
        <div
          id={bindId.bindId(2, 'InputContainer')}
          className="flex flex-col gap-6 py-4"
        >
          <InputFormComponent
            id={bindId.bindId(3, 'Input')}
            label="Nom de l'exercice"
            placeholder="Ex: SFA Pizza"
            className="w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <SelectFormComponent
            id={bindId.bindId(3, 'Select')}
            className="w-full"
            label="Modèle"
            placeholder="Ex: SFA"
            value={model}
            onChange={(e) => {
              const value = e.target.value as ModelType;
              if (value === 'EMPTY') setModel('');
              else setModel(e.target.value as 'SFA' | 'PCA' | 'OTHER');
            }}
            options={[
              { value: 'EMPTY', label: 'Aucun modèle' },
              { value: 'SFA', label: 'SFA' },
              { value: 'PCA', label: 'PCA' },
              { value: 'OTHER', label: 'Autre' },
            ]}
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
            disabled={!isFormValid(name, model)}
            className="w-19"
          >
            <Check />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';
import { PlusIcon } from 'lucide-react';
import { InterestModel } from '@shared/models/InterestModel';
import { BindIdManager } from '@/utils/BindIdManager';
import { Fragment, useEffect, useMemo, useState } from 'react';

// Interface du composant
export interface InterestsComboBoxComponent {
  id: string;
  value: InterestModel[];
  onChange: (listValue: InterestModel[]) => void;
}

// --- FUNCTION ---

// --- INTERESTS ---

/**
 * Chargement de la liste de patient
 * @returns Renvoie une liste de InterestModel
 */
async function loadInterests(): Promise<InterestModel[]> {
  return await window.electronAPI.interestGetAllInterests();
}

// --- LISTE DES CENTRES D'INTÉRÊTS DE L'INPUT ---

/**
 * Renvoie la liste des centres d'intérêts contenus dans l'input
 * @param availableInterests Liste des centres d'intérêts déjà existant
 * @param names Liste des valeurs dans l'input
 * @returns Renvoie un tableau de InterestModel
 */
function getInterestsFromInput(
  availableInterests: InterestModel[],
  names: string[]
): InterestModel[] {
  // Création d'un tableau associatif clé - intérêt
  const interestByName: { [key: string]: InterestModel } = {};
  availableInterests.forEach((interest: InterestModel) => {
    interestByName[interest.name] = interest;
  });

  // Récupération des centres d'intérêts contenus dans l'input
  const uniqueNames: { [key: string]: string } = saveUniqueKeysFromNames(
    {},
    names
  );

  // Création des centres d'intérêts
  const listValues: InterestModel[] = [];
  for (const key in uniqueNames) {
    const value: string = uniqueNames[key];

    if (Object.prototype.hasOwnProperty.call(interestByName, key)) {
      listValues.push(interestByName[key]);
    } else {
      listValues.push({
        id: -1,
        name: value,
        createdAt: new Date(),
      } as InterestModel);
    }
  }

  return listValues;
}

// --- SELECTION DES CENTRE D'INTÉRÊT ---

/**
 * Renvoie un tableau associatif avec les centres d'intérêts n'apparaissant qu'une seule fois
 * @param maps Tableau associatif
 * @param interests Liste des centres d'intérêts
 * @returns Renvoie un tableau associatif string - string
 */
function saveUniqueKeysFromInterests(
  maps: { [key: string]: string },
  interests: InterestModel[]
): { [key: string]: string } {
  const names: string[] = interests.map(
    (interest: InterestModel): string => interest.name
  );
  return saveUniqueKeysFromNames(maps, names);
}

/**
 * Renvoie un tableau associatif avec les centres d'intérêts n'apparaissant qu'une seule fois
 * @param maps Tableau associatif
 * @param interests Liste des noms des centres d'intérêts
 * @returns Renvoie un tableau associatif string - string
 */
function saveUniqueKeysFromNames(
  maps: { [key: string]: string },
  names: string[]
): { [key: string]: string } {
  const newMap = { ...maps };
  names.forEach((name: string) => {
    const trimmed: string = name.trim();
    const key: string = trimmed.toLowerCase();
    if (trimmed !== '') {
      newMap[key] = trimmed;
    }
  });
  return newMap;
}

// --- COMPOSANT ---

/**
 * Boîte avec la liste des mots-clés
 * @param dataComponent Données du composant
 * @returns Renvoie un composant
 */
export default function InterestsComboBox(
  dataComponent: InterestsComboBoxComponent
) {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-InterestsComboBox'
  );

  // --- INTERESTS ---
  const [availableInterests, setAvailableInterests] = useState<InterestModel[]>(
    []
  );
  const [selectedNames, setSelectedNames] = useState<string[]>([]);

  // --- INPUT ---
  const anchor = useComboboxAnchor();
  const [inputValue, setInputValue] = useState('');

  // --- DATA ---

  // Définition de la liste d'intérêts utilisables
  const existingItems = useMemo(() => {
    let newMap: { [key: string]: string } = {};
    newMap = saveUniqueKeysFromInterests(newMap, availableInterests);
    newMap = saveUniqueKeysFromInterests(newMap, dataComponent.value);
    return newMap;
  }, [availableInterests, dataComponent.value]);

  // Récupération des données de l'input
  const trimmed = inputValue.trim();
  const values = Object.values(existingItems);

  // Vérifier s'il y a de nouveau centre d'intérêts
  const isNewInterest =
    trimmed.length > 0 &&
    !values.some((item) => item.toLowerCase() === trimmed.toLowerCase());

  // Sauvegarde de la liste d'item
  const items = isNewInterest ? [...values, trimmed] : values;

  // --- USEEFFECT ---

  // Initialisation des données
  useEffect(() => {
    // Récupération des centres d'intérêts
    loadInterests().then((interests: InterestModel[]) => {
      setAvailableInterests(interests);
    });
  }, []);

  // Modification de la liste d'élément par défaut
  useEffect(() => {
    setSelectedNames(
      dataComponent.value.map(
        (interest: InterestModel): string => interest.name
      )
    );
  }, [dataComponent.value]);

  // --- COMPOSANT ---
  return (
    <Combobox
      id={bindId.bindId(1, 'Combobox')}
      multiple
      autoHighlight
      items={items}
      value={selectedNames}
      onValueChange={(names: string[]) => {
        setSelectedNames(names);
        const interests: InterestModel[] = getInterestsFromInput(
          availableInterests,
          names
        );
        dataComponent.onChange(interests);
      }}
      onInputValueChange={(newValue) => setInputValue(newValue)}
    >
      <ComboboxChips
        id={bindId.bindId(2, 'InterestChips')}
        ref={anchor}
        className="w-full"
      >
        <ComboboxValue>
          {(values: string[]) => (
            <Fragment>
              {values.map((value: string) => (
                <ComboboxChip
                  id={bindId.bindId(3, 'NameInterest-' + value)}
                  key={value}
                >
                  {value}
                </ComboboxChip>
              ))}
              <ComboboxChipsInput />
            </Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent id={bindId.bindId(2, 'ContentInput')} anchor={anchor}>
        <ComboboxEmpty id={bindId.bindId(3, 'Empty')}>
          Aucun résultat.
        </ComboboxEmpty>
        <ComboboxList id={bindId.bindId(3, 'ListInterest')}>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {isNewInterest && item === trimmed ? (
                <span
                  id={bindId.bindId(4, 'ButtonAdd-' + item)}
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="size-4" />
                  Ajouter « {item} »
                </span>
              ) : (
                item
              )}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

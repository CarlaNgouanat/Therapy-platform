// Base
import React, { useState, useEffect } from 'react';
import { NavigateFunction, useNavigate } from 'react-router';
// Types
// Composants internes
import { PageHeader } from '@/components/PageHeader';
import { SearchBar } from '@/components/form/SearchBar';
import ExerciseDialog from '@/components/exercises/ExerciseDialog';
// Icônes
import { ExerciseWithInterestsModel } from '@shared/models/ExerciseWithInterestsModel';
import { BindIdManager } from '@/utils/BindIdManager';
import { ExerciseType } from '@shared/types/ExerciseType';
import { AddCardExercise } from '@/components/exercises/AddCardExercise';
import { RoutesManager } from '@/utils/RoutesManager';
import { SelectFormComponent } from '@/components/form/FormComponent';
import { DetailsCardExercise } from '@/components/exercises/DetailsCardExercise';

// --- TYPES ---
type FilterType = 'ASC' | 'DESC' | 'EMPTY' | '';
type ModelType = ExerciseType | 'EMPTY' | '';

// --- FONCTIONS ---
// --- EXERCICES ---

/**
 * Récupère la liste des exercises depuis la DB
 * @returns Renvoie une promesse avec la liste des exercices au format ExerciseWithInterestsModel
 */
async function fetchExercises(): Promise<ExerciseWithInterestsModel[]> {
  return await window.electronAPI.exerciseGetAllExercisesWithInterests();
}

/**
 * Sauvegarde un nouvel exercice dans la base de données
 * @param exerciseData Données de l'exercice à sauvegarder
 * @returns Renvoie une promesse avec la nouvelle liste d'exercice
 */
async function handleSaveExercise(
  exerciseData: ExerciseWithInterestsModel
): Promise<ExerciseWithInterestsModel[]> {
  await window.electronAPI.exerciseCreateExercise(exerciseData);
  return fetchExercises();
}

// --- FILTER AND SORT ---

/**
 * Application de l'input texte
 * @param exercises Liste d'exercises
 * @param query Texte saisi par l'utilisateur
 * @returns Renvoie la liste filtrée
 */
function applyInput(exercises: ExerciseWithInterestsModel[], query: string) {
  return exercises.filter(
    (exercise: ExerciseWithInterestsModel) =>
      query === '' ||
      exercise.name.toLowerCase().includes(query.toLowerCase()) ||
      exercise.model.toLowerCase().includes(query.toLowerCase())
  );
}

/**
 * Application du filtre du toggle s'il est activé
 * @param exercises Liste d'exercises
 * @param toggle Toggle sur l'appartenance d'un exercice à un patient
 * @returns Renvoie la liste filtrée
 */
function applyToggle(exercises: ExerciseWithInterestsModel[], toggle: boolean) {
  return exercises.filter((exercise: ExerciseWithInterestsModel) => {
    return exercise.patientId !== null || !toggle;
  });
}

/**
 * Application du filtre pour l'ordre des exercises
 * @param exercises Liste d'exercises
 * @param fitler Filtre à appliquer
 * @returns Renvoie la liste triée
 */
function applyFilter(
  exercises: ExerciseWithInterestsModel[],
  filter: FilterType
) {
  return exercises.sort(
    (
      exerciseA: ExerciseWithInterestsModel,
      exerciseB: ExerciseWithInterestsModel
    ) => {
      if (filter === 'ASC') return exerciseA.name.localeCompare(exerciseB.name);
      else if (filter === 'DESC')
        return exerciseB.name.localeCompare(exerciseA.name);
      else return 0;
    }
  );
}

/**
 * Application du filtre sur le modèle
 * @param exercises Liste d'exercises
 * @param model Modèle à filtrer
 * @returns Renvoie la liste filtrée
 */
function applyModel(exercises: ExerciseWithInterestsModel[], model: ModelType) {
  return exercises.filter((exercise: ExerciseWithInterestsModel) => {
    return exercise.model === model || model === '';
  });
}

// --- NAVIGATION ---

/**
 * Navigation vers une page exercice
 * @param navigate Objet de navigation
 * @param exercise Information de l'exercice
 */
function navigateExercise(
  navigate: NavigateFunction,
  exercise: ExerciseWithInterestsModel
) {
  // Navigation vers la nouvelle page
  const path: string | null = RoutesManager.navigateTo(
    'exercise',
    String(exercise.id)
  );
  if (path !== null) {
    navigate(path);
  }
  // TODO : gérer le cas où path == null
}

// --- COMPONENT ---

/**
 * Page d'affichage de la liste des exercices
 * @returns Renvoie un composant
 */
export default function ExercisesPage(): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager('ExerciseDetailsPage');

  // --- NAVIGATION ---
  const navigate: NavigateFunction = useNavigate();

  // --- EXERCICES ---
  const [exercises, setExercises] = useState<ExerciseWithInterestsModel[]>([]);
  const [updateExercises, setUpdateExercises] = useState<
    ExerciseWithInterestsModel[]
  >([]);

  // --- FILTRES ET TRIES
  const [searchQuery, setSearchQuery] = useState<string>('');
  // const [togglePatient, setTogglePatient] = useState<boolean>(false);
  const [togglePatient] = useState<boolean>(false);
  const [filterExercise, setFilterExercise] = useState<FilterType>('');
  const [modelExercise, setModelExercise] = useState<ModelType>('');

  // --- DIALOG
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // --- USE EFFECT ---
  // Au chargement, récupération de la liste des exercices
  useEffect(() => {
    fetchExercises().then((exercises: ExerciseWithInterestsModel[]) => {
      setExercises(exercises);
      setUpdateExercises(exercises);
    });
  }, []);

  // Application des filtres lorsqu'un input change
  useEffect(() => {
    setUpdateExercises(
      applyFilter(
        applyModel(
          applyToggle(applyInput(exercises, searchQuery), togglePatient),
          modelExercise
        ),
        filterExercise
      )
    );
  }, [searchQuery, togglePatient, modelExercise, filterExercise, exercises]);

  // --- COMPOSANT ---
  return (
    <div
      id={bindId.bindId(1, 'MainContainer')}
      className="w-full flex flex-col gap-4"
    >
      {/* Header + Filtres et trie */}
      <div
        id={bindId.bindId(2, 'HeaderContainer')}
        className="w-full flex flex-col"
      >
        <PageHeader title="Exercices" />
        <SearchBar
          id={bindId.bindId(3, 'SearchBar')}
          placeholder="Rechercher un exercice..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="mb-4"
        />
        <div
          className="flex gap-6"
          id={bindId.bindId(3, 'FilterSortContainer')}
        >
          <SelectFormComponent
            id={bindId.bindId(4, 'filterComponent')}
            className="w-[160px]"
            placeholder="Filtre"
            value={filterExercise}
            onChange={(e) => {
              const value: FilterType = e.target.value as FilterType;
              if (value === 'EMPTY') setFilterExercise('');
              else setFilterExercise(e.target.value as FilterType);
            }}
            options={[
              { value: 'EMPTY', label: 'Aucun filtre' },
              { value: 'ASC', label: 'Nom alphabétique' },
              { value: 'DESC', label: 'Nom anti-alphabétique' },
            ]}
          />
          <SelectFormComponent
            id={bindId.bindId(4, 'modeleComponent')}
            className="w-[160px]"
            placeholder="Modèle"
            value={modelExercise}
            onChange={(e) => {
              const value: ModelType = e.target.value as ModelType;
              if (value === 'EMPTY') setModelExercise('');
              else setModelExercise(e.target.value as ModelType);
            }}
            options={[
              { value: 'EMPTY', label: 'Aucun modèle' },
              { value: 'SFA', label: 'SFA' },
              { value: 'PCA', label: 'PCA' },
              { value: 'OTHER', label: 'Autre' },
            ]}
          />

          {/* TODO : Toggle */}
        </div>
      </div>

      {/* Liste des exercices */}
      <div id={bindId.bindId(2, 'CardMainConainter')}>
        <div
          id={bindId.bindId(3, 'Container')}
          className="bg-white p-4 rounded-lg shadow-sm"
        >
          <div
            id={bindId.bindId(4, 'CardContainer')}
            className="flex flex-wrap gap-6"
          >
            <AddCardExercise
              id={bindId.bindId(5, 'AddCard')}
              onClick={() => {
                setIsDialogOpen(true);
              }}
            />

            {updateExercises.map((exercise: ExerciseWithInterestsModel) => (
              <DetailsCardExercise
                id={bindId.bindId(5, 'Card' + exercise.id)}
                key={exercise.id}
                exercise={exercise}
                onClick={() => {
                  navigateExercise(navigate, exercise);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Dialogue d'ajout */}
      <ExerciseDialog
        id={bindId.bindId(2, 'ExerciseDialog')}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={(exerciseData: ExerciseWithInterestsModel) => {
          handleSaveExercise(exerciseData).then(
            (exercices: ExerciseWithInterestsModel[]) => {
              setExercises(exercices);
            }
          );
        }}
      />
    </div>
  );
}

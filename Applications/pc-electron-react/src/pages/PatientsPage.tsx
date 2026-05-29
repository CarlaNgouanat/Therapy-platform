import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { SearchBar } from '@/components/form/SearchBar';
import PatientDialog from '@/components/patients/PatientDialog';
import { patientsColumns } from '@/config/columns/PatientsColumns';
import { DataTable } from '@/components/DataTable';
import { NavigateFunction, useNavigate } from 'react-router';
import { PatientWithInterestsModel } from '@shared/models/PatientWithInterestsModel';
import { SelectFormComponent } from '@/components/form/FormComponent';
import { BindIdManager } from '@/utils/BindIdManager';
import { RoutesManager } from '@/utils/RoutesManager';

// --- TYPES ---
type FilterType =
  | 'ASC-NAME'
  | 'DESC-NAME'
  | 'ASC-AGE'
  | 'DESC-AGE'
  | 'EMPTY'
  | '';

// --- FONCTIONS ---
// --- PATIENTS ---

/**
 * Récupère la liste des exercises depuis la DB
 * @returns Renvoie une promesse avec la liste des exercices au format PatientWithInterestsModel
 */
async function fetchPatients(): Promise<PatientWithInterestsModel[]> {
  return await window.electronAPI.patientGetAllPatientsWithInterests();
}

/**
 * Sauvegarde un nouveau patient dans la base de données
 * @param patientData Données du patient à sauvegarder
 * @returns Renvoie une promesse avec la nouvelle liste de patients
 */
async function handleSavePatient(
  patientData: PatientWithInterestsModel
): Promise<PatientWithInterestsModel[]> {
  await window.electronAPI.patientCreatePatient(patientData);
  return fetchPatients();
}

// --- FILTER AND SORT ---

/**
 * Application de l'input texte
 * @param patients Liste de patients
 * @param query Texte saisi par l'utilisateur
 * @returns Renvoie la liste filtrée
 */
function applyInput(patients: PatientWithInterestsModel[], query: string) {
  return patients.filter(
    (patient: PatientWithInterestsModel) =>
      query === '' ||
      `${patient.firstName} ${patient.lastName}`
        .toLowerCase()
        .includes(query.toLowerCase())
  );
}

/**
 * Application du filtre pour l'ordre des patients
 * @param patients Liste des patients
 * @param fitler Filtre à appliquer
 * @returns Renvoie la liste triée
 */
function applyFilter(
  patients: PatientWithInterestsModel[],
  filter: FilterType
) {
  return patients.sort(
    (
      patientA: PatientWithInterestsModel,
      patientB: PatientWithInterestsModel
    ) => {
      if (filter === 'ASC-NAME')
        return patientA.firstName.localeCompare(patientB.firstName);
      else if (filter === 'DESC-NAME')
        return patientB.firstName.localeCompare(patientA.firstName);
      else if (filter === 'ASC-AGE')
        return patientA.birthDate.getTime() - patientB.birthDate.getTime();
      else if (filter === 'DESC-AGE')
        return patientB.birthDate.getTime() - patientA.birthDate.getTime();
      else return 0;
    }
  );
}

// --- NAVIGATION ---

/**
 * Navigation vers une page patient
 * @param navigate Objet de navigation
 * @param patient Information du patient
 */
function navigatePatient(
  navigate: NavigateFunction,
  patient: PatientWithInterestsModel
) {
  // Navigation vers la nouvelle page
  const path: string | null = RoutesManager.navigateTo(
    'patient',
    String(patient.id)
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
export default function PatientsPage(): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager('ExerciseDetailsPage');

  // --- NAVIGATION ---
  const navigate: NavigateFunction = useNavigate();

  // --- PATIENTS ---
  const [patients, setPatients] = useState<PatientWithInterestsModel[]>([]);
  const [updatePatients, setUpdatePatients] = useState<
    PatientWithInterestsModel[]
  >([]);

  // --- FILTRES ET TRIES
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterPatient, setFilterPatient] = useState<FilterType>('');

  // --- DIALOG
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // --- USE EFFECT ---
  // Au chargement, récupération de la liste des patients
  useEffect(() => {
    fetchPatients().then((patients: PatientWithInterestsModel[]) => {
      setPatients(patients);
      setUpdatePatients(patients);
    });
  }, []);

  // Application des filtres lorsqu'un input change
  useEffect(() => {
    setUpdatePatients(
      applyFilter(applyInput(patients, searchQuery), filterPatient)
    );
  }, [searchQuery, filterPatient, patients]);

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
        <PageHeader title="Patients" />
        <SearchBar
          id={bindId.bindId(3, 'SearchBar')}
          placeholder="Rechercher un patient..."
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
            placeholder="Filtre"
            value={filterPatient}
            className="w-[160px]"
            onChange={(e) => {
              const value: FilterType = e.target.value as FilterType;
              if (value === 'EMPTY') setFilterPatient('');
              else setFilterPatient(e.target.value as FilterType);
            }}
            options={[
              { value: 'EMPTY', label: 'Aucun filtre' },
              { value: 'ASC-NAME', label: 'Nom alphabétique' },
              { value: 'DESC-NAME', label: 'Nom anti-alphabétique' },
              { value: 'ASC-AGE', label: 'Age croissant' },
              { value: 'DESC-AGE', label: 'Age décroissant' },
            ]}
          />
        </div>
      </div>

      {/* Liste des patients */}
      <div id={bindId.bindId(2, 'TableMainContainer')}>
        <DataTable
          id={bindId.bindId(3, 'Table')}
          columns={patientsColumns}
          data={updatePatients}
          rowOnClick={(patient) => {
            navigatePatient(navigate, patient);
          }}
          onCreate={() => setIsDialogOpen(true)}
        />
      </div>

      {/* Dialogue d'ajout */}
      <PatientDialog
        id=""
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={(patientData: PatientWithInterestsModel) => {
          handleSavePatient(patientData).then(
            (patients: PatientWithInterestsModel[]) => {
              setPatients(patients);
            }
          );
        }}
      />
    </div>
  );
}

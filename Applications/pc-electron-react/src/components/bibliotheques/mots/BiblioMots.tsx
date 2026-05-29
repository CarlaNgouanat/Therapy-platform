import { useEffect, useState } from 'react';
import { ResourceModel } from '@shared/models/ResourceModel';
import { DataTable } from '@/components/DataTable';
import { wordColumns } from '@/config/columns/WordColumns';
import { ResourceType } from '@shared/types/ResourceType';
import { SearchBar } from '@/components/form/SearchBar';
import { SelectFormComponent } from '@/components/form/FormComponent';

type FilterType = 'ASC' | 'DESC' | 'EMPTY' | '';
type ModelType = ResourceType | 'EMPTY' | '';

/**
 * Récupère les mots de la DB
 * @returns Renvoie une liste de ressources
 */
async function fetchMots() {
  return await window.electronAPI.resourceGetByType({ type: 'WORD' });
}

/**
 * Application du filtre pour l'ordre des exercises
 * @param exercises Liste d'exercises
 * @param fitler Filtre à appliquer
 * @returns Renvoie la liste triée
 */
function applyFilter(mot: ResourceModel[], filter: FilterType) {
  return mot.sort((motA: ResourceModel, motB: ResourceModel) => {
    if (filter === 'ASC') return motA.name.localeCompare(motB.name);
    else if (filter === 'DESC') return motB.name.localeCompare(motA.name);
    else return 0;
  });
}

/**
 * Application de l'input texte
 * @param mots Liste de mots
 * @param query Texte saisi par l'utilisateur
 * @returns Renvoie la liste filtrée
 */
function applyInput(mots: ResourceModel[], query: string) {
  return mots.filter(
    (mot: ResourceModel) =>
      query === '' || mot.name.toLowerCase().includes(query.toLowerCase())
  );
}

/**
 * Application du filtre sur le modèle
 * @param mots Liste de mots
 * @param model Modèle à filtrer
 * @returns Renvoie la liste filtrée
 */
function applyModel(mots: ResourceModel[], model: ModelType) {
  return mots.filter((mot: ResourceModel) => {
    return mot.type === model || model === '';
  });
}

export function BiblioMots() {
  const [data, setData] = useState<ResourceModel[]>([]);
  const [updateData, setUpdateData] = useState<ResourceModel[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filtreMot, setFilterMot] = useState<FilterType>('');
  const [modelMot, setModelMot] = useState<ModelType>('');
  useEffect(() => {
    fetchMots().then((resources: ResourceModel[]) => {
      setData(resources);
      setUpdateData(resources);
    });
  }, []);

  useEffect(() => {
    setUpdateData(
      applyFilter(
        applyModel(applyInput(data, searchQuery), modelMot),
        filtreMot
      )
    );
  }, [searchQuery, modelMot, filtreMot, data]);
  return (
    <>
      <SearchBar
        id=""
        placeholder="Rechercher un mot..."
        value={searchQuery}
        onChange={setSearchQuery}
        className="mb-4"
      />
      <div className="flex gap-6 mb-4" id="">
        <SelectFormComponent
          id=""
          className="w-[160px]"
          placeholder="Filtre"
          value={filtreMot}
          onChange={(e) => {
            const value: FilterType = e.target.value as FilterType;
            if (value === 'EMPTY') setFilterMot('');
            else setFilterMot(e.target.value as FilterType);
          }}
          options={[
            { value: 'EMPTY', label: 'Aucun filtre' },
            { value: 'ASC', label: 'Nom alphabétique' },
            { value: 'DESC', label: 'Nom anti-alphabétique' },
          ]}
        />
        <SelectFormComponent
          id=""
          className="w-[160px]"
          placeholder="Catégorie"
          value={modelMot}
          onChange={(e) => {
            const value: ModelType = e.target.value as ModelType;
            if (value === 'EMPTY') setModelMot('');
            else setModelMot(e.target.value as ModelType);
          }}
          options={[{ value: 'EMPTY', label: 'Aucune catégorie' }]}
        />
      </div>

      {data && (
        <DataTable
          id=""
          onCreate={() => {}}
          columns={wordColumns}
          data={updateData}
        />
      )}
    </>
  );
}

/*<div>
      <h2>Bibliothèque de mots</h2>
      {data &&
      <>
      <p>Nombre de mots : {data.length}</p>
      <ul>
          {data.map((mot) => 
            <li key={mot.id}>{mot.name}</li>
          )}
        </ul>
      </>
        
      }
    </div>*/

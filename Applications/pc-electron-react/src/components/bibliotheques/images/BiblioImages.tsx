import { useEffect, useState } from 'react';
import { SearchBar } from '@/components/form/SearchBar';
import { SelectFormComponent } from '@/components/form/FormComponent';
import { ResourceModel } from '@shared/models/ResourceModel';
import { AddCardExercise } from '@/components/exercises/AddCardExercise';
import { ImageCard } from './ImageCard';

type FilterType = 'ASC' | 'DESC' | 'EMPTY' | '';

/**
 * Récupère les images de la DB
 * @returns Renvoie une liste de ressources
 */
async function fetchImages() {
  return await window.electronAPI.resourceGetByType({ type: 'IMAGE' });
}

/**
 * Application du filtre pour l'ordre des exercises
 * @param exercises Liste d'exercises
 * @param fitler Filtre à appliquer
 * @returns Renvoie la liste triée
 */
function applyFilter(interet: ResourceModel[], filter: FilterType) {
  return interet.sort((interetA: ResourceModel, interetB: ResourceModel) => {
    if (filter === 'ASC') return interetA.name.localeCompare(interetB.name);
    else if (filter === 'DESC')
      return interetB.name.localeCompare(interetA.name);
    else return 0;
  });
}

/**
 * Application de l'input texte
 * @param interets Liste de interets
 * @param query Texte saisi par l'utilisateur
 * @returns Renvoie la liste filtrée
 */
function applyInput(image: ResourceModel[], query: string) {
  return image.filter(
    (interet: ResourceModel) =>
      query === '' || interet.name.toLowerCase().includes(query.toLowerCase())
  );
}

export function BiblioImages() {
  const [data, setData] = useState<ResourceModel[]>([]);
  const [updateData, setUpdateData] = useState<ResourceModel[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filtreInteret, setFilterInteret] = useState<FilterType>('');
  useEffect(() => {
    fetchImages().then((resources: ResourceModel[]) => {
      setData(resources);
      setUpdateData(resources);
    });
  }, []);

  useEffect(() => {
    setUpdateData(applyFilter(applyInput(data, searchQuery), filtreInteret));
  }, [searchQuery, filtreInteret, data]);
  return (
    <>
      <SearchBar
        id=""
        placeholder="Rechercher un interet..."
        value={searchQuery}
        onChange={setSearchQuery}
        className="mb-4"
      />
      <div className="flex gap-6 mb-4" id="">
        <SelectFormComponent
          id=""
          className="w-[160px]"
          placeholder="Filtre"
          value={filtreInteret}
          onChange={(e) => {
            const value: FilterType = e.target.value as FilterType;
            if (value === 'EMPTY') setFilterInteret('');
            else setFilterInteret(e.target.value as FilterType);
          }}
          options={[
            { value: 'EMPTY', label: 'Aucun filtre' },
            { value: 'ASC', label: 'Nom alphabétique' },
            { value: 'DESC', label: 'Nom anti-alphabétique' },
          ]}
        />
      </div>

      <div id="" className="bg-white p-4 rounded-lg shadow-sm">
        <div id="" className="flex flex-wrap gap-6">
          <AddCardExercise id="" onClick={() => {}} />

          {updateData.map((images: ResourceModel) => (
            <ImageCard
              id=""
              key={images.id}
              image={images}
              onClick={() => {}}
            />
          ))}
        </div>
      </div>
    </>
  );
}

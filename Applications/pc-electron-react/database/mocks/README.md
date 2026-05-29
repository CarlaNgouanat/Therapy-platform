# Mock des données

Les données mockées sont des données tests utilisées en développement.

La classe `DevMockData` est utilisée pour ajouter des données tests dans la base de données pour facilier le développement et le test de cas particulier.

Actuellement, on ajoute 3 exercices (2 SFA et 1 PCA) :

```ts
<ExerciseWithInterestsModel>{
  id: 1,
  name: 'Test - Pizza SFA',
  model: 'SFA',
  patientId: null,
  createdAt: new Date(''),
  data: <SFAExerciseModel>{
    sfaCategory: 'Aliment, Nourriture, Plat italien',
    sfaUse: 'Se nourrir, Partager un repas, Dîner entre amis',
    sfaAction: 'Manger, Couper, Partager, Cuire',
    sfaProperties: 'Rond, Chaud, Fromage, Tomate',
    sfaAssociation: 'Italie, Restaurant, Faim, Fête',
  },
  interests: [],
};
```

```ts
<ExerciseWithInterestsModel>{
  id: 2,
  name: 'Test - Pomme SFA',
  model: 'SFA',
  patientId: null,
  createdAt: new Date(''),
  data: <SFAExerciseModel>{
    sfaCategory: 'Fruit, Aliment',
    sfaUse: 'Manger, Cuisiner',
    sfaAction: 'Croquer, Éplucher, Couper',
    sfaProperties: 'Rouge, Vert, Croquant, Sucré',
    sfaAssociation: 'Santé, Automne, Compote',
  },
  interests: [],
};
```

```ts
<ExerciseWithInterestsModel>{
  id: 3,
  name: 'Test - Exercice PCA',
  model: 'PCA',
  patientId: null,
  createdAt: new Date(''),
  data: <PCAExerciseModel>{},
  interests: [],
};
```

## Redirections

- [Retour au README.md du dossier `database`](./../README.md)
- [Retour au README.md de la racine](./../../README.md)

<style>
  @import "../../docs/readmeDocs/assets/style.css"
</style>

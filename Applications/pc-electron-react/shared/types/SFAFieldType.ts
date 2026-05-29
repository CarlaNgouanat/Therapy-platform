/**
 * Liste des sections du SFA
 */
export type SFAFieldType =
  | 'CATEGORY' // sfaCategory - "C'est un..."
  | 'USE' // sfaUse - "Sert à..."
  | 'ACTION' // sfaAction - "Fait quoi?"
  | 'PROPERTIES' // sfaProperties - "C'est en..."
  | 'ASSOCIATION'; // sfaAssociation - "Me fait penser à..."

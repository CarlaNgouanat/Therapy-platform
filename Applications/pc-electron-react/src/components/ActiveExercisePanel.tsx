import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, PlusIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExerciseModel } from '@shared/models/ExerciseModel';
import { SFAFieldType } from '@shared/types/SFAFieldType';
import { SFAExerciseModel } from '@shared/models/exercises/SFAExerciseModel';

// --- Types ---

// Interface du composant
export interface ActiveExercisePanelProps {
  exercise: ExerciseModel;
  onStop: () => void;
  isReadOnly?: boolean;
}

/**
 * Helper to get color config for each SFA type (matching Mobile/Figma)
 * @param type Type du sFA
 * @returns Renvoie une config
 */
const getCategoryConfig = (type: SFAFieldType) => {
  switch (type) {
    case 'CATEGORY':
      return {
        label: 'Catégorie',
        sub: "C'est un ...",
        bg: 'bg-[#BFD0F1]',
        border: 'border-[#A3CEF0]',
      }; // Blue-ish
    case 'USE':
      return {
        label: 'Usage',
        sub: 'Sert à ...',
        bg: 'bg-[#CBECCB]',
        border: 'border-[#9BE3B7]',
      }; // Green-ish
    case 'ACTION':
      return {
        label: 'Action',
        sub: 'Fait quoi ?',
        bg: 'bg-[#F9EFC3]',
        border: 'border-[#FDE68A]',
      }; // Yellow-ish
    case 'PROPERTIES':
      return {
        label: 'Propriétés',
        sub: "C'est en ...",
        bg: 'bg-[#DCCAF2]',
        border: 'border-[#C4B5FD]',
      }; // Purple-ish
    case 'ASSOCIATION':
      return {
        label: 'Association',
        sub: 'Me fait penser à ?',
        bg: 'bg-[#F4D1B6]',
        border: 'border-[#FDBA74]',
      }; // Orange-ish
    default:
      return {
        label: type,
        sub: '',
        bg: 'bg-gray-100',
        border: 'border-gray-200',
      };
  }
};

/**
 * Composant sunr une session active
 * @param param0 Données du composant
 * @returns Renvoie un composant
 */
export function ActiveExercisePanel({
  exercise,
  onStop,
}: ActiveExercisePanelProps) {
  // State for View Mode: 'GLOBAL' (5 cards) or 'DETAIL' (Green screen)
  const [activeCategory, setActiveCategory] = useState<SFAFieldType | null>(
    null
  );

  // State for Answers (Given vs Remaining)
  // We maintain a map of Type -> { given: string[], remaining: string[] }
  const [answersMap, setAnswersMap] = useState<
    Record<string, { given: string[]; remaining: string[] }>
  >({});

  // Manual Input Dialog
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [manualInput, setManualInput] = useState('');

  // --- Logic to Disable Global Scroll for this View ---

  useEffect(() => {
    // On cache le scroll du body au montage
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    // On le remet au démontage (quand on quitte l'exercice)
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // --- Initialization ---

  useEffect(() => {
    // Parse exercise fields to populate "Remaining"
    const newMap: Record<string, { given: string[]; remaining: string[] }> = {};
    const data: SFAExerciseModel = exercise.data as SFAExerciseModel;

    const parse = (str?: string) =>
      str
        ? str
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
        : [];

    newMap['CATEGORY'] = { given: [], remaining: parse(data.sfaCategory) };
    newMap['USE'] = { given: [], remaining: parse(data.sfaUse) };
    newMap['ACTION'] = { given: [], remaining: parse(data.sfaAction) };
    newMap['PROPERTIES'] = {
      given: [],
      remaining: parse(data.sfaProperties),
    };
    newMap['ASSOCIATION'] = {
      given: [],
      remaining: parse(data.sfaAssociation),
    };

    setAnswersMap(newMap);
  }, [exercise]);

  // --- Handlers ---

  const handleAddAnswer = (type: SFAFieldType, value: string) => {
    if (!value) return;

    setAnswersMap((prev) => {
      const current = prev[type] || { given: [], remaining: [] };
      // Move from remaining to given, or just add if not in remaining
      const newRemaining = current.remaining.filter(
        (r) => r.toLowerCase() !== value.toLowerCase()
      );
      // Check if already given
      if (current.given.some((g) => g.toLowerCase() === value.toLowerCase())) {
        return prev;
      }

      return {
        ...prev,
        [type]: {
          given: [...current.given, value],
          remaining: newRemaining,
        },
      };
    });
  };

  const handleManualSubmit = () => {
    if (activeCategory && manualInput) {
      handleAddAnswer(activeCategory, manualInput);
      window.electronAPI.sessionServiceMarkAnswerGiven(
        activeCategory,
        manualInput
      );
      setManualInput('');
      setIsAddDialogOpen(false);
    }
  };

  // --- Renderers ---

  // 1. Global View (Grid of 5 Cards)
  const renderGlobalView = () => {
    // Order from screenshot: Category, Use, Action, Properties, Association

    // Helper to render the mini-list inside the card
    const renderMiniList = (type: SFAFieldType) => {
      const data = answersMap[type];
      if (!data) return null;
      // Show first 3 given answers
      return (
        <div className="flex flex-wrap gap-2 mt-2">
          {data.given.slice(0, 3).map((ans, i) => (
            <span key={i} className="text-sm font-medium text-gray-800">
              {ans}
            </span>
          ))}
          {data.given.length > 3 && (
            <span className="text-xs text-gray-500">...</span>
          )}
        </div>
      );
    };

    return (
      <div className="h-full w-full overflow-y-auto bg-[#EDEEEF] p-8 box-border">
        <div className="max-w-6xl mx-auto flex flex-col min-h-0">
          <h2 className="text-2xl font-bold mb-6">
            {exercise.name} - SFA PIZZA
          </h2>{' '}
          {/* Placeholder title match */}
          <div className="grid grid-cols-2 gap-6 relative">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Category */}
              <div
                onClick={() => {
                  setActiveCategory('CATEGORY');
                  window.electronAPI.sessionServiceSelectField('CATEGORY');
                }}
                className="bg-[#BFD0F1] rounded-xl p-1 h-48 cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="absolute inset-0 top-0 h-16 flex flex-col items-center justify-center">
                  <h3 className="font-bold text-lg">Catégorie</h3>
                  <p className="text-sm text-gray-700 italic">
                    C&apos;est un ...
                  </p>
                </div>
                <div className="bg-white absolute inset-x-2 bottom-2 top-20 rounded-lg p-3">
                  {renderMiniList('CATEGORY')}
                </div>
              </div>

              {/* Propriétés */}
              <div
                onClick={() => {
                  setActiveCategory('PROPERTIES');
                  window.electronAPI.sessionServiceSelectField('PROPERTIES');
                }}
                className="bg-[#DCCAF2] rounded-xl p-1 h-48 cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="absolute inset-0 top-0 h-16 flex flex-col items-center justify-center">
                  <h3 className="font-bold text-lg">Propriétés</h3>
                  <p className="text-sm text-gray-700 italic">
                    C&apos;est en ...
                  </p>
                </div>
                <div className="bg-white absolute inset-x-2 bottom-2 top-20 rounded-lg p-3">
                  {renderMiniList('PROPERTIES')}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Usage */}
              <div
                onClick={() => {
                  setActiveCategory('USE');
                  window.electronAPI.sessionServiceSelectField('USE');
                }}
                className="bg-[#CBECCB] rounded-xl p-1 h-48 cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="absolute inset-0 top-0 h-16 flex flex-col items-center justify-center">
                  <h3 className="font-bold text-lg">Usage</h3>
                  <p className="text-sm text-gray-700 italic">Sert à ...</p>
                </div>
                <div className="bg-white absolute inset-x-2 bottom-2 top-20 rounded-lg p-3">
                  {renderMiniList('USE')}
                </div>
              </div>

              {/* Action */}
              <div
                onClick={() => {
                  setActiveCategory('ACTION');
                  window.electronAPI.sessionServiceSelectField('ACTION');
                }}
                className="bg-[#F9EFC3] rounded-xl p-1 h-48 cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="absolute inset-0 top-0 h-16 flex flex-col items-center justify-center">
                  <h3 className="font-bold text-lg">Action</h3>
                  <p className="text-sm text-gray-700 italic">Fait quoi ?</p>
                </div>
                <div className="bg-white absolute inset-x-2 bottom-2 top-20 rounded-lg p-3">
                  {renderMiniList('ACTION')}
                </div>
              </div>

              {/* Association */}
              <div
                onClick={() => {
                  setActiveCategory('ASSOCIATION');
                  window.electronAPI.sessionServiceSelectField('ASSOCIATION');
                }}
                className="bg-[#F4D1B6] rounded-xl p-1 h-48 cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="absolute inset-0 top-0 h-16 flex flex-col items-center justify-center">
                  <h3 className="font-bold text-lg">Association</h3>
                  <p className="text-sm text-gray-700 italic">
                    Me fait penser à ?
                  </p>
                </div>
                <div className="bg-white absolute inset-x-2 bottom-2 top-20 rounded-lg p-3">
                  {renderMiniList('ASSOCIATION')}
                </div>
              </div>
            </div>

            {/* Central Image Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-full shadow-xl border-4 border-white flex items-center justify-center overflow-hidden z-10">
              <span className="text-gray-400 font-bold">IMAGE</span>
            </div>
          </div>
          <div className="mt-4 flex justify-end shrink-0">
            <Button onClick={onStop}>Terminer</Button>
          </div>
        </div>
      </div>
    );
  };

  // 2. Detail View (Green Screen)
  const renderDetailView = () => {
    if (!activeCategory) return null;
    const config = getCategoryConfig(activeCategory);
    const data = answersMap[activeCategory];

    return (
      <div className="h-full w-full flex flex-col bg-[#F1F2F3] overflow-hidden">
        {/* Header */}
        <div className="bg-white p-4 border-b flex items-center shrink-0">
          <Button
            variant="ghost"
            onClick={() => {
              setActiveCategory(null);
              window.electronAPI.sessionServiceDeselectField();
            }}
            className="text-gray-600 gap-2"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Retour à l&apos;exercice
          </Button>
        </div>

        {/* Green Content Area */}
        <div className="flex-1 p-8 bg-[#CBECCB] relative overflow-y-auto box-border">
          <div className="max-w-5xl mx-auto relative flex flex-col">
            {/* Titre - Centré */}
            <div className="flex flex-col items-center justify-center gap-4 mb-8">
              {/* Floating Category Card */}
              <div className="bg-white rounded-xl shadow-sm px-12 py-4 text-center">
                <h2 className="font-bold text-xl">{config.label}</h2>
                <p className="text-gray-600 italic">{config.sub}</p>
              </div>
            </div>

            {/* Container for Tabs and Buttons */}
            <div className="flex flex-col md:flex-row items-end justify-between gap-4 z-10">
              {/* Tabs - Collés à la carte blanche */}
              <div className="bg-white rounded-t-xl inline-flex px-4 py-2 gap-4 border-b">
                <span className="font-bold bg-blue-200 px-2 py-1 rounded text-sm">
                  Mots
                </span>
                <span className="text-gray-500 cursor-not-allowed">Images</span>
                <span className="text-gray-500 cursor-not-allowed">Sons</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mb-2">
                <Button
                  className="bg-[#5C9CE6] hover:bg-[#4A8ACF] text-white"
                  size="sm"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Ajouter un indice
                </Button>
                <Button
                  className="bg-[#5C9CE6] hover:bg-[#4A8ACF] text-white"
                  size="sm"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Ajouter une réponse du patient
                </Button>
              </div>
            </div>

            {/* Main White Card with Columns */}
            <div className="bg-white rounded-b-xl rounded-tr-xl shadow-lg p-8 min-h-[400px] grid grid-cols-2 gap-0 relative">
              <div className="absolute inset-y-8 left-1/2 w-px bg-gray-300"></div>

              {/* Left: Already Given */}
              <div className="pr-8">
                <h3 className="text-center font-bold text-xl mb-6">
                  Déjà donnés
                </h3>
                <div className="flex flex-wrap gap-3">
                  {data?.given.map((ans, i) => (
                    <div
                      key={i}
                      className="border rounded-full px-4 py-2 text-lg font-medium border-gray-400 bg-gray-50"
                    >
                      {ans}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Remaining */}
              <div className="pl-8">
                <h3 className="text-center font-bold text-xl mb-6">Restants</h3>
                <div className="flex flex-wrap gap-3">
                  {data?.remaining.map((ans, i) => (
                    <div
                      key={i}
                      className="border rounded-full px-4 py-2 text-lg font-medium border-gray-400 text-gray-500 hover:text-black hover:border-black cursor-pointer transition-colors"
                      onClick={() => {
                        handleAddAnswer(activeCategory, ans);
                        window.electronAPI.sessionServiceMarkAnswerGiven(
                          activeCategory,
                          ans
                        );
                      }}
                    >
                      {ans}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Use Portal to render at body level to cover everything
  return createPortal(
    <>
      <div className="fixed inset-0 z-[9999] bg-white overflow-hidden flex flex-col">
        {activeCategory ? renderDetailView() : renderGlobalView()}
      </div>

      {/* Manual Input Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une réponse du patient</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label>Réponse</Label>
            <Input
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleManualSubmit}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>,
    document.body
  );
}

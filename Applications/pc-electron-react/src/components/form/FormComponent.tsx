import { ChangeEvent, ChangeEventHandler, useState } from 'react';
import { TemplateForm } from '@/components/form/TemplateForm';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BindIdManager } from '@/utils/BindIdManager';
import { BaseUIEvent } from 'node_modules/@base-ui/react/esm/utils/types';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { formatDateLong } from '@/utils/DateUtils';
import { ChevronDownIcon } from 'lucide-react';
import InterestsComboBox, {
  InterestsComboBoxComponent,
} from '@/components/form/InterestsComboBox';

// --- INTERFACE ---

// Interface d'un composant select
export interface SelectFormComponentType {
  id: string;
  className?: string;
  title?: string;
  label?: string;
  displayRequire?: boolean;
  placeholder: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

// Interface d'un composant input
export interface InputFormComponentType {
  id: string;
  className?: string;
  title?: string;
  label?: string;
  displayRequire?: boolean;
  placeholder: string;
  value: string;
  onChange: (event: BaseUIEvent<ChangeEvent<HTMLInputElement>>) => void;
}

// Interface d'un composant textarea
export interface TextareaFormComponentType {
  id: string;
  className?: string;
  title?: string;
  label?: string;
  displayRequire?: boolean;
  placeholder: string;
  value: string;
  rows: number;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
}

// Interface d'un composant date
export interface DateFormComponentType {
  id: string;
  className?: string;
  title?: string;
  label?: string;
  displayRequire?: boolean;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  disabledDates: (date: Date) => boolean;
}

// Interface d'un composant time
export interface TimeFormComponentType {
  id: string;
  className?: string;
  title?: string;
  label?: string;
  displayRequire?: boolean;
  value: string | undefined;
  onChange: ChangeEventHandler<HTMLInputElement> | undefined;
  disabledDates: (date: Date) => boolean;
}

// Interface d'un composant date
export interface InterestsComboBoxFormComponentType extends InterestsComboBoxComponent {
  id: string;
  className?: string;
  title?: string;
  label?: string;
  displayRequire?: boolean;
}

/**
 * Composant créer un selecteur avec un label (si label définit)
 * @param dataComponent Données du selecteur
 * @returns Renvoie un composant
 */
export function SelectFormComponent(dataComponent: SelectFormComponentType) {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-SelectFormComponent'
  );

  // --- COMPOSANT ---
  return (
    <TemplateForm
      key={bindId.bindId(1, 'TemplateForm')}
      id={bindId.bindId(1, 'TemplateForm')}
      className={dataComponent.className}
      idInput=""
      label={dataComponent.label}
      title={dataComponent.title}
      displayRequire={dataComponent.displayRequire}
      child={
        <Select
          value={dataComponent.value}
          onValueChange={(val: string) => {
            const event = {
              target: { value: val },
            } as React.ChangeEvent<HTMLSelectElement>;
            dataComponent.onChange(event);
          }}
        >
          <SelectTrigger
            id={bindId.bindId(1, 'SelectTrigger')}
            className={'bg-white ' + dataComponent.className}
          >
            <SelectValue
              id={bindId.bindId(2, 'Placeholder')}
              placeholder={dataComponent.placeholder}
            />
          </SelectTrigger>
          <SelectContent id={bindId.bindId(1, 'SelectContent')}>
            {dataComponent.options.map((option) => (
              <SelectItem
                id={bindId.bindId(2, 'InputSelect' + option.value)}
                key={option.value}
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    ></TemplateForm>
  );
}

/**
 * Composant créer un input avec un label (si label définit)
 * @param dataComponent Données de l'input
 * @returns Renvoie un composant
 */
export function InputFormComponent(dataComponent: InputFormComponentType) {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-InputFormComponent'
  );
  const inputId: string = bindId.bindId(1, 'Input');

  // --- COMPOSANT ---
  return (
    <TemplateForm
      key={bindId.bindId(1, 'TemplateForm')}
      id={bindId.bindId(1, 'TemplateForm')}
      className={dataComponent.className}
      idInput={inputId}
      label={dataComponent.label}
      title={dataComponent.title}
      displayRequire={dataComponent.displayRequire}
      child={
        <Input
          id={inputId}
          type={'text'}
          value={dataComponent.value}
          onChange={dataComponent.onChange}
          placeholder={dataComponent.placeholder}
          className={'col-span-3' + dataComponent.className}
        />
      }
    ></TemplateForm>
  );
}

/**
 * Composant créer un textarea avec un label (si label définit)
 * @param dataComponent Données du textarea
 * @returns Renvoie un composant
 */
export function TextareaFormComponent(
  dataComponent: TextareaFormComponentType
) {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-TextareaFormComponent'
  );
  const inputId: string = bindId.bindId(1, 'Textarea');

  // --- COMPOSANT ---
  return (
    <TemplateForm
      key={bindId.bindId(1, 'TemplateForm')}
      id={bindId.bindId(1, 'TemplateForm')}
      className={dataComponent.className}
      idInput={inputId}
      label={dataComponent.label}
      title={dataComponent.title}
      displayRequire={dataComponent.displayRequire}
      child={
        <textarea
          id={inputId}
          value={dataComponent.value}
          onChange={dataComponent.onChange}
          placeholder={dataComponent.placeholder}
          className="col-span-3 w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={dataComponent.rows}
        />
      }
    ></TemplateForm>
  );
}

/**
 * Composant créer une date avec un label (si label définit)
 * @param dataComponent Données de la date
 * @returns Renvoie un composant
 */
export function DateFormComponent(dataComponent: DateFormComponentType) {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-DateFormComponent'
  );
  const inputId: string = bindId.bindId(1, 'Date');

  // --- VARIABLES ---
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  // --- COMPOSANT ---
  return (
    <TemplateForm
      key={bindId.bindId(1, 'TemplateForm')}
      id={bindId.bindId(1, 'TemplateForm')}
      className={dataComponent.className}
      idInput={inputId}
      label={dataComponent.label}
      title={dataComponent.title}
      displayRequire={dataComponent.displayRequire}
      child={
        <div
          id={bindId.bindId(2, 'Container')}
          className="col-span-3 flex flex-row gap-3"
        >
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger
              id={bindId.bindId(3, 'PopoverTrigger')}
              className="w-full"
            >
              <Button
                variant="outline"
                id={bindId.bindId(4, 'Button')}
                className="justify-between font-normal w-full bg-white"
              >
                {dataComponent.value
                  ? formatDateLong(dataComponent.value)
                  : 'Sélectionner une date'}
                <ChevronDownIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              id={bindId.bindId(3, 'PopoverContent')}
              className="overflow-hidden p-0"
              align="start"
            >
              <Calendar
                id={bindId.bindId(4, 'Calendar')}
                mode="single"
                selected={dataComponent.value}
                captionLayout="dropdown"
                disabled={dataComponent.disabledDates}
                onSelect={(date: Date | undefined) => {
                  dataComponent.onChange(date);
                  setIsCalendarOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      }
    ></TemplateForm>
  );
}

/**
 * Composant créer une date avec un label (si label définit)
 * @param dataComponent Données de la date
 * @returns Renvoie un composant
 */
export function TimeFormComponent(dataComponent: TimeFormComponentType) {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-DateFormComponent'
  );
  const inputId: string = bindId.bindId(1, 'Time');

  // --- COMPOSANT ---
  return (
    <TemplateForm
      key={bindId.bindId(1, 'TemplateForm')}
      id={bindId.bindId(1, 'TemplateForm')}
      className={dataComponent.className}
      idInput={inputId}
      label={dataComponent.label}
      title={dataComponent.title}
      displayRequire={dataComponent.displayRequire}
      child={
        <Input
          id={bindId.bindId(3, 'TimeInput')}
          type="time"
          lang="fr-FR"
          value={dataComponent.value}
          onChange={dataComponent.onChange}
          className="[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      }
    ></TemplateForm>
  );
}

/**
 * Composant créer un textarea avec un label (si label définit)
 * @param dataComponent Données du textarea
 * @returns Renvoie un composant
 */
export function InterestsComboBoxFormComponent(
  dataComponent: InterestsComboBoxFormComponentType
) {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-InterestsComboBoxFormComponent'
  );
  const inputId: string = bindId.bindId(1, 'InterestsComboBox');

  // --- COMPOSANT ---
  return (
    <TemplateForm
      key={bindId.bindId(1, 'TemplateForm')}
      id={bindId.bindId(1, 'TemplateForm')}
      className={dataComponent.className}
      idInput={inputId}
      label={dataComponent.label}
      title={dataComponent.title}
      displayRequire={dataComponent.displayRequire}
      child={
        <InterestsComboBox
          id={bindId.bindId(1, 'InterestsComboBox')}
          value={dataComponent.value}
          onChange={dataComponent.onChange}
        />
      }
    ></TemplateForm>
  );
}

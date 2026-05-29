import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { formatDateLong } from '@/utils/DateUtils';
import { ChevronDownIcon } from 'lucide-react';

// Interface du composant
export interface FormFieldProps {
  id: string;
  label: string;
  type: 'text' | 'date' | 'email' | 'number' | 'datetime-local' | 'select';
  // Valeurs pour les input classiques
  value?: string;
  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  placeholder?: string;
  // Valeurs pour les textarea
  multiline?: boolean;
  rows?: number;
  // Valeurs pour le format date avec calendrier et sélecteur d'heure
  dateValue?: Date;
  onDateChange?: (date: Date | undefined) => void;
  timeValue?: string;
  onTimeChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showTime?: boolean;
  // Valeurs pour le select
  options?: Array<{ value: string; label: string }>;
  // Indique si le champ est requis
  required?: boolean;
  // CSS additionnel
  className?: string;
  disabledDates?: (date: Date) => boolean;
}

// Champ de formulaire avec support de différents types d'input
export function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 4,
  dateValue,
  onDateChange,
  timeValue,
  onTimeChange,
  showTime = false,
  options = [],
  required = false,
  className = '',
  disabledDates,
}: FormFieldProps): React.JSX.Element {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <div className={`grid grid-cols-4 items-center gap-4 ${className}`}>
      <Label htmlFor={id}>
        <div>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </div>
      </Label>
      {type === 'date' ? (
        <div className="col-span-3 flex flex-row gap-3">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger className="w-full">
              <Button
                variant="outline"
                id={`${id}-date`}
                className="justify-between font-normal w-full"
              >
                {dateValue
                  ? formatDateLong(dateValue)
                  : 'Sélectionner une date'}
                <ChevronDownIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={dateValue}
                captionLayout="dropdown"
                disabled={disabledDates}
                onSelect={(date) => {
                  onDateChange?.(date);
                  setIsCalendarOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
          {showTime && (
            <Input
              id={`${id}-time`}
              type="time"
              lang="fr-FR"
              step="1"
              value={timeValue}
              onChange={onTimeChange}
              className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          )}
        </div>
      ) : type === 'select' ? (
        <Select
          value={value}
          onValueChange={
            onChange
              ? (val) => {
                  if (onChange) {
                    const event = {
                      target: { value: val },
                    } as React.ChangeEvent<HTMLSelectElement>;
                    onChange(event);
                  }
                }
              : undefined
          }
          required={required}
        >
          <SelectTrigger className="col-span-3 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <SelectValue placeholder={placeholder || label} />
          </SelectTrigger>
          <SelectContent>
            {options &&
              options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      ) : multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="col-span-3 w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={rows}
        />
      ) : (
        <Input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="col-span-3"
        />
      )}
    </div>
  );
}

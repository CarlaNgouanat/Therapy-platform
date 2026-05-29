import React from 'react';
import { Label } from '@/components/ui/label';

export interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  className?: string;
}

// Champ de sélection avec label
export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  required = false,
  className = '',
}: SelectFieldProps): React.JSX.Element {
  return (
    <div className={`grid grid-cols-4 items-center gap-4 ${className}`}>
      <Label htmlFor={id} className="text-right">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className="col-span-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

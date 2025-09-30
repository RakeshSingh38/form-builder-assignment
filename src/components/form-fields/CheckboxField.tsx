'use client';

import React, { FC } from 'react';
import { FormField, FormTheme } from '@/types/form';

interface CheckboxFieldProps {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  theme: FormTheme;
  mode: 'edit' | 'preview';
  onEdit?: (field: FormField) => void;
}

export const CheckboxField: FC<CheckboxFieldProps> = ({
  field,
  value,
  onChange,
  error,
  mode,
}) => {

  const handleCheckboxChange = (option: string, checked: boolean) => {
    const currentValues = Array.isArray(value) ? value : [];
    const allowMultiple = field.multiple === true; // Default to false (single selection)

    if (checked) {
      if (allowMultiple) {
        onChange([...currentValues, option]);
      } else {
        // Single selection - replace current selection
        onChange([option]);
      }
    } else {
      onChange(currentValues.filter((v: string) => v !== option));
    }
  };

  const isChecked = (option: string) => {
    return Array.isArray(value) && value.includes(option);
  };

  return (
    <div className="mb-4 relative group">
      <label
        className="block mb-2 font-medium"
        style={{
          color: 'var(--color-text)',
          fontSize: 'var(--font-size-base)',
          fontFamily: 'var(--font-family)'
        }}
      >
        {field.label}
        {field.required && (
          <span
            className="ml-1 font-bold"
            style={{ color: 'var(--color-error)' }}
            title="This field is required"
          >
            *
          </span>
        )}
      </label>
      <div className="flex flex-col gap-2">
        {field.options?.map((option, index) => (
          <label
            key={index}
            className="flex items-center gap-2 cursor-pointer"
            style={{
              color: 'var(--color-text)',
              fontSize: 'var(--font-size-base)',
              fontFamily: 'var(--font-family)'
            }}
          >
            <input
              type="checkbox"
              className="w-4 h-4 rounded focus:ring-2 focus:ring-blue-500"
              style={{
                accentColor: 'var(--color-primary)',
                backgroundColor: 'var(--color-background)'
              }}
              checked={isChecked(option)}
              onChange={(e) => handleCheckboxChange(option, e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                }
              }}
              disabled={mode === 'edit'}
            />
            {option}
          </label>
        ))}
      </div>
      {error && (
        <div
          className="mt-2"
          style={{
            color: 'var(--color-error)',
            fontSize: 'var(--font-size-sm)',
            fontFamily: 'var(--font-family)'
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};


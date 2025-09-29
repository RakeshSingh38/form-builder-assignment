'use client';

import React from 'react';
import { DraggableField } from '../drag-drop/DraggableField';
import { FormField } from '@/types/form';


const defaultFields: FormField[] = [
  // Text Fields
  {
    id: 'text-field',
    type: 'text',
    label: 'Text Input',
    placeholder: 'Enter text...',
    required: true,
  },
  {
    id: 'email-field',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter email...',
    required: true,
    validation: {
      email: true,
      emailMessage: 'Please enter a valid email address'
    }
  },
  {
    id: 'password-field',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter password...',
    required: false,
  },
  {
    id: 'number-field',
    type: 'number',
    label: 'Number',
    placeholder: 'Enter number...',
    required: false,
  },
  {
    id: 'textarea-field',
    type: 'textarea',
    label: 'Text Area',
    placeholder: 'Enter text...',
    required: false,
    rows: 4,
  },
  // Selection Fields
  {
    id: 'select-field',
    type: 'select',
    label: 'Select',
    placeholder: 'Choose an option...',
    required: false,
    options: ['Option 1', 'Option 2', 'Option 3'],
  },
  {
    id: 'radio-field',
    type: 'radio',
    label: 'Radio Buttons',
    required: false,
    options: ['Option 1', 'Option 2', 'Option 3'],
  },
  {
    id: 'checkbox-field',
    type: 'checkbox',
    label: 'Checkboxes',
    required: false,
    options: ['Option 1', 'Option 2', 'Option 3'],
  },
  // Other Fields
  {
    id: 'date-field',
    type: 'date',
    label: 'Date',
    required: false,
  },
  {
    id: 'file-field',
    type: 'file',
    label: 'File Upload',
    required: false,
    accept: '*/*',
  },
  {
    id: 'image-field',
    type: 'file',
    label: 'Image Upload',
    required: false,
    accept: 'image/*',
  },
  // Validation Fields
  {
    id: 'url-field',
    type: 'text',
    label: 'URL',
    placeholder: 'https://example.com',
    required: false,
    validation: {
      pattern: '^https?://.+',
      message: 'Please enter a valid URL'
    },
  },
  {
    id: 'phone-field',
    type: 'text',
    label: 'Phone Number',
    placeholder: '+91 9999999999',
    required: false,
    validation: {
      pattern: '^[\\+]?[1-9][\\d\\s\\-\\(\\)]{7,}$',
      message: 'Please enter a valid phone number'
    },
  },
  {
    id: 'zip-field',
    type: 'text',
    label: 'ZIP Code',
    placeholder: '123456',
    required: false,
    validation: {
      pattern: '^\\d+$',
      message: 'Please enter a valid ZIP code (numbers only)'
    },
  },
];

const fieldGroups = [
  {
    title: 'Text Fields',
    fields: defaultFields.filter(field =>
      ['text', 'email', 'password', 'number', 'textarea'].includes(field.type) &&
      !['url-field', 'phone-field', 'zip-field'].includes(field.id)
    ),
  },
  {
    title: 'Selection Fields',
    fields: defaultFields.filter(field =>
      ['select', 'radio', 'checkbox'].includes(field.type)
    ),
  },
  {
    title: 'Validation Fields',
    fields: defaultFields.filter(field =>
      ['url-field', 'phone-field', 'zip-field'].includes(field.id)
    ),
  },
  {
    title: 'File Upload Fields',
    fields: defaultFields.filter(field =>
      ['file'].includes(field.type)
    ),
  },
  {
    title: 'Other Fields',
    fields: defaultFields.filter(field =>
      ['date'].includes(field.type)
    ),
  },
];

interface FieldPaletteProps {
  onDropField?: (field: FormField) => void;
  mode?: 'edit' | 'preview';
}

export const FieldPalette = ({ onDropField, mode = 'edit' }: FieldPaletteProps) => {
  return (
    <div className={`w-full lg:w-72 border-r-0 lg:border-r lg:shadow-sm lg:h-[calc(100vh-4rem)] ${mode === 'edit' ? 'lg:fixed lg:left-0 lg:top-16 lg:z-10' : ''}`} style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
      <div
        className="h-full overflow-y-auto p-4 scrollbar-hover"
        style={{
          scrollbarWidth: 'none',
          scrollbarColor: 'transparent transparent'
        }}
      >
        <h3 className="font-bold mb-4" style={{ color: 'var(--color-text)', fontSize: 'var(--font-size-lg)' }}>Form Fields</h3>
        {fieldGroups.map((group, index) => (
          <div key={index} className="mb-6">
            <h4 className="font-medium mb-2 pb-2 border-b" style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)', fontSize: 'var(--font-size-base)' }}>
              {group.title}
            </h4>
            <div className="flex flex-col gap-2">
              {group.fields.map((field) => (
                <DraggableField key={field.id} field={field} onDrop={onDropField} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

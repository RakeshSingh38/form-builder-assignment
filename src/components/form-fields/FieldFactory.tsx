'use client';

import React, { FC } from 'react';
import { FormField, FormTheme } from '@/types/form';
import { BaseField } from './BaseField';
import { CheckboxField } from './CheckboxField';
import { RadioField } from './RadioField';

interface FieldFactoryProps {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  theme: FormTheme;
  mode: 'edit' | 'preview';
  onEdit?: (field: FormField) => void;
  onLabelUpdate?: (fieldId: string, newLabel: string) => void;
}

export const FieldFactory: FC<FieldFactoryProps> = (props) => {
  const { field } = props;

  switch (field.type) {
    case 'checkbox':
      return <CheckboxField {...props} />;
    case 'radio':
      return <RadioField {...props} />;
    default:
      return <BaseField {...props} />;
  }
};

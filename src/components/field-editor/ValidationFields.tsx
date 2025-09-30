'use client';

import React from 'react';
import { Input } from '../ui';
import { FormField } from '@/types/form';

interface ValidationFieldsProps {
    field: FormField;
    updateValidation: (validation: Record<string, unknown>) => void;
    showLengthFields?: boolean;
    showPatternField?: boolean;
    showMessageField?: boolean;
    lengthPlaceholders?: {
        min?: string;
        max?: string;
    };
    patternPlaceholder?: string;
    messagePlaceholder?: string;
}

export const ValidationFields: React.FC<ValidationFieldsProps> = ({
    field,
    updateValidation,
    showLengthFields = true,
    showPatternField = true,
    showMessageField = true,
    lengthPlaceholders = {},
    patternPlaceholder = "e.g., ^[A-Za-z]+$",
    messagePlaceholder = "Custom validation error message"
}) => {
    return (
        <>
            {showLengthFields && (
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Minimum Length"
                        type="number"
                        value={field.validation?.min || ''}
                        onChange={(e) => updateValidation({ min: e.target.value ? parseInt(e.target.value) : undefined })}
                        min={0}
                        placeholder={lengthPlaceholders.min}
                    />
                    <Input
                        label="Maximum Length"
                        type="number"
                        value={field.validation?.max || ''}
                        onChange={(e) => updateValidation({ max: e.target.value ? parseInt(e.target.value) : undefined })}
                        min={0}
                        placeholder={lengthPlaceholders.max}
                    />
                </div>
            )}

            {showPatternField && (
                <Input
                    label="Pattern (Regex)"
                    value={field.validation?.pattern || ''}
                    onChange={(e) => updateValidation({ pattern: e.target.value })}
                    placeholder={patternPlaceholder}
                />
            )}

            {showMessageField && (
                <Input
                    label="Custom Error Message"
                    value={field.validation?.message || ''}
                    onChange={(e) => updateValidation({ message: e.target.value })}
                    placeholder={messagePlaceholder}
                />
            )}
        </>
    );
};

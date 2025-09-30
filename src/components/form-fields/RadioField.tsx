'use client';

import React, { FC } from 'react';
import { FormField, FormTheme } from '@/types/form';

interface RadioFieldProps {
    field: FormField;
    value: unknown;
    onChange: (value: unknown) => void;
    error?: string;
    theme: FormTheme;
    mode: 'edit' | 'preview';
    onEdit?: (field: FormField) => void;
}

export const RadioField: FC<RadioFieldProps> = ({
    field,
    value,
    onChange,
    error,
    mode,
    onEdit,
}) => {

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
                            type="radio"
                            name={field.id}
                            value={option}
                            className="w-4 h-4 focus:ring-2"
                            style={{
                                accentColor: 'var(--color-primary)',
                                backgroundColor: 'var(--color-background)',
                                borderColor: 'var(--color-border)'
                            }}
                            checked={value === option}
                            onChange={(e) => onChange(e.target.value)}
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

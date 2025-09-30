'use client';

import React, { FC, InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
}

export const Checkbox: FC<CheckboxProps> = ({
    label,
    error,
    helperText,
    className = '',
    style,
    ...props
}) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center">
                <input
                    type="checkbox"
                    className={`h-4 w-4 focus:ring-2 focus:ring-blue-500 border rounded transition-colors ${className}`}
                    style={{
                        accentColor: 'var(--color-primary)',
                        ...style,
                    }}
                    {...props}
                />
                <label className="ml-2 block text-sm" style={{ color: 'var(--color-text)' }}>
                    {label}
                </label>
            </div>
            {error && (
                <p className="text-sm" style={{ color: 'var(--color-error)' }}>
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                    {helperText}
                </p>
            )}
        </div>
    );
};

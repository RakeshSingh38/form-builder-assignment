'use client';

import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input = ({ label, error, helperText, className = '', style, ...props }: InputProps) => {
    const inputClasses = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${className}`;

    const inputStyles = {
        backgroundColor: 'var(--color-background)',
        borderColor: error ? 'var(--color-error)' : 'var(--color-border)',
        color: 'var(--color-text)',
        ...style,
    };

    return (
        <div className="space-y-1 lg:space-y-2">
            {label && (
                <label className="block text-xs lg:text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                    {label}
                </label>
            )}
            <input className={inputClasses} style={inputStyles} {...props} />
            {error && (
                <p className="text-xs lg:text-sm" style={{ color: 'var(--color-error)' }}>
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p className="text-xs lg:text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                    {helperText}
                </p>
            )}
        </div>
    );
};

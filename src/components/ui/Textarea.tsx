'use client';

import React, { FC, TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Textarea: FC<TextareaProps> = ({
    label,
    error,
    helperText,
    className = '',
    style,
    ...props
}) => {
    const textareaClasses = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-y max-h-64 min-h-20 ${className}`;

    const textareaStyles = {
        backgroundColor: 'var(--color-background)',
        borderColor: error ? 'var(--color-error)' : 'var(--color-border)',
        color: 'var(--color-text)',
        ...style,
    };

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                    {label}
                </label>
            )}
            <textarea
                className={textareaClasses}
                style={textareaStyles}
                {...props}
            />
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

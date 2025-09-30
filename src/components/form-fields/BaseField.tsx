'use client';

import React, { useState, KeyboardEvent, FocusEvent, MouseEvent } from 'react';
import { FormField, FormTheme } from '../../types/form';

interface BaseFieldProps {
    field: FormField;
    value: unknown;
    onChange: (value: unknown) => void;
    error?: string;
    theme: FormTheme;
    mode: 'edit' | 'preview';
    onLabelUpdate?: (fieldId: string, newLabel: string) => void;
}

export const BaseField = ({
    field, value, onChange, error, mode, onLabelUpdate
}: BaseFieldProps) => {
    const [isEditingLabel, setIsEditingLabel] = useState(false);
    const [tempLabel, setTempLabel] = useState(field.label);

    const handleLabelEdit = () => mode === 'edit' && setIsEditingLabel(true);
    const handleLabelSave = () => {
        if (onLabelUpdate && isEditingLabel) onLabelUpdate(field.id, tempLabel);
        setIsEditingLabel(false);
    };
    const handleLabelCancel = () => {
        setTempLabel(field.label);
        setIsEditingLabel(false);
    };
    const handleLabelKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && isEditingLabel) handleLabelSave();
        else if (e.key === 'Escape' && isEditingLabel) handleLabelCancel();
    };

    const inputStyles = {
        backgroundColor: mode === 'edit' ? 'var(--color-surface)' : 'var(--color-background)',
        borderColor: error ? 'var(--color-error)' : 'var(--color-border)',
        color: 'var(--color-text)',
        fontSize: 'var(--font-size-base)',
        fontFamily: 'var(--font-family)',
        borderStyle: 'solid',
        borderWidth: '2px'
    };

    const baseClasses = "w-full px-4 py-2 border-2 rounded-lg transition-all duration-200 focus:outline-none";
    const disabledClasses = mode === 'edit' ? "cursor-not-allowed opacity-60" : "";
    const focusStyles = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        e.target.style.borderColor = 'var(--color-primary)';
        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
    };
    const blurStyles = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)';
        e.target.style.boxShadow = 'none';
    };

    const renderInput = () => {
        const commonProps = {
            style: inputStyles,
            onClick: (e: MouseEvent) => e.stopPropagation(),
            onFocus: focusStyles,
            onBlur: blurStyles,
            disabled: mode === 'edit'
        };

        switch (field.type) {
            case 'textarea':
                return <textarea {...commonProps} className={`${baseClasses} resize-y min-h-[100px] max-h-64 ${disabledClasses}`} value={String(value || '')} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} rows={field.rows || 4} />;
            case 'select':
                if (field.multiple) {
                    const selectedValues = Array.isArray(value) ? value : [];
                    return (
                        <select {...commonProps} className={`${baseClasses} ${disabledClasses}`} value={selectedValues} onChange={(e) => onChange(Array.from(e.target.selectedOptions, option => option.value))} multiple>
                            {field.options?.map((option: string, index: number) => <option key={index} value={option}>{option}</option>)}
                        </select>
                    );
                } else {
                    return (
                        <select {...commonProps} className={`${baseClasses} ${disabledClasses}`} value={String(value || '')} onChange={(e) => onChange(e.target.value)}>
                            <option value="">{field.placeholder || 'Select an option'}</option>
                            {field.options?.map((option: string, index: number) => <option key={index} value={option}>{option}</option>)}
                        </select>
                    );
                }
            case 'file':
                return (
                    <input {...commonProps} className={`${baseClasses} ${disabledClasses}`} type="file" accept={field.accept || '*/*'} onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && field.accept && field.accept !== '*/*') {
                            const acceptedTypes = field.accept.split(',').map(type => type.trim());
                            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
                            const mimeType = file.type.toLowerCase();
                            const isValidType = acceptedTypes.some(acceptedType =>
                                acceptedType.startsWith('.') ? fileExtension === acceptedType.toLowerCase() :
                                    acceptedType.includes('/') ? mimeType === acceptedType.toLowerCase() || mimeType.startsWith(acceptedType.toLowerCase()) :
                                        false
                            );
                            if (!isValidType) {
                                alert(`Please select a file of type: ${field.accept}`);
                                e.target.value = '';
                                return;
                            }
                        }
                        onChange(file || null);
                    }} />
                );
            default:
                return <input {...commonProps} className={`${baseClasses} ${disabledClasses}`} type={field.type} value={String(value || '')} onChange={(e) => onChange(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); e.preventDefault(); } }} placeholder={field.placeholder} />;
        }
    };

    return (
        <div className="mb-2 relative group w-full overflow-hidden">
            {isEditingLabel ? (
                <div className="mb-2">
                    <input
                        type="text"
                        value={tempLabel}
                        onChange={(e) => setTempLabel(e.target.value)}
                        onKeyDown={handleLabelKeyDown}
                        className="max-w-xs px-3 py-1.5 border-2 rounded-md text-sm focus:outline-none transition-all duration-200"
                        style={{
                            backgroundColor: 'var(--color-background)',
                            color: 'var(--color-text)',
                            borderColor: 'var(--color-border)',
                            fontSize: 'var(--font-size-base)',
                            fontFamily: 'var(--font-family)',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                        }}
                        onFocus={focusStyles}
                        onBlur={(e) => {
                            handleLabelSave();
                            e.target.style.borderColor = 'var(--color-border)';
                            e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
                        }}
                        autoFocus
                    />
                </div>
            ) : (
                <label
                    className={`block mb-2 font-medium break-words ${mode === 'edit' ? 'cursor-pointer px-2 py-1 rounded transition-all duration-200 hover:shadow-sm' : ''}`}
                    style={{
                        color: 'var(--color-text)',
                        fontSize: 'var(--font-size-base)',
                        fontFamily: 'var(--font-family)',
                        backgroundColor: 'transparent',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word'
                    }}
                    onMouseEnter={(e) => {
                        if (mode === 'edit') {
                            e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                            e.currentTarget.style.borderColor = 'var(--color-border)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (mode === 'edit') {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.borderColor = 'transparent';
                        }
                    }}
                    onClick={mode === 'edit' ? handleLabelEdit : undefined}
                    title={mode === 'edit' ? 'Click to edit label' : ''}
                >
                    {field.label}
                    {field.required && <span className="ml-1 font-bold" style={{ color: 'var(--color-error)' }} title="This field is required">*</span>}
                </label>
            )}
            {renderInput()}
            {error && <div className="mt-2" style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-sm)', fontFamily: 'var(--font-family)' }}>{error}</div>}
        </div>
    );
};

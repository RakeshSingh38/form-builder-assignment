import { useState, useEffect } from 'react';
import { FormField } from '../types/form';

export const useFieldEditor = (initialField: FormField) => {
    const [editedField, setEditedField] = useState(initialField);

    useEffect(() => {
        setEditedField(initialField);
    }, [initialField]);

    const updateField = (updates: Partial<FormField>) => {
        setEditedField(prev => ({ ...prev, ...updates }));
    };

    const updateValidation = (updates: Record<string, unknown>) => {
        setEditedField(prev => ({
            ...prev,
            validation: { ...prev.validation, ...updates },
        }));
    };

    const updateOption = (index: number, value: string) => {
        const options = [...(editedField.options || [])];
        options[index] = value;
        setEditedField(prev => ({ ...prev, options }));
    };

    const addOption = (value = 'New Option') => {
        const options = [...(editedField.options || []), value];
        setEditedField(prev => ({ ...prev, options }));
    };

    const removeOption = (index: number) => {
        const options = editedField.options?.filter((_, i) => i !== index) || [];
        setEditedField(prev => ({ ...prev, options }));
    };

    return {
        editedField,
        updateField,
        updateValidation,
        updateOption,
        addOption,
        removeOption,
    };
};



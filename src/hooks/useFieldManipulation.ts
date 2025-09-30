import { useState } from 'react';
import { FormConfig, FormField } from '../types/form';
import { v4 as uuidv4 } from 'uuid';

export const useFieldManipulation = (initialConfig: FormConfig) => {
    const [formConfig, setFormConfig] = useState(initialConfig);

    const addField = (field: FormField, index?: number) => {
        const newField = { ...field, id: uuidv4() };
        setFormConfig(prev => ({
            ...prev,
            fields: index !== undefined
                ? [...prev.fields.slice(0, index), newField, ...prev.fields.slice(index)]
                : [...prev.fields, newField],
        }));
    };

    const removeField = (fieldId: string) => {
        setFormConfig(prev => ({
            ...prev,
            fields: prev.fields.filter(f => f.id !== fieldId)
        }));
    };

    const updateField = (fieldId: string, updates: Partial<FormField>) => {
        setFormConfig(prev => ({
            ...prev,
            fields: prev.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f)
        }));
    };

    const reorderFields = (fromIndex: number, toIndex: number) => {
        setFormConfig(prev => {
            const newFields = [...prev.fields];
            const [movedField] = newFields.splice(fromIndex, 1);
            newFields.splice(toIndex, 0, movedField);
            return { ...prev, fields: newFields };
        });
    };

    return {
        formConfig,
        setFormConfig,
        addField,
        removeField,
        updateField,
        reorderFields,
    };
};



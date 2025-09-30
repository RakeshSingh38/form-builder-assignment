'use client';

import React from 'react';
import { FormField } from '@/types/form';
import { Save } from 'lucide-react';
import { Modal, Input, Button, Checkbox, Section } from '../ui';
import { useFieldEditor } from '../../hooks/useFieldEditor';

interface FieldEditorProps {
    field: FormField;
    isOpen: boolean;
    onClose: () => void;
    onSave: (field: FormField) => void;
}

export const FieldEditor = ({ field, isOpen, onClose, onSave }: FieldEditorProps) => {
    const { editedField, updateField, updateValidation, updateOption, addOption, removeOption } = useFieldEditor(field);

    // Save and close
    const handleSave = () => {
        onSave(editedField);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Field" size="lg">
            <div className="space-y-6">
                {/* Basic field settings */}
                <Section title="Basic Properties">
                    <Input
                        label="Field Label"
                        value={editedField.label}
                        onChange={(e) => updateField({ label: e.target.value })}
                    />

                    <Input
                        label="Placeholder"
                        value={editedField.placeholder || ''}
                        onChange={(e) => updateField({ placeholder: e.target.value })}
                    />

                    <Checkbox
                        label="Required field"
                        checked={editedField.required || false}
                        onChange={(e) => updateField({ required: e.target.checked })}
                    />
                </Section>

                {/* Textarea settings */}
                {editedField.type === 'textarea' && (
                    <Input
                        label="Number of Rows"
                        type="number"
                        value={editedField.rows || 4}
                        onChange={(e) => updateField({ rows: parseInt(e.target.value) })}
                        min={1}
                        max={20}
                    />
                )}

                {/* Options for select/radio/checkbox fields */}
                {(editedField.type === 'select' || editedField.type === 'radio' || editedField.type === 'checkbox') && (
                    <Section title="Options">
                        {editedField.options?.map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input
                                    value={option}
                                    onChange={(e) => updateOption(index, e.target.value)}
                                    className="flex-1"
                                />
                                <Button variant="danger" size="sm" onClick={() => removeOption(index)}>
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <Button variant="primary" onClick={() => addOption()}>
                            Add Option
                        </Button>
                    </Section>
                )}

                {/* Multiple selection for select fields */}
                {editedField.type === 'select' && (
                    <Checkbox
                        label="Allow multiple selections"
                        checked={editedField.multiple || false}
                        onChange={(e) => updateField({ multiple: e.target.checked })}
                    />
                )}

                {/* File upload settings */}
                {editedField.type === 'file' && (
                    <Input
                        label="Accepted File Types"
                        value={editedField.accept || ''}
                        onChange={(e) => updateField({ accept: e.target.value })}
                        placeholder="e.g., .pdf,.doc,.docx or image/*"
                    />
                )}

                {/* Validation rules */}
                <Section title="Validation">
                    {/* Text and textarea validation */}
                    {(editedField.type === 'text' || editedField.type === 'textarea') && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Minimum Length"
                                    type="number"
                                    value={editedField.validation?.min || ''}
                                    onChange={(e) => updateValidation({ min: e.target.value ? parseInt(e.target.value) : undefined })}
                                    min={0}
                                />
                                <Input
                                    label="Maximum Length"
                                    type="number"
                                    value={editedField.validation?.max || ''}
                                    onChange={(e) => updateValidation({ max: e.target.value ? parseInt(e.target.value) : undefined })}
                                    min={0}
                                />
                            </div>
                            <Input
                                label="Pattern (Regex)"
                                value={editedField.validation?.pattern || ''}
                                onChange={(e) => updateValidation({ pattern: e.target.value })}
                                placeholder="e.g., ^[A-Za-z]+$"
                            />
                            <Input
                                label="Custom Error Message"
                                value={editedField.validation?.message || ''}
                                onChange={(e) => updateValidation({ message: e.target.value })}
                                placeholder="Custom validation error message"
                            />
                        </>
                    )}

                    {/* Email validation */}
                    {editedField.type === 'email' && (
                        <>
                            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                                <h4 className="font-medium mb-3" style={{ color: 'var(--color-text)', fontSize: 'var(--font-size-base)' }}>
                                    Email Validation
                                </h4>
                                <div className="space-y-3">
                                    <Checkbox
                                        label="Enable email format validation"
                                        checked={editedField.validation?.email || false}
                                        onChange={(e) => updateValidation({ email: e.target.checked })}
                                    />
                                    <Input
                                        label="Custom Email Error Message"
                                        value={editedField.validation?.emailMessage || ''}
                                        onChange={(e) => updateValidation({ emailMessage: e.target.value })}
                                        placeholder="e.g., Please enter a valid email address"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Number validation */}
                    {editedField.type === 'number' && (
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Minimum Value"
                                type="number"
                                value={editedField.validation?.min || ''}
                                onChange={(e) => updateValidation({ min: e.target.value ? parseFloat(e.target.value) : undefined })}
                            />
                            <Input
                                label="Maximum Value"
                                type="number"
                                value={editedField.validation?.max || ''}
                                onChange={(e) => updateValidation({ max: e.target.value ? parseFloat(e.target.value) : undefined })}
                            />
                        </div>
                    )}
                </Section>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    <Save size={16} className="mr-2" />
                    Save Changes
                </Button>
            </div>
        </Modal>
    );
};
'use client';

import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FormConfig, FormField, FormMode } from '../../types/form';
import { FieldPalette } from '../field-palette/FieldPalette';
import { DroppableFormArea } from '../drag-drop/DroppableFormArea';
import { FormPreview } from '../form-preview/FormPreview';
import CustomThemeEditor from '../theme-editor/CustomThemeEditor';
import { FieldEditor } from '../field-editor/FieldEditor';
import { v4 as uuidv4 } from 'uuid';
import { Save, Download, Upload, Palette } from 'lucide-react';
import { Navbar, ImportModal, ThemeDropdown } from '../ui';
import { useModalState } from '../../hooks/useModalState';
import { useFieldManipulation } from '../../hooks/useFieldManipulation';
import { downloadFile, importFile } from '../../utils/fileUtils';
import { useCustomTheme } from '../../contexts/CustomThemeContext';
import themes from '../../data/themes.json';
import defaultFormConfig from '../../data/defaultFormConfig.json';
interface FormBuilderProps {
    initialFormConfig?: FormConfig;
    onSave?: (formConfig: FormConfig) => void;
    onExport?: (formConfig: FormConfig) => void;
}

const createDefaultConfig = (): FormConfig => ({
    id: uuidv4(),
    ...defaultFormConfig,
    theme: themes[0]
});

export const FormBuilder = ({ initialFormConfig = createDefaultConfig(), onSave, onExport }: FormBuilderProps) => {
    const [mode, setMode] = useState<FormMode>('edit');
    const [formData, setFormData] = useState({});
    const [editingField, setEditingField] = useState<FormField | null>(null);

    const { modals, openModal, closeModal } = useModalState({ themeEditor: false, fieldEditor: false, importModal: false });
    const { formConfig, setFormConfig, addField, removeField, updateField, reorderFields } = useFieldManipulation(initialFormConfig);
    const { currentTheme, themeMode, updateTheme, setThemeMode } = useCustomTheme();

    const handleThemeChange = (theme: typeof formConfig.theme) => {
        setFormConfig(prev => ({ ...prev, theme }));
        updateTheme(theme);
        if (theme.id === 'light') setThemeMode('light');
        else if (theme.id === 'dark') setThemeMode('dark');
        else setThemeMode('custom');
    };

    const handleEditField = (field: FormField) => {
        setEditingField(field);
        openModal('fieldEditor');
    };

    const handleSaveField = (updatedField: FormField) => {
        updateField(updatedField.id, updatedField);
        closeModal('fieldEditor');
        setEditingField(null);
    };

    const handleSave = () => {
        console.log('Save button clicked');
        onSave?.(formConfig);
    };

    const handleExport = () => {
        console.log('Export button clicked');
        if (onExport) onExport(formConfig);
        else downloadFile(formConfig, formConfig.title.replace(/[^a-zA-Z0-9]/g, '_') + '.json');
    };

    const handleImport = async (file: File) => {
        const importedConfig = await importFile(file) as Partial<FormConfig>;
        if (!importedConfig || typeof importedConfig !== 'object') throw new Error('Invalid file format');
        const validatedConfig: FormConfig = {
            ...importedConfig,
            id: importedConfig.id || uuidv4(),
            title: importedConfig.title || 'Imported Form',
            fields: importedConfig.fields || [],
            theme: importedConfig.theme || formConfig.theme,
            settings: importedConfig.settings || formConfig.settings
        };
        setFormConfig(validatedConfig);
    };

    const handleTitleStyleChange = (titleStyle: { fontSize?: string; fontFamily?: string; fontWeight?: string; textAlign?: string }) => setFormConfig(prev => ({
        ...prev,
        titleStyle: {
            fontSize: titleStyle.fontSize || prev.titleStyle?.fontSize || '2xl',
            fontFamily: titleStyle.fontFamily || prev.titleStyle?.fontFamily || 'Inter',
            fontWeight: titleStyle.fontWeight || prev.titleStyle?.fontWeight || 'bold',
            textAlign: (titleStyle.textAlign as 'left' | 'center' | 'right') || prev.titleStyle?.textAlign || 'center'
        }
    }));

    const handleDescriptionStyleChange = (descriptionStyle: { fontSize?: string; fontFamily?: string; fontWeight?: string; textAlign?: string }) => setFormConfig(prev => ({
        ...prev,
        descriptionStyle: {
            fontSize: descriptionStyle.fontSize || prev.descriptionStyle?.fontSize || 'base',
            fontFamily: descriptionStyle.fontFamily || prev.descriptionStyle?.fontFamily || 'Inter',
            fontWeight: descriptionStyle.fontWeight || prev.descriptionStyle?.fontWeight || 'normal',
            textAlign: (descriptionStyle.textAlign as 'left' | 'center' | 'right') || prev.descriptionStyle?.textAlign || 'left'
        }
    }));

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex min-h-screen font-sans" style={{ backgroundColor: 'var(--color-background)' }}>
                <Navbar
                    title="Form Builder"
                    mode={mode}
                    onModeChange={setMode}
                    actions={[
                        { icon: Upload, label: 'Import', variant: 'secondary', onClick: () => { console.log('Import button clicked'); openModal('importModal'); } },
                        { icon: Download, label: 'Export', variant: 'secondary', onClick: handleExport },
                        { icon: Palette, label: 'Theme', variant: 'secondary', children: (<ThemeDropdown currentTheme={currentTheme} themeMode={themeMode} themes={themes} onThemeChange={handleThemeChange} onCustomTheme={() => openModal('themeEditor')} />) },
                        { icon: Save, label: 'Save', variant: 'primary', onClick: handleSave }
                    ]}
                />

                <div className="flex flex-col lg:flex-row mt-12 lg:mt-16 w-full">
                    {mode === 'edit' && <FieldPalette onDropField={addField} mode={mode} />}
                    <div className={`flex-1 p-2 lg:p-4 min-h-0 ${mode === 'edit' ? 'lg:ml-72' : ''}`} style={{ backgroundColor: 'var(--color-surface)' }}>
                        {mode === 'preview' ? (
                            <FormPreview formConfig={formConfig} onSubmit={(submission) => console.log('Form submitted:', submission)} />
                        ) : (
                            <DroppableFormArea
                                formConfig={formConfig}
                                onAddField={addField}
                                onRemoveField={removeField}
                                onEditField={handleEditField}
                                onLabelUpdate={(fieldId: string, newLabel: string) => updateField(fieldId, { label: newLabel })}
                                onReorderFields={reorderFields}
                                onTitleChange={(title) => setFormConfig(prev => ({ ...prev, title }))}
                                onDescriptionChange={(description) => setFormConfig(prev => ({ ...prev, description }))}
                                onTitleStyleChange={handleTitleStyleChange}
                                onDescriptionStyleChange={handleDescriptionStyleChange}
                                mode={mode}
                                formData={formData}
                                onFormDataChange={setFormData}
                                errors={{}}
                            />
                        )}
                    </div>
                </div>

                <CustomThemeEditor isOpen={modals.themeEditor} onClose={() => closeModal('themeEditor')} />
                {editingField && <FieldEditor field={editingField} isOpen={modals.fieldEditor} onClose={() => { closeModal('fieldEditor'); setEditingField(null); }} onSave={handleSaveField} />}
                <ImportModal isOpen={modals.importModal} onClose={() => closeModal('importModal')} onImport={handleImport} />
            </div>
        </DndProvider>
    );
};
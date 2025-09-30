'use client';

import React from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { FormField, FormConfig } from '../../types/form';
import { FieldFactory } from '../form-fields/FieldFactory';
import { TitleDescriptionEditor } from '../ui/TitleDescriptionEditor';
import { Plus, GripVertical, Edit3, Trash2 } from 'lucide-react';

interface DroppableFormAreaProps {
  formConfig: FormConfig;
  onAddField: (field: FormField, index?: number) => void;
  onRemoveField: (fieldId: string) => void;
  onEditField: (field: FormField) => void;
  onLabelUpdate: (fieldId: string, newLabel: string) => void;
  onReorderFields: (fromIndex: number, toIndex: number) => void;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onTitleStyleChange: (style: { fontSize?: string; fontFamily?: string; fontWeight?: string; textAlign?: string }) => void;
  onDescriptionStyleChange: (style: { fontSize?: string; fontFamily?: string; fontWeight?: string; textAlign?: string }) => void;
  mode: 'edit' | 'preview';
  formData: Record<string, unknown>;
  onFormDataChange: (data: Record<string, unknown>) => void;
  errors: Record<string, string>;
}

export const DroppableFormArea = ({
  formConfig, onAddField, onRemoveField, onEditField, onLabelUpdate, onReorderFields,
  onTitleChange, onDescriptionChange, onTitleStyleChange, onDescriptionStyleChange,
  mode, formData, onFormDataChange, errors
}: DroppableFormAreaProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'field',
    drop: (item: { field: FormField }, monitor) => {
      console.log('Drop detected:', item.field.label, 'didDrop:', monitor.didDrop());
      if (monitor.didDrop()) return;
      if (formConfig.fields.length === 0) {
        console.log('Adding field to empty form:', item.field.label);
        // I am adding a small delay to ensure state consistency
        setTimeout(() => onAddField(item.field), 10);
      } else {
        console.log('Adding field to existing form:', item.field.label);
        // Add field to the end of existing fields so that the fields are added in the correct order
        setTimeout(() => onAddField(item.field, formConfig.fields.length), 10);
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver() })
  }));

  const handleFieldChange = (fieldId: string, value: unknown) => {
    onFormDataChange({ ...formData, [fieldId]: value });
  };

  const DropZone = ({ index }: { index: number }) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: 'field',
      drop: (item: { field: FormField }, monitor) => {
        if (monitor.didDrop()) return;
        // Add small delay to ensure state consistency
        setTimeout(() => onAddField(item.field, index), 10);
      },
      collect: (monitor) => ({ isOver: monitor.isOver() })
    }));

    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <div ref={drop as any} className={`h-2 transition-all duration-200 ${isOver ? 'bg-blue-500 h-8' : 'bg-transparent'}`} style={{ backgroundColor: isOver ? 'var(--color-primary)' : 'transparent', opacity: isOver ? 0.3 : 0, pointerEvents: 'auto' }} />
    );
  };

  const DraggableFieldItem = ({ field, index }: { field: FormField; index: number }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'form-field',
      item: { field, index },
      collect: (monitor) => ({ isDragging: monitor.isDragging() })
    }));

    const [{ isOver }, drop] = useDrop(() => ({
      accept: 'form-field',
      drop: (item: { field: FormField; index?: number }) => {
        if (item.index !== undefined) {
          const dragIndex = item.index;
          const hoverIndex = index;
          if (dragIndex !== hoverIndex) {
            // I am adding a small delay to ensure state consistency
            setTimeout(() => onReorderFields(dragIndex, hoverIndex), 10);
          }
        }
      },
      // I am collecting the isOver state to determine if the field is being hovered
      collect: (monitor) => ({ isOver: monitor.isOver() })
    }));

    return (
      <div ref={(node) => { drag(node); drop(node); }} className={`relative mb-3 p-2 rounded-lg transition-all duration-200 ${mode === 'edit' ? 'group hover:shadow-lg hover:border-2 hover:border-opacity-50 cursor-move' : ''} ${isDragging ? 'opacity-50' : ''} ${isOver ? 'border-blue-500' : ''}`} style={mode === 'edit' ? { borderColor: isOver ? 'var(--color-primary)' : 'var(--color-border)', borderWidth: '1px', borderStyle: 'solid', backgroundColor: 'var(--color-surface)' } : {}}>
        <div className="relative">
          <FieldFactory field={field} value={formData[field.id]} onChange={(value) => handleFieldChange(field.id, value)} error={errors[field.id]} theme={formConfig.theme} mode={mode} onEdit={onEditField} onLabelUpdate={onLabelUpdate} />
          {mode === 'edit' && (
            <div className="absolute -top-4 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
              <div className="hidden lg:block p-2.5 rounded-lg cursor-move transition-all duration-200 hover:scale-105 shadow-sm" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }} title="Drag to reorder">
                <GripVertical size={16} style={{ color: 'var(--color-textSecondary)' }} />
              </div>
              <div className="lg:hidden p-2 rounded-lg cursor-move shadow-sm border transition-all duration-200 hover:scale-105" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }} title="Drag to reorder">
                <GripVertical size={12} style={{ color: 'var(--color-textSecondary)' }} />
              </div>
              <button className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 lg:py-2.5 text-white rounded-lg hover:scale-105 transition-all duration-200 shadow-md font-medium hover:shadow-lg" style={{ backgroundColor: 'var(--color-primary)', fontSize: 'var(--font-size-xs)' }} onClick={() => onEditField(field)} title="Edit field settings">
                <Edit3 size={12} className="lg:size-[14px]" />
                <span>Edit</span>
              </button>
              <button className="w-7 lg:w-9 h-7 lg:h-9 text-white rounded-lg cursor-pointer flex items-center justify-center hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg" style={{ backgroundColor: 'var(--color-error)' }} onClick={() => onRemoveField(field.id)} title="Remove field">
                <Trash2 size={12} className="lg:size-[14px]" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex justify-center">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <div ref={drop as any} className="w-full max-w-4xl p-2 lg:p-4 border-2 border-dashed rounded-xl transition-all duration-200 relative shadow-sm overflow-hidden" style={{ backgroundColor: isOver ? 'var(--color-surface)' : 'var(--color-background)', borderColor: isOver ? 'var(--color-primary)' : 'var(--color-border)', boxShadow: isOver ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
        {formConfig.fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[500px] text-center px-4">
            <div className="w-20 h-20 border-2 border-dashed rounded-full flex items-center justify-center mb-6" style={{ borderColor: 'var(--color-border)' }}>
              <Plus size={40} style={{ color: 'var(--color-textSecondary)' }} />
            </div>
            <h3 className="text-lg lg:text-xl font-semibold mb-3 break-words" style={{ color: 'var(--color-text)' }}>Drag fields here to build your form</h3>
            <p className="text-sm lg:text-base max-w-md break-words" style={{ color: 'var(--color-textSecondary)' }}>Start by dragging a field from the left panel to create your form. You can add text inputs, dropdowns, checkboxes, and more.</p>
          </div>
        ) : (
          <>
            <TitleDescriptionEditor title={formConfig.title} description={formConfig.description || ''} titleStyle={formConfig.titleStyle} descriptionStyle={formConfig.descriptionStyle} onTitleChange={onTitleChange} onDescriptionChange={onDescriptionChange} onTitleStyleChange={onTitleStyleChange} onDescriptionStyleChange={onDescriptionStyleChange} />
            {mode === 'edit' && <DropZone index={0} />}
            {formConfig.fields.map((field: FormField, index: number) => (
              <div key={field.id}>
                <DraggableFieldItem field={field} index={index} />
                {mode === 'edit' && <DropZone index={index + 1} />}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

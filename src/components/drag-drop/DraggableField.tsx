'use client';

import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FormField } from '@/types/form';
import {
    Type,
    Mail,
    Lock,
    Hash,
    FileText,
    ChevronDown,
    CheckSquare,
    Radio,
    Calendar,
    Upload,
    Link,
    Phone,
    MapPin,
    Image,
    File,
    FileText as Document,
    Plus
} from 'lucide-react';

interface DraggableFieldProps {
    field: FormField;
    onDrop?: (field: FormField) => void;
}

const getFieldIcon = (field: FormField) => {
    // Check for specific field types by ID
    if (field.id === 'url-field') {
        return <Link size={16} />;
    }
    if (field.id === 'phone-field') {
        return <Phone size={16} />;
    }
    if (field.id === 'zip-field') {
        return <MapPin size={16} />;
    }
    if (field.id === 'image-field') {
        // eslint-disable-next-line jsx-a11y/alt-text
        return <Image size={16} />;
    }
    if (field.id === 'pdf-field') {
        return <File size={16} />;
    }
    if (field.id === 'document-field') {
        return <Document size={16} />;
    }

    // Handle regular field types
    switch (field.type) {
        case 'text':
            return <Type size={16} />;
        case 'email':
            return <Mail size={16} />;
        case 'password':
            return <Lock size={16} />;
        case 'number':
            return <Hash size={16} />;
        case 'textarea':
            return <FileText size={16} />;
        case 'select':
            return <ChevronDown size={16} />;
        case 'checkbox':
            return <CheckSquare size={16} />;
        case 'radio':
            return <Radio size={16} />;
        case 'date':
            return <Calendar size={16} />;
        case 'file':
            return <Upload size={16} />;
        default:
            return <Type size={16} />;
    }
};

export const DraggableField = ({ field, onDrop }: DraggableFieldProps) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'field',
        item: () => {
            console.log('Drag started:', field.label);
            return { field };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        // Ensure drag starts immediately
        canDrag: true,
    }));

    // Mobile drop zone
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'field',
        drop: (item: { field: FormField }) => {
            console.log('Mobile drop zone - field dropped:', item.field.label);
            if (onDrop) {
                onDrop(item.field);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    return (
        <>
            {/* Mobile drag indicator - half screen drop zone */}
            {isDragging && (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <div ref={drop as any} className="fixed bottom-0 left-0 right-0 h-1/2 z-10 lg:hidden">
                    <div className={`w-full h-full border-t-4 flex flex-col transition-all duration-200 ${isOver ? 'bg-green-500 bg-opacity-90 border-green-600' : 'bg-blue-500 bg-opacity-90 border-blue-600'}`}>
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center text-white">
                                <div className={`w-20 h-20 border-4 border-white border-dashed rounded-lg flex items-center justify-center mb-6 mx-auto ${isOver ? 'border-green-300' : ''}`}>
                                    <Plus size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Form Builder</h3>
                                <p className="text-lg">{isOver ? 'Release to add!' : `Drop "${field.label}" here`}</p>
                                <p className="text-sm opacity-80 mt-2">Release to add to your form</p>
                            </div>
                        </div>
                        <div className={`p-4 text-center ${isOver ? 'bg-green-600' : 'bg-blue-600'}`}>
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--color-primary)' }}></div>
                                <span className="font-semibold">{field.label}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ref={drag as any}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-grab transition-all duration-200 hover:shadow-sm active:cursor-grabbing ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'
                    }`}
                style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                }}
            >
                {/* Desktop icon */}
                <div className="hidden lg:flex items-center justify-center w-6 h-6" style={{ color: 'var(--color-primary)' }}>
                    {getFieldIcon(field)}
                </div>

                {/* Mobile icon - smaller */}
                <div className="flex lg:hidden items-center justify-center w-5 h-5" style={{ color: 'var(--color-primary)' }}>
                    {getFieldIcon(field)}
                </div>

                <span className="text-sm lg:text-base font-medium flex-1" style={{ color: 'var(--color-text)' }}>
                    {field.label}
                </span>

                {/* Mobile draggable handle - right side */}
                <div className="flex items-center justify-center w-5 h-5 lg:hidden" style={{ color: 'var(--color-textSecondary)' }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                        <circle cx="3" cy="3" r="1" />
                        <circle cx="9" cy="3" r="1" />
                        <circle cx="3" cy="6" r="1" />
                        <circle cx="9" cy="6" r="1" />
                        <circle cx="3" cy="9" r="1" />
                        <circle cx="9" cy="9" r="1" />
                    </svg>
                </div>
            </div>
        </>
    );
};

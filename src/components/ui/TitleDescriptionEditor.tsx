'use client';

import React, { useState, FC } from 'react';
import { Settings, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface TitleDescriptionEditorProps {
    title: string;
    description: string;
    titleStyle?: {
        fontSize: string;
        fontFamily: string;
        fontWeight: string;
        textAlign: 'left' | 'center' | 'right';
    };
    descriptionStyle?: {
        fontSize: string;
        fontFamily: string;
        fontWeight: string;
        textAlign: 'left' | 'center' | 'right';
    };
    onTitleChange: (title: string) => void;
    onDescriptionChange: (description: string) => void;
    onTitleStyleChange: (style: {
        fontSize: string;
        fontFamily: string;
        fontWeight: string;
        textAlign: 'left' | 'center' | 'right';
    }) => void;
    onDescriptionStyleChange: (style: {
        fontSize: string;
        fontFamily: string;
        fontWeight: string;
        textAlign: 'left' | 'center' | 'right';
    }) => void;
}

export const TitleDescriptionEditor: FC<TitleDescriptionEditorProps> = ({
    title, description, titleStyle, descriptionStyle, onTitleChange, onDescriptionChange, onTitleStyleChange, onDescriptionStyleChange
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editingType, setEditingType] = useState<'title' | 'description'>('title');

    const titleStyleDefault = { fontSize: '24px', fontFamily: 'Arial, sans-serif', fontWeight: '700', textAlign: 'center' as const, ...titleStyle };
    const descStyleDefault = { fontSize: '16px', fontFamily: 'Arial, sans-serif', fontWeight: '400', textAlign: 'left' as const, ...descriptionStyle };

    const handleStyleChange = (field: string, value: string, type: 'title' | 'description') => {
        const currentStyle = type === 'title' ? titleStyleDefault : descStyleDefault;
        const newStyle = { ...currentStyle, [field]: value };
        if (type === 'title') {
            onTitleStyleChange(newStyle);
        } else {
            onDescriptionStyleChange(newStyle);
        }
    };

    const currentStyle = editingType === 'title' ? titleStyleDefault : descStyleDefault;

    return (
        <div className="mb-6 p-4 border-2 rounded-lg relative" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
            <button
                onClick={() => setIsEditing(!isEditing)}
                className="absolute top-2 right-2 p-2 rounded-lg transition-colors"
                style={{ backgroundColor: isEditing ? 'var(--color-primary)' : 'transparent', color: isEditing ? 'white' : 'var(--color-textSecondary)' }}
            >
                <Settings size={16} />
            </button>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>Form Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        placeholder="Enter form title..."
                        className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-all"
                        style={{
                            backgroundColor: 'var(--color-background)',
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-text)',
                            fontSize: titleStyleDefault.fontSize,
                            fontFamily: titleStyleDefault.fontFamily,
                            fontWeight: titleStyleDefault.fontWeight,
                            textAlign: titleStyleDefault.textAlign
                        }}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>Form Description</label>
                    <textarea
                        value={description || ''}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                        placeholder="Enter form description..."
                        rows={3}
                        className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-all resize-none"
                        style={{
                            backgroundColor: 'var(--color-background)',
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-text)',
                            fontSize: descStyleDefault.fontSize,
                            fontFamily: descStyleDefault.fontFamily,
                            fontWeight: descStyleDefault.fontWeight,
                            textAlign: descStyleDefault.textAlign
                        }}
                    />
                </div>
            </div>

            {isEditing && (
                <div className="mt-4 p-4 border-t-2 border-dashed" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setEditingType('title')}
                            className="px-3 py-1 rounded text-sm transition-colors"
                            style={{ backgroundColor: editingType === 'title' ? 'var(--color-primary)' : 'var(--color-surface)', color: editingType === 'title' ? 'white' : 'var(--color-textSecondary)' }}
                        >
                            Title
                        </button>
                        <button
                            onClick={() => setEditingType('description')}
                            className="px-3 py-1 rounded text-sm transition-colors"
                            style={{ backgroundColor: editingType === 'description' ? 'var(--color-primary)' : 'var(--color-surface)', color: editingType === 'description' ? 'white' : 'var(--color-textSecondary)' }}
                        >
                            Description
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text)' }}>Size</label>
                            <select
                                value={currentStyle.fontSize}
                                onChange={(e) => handleStyleChange('fontSize', e.target.value, editingType)}
                                className="w-full px-2 py-1 text-sm border rounded"
                                style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                            >
                                <option value="16px">16px</option>
                                <option value="20px">20px</option>
                                <option value="24px">24px</option>
                                <option value="28px">28px</option>
                                <option value="32px">32px</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text)' }}>Weight</label>
                            <select
                                value={currentStyle.fontWeight}
                                onChange={(e) => handleStyleChange('fontWeight', e.target.value, editingType)}
                                className="w-full px-2 py-1 text-sm border rounded"
                                style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                            >
                                <option value="400">Normal</option>
                                <option value="600">Semi</option>
                                <option value="700">Bold</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text)' }}>Align</label>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleStyleChange('textAlign', 'left', editingType)}
                                    className="p-2 rounded transition-colors"
                                    style={{ backgroundColor: currentStyle.textAlign === 'left' ? 'var(--color-primary)' : 'var(--color-surface)', color: currentStyle.textAlign === 'left' ? 'white' : 'var(--color-textSecondary)' }}
                                >
                                    <AlignLeft size={14} />
                                </button>
                                <button
                                    onClick={() => handleStyleChange('textAlign', 'center', editingType)}
                                    className="p-2 rounded transition-colors"
                                    style={{ backgroundColor: currentStyle.textAlign === 'center' ? 'var(--color-primary)' : 'var(--color-surface)', color: currentStyle.textAlign === 'center' ? 'white' : 'var(--color-textSecondary)' }}
                                >
                                    <AlignCenter size={14} />
                                </button>
                                <button
                                    onClick={() => handleStyleChange('textAlign', 'right', editingType)}
                                    className="p-2 rounded transition-colors"
                                    style={{ backgroundColor: currentStyle.textAlign === 'right' ? 'var(--color-primary)' : 'var(--color-surface)', color: currentStyle.textAlign === 'right' ? 'white' : 'var(--color-textSecondary)' }}
                                >
                                    <AlignRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
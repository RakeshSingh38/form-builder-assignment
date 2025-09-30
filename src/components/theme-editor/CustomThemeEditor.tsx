'use client';

import React, { useState, FC } from 'react';
import { X, Palette, Type } from 'lucide-react';
import { useCustomTheme } from '../../contexts/CustomThemeContext';
import colorInputs from '../../data/colorInputs.json';
import typographyInputs from '../../data/typographyInputs.json';

interface CustomThemeEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomThemeEditor: FC<CustomThemeEditorProps> = ({ isOpen, onClose }) => {
  const { currentTheme, updateTheme } = useCustomTheme();
  const [activeTab, setActiveTab] = useState<'colors' | 'typography'>('colors');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getNestedValue = (obj: any, path: string) => path.split('.').reduce((current: any, key: string) => current?.[key], obj);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setNestedValue = (obj: any, path: string, value: any) => {
    const keys = path.split('.'); const lastKey = keys.pop()!;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const target = keys.reduce((current: any, key: string) => { if (!current[key]) current[key] = {}; return current[key]; }, obj);
    target[lastKey] = value;
  };

  const handleChange = (section: string, key: string, value: string) => {
    const newTheme = { ...currentTheme };
    setNestedValue(newTheme, `${section}.${key}`, value);
    updateTheme(newTheme);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parseRangeValue = (value: any, min: string) => {
    if (typeof value === 'string' && value.includes('rem')) return parseFloat(value.replace('rem', ''));
    return parseFloat(min || '0.75');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="font-semibold" style={{ color: 'var(--color-text)', fontSize: 'var(--font-size-xl)' }}>Custom Theme Editor</h2>
          <button onClick={onClose} className="transition-colors" style={{ color: 'var(--color-textSecondary)' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-textSecondary)'; }}><X className="w-6 h-6" /></button>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4 flex-shrink-0">
          <div className="flex space-x-1 p-1 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
            {[
              { id: 'colors', label: 'Colors', icon: Palette },
              { id: 'typography', label: 'Typography', icon: Type }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as 'colors' | 'typography')}
                className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors"
                style={{
                  backgroundColor: activeTab === id ? 'var(--color-background)' : 'transparent',
                  color: activeTab === id ? 'var(--color-primary)' : 'var(--color-textSecondary)',
                  boxShadow: activeTab === id ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== id) {
                    e.currentTarget.style.color = 'var(--color-text)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== id) {
                    e.currentTarget.style.color = 'var(--color-textSecondary)';
                  }
                }}
              >
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto themed-scrollbar px-6">
          {activeTab === 'colors' && (
            <div className="grid grid-cols-2 gap-4 pb-4">
              {colorInputs.map((input) => (
                <div key={input.key} className="space-y-2">
                  <label className="block font-medium" style={{ color: 'var(--color-text)', fontSize: 'var(--font-size-sm)' }}>{input.label}</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={getNestedValue(currentTheme, `colors.${input.key}`) || '#000000'} onChange={(e) => handleChange('colors', input.key, e.target.value)} className="w-12 h-10 border border-gray-300 rounded cursor-pointer" />
                    <input type="text" value={getNestedValue(currentTheme, `colors.${input.key}`) || '#000000'} onChange={(e) => handleChange('colors', input.key, e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="#000000" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'typography' && (
            <div className="space-y-4 pb-4">
              {typographyInputs.map((input) => (
                <div key={input.key} className="space-y-2">
                  <label className="block font-medium" style={{ color: 'var(--color-text)', fontSize: 'var(--font-size-sm)' }}>{input.label}</label>
                  {input.type === 'select' ? (
                    <select value={getNestedValue(currentTheme, `typography.${input.key}`) || 'Arial, sans-serif'} onChange={(e) => handleChange('typography', input.key, e.target.value)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                      {input.options?.map((option) => <option key={option} value={option} style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>{option}</option>)}
                    </select>
                  ) : (
                    <div className="flex items-center gap-3">
                      <input type="range" min={input.min} max={input.max} step={input.step} value={parseRangeValue(getNestedValue(currentTheme, `typography.${input.key}`), input.min!)} onChange={(e) => handleChange('typography', input.key, `${e.target.value}rem`)} className="flex-1 h-2 rounded-lg appearance-none cursor-pointer slider" style={{ backgroundColor: 'var(--color-border)' }} />
                      <span className="w-16" style={{ color: 'var(--color-textSecondary)', fontSize: 'var(--font-size-sm)' }}>{getNestedValue(currentTheme, `typography.${input.key}`) || '1rem'}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="flex justify-end gap-3 p-6 pt-4 border-t flex-shrink-0" style={{ borderColor: 'var(--color-border)' }}>
          <button onClick={onClose} className="px-4 py-2 transition-colors" style={{ color: 'var(--color-textSecondary)', fontSize: 'var(--font-size-lg)' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-textSecondary)'; }}>Cancel</button>
          <button onClick={onClose} className="px-6 py-2 text-white rounded-md transition-colors" style={{ backgroundColor: 'var(--color-primary)', fontSize: 'var(--font-size-lg)' }} onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}>Apply Theme</button>
        </div>
      </div>
    </div>
  );
};

export default CustomThemeEditor;
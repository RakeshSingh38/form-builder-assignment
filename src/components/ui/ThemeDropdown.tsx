'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Palette, ChevronDown, Check } from 'lucide-react';
import { Button } from './Button';
import { FormTheme } from '@/types/form';
import { CustomTheme } from '@/contexts/CustomThemeContext';

interface ThemeDropdownProps {
    currentTheme: CustomTheme;
    themeMode: 'light' | 'dark' | 'custom';
    themes: FormTheme[];
    onThemeChange: (theme: FormTheme) => void;
    onCustomTheme: () => void;
}

export const ThemeDropdown = ({ currentTheme, themeMode, themes, onThemeChange, onCustomTheme }: ThemeDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleThemeSelect = (theme: FormTheme) => {
        console.log('Theme selected:', theme.name);
        onThemeChange(theme);
        setIsOpen(false);
    };

    const handleCustomTheme = () => {
        console.log('Custom theme button clicked');
        onCustomTheme();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="secondary"
                onClick={() => {
                    console.log('Theme dropdown button clicked, isOpen:', isOpen);
                    setIsOpen(!isOpen);
                }}
                className="text-xs px-2 py-1.5 min-w-[60px] flex items-center justify-center gap-1"
            >
                <Palette size={12} />
                <span className="hidden lg:inline text-xs">Theme</span>
                <ChevronDown size={10} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-48 lg:w-64 border rounded-lg shadow-lg z-50"
                    style={{
                        backgroundColor: 'var(--color-background)',
                        borderColor: 'var(--color-border)'
                    }}
                >
                    <div className="py-2">
                        {/* Theme Options */}
                        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-textSecondary)' }}>
                            Preset Themes
                        </div>

                        {themes.map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => handleThemeSelect(theme)}
                                className="w-full px-3 py-2 text-left flex items-center justify-between group"
                                style={{
                                    backgroundColor: 'transparent',
                                    color: 'var(--color-text)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Color preview */}
                                    <div className="flex gap-1">
                                        <div
                                            className="w-3 h-3 rounded-full border border-gray-300"
                                            style={{ backgroundColor: theme.colors.primary }}
                                        />
                                        <div
                                            className="w-3 h-3 rounded-full border border-gray-300"
                                            style={{ backgroundColor: theme.colors.secondary }}
                                        />
                                        <div
                                            className="w-3 h-3 rounded-full border border-gray-300"
                                            style={{ backgroundColor: theme.colors.accent }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium">{theme.name}</span>
                                </div>

                                {themeMode === theme.id && (
                                    <Check size={16} style={{ color: 'var(--color-primary)' }} />
                                )}
                            </button>
                        ))}

                        {/* Divider */}
                        <div className="border-t my-2" style={{ borderColor: 'var(--color-border)' }} />

                        {/* Custom Theme Option */}
                        <button
                            onClick={handleCustomTheme}
                            className="w-full px-3 py-2 text-left flex items-center justify-between group"
                            style={{
                                backgroundColor: 'transparent',
                                color: 'var(--color-text)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-6 rounded border border-gray-300 flex items-center justify-center">
                                    <span className="text-xs font-bold" style={{ color: 'var(--color-textSecondary)' }}>+</span>
                                </div>
                                <span className="text-sm font-medium">Custom Theme</span>
                            </div>
                            {themeMode === 'custom' && (
                                <Check size={16} style={{ color: 'var(--color-primary)' }} />
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

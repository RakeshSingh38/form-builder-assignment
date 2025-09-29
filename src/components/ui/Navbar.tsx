'use client';

import React, { useState, useEffect, ChangeEvent, ReactElement } from 'react';
import { LucideIcon, Edit3, Eye, Menu, X } from 'lucide-react';
import { Button } from './Button';
import { IconButton } from './IconButton';
import Image from 'next/image';

interface NavbarProps {
    title: string;
    mode: 'edit' | 'preview';
    onModeChange: (mode: 'edit' | 'preview') => void;
    scrollProgress?: number;
    actions: Array<{
        icon: LucideIcon;
        label: string;
        variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
        onClick?: () => void;
        children?: ReactElement;
        type?: 'button' | 'file';
        accept?: string;
        onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    }>;
}

// Helper functions
const useClickOutside = (isOpen: boolean, onClose: () => void) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleClick = (e: MouseEvent) => {
            const target = e.target as Element;
            if (!target.closest('.mobile-menu-container')) onClose();
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [isOpen, onClose]);
};

const useScrollProgress = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial calculation
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return progress;
};

export const Navbar = ({ title, mode, onModeChange, actions }: NavbarProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const scrollProgress = useScrollProgress();

    useClickOutside(isMobileMenuOpen, () => setIsMobileMenuOpen(false));

    // Action button components for cleaner code
    const FileActionButton = ({ action, index, isMobile = false }: { action: NavbarProps['actions'][0]; index: number; isMobile?: boolean }) => (
        <>
            <input
                type="file"
                accept={action.accept}
                onChange={(e) => {
                    console.log('File input changed in Navbar:', e.target.files);
                    action.onChange?.(e);
                    if (isMobile) setIsMobileMenuOpen(false);
                }}
                className="hidden"
                id={`${isMobile ? 'mobile-' : ''}file-input-${index}`}
                style={{ display: 'none' }}
            />
            <button
                type="button"
                onClick={() => {
                    console.log('Import button clicked');
                    const fileInput = document.getElementById(`${isMobile ? 'mobile-' : ''}file-input-${index}`) as HTMLInputElement;
                    if (fileInput) fileInput.click();
                    if (isMobile) setIsMobileMenuOpen(false);
                }}
                className={isMobile
                    ? "w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded border transition-colors focus:outline-none focus:ring-1"
                    : "inline-flex items-center justify-center px-2 py-1.5 text-xs font-medium rounded border transition-colors focus:outline-none focus:ring-1 min-w-[60px]"
                }
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
            >
                <action.icon size={isMobile ? 16 : 12} className={isMobile ? "mr-2" : "lg:mr-1"} />
                <span className={isMobile ? "" : "hidden lg:inline text-xs"}>{action.label}</span>
            </button>
        </>
    );

    const RegularActionButton = ({ action, isMobile = false }: { action: NavbarProps['actions'][0]; isMobile?: boolean }) => (
        isMobile ? (
            <button
                onClick={() => {
                    action.onClick?.();
                    setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded border transition-colors focus:outline-none focus:ring-1"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
            >
                <action.icon size={16} className="mr-2" />
                {action.label}
            </button>
        ) : (
            <IconButton
                icon={action.icon}
                variant={action.variant || 'secondary'}
                onClick={action.onClick}
                className="text-xs px-2 py-1.5 min-w-[60px]"
            >
                <span className="hidden lg:inline text-xs ml-1">{action.label}</span>
            </IconButton>
        )
    );

    return (
        <div
            className="fixed top-0 left-0 right-0 border-b z-50"
            style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)'
            }}
        >
            {/* Main navbar content */}
            <div className="h-12 lg:h-16 flex flex-row items-center justify-between lg:justify-start px-2 lg:px-6 py-1">
                {/* Left section - Hamburger Menu (Mobile) + Title */}
                <div className="flex items-center flex-1 min-w-0">
                    {/* Hamburger Menu - Mobile Only */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-1 mr-2 rounded transition-colors mobile-menu-container"
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        style={{ color: 'var(--color-text)' }}
                    >
                        {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>

                    <div className="flex items-center space-x-3">
                        <Image
                            src="/logo.png"
                            alt="FormBuilder Logo"
                            width={24}
                            height={24}
                            className="rounded-lg"
                        />
                        <h1 className="text-xs lg:text-lg font-bold truncate" style={{ color: 'var(--color-text)' }}>
                            {title}
                        </h1>
                    </div>
                </div>

                {/* Center section - Mode Toggle (Always visible) */}
                <div className="lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 flex rounded-md p-0.5" style={{ backgroundColor: 'var(--color-surface)' }}>
                    <Button
                        variant={mode === 'edit' ? 'primary' : 'ghost'}
                        onClick={() => onModeChange('edit')}
                        className="px-2 py-1.5 lg:px-1.5 lg:py-0.5 min-w-0"
                    >
                        <Edit3 size={14} className="lg:size-8" />
                        <span className="ml-1.5 lg:hidden text-sm">Edit</span>
                        <span className="hidden lg:inline lg:ml-1 lg:text-xs">Edit</span>
                    </Button>
                    <Button
                        variant={mode === 'preview' ? 'primary' : 'ghost'}
                        onClick={() => onModeChange('preview')}
                        className="px-2 py-1.5 lg:px-1.5 lg:py-0.5 min-w-0"
                    >
                        <Eye size={14} className="lg:size-8" />
                        <span className="ml-1.5 lg:hidden text-sm">Preview</span>
                        <span className="hidden lg:inline lg:ml-1 lg:text-xs">Preview</span>
                    </Button>
                </div>

                {/* Right section - Actions (Desktop) */}
                <div className="hidden lg:flex items-center gap-2 flex-shrink-0 lg:ml-auto">
                    {actions.map((action, index) => (
                        <div key={index}>
                            {action.type === 'file' ? (
                                <FileActionButton action={action} index={index} />
                            ) : action.children ? (
                                action.children
                            ) : (
                                <RegularActionButton action={action} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile menu dropdown */}
            {isMobileMenuOpen && (
                <div className="lg:hidden border-t mobile-menu-container" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
                    <div className="px-4 py-3 space-y-3">
                        <div className="space-y-2">
                            {actions.map((action, index) => (
                                <div key={index}>
                                    {action.type === 'file' ? (
                                        <FileActionButton action={action} index={index} isMobile />
                                    ) : action.children ? (
                                        <div>{action.children}</div>
                                    ) : (
                                        <RegularActionButton action={action} isMobile />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Horizontal Scroll Indicator - Will be only shown in preview mode */}
            {mode === 'preview' && (
                <div className="w-full h-1 bg-gray-200 dark:bg-gray-700">
                    <div
                        className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-200 ease-out"
                        style={{
                            width: `${scrollProgress}%`,
                            minWidth: scrollProgress > 0 ? '2px' : '0px'
                        }}
                    />
                </div>
            )}
        </div>
    );
};

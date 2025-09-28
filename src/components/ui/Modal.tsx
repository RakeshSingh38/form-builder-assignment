'use client';

import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showCloseButton?: boolean;
}

export const Modal = ({ isOpen, onClose, title, children, size = 'lg', showCloseButton = true }: ModalProps) => {
    if (!isOpen) return null;

    // Modal sizes
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div
                className={`rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto themed-scrollbar`}
                style={{ backgroundColor: 'var(--color-surface)' }}
            >
                {/* Modal header */}
                <div
                    className="flex items-center justify-between p-4 lg:p-6 border-b"
                    style={{ borderColor: 'var(--color-border)' }}
                >
                    <h2 className="text-lg lg:text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                        {title}
                    </h2>
                    {showCloseButton && (
                        <button
                            onClick={onClose}
                            className="text-xl lg:text-2xl transition-colors hover:opacity-70 p-1"
                            style={{ color: 'var(--color-textSecondary)' }}
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Modal content */}
                <div className="p-4 lg:p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

'use client';

import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface IconButtonProps {
    icon: LucideIcon;
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    onClick?: () => void;
}

export const IconButton = ({
    icon: Icon,
    children,
    variant = 'secondary',
    size = 'md',
    className = '',
    onClick
}: IconButtonProps) => {
    return (
        <Button
            variant={variant}
            size={size}
            className={`${className} text-sm`}
            onClick={() => {
                console.log('IconButton clicked:', children);
                onClick?.();
            }}
        >
            <Icon size={16} />
            {children}
        </Button>
    );
};

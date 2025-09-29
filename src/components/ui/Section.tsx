'use client';

import React, { FC, ReactNode } from 'react';

interface SectionProps {
    title?: string;
    children: ReactNode;
    className?: string;
}

export const Section: FC<SectionProps> = ({
    title,
    children,
    className = '',
}) => {
    return (
        <div className={`space-y-4 ${className}`}>
            {title && (
                <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
};



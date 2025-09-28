'use client';

import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
}

export const Button = ({ variant = 'primary', size = 'md', className = '', style, children, ...props }: ButtonProps) => {
    // Base button styles
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

    // Button variants
    const variantClasses = {
        primary: 'text-white border-0 hover:opacity-90',
        secondary: 'border shadow-sm transition-all duration-200',
        danger: 'text-white border-0 hover:opacity-90',
        ghost: 'bg-transparent border-0 transition-all duration-200',
    };

    // Button sizes
    const sizeClasses = {
        sm: 'px-2 lg:px-3 py-1 lg:py-1.5 text-xs lg:text-sm',
        md: 'px-3 lg:px-4 py-1.5 lg:py-2 text-sm lg:text-base',
        lg: 'px-4 lg:px-6 py-2 lg:py-3 text-base lg:text-lg',
    };

    const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    // Get button styles based on variant
    const getButtonStyles = () => {
        const baseStyles = {
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--font-size-base)',
        };

        switch (variant) {
            case 'primary':
                return {
                    ...baseStyles,
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                };
            case 'secondary':
                return {
                    ...baseStyles,
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-text)',
                    borderColor: 'var(--color-border)',
                };
            case 'danger':
                return {
                    ...baseStyles,
                    backgroundColor: 'var(--color-error)',
                    color: 'white',
                };
            case 'ghost':
                return {
                    ...baseStyles,
                    backgroundColor: 'transparent',
                    color: 'var(--color-text)',
                };
            default:
                return baseStyles;
        }
    };

    return (
        <button
            className={buttonClasses}
            style={{ ...getButtonStyles(), ...style }}
            onMouseEnter={(e) => {
                if (variant === 'secondary') {
                    e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                } else if (variant === 'ghost') {
                    e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                }
            }}
            onMouseLeave={(e) => {
                if (variant === 'secondary') {
                    e.currentTarget.style.backgroundColor = 'var(--color-background)';
                } else if (variant === 'ghost') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                }
            }}
            onFocus={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 2px var(--color-primary)';
            }}
            onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
            }}
            {...props}
        >
            {children}
        </button>
    );
};

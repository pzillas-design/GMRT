import React from 'react';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Container: React.FC<ContainerProps> = ({
    children,
    className = '',
    size = 'lg'
}) => {
    const sizes = {
        sm: 'max-w-3xl',
        md: 'max-w-5xl',
        lg: 'max-w-[1200px]', // Matches our main content width
        xl: 'max-w-[1400px]', // Matches our hero/navbar width
        full: 'max-w-full',
    };

    return (
        <div className={`mx-auto px-6 md:px-12 w-full ${sizes[size]} ${className}`}>
            {children}
        </div>
    );
};

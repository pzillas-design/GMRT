import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    href?: string;
    icon?: React.ReactNode;
    fullWidth?: boolean;
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    href,
    icon,
    fullWidth = false,
    isLoading = false,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-gmrt-salmon text-white hover:bg-[#e08a75] focus:ring-gmrt-salmon/50 from-gmrt-salmon to-gmrt-logo bg-gradient-to-r hover:opacity-90",
        secondary: "bg-gmrt-blue text-white hover:bg-slate-800 focus:ring-gmrt-blue/50",
        outline: "border-2 border-slate-200 text-slate-700 hover:border-gmrt-blue hover:text-gmrt-blue bg-transparent",
        ghost: "text-slate-600 hover:text-gmrt-blue hover:bg-slate-50",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500/30",
    };

    const sizes = {
        sm: "text-sm px-3 py-1.5 gap-1.5",
        md: "text-base px-5 py-2.5 gap-2",
        lg: "text-lg px-8 py-3 gap-3",
    };

    const widthClass = fullWidth ? "w-full" : "";

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`;

    if (href) {
        return (
            <Link href={href} className={combinedClassName}>
                {icon && <span>{icon}</span>}
                {children}
            </Link>
        );
    }

    return (
        <button className={combinedClassName} disabled={disabled || isLoading} {...props}>
            {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : icon ? (
                <span>{icon}</span>
            ) : null}
            {children}
        </button>
    );
};

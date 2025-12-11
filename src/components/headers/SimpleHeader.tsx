import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';

interface SimpleHeaderProps {
    title: string;
    subtitle?: string;
    backLink?: string;
    backLabel?: string;
    actionLink?: string;
    actionIcon?: React.ReactNode;
    children?: React.ReactNode; // For filters or extra content
}

export function SimpleHeader({
    title,
    subtitle,
    backLink,
    backLabel,
    actionLink,
    actionIcon,
    children
}: SimpleHeaderProps) {
    return (
        <div className="relative pt-48 pb-16 bg-slate-50 border-b border-slate-200">
            {/* Safe Top Zone handled by pt-48 (More space above headline) */}

            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                {backLink && (
                    <div className="mb-8">
                        <Link href={backLink} className="inline-flex items-center gap-2 text-slate-500 hover:text-gmrt-blue transition-colors group">
                            <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
                            <span className="font-medium">{backLabel || 'Back'}</span>
                        </Link>
                    </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-10">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold text-gmrt-blue mb-4 tracking-tight">{title}</h1>
                        {subtitle && (
                            <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {actionLink && (
                        <Link
                            href={actionLink}
                            className="hidden md:flex items-center gap-2 bg-gmrt-blue/5 text-gmrt-blue px-6 py-3 hover:bg-gmrt-blue hover:text-white transition-all font-semibold text-sm border border-gmrt-blue/10"
                        >
                            {actionIcon}
                        </Link>
                    )}
                </div>

                {/* Additional Content (Filters, etc.) */}
                {children && (
                    <div className="w-full pt-8">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}

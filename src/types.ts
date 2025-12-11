import React from 'react';

export interface NavItem {
    label: string;
    href: string;
}

export interface EventItem {
    id: number;
    date: string;
    title: string;
    category: string;
    image: string;
}

export interface FeatureItem {
    title: string;
    description: string;
    icon: React.ReactNode;
}

export interface AccordionItem {
    id: string;
    title: string;
    content: string;
    icon?: React.ReactNode;
}

export type ContentBlockType = 'text' | 'image' | 'video' | 'headline' | 'pdf' | 'link';

export interface ContentBlock {
    id: string;
    type: ContentBlockType;
    content: string; // Text content or Image URL
    caption?: string; // For images
    url?: string; // For links or video URLs
    level?: number; // For headlines (1-6)
}

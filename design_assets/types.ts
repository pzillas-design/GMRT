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
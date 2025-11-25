import { LucideIcon } from 'lucide-react';

export enum CategoryType {
  LAWS = 'laws',
  LOCATIONS = 'locations',
  INSTRUCTIONS = 'instructions',
  DECISIONS = 'decisions',
  FATWAS = 'fatwas'
}

export interface Document {
  id: string;
  title: string;
  category: CategoryType;
  date: string;
  description?: string;
  content: string; // Simulated content
  tags?: string[];
  locationData?: {
    address: string;
    code: string;
    area: string;
  };
}

export interface CategoryConfig {
  id: CategoryType;
  title: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

export interface SearchResult {
  doc: Document;
  snippet: string;
}
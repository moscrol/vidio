import { cardVideoData } from '../generated/card-video-data';

export type Segment = (typeof cardVideoData.segments)[number];

export type CoverCard = {
  id: string;
  type: 'cover';
  tag?: string;
  kicker?: string;
  titleHtml?: string;
  subtitle?: string;
  badge?: string;
  footer?: string;
};

export type HookCard = {
  id: string;
  type: 'hook';
  tag?: string;
  meta?: string;
  titleHtml?: string;
  subtitle?: string;
  footer?: string;
};

export type LogisticsCard = {
  id: string;
  type: 'logistics';
  tag?: string;
  meta?: string;
  titleHtml?: string;
  subtitle?: string;
  footer?: string;
};

export type DataHeroCard = {
  id: string;
  type: 'dataHero';
  tag?: string;
  meta?: string;
  number?: string;
  unit?: string;
  label?: string;
  compareText?: string;
  insight?: string;
  footer?: string;
};

export type CompareCard = {
  id: string;
  type: 'compare';
  tag?: string;
  oldText?: string;
  newText?: string;
  explain?: string;
  footer?: string;
};

export type BusinessLoopCard = {
  id: string;
  type: 'loop';
  tag?: string;
  title?: string;
  steps?: string[];
  footer?: string;
};

export type OrderValidationCard = {
  id: string;
  type: 'orderValidation';
  tag?: string;
  meta?: string;
  title?: string;
  stages?: Array<{
    label: string;
    status: 'done' | 'current' | 'next' | 'risk';
    desc?: string;
  }>;
  verdict?: string;
  footer?: string;
};

export type SupplyChainShiftCard = {
  id: string;
  type: 'supplyChainShift';
  tag?: string;
  meta?: string;
  title?: string;
  from?: string;
  to?: string;
  drivers?: string[];
  result?: string;
  footer?: string;
};

export type QuoteCard = {
  id: string;
  type: 'quote';
  tag?: string;
  meta?: string;
  titleHtml?: string;
  subtitle?: string;
  url?: string;
  footer?: string;
};

export type ChecklistCard = {
  id: string;
  type: 'checklist';
  tag?: string;
  meta?: string;
  titleHtml?: string;
  items?: Array<{
    title: string;
    desc: string;
  }>;
  footer?: string;
};

export type EvidenceGridCard = {
  id: string;
  type: 'evidenceGrid';
  tag?: string;
  meta?: string;
  titleHtml?: string;
  subtitle?: string;
  evidences?: Array<{
    label: string;
    value: string;
  }>;
  footer?: string;
};



import { opengd77ExportAdapter } from './opengd77/adapter.ts';

export const exportAdapters = [opengd77ExportAdapter] as const;

export type ExportAdapterId = (typeof exportAdapters)[number]['id'];

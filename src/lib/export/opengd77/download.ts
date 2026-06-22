import { zipSync, strToU8 } from 'fflate';
import type { Codeplug } from '../../../models/codeplug.ts';
import type { ExportOptions } from '../../import-export/types.ts';
import { serialiseOpenGd77Files, type OpenGd77ExportFiles } from './serialise.ts';

export type OpenGd77ExportFileName = keyof OpenGd77ExportFiles;

export function buildOpenGd77Zip(codeplug: Codeplug): Uint8Array {
  const files = serialiseOpenGd77Files(codeplug);
  const zipEntries: Record<string, Uint8Array> = {};
  for (const [name, content] of Object.entries(files)) {
    zipEntries[name] = strToU8(content);
  }
  return zipSync(zipEntries);
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadOpenGd77File(codeplug: Codeplug, fileName: OpenGd77ExportFileName): void {
  const files = serialiseOpenGd77Files(codeplug);
  const blob = new Blob([files[fileName]], { type: 'text/csv;charset=utf-8' });
  downloadBlob(blob, fileName);
}

export function downloadOpenGd77Zip(codeplug: Codeplug, options?: ExportOptions): void {
  const zipName = options?.fileName ?? 'opengd77-export.zip';
  const zip = buildOpenGd77Zip(codeplug);
  const blob = new Blob([new Uint8Array(zip)], { type: 'application/zip' });
  downloadBlob(blob, zipName);
}

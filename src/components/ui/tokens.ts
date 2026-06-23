import type { MantineSize } from '@mantine/core';

/** Page width variants mapped to Mantine Container sizes. */
export type PageWidth = 'narrow' | 'default' | 'wide';

export const PAGE_CONTAINER_SIZE: Record<PageWidth, MantineSize> = {
  narrow: 'sm',
  default: 'lg',
  wide: 'xl',
};

/** Vertical gap between major page blocks (title, sections, table). */
export const PAGE_STACK_GAP = 'lg' as const;

/** Gap inside page header (title + description). */
export const PAGE_HEADER_GAP = 'xs' as const;

/** Gap inside a bordered section card. */
export const PAGE_SECTION_GAP = 'md' as const;

/** Gap between title and description inside a section card. */
export const PAGE_SECTION_HEADER_GAP = 4 as const;

/** Section card padding and radius — matches import/export panels. */
export const PAGE_SECTION_PADDING = 'md' as const;
export const PAGE_SECTION_RADIUS = 'md' as const;

/** Responsive grid for side-by-side section cards. */
export const PAGE_SECTION_GRID_COLS = { base: 1, md: 2 } as const;
export const PAGE_SECTION_GRID_SPACING = 'lg' as const;

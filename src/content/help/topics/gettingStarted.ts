import type { HelpEntry } from '../types.ts';

export const gettingStartedEntries: HelpEntry[] = [
  {
    id: 'gettingStarted.home',
    title: 'Home',
    short:
      'Start a new codeplug project from scratch or by importing a CPS export. Importing here always creates a new project — it does not change an existing one.',
    learnMoreSlug: 'getting-started',
    body: `## Home

From Home you can:

- **Start fresh** — create a blank project and build your codeplug layout here.
- **Import** — load a CPS export (OpenGD77, DM32, CHIRP, or native YAML) as a **new** project.

To add data to a project you already have open, use **Import & export** instead — that merges into the active project.`,
  },
  {
    id: 'gettingStarted.privacy',
    title: 'Privacy and storage',
    short:
      'Your codeplug lives in your browser. Nothing is uploaded to our servers, and CSV files you load never leave your machine.',
    learnMoreSlug: 'saving-syncing',
    body: `## Privacy and storage

Changes save automatically to your browser's local storage. We do not run a server that holds your codeplug.

Optional cloud sync (Google Drive) copies files you choose to save — it is interchange only, not a live edit store.`,
  },
  {
    id: 'import.newProjectOnly',
    title: 'New project import',
    short:
      'Import on Home always creates a new project. To update your current project, use Import & export.',
    learnMoreSlug: 'importing',
  },
  {
    id: 'project.metadata',
    title: 'Project metadata',
    short:
      'A project wraps one codeplug. Name, description, notes, and author are for your records — they are not written to CPS exports.',
    learnMoreSlug: 'getting-started',
  },
  {
    id: 'project.targetRadios',
    title: 'Target radios',
    short:
      'Indicative labels only — a reminder of which radios you plan to flash. This does not set export format or limits.',
    learnMoreSlug: 'exporting',
  },
  {
    id: 'project.dashboard',
    title: 'Summary dashboard',
    short:
      'Overview of your active project: entity counts, inset map, and quick links. Switch projects from Home.',
    learnMoreSlug: 'getting-started',
  },
  {
    id: 'project.metadataExport',
    title: 'Metadata and export',
    short:
      'Description, notes, and author stay in the project wrapper. Only the codeplug content (channels, zones, etc.) is exported to CPS formats.',
    learnMoreSlug: 'exporting',
  },
];

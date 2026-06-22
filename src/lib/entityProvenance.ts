export interface ImportedProvenance {
  formatId: string;
  sourceFile: string | null;
  importedAt: string;
  /** Ordered wire names for list members (zone→channel names; RGL→contact/tg names). Merge/delta only. */
  memberWireNames?: string[];
  /** Original Contact column at import — merge/delta only; export uses contactRef + mode rules. */
  contactWireName?: string;
  /** Original TG List column at import — merge/delta only; export uses rxGroupListId + mode rules. */
  rxGroupListWireName?: string;
  /** CHIRP Duplex/Offset wire at import — merge/delta only; export uses txFrequency and rxOnly. */
  chirpDuplexWire?: string;
  chirpOffsetWire?: string;
}

export interface EntityMeta {
  imported?: ImportedProvenance | null;
}

export interface WithEntityMeta {
  meta?: EntityMeta;
}

export interface StampImportedInput {
  formatId: string;
  sourceFile: string | null;
  importedAt: string;
  memberWireNames?: string[];
  contactWireName?: string;
  rxGroupListWireName?: string;
  chirpDuplexWire?: string;
  chirpOffsetWire?: string;
}

export function getMemberWireNames(entity: WithEntityMeta): string[] {
  return entity.meta?.imported?.memberWireNames ?? [];
}

export function setMemberWireNames<T extends WithEntityMeta>(entity: T, names: string[]): T {
  const imported = entity.meta?.imported;
  if (!imported) {
    return {
      ...entity,
      meta: {
        imported: {
          formatId: 'opengd77',
          sourceFile: null,
          importedAt: new Date().toISOString(),
          memberWireNames: names,
        },
      },
    };
  }
  return {
    ...entity,
    meta: {
      ...entity.meta,
      imported: { ...imported, memberWireNames: names },
    },
  };
}

export function stampImported<T extends WithEntityMeta>(entity: T, input: StampImportedInput): T {
  return {
    ...entity,
    meta: {
      imported: {
        formatId: input.formatId,
        sourceFile: input.sourceFile,
        importedAt: input.importedAt,
        ...(input.memberWireNames !== undefined ? { memberWireNames: input.memberWireNames } : {}),
        ...(input.contactWireName !== undefined ? { contactWireName: input.contactWireName } : {}),
        ...(input.rxGroupListWireName !== undefined
          ? { rxGroupListWireName: input.rxGroupListWireName }
          : {}),
        ...(input.chirpDuplexWire !== undefined ? { chirpDuplexWire: input.chirpDuplexWire } : {}),
        ...(input.chirpOffsetWire !== undefined ? { chirpOffsetWire: input.chirpOffsetWire } : {}),
      },
    },
  };
}

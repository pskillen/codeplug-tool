# Genericise import — progress

**Tracking:** [codeplug-tool#7](https://github.com/pskillen/codeplug-tool/issues/7)
**Branch:** `7/paddy/genericise-import-models`

---

## Overall status

**Status:** Complete (pending PR)

---

## Internal models

**Status:** Complete

**Delivered**

- `src/models/codeplug.ts` — id-based Channel, Zone, stubs, `emptyCodeplug`, schema version

---

## Import layer

**Status:** Complete

**Delivered**

- `src/lib/import/` — OpenGD77 adapter, registry, `importFiles`, folder drop helper
- `src/lib/csv.ts` trimmed to generic tokenizer

---

## Map refactor

**Status:** Complete

**Delivered**

- `src/lib/codeplug.ts` — name→id resolution
- `src/lib/channels.ts` — internal model field names, id-based zone lookup
- `ChannelMap.tsx` — consumes store

---

## Central store

**Status:** Complete

**Delivered**

- `src/state/codeplugStore.tsx` — provider, reducer, serialize/deserialize scaffold
- Wired in `main.tsx`

---

## Import UI

**Status:** Complete

**Delivered**

- `src/components/ImportPanel/ImportPanel.tsx` — multi-file, folder pick, clear all

---

## Documentation

**Status:** Complete

**Delivered**

- `docs/features/data-model/README.md`
- `docs/features/import/` hub + OpenGD77 deep dive

**Verify**

- `npm run lint && npm run test && npm run build`
- `npm run dev` → `/#/map` with sample CSVs from `sample-exports/`

---

## Next

- Open PR with `Closes #7`

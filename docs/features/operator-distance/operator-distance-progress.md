# Operator distance — progress

**Tracking:** [codeplug-tool#70](https://github.com/pskillen/codeplug-tool/issues/70)
**Branch:** `70/paddy/operator-distance`

---

## Overall status

**Status:** In progress

---

## Slice 0: Skill + docs scaffold

**Status:** Complete

**Delivered**

- Plan-mode reminder in `.cursor/skills/make-a-plan/SKILL.md`
- Feature doc folder `docs/features/operator-distance/`

---

## Slice 1: Distance utilities

**Status:** Complete

**Delivered**

- `src/lib/geoDistance.ts` — `haversineDistanceM`, `formatDistanceM`
- `src/lib/geoDistance.test.ts`

---

## Slice 2: Session operator position

**Status:** Complete

**Delivered**

- `src/state/operatorPosition.tsx` — `OperatorPositionProvider`, `useOperatorPosition`
- Wired in `src/main.tsx`

---

## Next

- CodeplugMap operator marker

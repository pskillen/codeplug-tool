# Genericise import — outstanding

Items **skipped**, **incomplete**, or **discovered during execution** — not future plan phases.

**Tracking:** [codeplug-tool#7](https://github.com/pskillen/codeplug-tool/issues/7)

---

## Persistence

- [x] Wire projects envelope to LocalStorage ([#9](https://github.com/pskillen/codeplug-tool/issues/9)) — shipped in `src/state/codeplugStorage.ts`

## Import

- [ ] Parse Contacts.csv, TG lists, talk groups when models are populated beyond stubs

## Store

- [x] Split serialize helpers to `codeplugStorage.ts` (addresses react-refresh warnings on store)

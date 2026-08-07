# Fork notice

This repository is a **fork** of [rullerzhou-afk/clawd-on-desk](https://github.com/rullerzhou-afk/clawd-on-desk).

- Upstream: <https://github.com/rullerzhou-afk/clawd-on-desk>
- This fork: <https://github.com/RRFRRF/clawd-on-desk4CodeWiz>
- License: **AGPL-3.0** (unchanged). Upstream copyright © 2026 Ruller_Lulu is
  retained; fork modifications © 2026 RRFRRF.

AGPL-3.0 requires that modified versions state their changes. That list is
below and is kept current with every fork release.

## What this fork changes

### 1. CodeWiz CLI support

CodeWiz (`@xhs/codewiz`) joins the existing **opencode-family** as a third
member, alongside opencode and MiMo Code. It is an opencode-derived CLI that
keeps opencode's plugin loader, the `@opencode-ai/plugin` SDK surface, and the
full event wire contract, so it needed no changes to the shared family core,
permission path, renderer, or reverse bridge.

Added:

- `agents/codewiz.js`, plus the `codewiz` entry in `agents/opencode-family.js`
- `hooks/codewiz-plugin/` (thin family entry) and `hooks/codewiz-install.js`
- the per-agent registration surface (prefs, settings, sync, cleanup, doctor,
  dashboard, session identity, agent icon)
- `npm run install:codewiz-plugin` / `npm run uninstall:codewiz-plugin`

Two deliberate deviations from how the other family members are wired:

- **No process names.** CodeWiz's platform binary is literally named
  `opencode` (`@xhs/codewiz-<platform>/bin/opencode`), so name-based matching
  would make CodeWiz and real opencode detect each other. Liveness instead uses
  the `commandLineNeedles` path in `src/state.js` with the needle
  `@xhs/codewiz`, which covers both the node wrapper and the platform binary.
- **`permissionsEnabled` defaults to `false`.** The permission path works (the
  reverse `Bun.serve` bridge starts inside CodeWiz's plugin sandbox and a round
  trip was verified), but the default stays conservative; enable it per-agent
  in Settings.

Config handling follows CodeWiz's own merged-config semantics: the effective
global config is `config.json` → `codewiz.json` → `codewiz.jsonc` (later wins,
arrays replaced rather than concatenated), so the installer edits whichever
file's `plugin` array actually wins and sweeps all three on uninstall.

### 2. Seal Desktop support

Seal Desktop (`Lobi.app`) runs its agent sessions through locally spawned
`codewiz acp` processes. Those processes load the same global plugin, so Seal
Desktop sessions report to Clawd as ordinary `codewiz:` sessions and drive the
pet with no extra integration code. Verified against a real Seal Desktop
restart, where a single ACP process loaded one plugin instance per open project
directory and streamed live session state.

Distinguishing Seal Desktop sessions from terminal CodeWiz sessions in the HUD
is not implemented; both currently display as CodeWiz.

### 3. Fork identity

- version line is independent (see below)
- in-app update checks point at this fork's releases
- the About page credits upstream alongside this fork

## Versioning

This fork uses upstream-aligned versions with an offset patch number:

```
major.minor  follow the upstream release this fork is based on
patch        starts at 100 and increments per fork release
```

| fork version | upstream base |
|---|---|
| `0.14.100` | `v0.14.0` + 45 commits (`ce387b83`, merge of upstream PR #820) |

The upstream base is recorded as a commit, not just a tag, because forks are
often cut from a point after the last release — `git describe` reports
`v0.14.0-45-gce387b83` here.

`0.14.0+codewiz.1`-style build metadata was rejected on purpose: SemVer ignores
everything after `+` when comparing versions, so `electron-updater` would treat
consecutive fork releases as identical, while this repo's own
`compareVersions` in `src/updater.js` would treat them as different. The two
update paths would disagree.

## Staying in sync with upstream

```bash
git remote add upstream https://github.com/rullerzhou-afk/clawd-on-desk.git
git fetch upstream
git merge upstream/main
```

After merging an upstream release, bump `major.minor` to match it and reset the
patch to `100`, then add a row to the table above.

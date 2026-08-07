## v0.14.100

First release of the **`clawd-on-desk4CodeWiz` fork**. Based on upstream
[rullerzhou-afk/clawd-on-desk](https://github.com/rullerzhou-afk/clawd-on-desk)
`v0.14.0` (specifically commit `ce387b83`, 45 commits past the tag), licensed AGPL-3.0, copyright © 2026 Ruller_Lulu — all credit for
Clawd itself belongs upstream.

This fork adds CodeWiz CLI and Seal Desktop support and ships its own release
line. See [docs/guides/fork-notice.md](../guides/fork-notice.md) for the full
change list and the versioning scheme.

### CodeWiz CLI Support

- **CodeWiz joins the opencode-family** — CodeWiz (`@xhs/codewiz`) is an
  opencode-derived CLI that keeps opencode's plugin loader, the
  `@opencode-ai/plugin` SDK surface, and the full event wire contract. It is
  registered as a third family member alongside opencode and MiMo Code, so the
  shared family core, permission path, renderer, and reverse bridge required no
  changes at all.
- **Install from Settings → Agents**, or run `npm run install:codewiz-plugin`.
  The plugin registers in `~/.config/codewiz/codewiz.jsonc`. CodeWiz's effective
  global config is a merge of `config.json` → `codewiz.json` → `codewiz.jsonc`
  (later wins, arrays replaced), so the installer edits whichever file's
  `plugin` array actually wins and sweeps all three on uninstall. Existing
  comments in the config survive install and uninstall.
- **Verified against CodeWiz v0.1.93** on macOS: `SessionStart`,
  `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, and `Stop → attention` all
  drive the pet; sessions carry the `codewiz:` namespace; the terminal PID chain
  resolves to the real terminal, so HUD click-to-focus works; and a permission
  round trip completes through the reverse bridge.
- **Process detection avoids a name collision** — CodeWiz's platform binary is
  literally named `opencode`, so matching by process name would make CodeWiz and
  real opencode detect each other. Liveness uses the `@xhs/codewiz` command-line
  needle instead, which covers both the node wrapper and the platform binary.
- **Permissions ship disabled by default** for CodeWiz. The path works, but the
  conservative default avoids surprising anyone who has not opted in; enable it
  per-agent in Settings.

### Seal Desktop Support

- **Seal Desktop sessions drive the pet** — Seal Desktop (`Lobi.app`) runs its
  agents through locally spawned `codewiz acp` processes, which load the same
  global plugin. Its sessions therefore arrive as ordinary `codewiz:` sessions
  with no additional integration code. Verified against a real Seal Desktop
  restart, where one ACP process loaded a plugin instance per open project
  directory and streamed live state.
- Seal Desktop and terminal CodeWiz sessions are not yet distinguished in the
  HUD; both display as CodeWiz.

### Fork Identity

- **Independent version line** — `major.minor` track the upstream release this
  fork is based on; the patch number starts at `100` and increments per fork
  release. `0.14.100` is based on upstream `v0.14.0`.
- **In-app updates point at this fork**, since it ships its own build artifacts.
- **The About page credits upstream alongside this fork**, and the original
  copyright is retained, as AGPL-3.0 requires.

### Known Limitations

- On some macOS builds, certain processes are invisible to `pgrep`, which can
  make the keep-awake heuristic miss Seal-spawned CodeWiz processes. This is a
  pre-existing platform quirk that affects every agent's command-line needle
  equally; real session state arrives through plugin events and is unaffected.
- Translations for this fork's additions are limited to English and Simplified
  Chinese.

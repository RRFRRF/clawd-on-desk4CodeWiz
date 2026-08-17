## v0.15.100

Second release of the **`clawd-on-desk4CodeWiz` fork**, merging upstream
`v0.15.0` (`bca6a8d3`, 100+ commits past the v0.14.0 base of v0.14.100).

Upstream credit: [rullerzhou-afk/clawd-on-desk](https://github.com/rullerzhou-afk/clawd-on-desk),
AGPL-3.0, © 2026 Ruller_Lulu. See [docs/guides/fork-notice.md](../guides/fork-notice.md)
for the fork change list and versioning scheme.

### What this release brings in from upstream v0.15.0

#### DeepSeek Harness (DSH)

- **State + interactive approval integration** — DSH sessions report lifecycle
  and tool activity to Clawd; `approval/request` and `ask_user_question`
  requests route to Clawd bubbles. DSH is **web profile / Windows-first
  experimental / plugin-only**. Install from **Settings → Agents**.
- **Clawd-managed bridge plugin** with auto-install on Settings Install,
  polling DSH's projection cache on a 1.5s interval.
- DSH does not enter `KNOWN_PERMISSION_AGENTS`; auto-tools / unattended /
  per-session grant all DEFER. Only manual Allow Once / Deny is supported.
- See [docs/guides/dsh-setup.md](../guides/dsh-setup.md) for setup details.

#### Other upstream features

- **QwenWork (千问办公)** — state-only hook agent (`~/.QwenWorkCN/settings.json`)
- **Kimi quota rings** — per-source quota display with manual refresh
- **OpenCode HUD context-window usage** — shows context-window usage in HUD
- **Spanish (es) locale** and README
- **Portuguese (pt-BR) locale** (already in v0.15.0 prep)
- **Visual roam fence picker** — select a free-roam area visually
- **Windows process-chain resolution** — B1a process metadata in server
- **Koffi native audit** — package only target-native Koffi binaries
- **WinGet manifest generation** (prepare-only)
- **Settings UX round 3** — focus preservation, responsive controls
- Numerous bug fixes: codex terminal fencing, macOS edge bounds, remote SSH
  Codespaces serialized transport, npm dependency security hardening, and more

#### Fork-specific (carried from v0.14.100, unchanged)

- **CodeWiz CLI** — opencode-family member, `~/.config/codewiz/codewiz.jsonc`
- **Seal Desktop** — sessions arrive as `codewiz:` sessions via ACP
- **Fork identity** — independent version line, in-app updates point at this
  fork, About page credits upstream alongside the fork

### Installation

**macOS: unsigned build.** This release is not code-signed or notarized. When
you open the `.dmg` and drag the app to `/Applications`, Gatekeeper may report
the app as "damaged and can't be opened". That is the quarantine attribute, not
a corrupted download. Remove it once after installing:

```bash
xattr -dr com.apple.quarantine "/Applications/Clawd on Desk.app"
```

The app then launches normally. (Signing and notarization require an Apple
Developer account and are not set up yet.)

**Windows:** run the `x64` or `ARM64` installer matching your machine. SmartScreen
may show an "unrecognized app" prompt on the first run — choose **More info →
Run anyway**.

**Linux:** use the package matching your distribution.

### Known Limitations

- On some macOS builds, certain processes are invisible to `pgrep`, which can
  make the keep-awake heuristic miss Seal-spawned CodeWiz processes. This is a
  pre-existing platform quirk that affects every agent's command-line needle
  equally; real session state arrives through plugin events and is unaffected.
- Translations for this fork's additions are limited to English and Simplified
  Chinese.

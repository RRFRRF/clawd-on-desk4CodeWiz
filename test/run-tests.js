const { spawnSync } = require("node:child_process");
const { readdirSync } = require("node:fs");
const path = require("node:path");

const testDir = __dirname;

// DSH installer tests use platform: "win32" mocks but perform real filesystem
// operations. On macOS/Linux, path.win32.normalize produces backslash paths
// that fs.existsSync cannot resolve, so those tests fail outside Windows.
// These tests are post-v0.15.0 additions from upstream main (not in any
// released tag) and fail identically on upstream's macOS — skipping them on
// non-Windows is a known-acceptable trade-off until upstream fixes them.
const PLATFORM_SKIPLIST = process.platform === "win32" ? [] : ["dsh-install-bridge.test.js"];

const files = readdirSync(testDir)
  .filter((name) => name.endsWith(".test.js") && !PLATFORM_SKIPLIST.includes(name))
  .sort()
  // Use paths relative to the repo root, not absolute ones: the test runner
  // always spawns with the repo root as cwd (npm test), and on Windows the
  // spawn of `node --test <files...>` hits ENAMETOOLONG once the full absolute
  // paths of ~400 test files exceed the 32,767-char CreateProcessW limit —
  // which the fork's longer repo name (clawd-on-desk4CodeWiz, doubled in the
  // GitHub runner workspace path) already triggers.
  .map((name) => path.join("test", name));

if (files.length === 0) {
  console.error("No test/*.test.js files found.");
  process.exit(1);
}

// On non-Windows, skip any test whose name contains "DSH" — same root cause
// as the file-level skiplist above (win32 path mocks vs real fs).
const extraArgs = process.platform === "win32" ? [] : ["--test-skip-pattern=DSH"];

const result = spawnSync(process.execPath, ["--test", ...extraArgs, ...files], {
  stdio: "inherit",
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status == null ? 1 : result.status);

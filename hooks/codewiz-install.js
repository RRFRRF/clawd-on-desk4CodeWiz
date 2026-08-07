#!/usr/bin/env node
// Register Clawd's codewiz plugin in the user's global CodeWiz config.
//
// Thin wrapper over the shared opencode-family installer
// (hooks/opencode-family-install.js). It preserves the FULL legacy surface —
// named exports, return shapes (incl. the "codewiz-not-found" reason string
// that integration-sync branches on), and the CLI entry — see
// docs/plans/plan-opencode-family-shared-integration.md §3.3/§5.
//
// CodeWiz's config is JSONC (~/.config/codewiz/codewiz.jsonc), so the shared
// installer routes edits through hooks/opencode-family-jsonc.js (element-level
// jsonc-parser edits that preserve user comments). The effective global config
// is a merge of config.json → codewiz.json → codewiz.jsonc (later wins, arrays
// replaced not concatenated), handled by the shared installer via the
// registry's configCandidates.

const { makeFamilyInstaller } = require("./opencode-family-install");

const installer = makeFamilyInstaller("codewiz");

module.exports = {
  DEFAULT_PARENT_DIR: installer.DEFAULT_PARENT_DIR,
  DEFAULT_CONFIG_PATH: installer.DEFAULT_CONFIG_PATH,
  registerCodewizPlugin: installer.register,
  unregisterCodewizPlugin: installer.unregister,
  resolvePluginDir: installer.resolvePluginDir,
  __test: installer.__test,
};

if (require.main === module) {
  try {
    if (process.argv.includes("--uninstall")) installer.unregister({});
    else installer.register({});
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

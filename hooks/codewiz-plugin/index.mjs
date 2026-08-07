// Clawd on Desk — codewiz plugin (thin family entry)
//
// All runtime logic lives in the shared family core; this entry only binds
// the codewiz identity. The four params MUST match the "codewiz" entry in
// agents/opencode-family.js (locked by a registry cross-check test).
//
// #413: this module must have exactly ONE export — the default function.
// The opencode-derived plugin loader iterates Object.values() of THIS
// module's namespace and throws "Plugin export is not a function" on any
// non-function export, silently killing the plugin. Never add named exports
// here; test internals ride on the default function (mod.default.__test).
import { createOpencodeFamilyPlugin } from "../opencode-family-plugin/core.mjs";

export default createOpencodeFamilyPlugin({
  agentId: "codewiz",
  hookSource: "codewiz-plugin",
  logFileName: "codewiz-plugin.log",
  sessionIdPrefix: "codewiz:",
});

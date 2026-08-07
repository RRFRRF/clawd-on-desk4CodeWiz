// codewiz agent configuration
// Perception via the opencode Plugin SDK: event hook → HTTP POST to Clawd.
// Plugin registered in ~/.config/codewiz/codewiz.jsonc "plugin" array (global scope).
//
// eventMap/capabilities are the shared opencode-family contract — identical
// for every family member, sourced from ./opencode-family so they can't drift
// (docs/plans/plan-opencode-family-shared-integration.md §3.1).
//
// processNames are INTENTIONALLY empty. CodeWiz's platform binary is named
// "opencode" (@xhs/codewiz-darwin-arm64/bin/opencode), so any name-based entry
// would make CodeWiz and real opencode detect each other. Liveness is handled
// by the commandLineNeedles path in src/state.js (needle "@xhs/codewiz"),
// which is a keep-awake fallback only and never creates a session.

const { FAMILY_EVENT_MAP, FAMILY_CAPABILITIES } = require("./opencode-family");

module.exports = {
  id: "codewiz",
  name: "CodeWiz",
  processNames: { win: [], mac: [], linux: [] },
  startupRecoveryProcessNames: { win: [], mac: [], linux: [] },
  eventSource: "plugin-event",
  eventMap: FAMILY_EVENT_MAP,
  capabilities: FAMILY_CAPABILITIES,
  pidField: "codewiz_pid",
};

const { describe, test } = require("node:test");
const assert = require("node:assert");
const path = require("node:path");
const os = require("node:os");
const fs = require("node:fs");

const installer = require("../hooks/codewiz-install.js");
const { registerCodewizPlugin, unregisterCodewizPlugin } = installer;
const { getFamilyConfig } = require("../agents/opencode-family.js");

const PLUGIN_DIR = "/abs/hooks/codewiz-plugin";

function tmpConfig(contents, fileName = "codewiz.jsonc") {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "clawd-codewiz-jsonc-"));
  const configPath = path.join(dir, fileName);
  if (contents !== null) fs.writeFileSync(configPath, contents);
  return { dir, configPath };
}

describe("codewiz-install — legacy surface", () => {
  test("exposes the full named-export surface", () => {
    assert.strictEqual(typeof installer.registerCodewizPlugin, "function");
    assert.strictEqual(typeof installer.unregisterCodewizPlugin, "function");
    assert.strictEqual(typeof installer.resolvePluginDir, "function");
    assert.strictEqual(typeof installer.DEFAULT_PARENT_DIR, "string");
    assert.strictEqual(typeof installer.DEFAULT_CONFIG_PATH, "string");
  });

  test("resolves the codewiz config paths from the family registry", () => {
    assert.strictEqual(
      installer.DEFAULT_PARENT_DIR,
      path.join(os.homedir(), ".config", "codewiz")
    );
    assert.strictEqual(
      installer.DEFAULT_CONFIG_PATH,
      path.join(os.homedir(), ".config", "codewiz", "codewiz.jsonc")
    );
  });

  test("resolves the plugin dir to hooks/codewiz-plugin", () => {
    assert.strictEqual(path.basename(installer.resolvePluginDir()), "codewiz-plugin");
  });

  test("reports the codewiz-not-found reason integration-sync branches on", () => {
    // The literal reason string is a contract with src/integration-sync.js —
    // a drifted string would silently turn a skipped sync into a reported
    // success. register() resolves the host dir from os.homedir() at call
    // time, so pointing that at an empty dir simulates "CodeWiz not installed".
    const realHomedir = os.homedir;
    const emptyHome = fs.mkdtempSync(path.join(os.tmpdir(), "clawd-codewiz-nohost-"));
    try {
      os.homedir = () => emptyHome;
      const result = registerCodewizPlugin({ silent: true });
      assert.strictEqual(result.skipped, true);
      assert.strictEqual(result.reason, "codewiz-not-found");
    } finally {
      os.homedir = realHomedir;
      fs.rmSync(emptyHome, { recursive: true, force: true });
    }
  });
});

describe("codewiz JSONC installer", () => {
  test("candidate order is codewiz.jsonc, codewiz.json, config.json", () => {
    // The effective CodeWiz config is a merge of config.json → codewiz.json →
    // codewiz.jsonc (later wins, arrays REPLACED). The installer must edit the
    // file whose "plugin" actually wins, so the order is load-bearing.
    assert.deepStrictEqual(
      [...getFamilyConfig("codewiz").configCandidates],
      ["codewiz.jsonc", "codewiz.json", "config.json"]
    );
  });

  test("stamps opencode.ai's $schema when creating a fresh config", () => {
    const { dir, configPath } = tmpConfig(null);
    registerCodewizPlugin({ silent: true, configPath, pluginDir: PLUGIN_DIR });
    const text = fs.readFileSync(configPath, "utf8");
    // CodeWiz itself writes exactly this URL into configs it creates
    // (verified in the v0.1.93 binary), unlike mimocode which must not.
    assert.ok(text.includes("https://opencode.ai/config.json"), text);
    fs.rmSync(dir, { recursive: true, force: true });
  });

  test("preserves comments across register and unregister", () => {
    const { dir, configPath } = tmpConfig('{\n  // keep me\n  "plugin": [],\n}');
    registerCodewizPlugin({ silent: true, configPath, pluginDir: PLUGIN_DIR });
    assert.ok(fs.readFileSync(configPath, "utf8").includes("// keep me"));

    unregisterCodewizPlugin({ configPath, pluginDir: PLUGIN_DIR });
    const after = fs.readFileSync(configPath, "utf8");
    assert.ok(after.includes("// keep me"), after);
    assert.ok(!after.includes("codewiz-plugin"), after);
    fs.rmSync(dir, { recursive: true, force: true });
  });

  test("unregister removes every duplicate managed entry", () => {
    const { dir, configPath } = tmpConfig(
      `{\n  "plugin": ["${PLUGIN_DIR}", "${PLUGIN_DIR}"],\n}`
    );
    const result = unregisterCodewizPlugin({ configPath, pluginDir: PLUGIN_DIR });
    assert.strictEqual(result.removed, 2);
    fs.rmSync(dir, { recursive: true, force: true });
  });

  test("leaves a user's unrelated plugin entries untouched", () => {
    const { dir, configPath } = tmpConfig(
      '{\n  "plugin": ["file:///Users/me/.config/codewiz/plugin/git-ai.ts"],\n}'
    );
    registerCodewizPlugin({ silent: true, configPath, pluginDir: PLUGIN_DIR });
    unregisterCodewizPlugin({ configPath, pluginDir: PLUGIN_DIR });
    const after = fs.readFileSync(configPath, "utf8");
    assert.ok(after.includes("git-ai.ts"), after);
    fs.rmSync(dir, { recursive: true, force: true });
  });
});

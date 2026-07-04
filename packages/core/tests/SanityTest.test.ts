import * as core from "../src";

test("core exports sanity", () => {
  expect(core.scan).toBeDefined();
  expect(core.parse).toBeDefined();
});

describe('UMD Global', () => {
  it('exposes exports', () => {
    const scanner = global.lightningflowscanner;
    expect(scanner).toBeDefined();
    expect(typeof scanner.scan).toBe('function');
    expect(scanner.Flow).toBeDefined();
  });

  it('getRules() exposes configurableOptions on configurable rules', () => {
    const scanner = global.lightningflowscanner;
    if (!scanner) return; // Skip in Node-only mode

    const rules = scanner.getRules();
    const configurableRules = rules.filter((r: any) => r.isConfigurable);

    expect(configurableRules.length).toBeGreaterThan(0);

    for (const rule of configurableRules) {
      expect(rule.configurableOptions).toBeDefined();
      expect(Array.isArray(rule.configurableOptions)).toBe(true);
      expect(rule.configurableOptions.length).toBeGreaterThan(0);

      for (const opt of rule.configurableOptions) {
        expect(typeof opt.name).toBe('string');
        expect(['number', 'string', 'boolean', 'expression']).toContain(opt.type);
        expect(typeof opt.description).toBe('string');
      }
    }
  });

  it('getRules() returns APIVersion with expression configurableOption', () => {
    const scanner = global.lightningflowscanner;
    if (!scanner) return; // Skip in Node-only mode

    const rules = scanner.getRules();
    const apiVersion = rules.find((r: any) => r.name === 'APIVersion');

    expect(apiVersion).toBeDefined();
    expect(apiVersion.isConfigurable).toBe(true);
    expect(apiVersion.configurableOptions).toEqual([
      {
        name: 'expression',
        type: 'expression',
        description: expect.any(String),
        defaultValue: '>= 50',
      },
    ]);
  });
});
import MaterialLayout from '../components/MaterialLayout';

const C = {
  bg: '#faf9f5',
  dark: '#141413',
  orange: '#d97757',
  blue: '#6a9bcc',
  green: '#788c5d',
  gray: '#b0aea5',
  lightGray: '#e8e6dc',
  cream: '#f5f3ee',
  muted: '#6a685e',
  faint: '#b0aea5',
};

const sectionHeading = {
  fontFamily: 'var(--serif)',
  fontSize: 20,
  fontWeight: 400,
  color: C.dark,
  margin: '0 0 16px 0',
};

const codeBlock = {
  fontFamily: 'var(--mono)',
  fontSize: 11,
  lineHeight: 1.6,
  color: '#e8e6dc',
  background: C.dark,
  borderRadius: 6,
  padding: '16px 18px',
  whiteSpace: 'pre',
  overflowX: 'auto',
  margin: '0 0 20px 0',
};

const codeLabel = {
  fontFamily: 'var(--mono)',
  fontSize: 10,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: C.muted,
  marginBottom: 6,
};

const surfaces = [
  {
    num: 1,
    name: 'CLAUDE.md',
    desc: 'Persistent project context. The system prompt for your codebase.',
    why: 'Start every customer deployment here.',
  },
  {
    num: 2,
    name: 'Hooks',
    desc: 'Custom scripts before/after actions. Pre-commit linting, post-edit testing.',
    why: "The answer to 'how do I control what Claude does?'",
  },
  {
    num: 3,
    name: 'Permissions',
    desc: 'Tiered control: Interactive (asks first), Auto-accept (within boundaries), Headless (CI/CD).',
    why: 'Critical for enterprise security conversations.',
  },
  {
    num: 4,
    name: 'MCP',
    desc: 'Model Context Protocol connects Claude to external services. 1000+ connectors.',
    why: 'Often the unlock for enterprise deals.',
  },
  {
    num: 5,
    name: 'Slash Commands',
    desc: 'Quick actions and custom workflows. Shared via git.',
    why: 'Tech leads love standardized team workflows.',
  },
  {
    num: 6,
    name: 'Memory',
    desc: 'Preferences across sessions. Project-level (CLAUDE.md, shared) + User-level (~/.claude/, personal).',
    why: 'Claude remembers your conventions.',
  },
];

const permissionTiers = [
  {
    tier: 'Interactive',
    desc: 'Asks before destructive actions.',
    use: 'Learning & exploration.',
  },
  {
    tier: 'Auto-accept',
    desc: 'Executes within boundaries.',
    use: 'Experienced users.',
  },
  {
    tier: 'Headless',
    desc: 'No human in loop.',
    use: 'CI/CD pipelines.',
  },
];

export default function F5_Configuration() {
  return (
    <MaterialLayout
      id="F5"
      title="Configuration & Customization"
      subtitle="Six surfaces that shape Claude Code's behavior"
      color={C.green}
      category="Foundations"
      format="Cheat Sheet"
    >
      {/* ════════════ PAGE 1 ════════════ */}
      <div>
        <h2 style={sectionHeading}>Configuration Surfaces</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {surfaces.map((s) => (
            <div
              key={s.num}
              style={{
                display: 'flex',
                gap: 14,
                background: C.cream,
                border: `1px solid ${C.lightGray}`,
                borderRadius: 6,
                padding: '14px 16px',
                alignItems: 'flex-start',
              }}
            >
              {/* Number badge */}
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#fff',
                  background: C.green,
                  borderRadius: '50%',
                  width: 26,
                  height: 26,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                {s.num}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.dark,
                    marginBottom: 4,
                  }}
                >
                  {s.name}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: 12,
                    color: C.dark,
                    lineHeight: 1.5,
                    marginBottom: 6,
                  }}
                >
                  {s.desc}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: 11,
                    color: C.green,
                    fontStyle: 'italic',
                    lineHeight: 1.4,
                  }}
                >
                  Why it matters: {s.why}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════ PAGE 2 ════════════ */}
      <div className="page-break-before" style={{ marginTop: 32 }}>
        {/* CLAUDE.md Template */}
        <div style={codeLabel}>CLAUDE.md Template</div>
        <pre style={codeBlock}>
{`# Project: [Name]
## Architecture
- [Framework] backend, [Framework] frontend
- [Database] via [ORM]
## Conventions
- [Language/style rules]
- Tests live next to source: foo.ts → foo.test.ts
## Before committing
- Run \`npm run lint && npm test\`
- Never commit .env files
## Team notes
- [Anything you'd tell a new teammate on day one]`}
        </pre>

        {/* Hook Config Example */}
        <div style={codeLabel}>Hook Config Example</div>
        <pre style={codeBlock}>
{`{
  "pre-commit": ["npm run lint", "npm run type-check"],
  "post-edit": ["npm test -- --related"],
  "pre-push": ["npm run test:e2e"]
}`}
        </pre>

        {/* Managed Settings Example */}
        <div style={codeLabel}>Managed Settings Example</div>
        <pre style={codeBlock}>
{`{
  "permissions": {
    "deny": ["Bash(rm -rf *)", "Bash(curl *)"],
    "defaultMode": "default"
  },
  "disableBypassPermissionsMode": true,
  "allowManagedMcpServersOnly": true
}`}
        </pre>

        {/* Custom Slash Command */}
        <div style={codeLabel}>Custom Slash Command</div>
        <pre style={codeBlock}>
{`# .claude/commands/deploy-check.md
Run pre-deployment checklist:
1. Run full test suite
2. Check for TODO/FIXME comments
3. Verify env vars documented
4. Validate error handling`}
        </pre>

        {/* Permission Tiers */}
        <div style={{ ...codeLabel, marginBottom: 10 }}>Permission Tiers</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {permissionTiers.map((t) => (
            <div
              key={t.tier}
              style={{
                background: C.cream,
                border: `1px solid ${C.lightGray}`,
                borderTop: `3px solid ${C.green}`,
                borderRadius: 6,
                padding: '12px 14px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.dark,
                  marginBottom: 4,
                }}
              >
                {t.tier}
              </div>
              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 11,
                  color: C.dark,
                  lineHeight: 1.5,
                  marginBottom: 2,
                }}
              >
                {t.desc}
              </div>
              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 11,
                  color: C.muted,
                  fontStyle: 'italic',
                }}
              >
                {t.use}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MaterialLayout>
  );
}

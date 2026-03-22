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
  margin: '0 0 14px 0',
};

const subHeading = {
  fontFamily: 'var(--serif)',
  fontSize: 16,
  fontWeight: 400,
  color: C.dark,
  margin: '0 0 10px 0',
};

const codeBlock = {
  fontFamily: 'var(--mono)',
  fontSize: 11,
  lineHeight: 1.6,
  color: '#e8e6dc',
  background: C.dark,
  borderRadius: 6,
  padding: '14px 16px',
  whiteSpace: 'pre',
  overflowX: 'auto',
  margin: '0 0 18px 0',
};

const bodyText = {
  fontFamily: 'var(--sans)',
  fontSize: 12,
  color: C.dark,
  lineHeight: 1.6,
};

const listItem = {
  fontFamily: 'var(--sans)',
  fontSize: 12,
  color: C.dark,
  lineHeight: 1.6,
  marginBottom: 6,
};

const inlineCode = {
  fontFamily: 'var(--mono)',
  fontSize: 11,
  background: C.lightGray,
  borderRadius: 3,
  padding: '1px 5px',
};

const sectionBox = {
  background: C.cream,
  border: `1px solid ${C.lightGray}`,
  borderRadius: 6,
  padding: '16px 18px',
  marginBottom: 16,
};

export default function M3b_CoreExtensions() {
  return (
    <MaterialLayout
      id="M3b"
      title="Core Extensions"
      subtitle="Hooks, MCP, sub-agents, and custom commands"
      color={C.green}
      category="Day 3"
      format="Cheat Sheet"
    >
      {/* ════════════ PAGE 1 ════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {/* ═══ LEFT COLUMN ═══ */}
        <div>
          {/* ── Hooks ── */}
          <div style={sectionBox}>
            <h2 style={sectionHeading}>Hooks</h2>
            <p style={{ ...bodyText, marginBottom: 12 }}>
              Automated actions on events &mdash; enforced gates that can&apos;t be skipped.
            </p>
            <h3 style={subHeading}>Hook Types</h3>
            <ul style={{ margin: 0, paddingLeft: 18, marginBottom: 14 }}>
              <li style={listItem}>
                <strong>PreToolUse</strong> &mdash; before Claude uses a tool
              </li>
              <li style={listItem}>
                <strong>PostToolUse</strong> &mdash; after a tool completes
              </li>
              <li style={listItem}>
                <strong>Notification</strong> &mdash; on events like session start
              </li>
            </ul>
            <pre style={codeBlock}>
{`// .claude/settings.json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "npm test -- --bail"
      }]
    }]
  }
}`}
            </pre>
            <p style={{ ...bodyText, color: C.muted, fontStyle: 'italic', margin: 0 }}>
              Hooks = enforcement. Slash commands = convenience. For compliance, use hooks.
            </p>
          </div>

          {/* ── MCP Servers ── */}
          <div style={sectionBox}>
            <h2 style={sectionHeading}>MCP Servers</h2>
            <p style={{ ...bodyText, marginBottom: 12 }}>
              Model Context Protocol connects Claude to external tools and data.
            </p>
            <h3 style={subHeading}>How It Works</h3>
            <p style={{ ...bodyText, marginBottom: 14 }}>
              Configure in settings &rarr; Claude discovers tools &rarr; Uses them in the agentic loop
            </p>
            <pre style={codeBlock}>
{`// .claude/settings.json
{
  "mcpServers": {
    "jira": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-jira"],
      "env": { "JIRA_URL": "..." }
    }
  }
}`}
            </pre>
            <p style={{ ...bodyText, margin: 0 }}>
              <strong>Common servers:</strong> Jira, Slack, Datadog, Confluence, GitHub, PostgreSQL
            </p>
          </div>
        </div>

        {/* ═══ RIGHT COLUMN ═══ */}
        <div>
          {/* ── Sub-agents ── */}
          <div style={sectionBox}>
            <h2 style={sectionHeading}>Sub-agents</h2>
            <p style={{ ...bodyText, marginBottom: 12 }}>
              Claude can spawn additional agents that work in parallel.
            </p>
            <h3 style={subHeading}>Patterns</h3>
            <ul style={{ margin: 0, paddingLeft: 18, marginBottom: 14 }}>
              <li style={listItem}>
                <strong>Writer/reviewer pair</strong> &mdash; one writes, one reviews
              </li>
              <li style={listItem}>
                <strong>Fan-out across files</strong> &mdash; parallel edits to many files
              </li>
              <li style={listItem}>
                <strong>Research agent</strong> &mdash; searches while main agent works
              </li>
            </ul>
            <p style={{ ...bodyText, color: C.muted, fontStyle: 'italic', margin: 0 }}>
              Tradeoff: Multiplies token usage. Use when parallelism saves significant time.
            </p>
          </div>

          {/* ── Custom Slash Commands ── */}
          <div style={sectionBox}>
            <h2 style={sectionHeading}>Custom Slash Commands</h2>
            <p style={{ ...bodyText, marginBottom: 12 }}>
              Package workflows your team shares via git.
            </p>
            <p style={{ ...bodyText, marginBottom: 14 }}>
              Create <span style={inlineCode}>.claude/commands/your-command.md</span> &mdash;
              becomes <span style={inlineCode}>/your-command</span>
            </p>
            <pre style={codeBlock}>
{`Run pre-deployment checklist:
1. Run full test suite, report results
2. Check for TODO/FIXME in changed files
3. Verify env vars in .env.example
4. Check for console.log in prod code
5. Generate change summary since last tag`}
            </pre>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: C.faint, margin: '0 0 14px 0' }}>
              .claude/commands/deploy-check.md
            </p>
            <p style={{ ...bodyText, color: C.muted, fontStyle: 'italic', margin: 0 }}>
              A tech lead defines commands once &rarr; entire team inherits via git
            </p>
          </div>
        </div>
      </div>

      {/* ════════════ PAGE 2 ════════════ */}
      <div className="page-break-before" style={{ marginTop: 32 }}>
        {/* ── Decision Guide ── */}
        <h2 style={sectionHeading}>Decision Guide: Hooks vs. Commands vs. MCP</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 14,
            marginBottom: 24,
          }}
        >
          {[
            {
              label: 'Hooks',
              nature: 'Automatic, enforced, can\u2019t bypass',
              useFor: 'Compliance, quality gates',
              accent: C.green,
            },
            {
              label: 'Commands',
              nature: 'Opt-in, developer triggers',
              useFor: 'Team workflows, convenience',
              accent: C.blue,
            },
            {
              label: 'MCP',
              nature: 'External data/tools, always available',
              useFor: 'Connecting to Jira, Datadog, etc.',
              accent: C.orange,
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: C.cream,
                border: `1px solid ${C.lightGray}`,
                borderTop: `3px solid ${item.accent}`,
                borderRadius: 6,
                padding: '16px 18px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 13,
                  fontWeight: 700,
                  color: item.accent,
                  marginBottom: 8,
                }}
              >
                {item.label}
              </div>
              <p style={{ ...bodyText, marginBottom: 10 }}>{item.nature}</p>
              <p style={{ ...bodyText, color: C.muted, margin: 0 }}>
                <strong>Use for:</strong> {item.useFor}
              </p>
            </div>
          ))}
        </div>

        {/* ── Composed Workflow ── */}
        <div
          style={{
            background: C.dark,
            color: '#e8e6dc',
            borderRadius: 6,
            padding: '16px 20px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: C.green,
              marginBottom: 8,
            }}
          >
            Composed Workflow
          </div>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 12, lineHeight: 1.7 }}>
            One prompt uses all three: MCP pulls Jira context &rarr; Claude implements the
            feature &rarr; hooks enforce tests &rarr; <span style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>/deploy-check</span> verifies readiness
          </div>
        </div>
      </div>
    </MaterialLayout>
  );
}

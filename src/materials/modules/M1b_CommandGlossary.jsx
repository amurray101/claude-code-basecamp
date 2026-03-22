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

const subHeading = {
  fontFamily: 'var(--serif)',
  fontSize: 15,
  fontWeight: 400,
  color: C.dark,
  margin: '0 0 8px 0',
};

const inlineCode = {
  fontFamily: 'var(--mono)',
  fontSize: 11,
  background: C.lightGray,
  borderRadius: 3,
  padding: '2px 6px',
  whiteSpace: 'nowrap',
};

const cmdRow = {
  display: 'flex',
  gap: 8,
  alignItems: 'flex-start',
  padding: '7px 14px',
  borderBottom: `1px solid ${C.lightGray}`,
};

const cmdName = {
  fontFamily: 'var(--mono)',
  fontSize: 12,
  fontWeight: 600,
  color: C.dark,
  minWidth: 110,
  flexShrink: 0,
};

const cmdDesc = {
  fontFamily: 'var(--sans)',
  fontSize: 11,
  color: C.muted,
  lineHeight: 1.5,
};

const sectionBox = (accentColor) => ({
  background: C.cream,
  border: `1px solid ${C.lightGray}`,
  borderTop: `3px solid ${accentColor}`,
  borderRadius: 6,
  overflow: 'hidden',
  marginBottom: 14,
});

const sectionLabel = (accentColor) => ({
  fontFamily: 'var(--mono)',
  fontSize: 9,
  letterSpacing: 1.2,
  textTransform: 'uppercase',
  color: accentColor,
  padding: '10px 14px 0',
});

export default function M1b_CommandGlossary() {
  return (
    <MaterialLayout
      id="M1b"
      title="Command Glossary"
      subtitle="Every command, shortcut, and flag in one place"
      color={C.orange}
      category="Day 1"
      format="Cheat Sheet"
    >
      {/* ── Daily Drivers (top banner, full width) ── */}
      <div
        style={{
          background: C.dark,
          borderRadius: 8,
          padding: '14px 18px',
          marginBottom: 18,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: 10,
        }}
      >
        {[
          { cmd: 'claude', what: 'Launch session' },
          { cmd: '/compact', what: 'Compress context' },
          { cmd: '/clear', what: 'Reset session' },
          { cmd: '/cost', what: 'Check spend' },
          { cmd: 'Shift+Tab', what: 'Plan Mode on/off' },
          { cmd: 'Escape', what: 'Interrupt Claude' },
          { cmd: '@ + file', what: 'Add file to context' },
          { cmd: 'Up arrow', what: 'Recall last message' },
        ].map((d) => (
          <div key={d.cmd} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: C.orange }}>
              {d.cmd}
            </span>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 10, color: '#b0aea5', lineHeight: 1.3 }}>
              {d.what}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {/* ═══ LEFT COLUMN ═══ */}
        <div>
          {/* ── Slash Commands ── */}
          <div style={sectionBox(C.orange)}>
            <div style={sectionLabel(C.orange)}>Slash Commands</div>
            {[
              { cmd: '/model', desc: 'Switch model (Sonnet, Opus, Haiku) mid-conversation.' },
              { cmd: '/review', desc: 'Code review mode. Reviews staged or recent changes before committing.' },
              { cmd: '/commit', desc: 'Stage and commit with a Claude-generated message.' },
              { cmd: '/test', desc: 'Run the project\u2019s test suite and report results.' },
              { cmd: '/init', desc: 'Generate a CLAUDE.md by analyzing the codebase.' },
              { cmd: '/help', desc: 'Show available commands and usage guidance.' },
            ].map(c => (
              <div key={c.cmd} style={cmdRow}>
                <span style={cmdName}>{c.cmd}</span>
                <span style={cmdDesc}>{c.desc}</span>
              </div>
            ))}
          </div>

          {/* ── Custom Commands ── */}
          <div style={sectionBox(C.orange)}>
            <div style={sectionLabel(C.orange)}>Custom Slash Commands</div>
            <div style={{ padding: '8px 14px' }}>
              <p style={cmdDesc}>
                Create markdown files in <span style={inlineCode}>.claude/commands/</span> &mdash; shared with the team via git. Invoke with <span style={inlineCode}>/command-name</span>. Use <span style={inlineCode}>@ + filename</span> to mention a file in context.
              </p>
              <div style={{ background: C.bg, border: `1px solid ${C.lightGray}`, borderRadius: 4, padding: '8px 10px', marginTop: 6, fontFamily: 'var(--mono)', fontSize: 10, color: C.dark, lineHeight: 1.6 }}>
                <div style={{ color: C.faint }}>{'# .claude/commands/deploy-check.md'}</div>
                <div>Run pre-deployment checklist:</div>
                <div>1. Run all tests</div>
                <div>2. Check for lint errors</div>
                <div>3. Verify env variables</div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ RIGHT COLUMN ═══ */}
        <div>
          {/* ── CLI Commands ── */}
          <div style={sectionBox(C.dark)}>
            <div style={sectionLabel(C.dark)}>CLI Commands</div>
            <h2 style={{ ...subHeading, padding: '6px 14px 0' }}>Interactive</h2>
            {[
              { cmd: 'claude', desc: 'Launch interactive session. Reads codebase and CLAUDE.md automatically.' },
              { cmd: 'claude -c', desc: 'Continue the most recent conversation.' },
              { cmd: 'claude auth', desc: 'Authenticate with your Anthropic account.' },
            ].map(c => (
              <div key={c.cmd} style={cmdRow}>
                <span style={{ ...cmdName, minWidth: 120 }}>{c.cmd}</span>
                <span style={cmdDesc}>{c.desc}</span>
              </div>
            ))}

            <h2 style={{ ...subHeading, padding: '10px 14px 0' }}>Scripting &amp; CI/CD</h2>
            {[
              { cmd: 'claude -p "..."', desc: 'Run a single prompt and exit. Output goes to stdout.' },
              { cmd: 'echo "..." | claude', desc: 'Pipe input as a prompt. Combine with -p for scripted workflows.' },
              { cmd: '--output-format json', desc: 'Return structured JSON. Useful for CI/CD integration.' },
              { cmd: '--max-turns N', desc: 'Limit agentic turns. Safety valve for automated runs.' },
              { cmd: '--verbose', desc: 'Show tool calls and internal reasoning.' },
            ].map(c => (
              <div key={c.cmd} style={cmdRow}>
                <span style={{ ...cmdName, minWidth: 120, fontSize: 11 }}>{c.cmd}</span>
                <span style={cmdDesc}>{c.desc}</span>
              </div>
            ))}
          </div>

          {/* ── Permission Modes ── */}
          <div style={sectionBox(C.dark)}>
            <div style={sectionLabel(C.dark)}>Permission Modes</div>
            {[
              { cmd: 'Default', desc: 'Asks before writes, commands, and network requests.', color: C.blue },
              { cmd: 'Plan Mode', desc: 'Reads and proposes but takes no actions. Toggle: Shift+Tab.', color: C.green },
              { cmd: 'Auto-accept', desc: 'Executes within configured boundaries. Hooks still apply.', color: C.orange },
              { cmd: 'Headless', desc: 'No human in the loop. For CI/CD pipelines.', color: C.dark },
            ].map(c => (
              <div key={c.cmd} style={cmdRow}>
                <div style={{ minWidth: 85, flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: c.color + '14', color: c.color }}>{c.cmd}</span>
                </div>
                <span style={cmdDesc}>{c.desc}</span>
              </div>
            ))}
          </div>

          {/* ── Configuration Files ── */}
          <div style={sectionBox(C.dark)}>
            <div style={sectionLabel(C.dark)}>Configuration Files</div>
            {[
              { cmd: 'CLAUDE.md', desc: 'Project context \u2014 architecture, conventions, testing. Read every session. The most impactful configuration.' },
              { cmd: '.claude/settings.json', desc: 'Project settings \u2014 MCP servers, permissions, model preferences.' },
              { cmd: '.claude/commands/', desc: 'Custom slash commands as markdown files. Shared via git.' },
              { cmd: '~/.claude/', desc: 'User-level config \u2014 personal memory, preferences. Follows you across projects.' },
            ].map(c => (
              <div key={c.cmd} style={cmdRow}>
                <span style={{ ...cmdName, minWidth: 140, fontSize: 10 }}>{c.cmd}</span>
                <span style={cmdDesc}>{c.desc}</span>
              </div>
            ))}
          </div>

          {/* ── Environment Variables ── */}
          <div style={sectionBox(C.dark)}>
            <div style={sectionLabel(C.dark)}>Environment Variables</div>
            {[
              { cmd: 'ANTHROPIC_API_KEY', desc: 'API key auth. Required for CI/CD and headless mode.' },
              { cmd: 'CLAUDE_CODE_USE_BEDROCK', desc: 'Route through AWS Bedrock.' },
              { cmd: 'CLAUDE_CODE_USE_VERTEX', desc: 'Route through Google Vertex AI.' },
            ].map(c => (
              <div key={c.cmd} style={cmdRow}>
                <span style={{ ...cmdName, fontSize: 10, minWidth: 140 }}>{c.cmd}</span>
                <span style={cmdDesc}>{c.desc}</span>
              </div>
            ))}
          </div>

          {/* ── Tip ── */}
          <div
            style={{
              background: C.bg,
              border: `1px solid ${C.lightGray}`,
              borderLeft: `3px solid ${C.green}`,
              borderRadius: 4,
              padding: '10px 14px',
              fontFamily: 'var(--sans)',
              fontSize: 11,
              color: C.muted,
              lineHeight: 1.55,
            }}
          >
            <strong style={{ color: C.green }}>Session hygiene:</strong>{' '}
            <span style={inlineCode}>/compact</span> between steps,{' '}
            <span style={inlineCode}>/clear</span> between tasks,{' '}
            <span style={inlineCode}>/cost</span> before wrapping up.
          </div>
        </div>
      </div>
    </MaterialLayout>
  );
}

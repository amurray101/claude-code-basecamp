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
  fontSize: 15,
  fontWeight: 400,
  color: C.dark,
  margin: '0 0 10px 0',
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
  gap: 10,
  alignItems: 'flex-start',
  padding: '10px 14px',
  borderBottom: `1px solid ${C.lightGray}`,
};

const cmdName = {
  fontFamily: 'var(--mono)',
  fontSize: 12,
  fontWeight: 600,
  color: C.dark,
  minWidth: 120,
  flexShrink: 0,
};

const cmdDesc = {
  fontFamily: 'var(--sans)',
  fontSize: 11,
  color: C.muted,
  lineHeight: 1.55,
};

const sectionBox = (accentColor) => ({
  background: C.cream,
  border: `1px solid ${C.lightGray}`,
  borderTop: `3px solid ${accentColor}`,
  borderRadius: 6,
  overflow: 'hidden',
  marginBottom: 18,
});

const sectionLabel = (accentColor) => ({
  fontFamily: 'var(--mono)',
  fontSize: 9,
  letterSpacing: 1.2,
  textTransform: 'uppercase',
  color: accentColor,
  padding: '12px 14px 0',
});

const tipBox = {
  background: C.bg,
  border: `1px solid ${C.lightGray}`,
  borderLeft: `3px solid ${C.green}`,
  borderRadius: 4,
  padding: '10px 14px',
  fontFamily: 'var(--sans)',
  fontSize: 11,
  color: C.muted,
  lineHeight: 1.55,
  marginBottom: 18,
};

export default function M1b_CommandGlossary() {
  return (
    <MaterialLayout
      id="M1b"
      title="Command Glossary"
      subtitle="Every command, shortcut, and flag in one place"
      color={C.orange}
      category="Desk Reference"
      format="Cheat Sheet"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* ═══ LEFT COLUMN ═══ */}
        <div>
          {/* ── Slash Commands ── */}
          <div style={sectionBox(C.orange)}>
            <div style={sectionLabel(C.orange)}>Slash Commands</div>
            <h2 style={{ ...subHeading, padding: '6px 14px 0' }}>Session Management</h2>
            {[
              { cmd: '/compact', desc: 'Compress conversation context. Summarizes history to free space while preserving key details. Use every 15–20 min in long sessions or after completing a major step.' },
              { cmd: '/clear', desc: 'Reset session completely. Clears all conversation context. Use when switching to an unrelated task.' },
              { cmd: '/cost', desc: 'Show token usage for the current session — tokens in, tokens out, and total spend. Essential for cost conversations with customers.' },
              { cmd: '/stats', desc: 'Display usage patterns and session statistics.' },
            ].map(c => (
              <div key={c.cmd} style={cmdRow}>
                <span style={cmdName}>{c.cmd}</span>
                <span style={cmdDesc}>{c.desc}</span>
              </div>
            ))}

            <h2 style={{ ...subHeading, padding: '14px 14px 0' }}>Workflow</h2>
            {[
              { cmd: '/review', desc: 'Code review mode. Claude reviews staged or recent changes and provides feedback before committing.' },
              { cmd: '/commit', desc: 'Stage files and commit with a Claude-generated message. Analyzes the diff to write a meaningful commit summary.' },
              { cmd: '/test', desc: 'Run the project\'s test suite and report results.' },
              { cmd: '/init', desc: 'Generate a CLAUDE.md file for the current project by analyzing the codebase structure, conventions, and dependencies.' },
            ].map(c => (
              <div key={c.cmd} style={cmdRow}>
                <span style={cmdName}>{c.cmd}</span>
                <span style={cmdDesc}>{c.desc}</span>
              </div>
            ))}

            <h2 style={{ ...subHeading, padding: '14px 14px 0' }}>Navigation</h2>
            {[
              { cmd: '/help', desc: 'Show available commands and usage guidance.' },
              { cmd: '/config', desc: 'View or modify Claude Code configuration settings.' },
              { cmd: '/model', desc: 'Switch the active model (Sonnet, Opus, Haiku) mid-conversation.' },
              { cmd: '/login', desc: 'Re-authenticate or switch accounts.' },
              { cmd: '/logout', desc: 'Sign out of the current session.' },
            ].map(c => (
              <div key={c.cmd} style={cmdRow}>
                <span style={cmdName}>{c.cmd}</span>
                <span style={cmdDesc}>{c.desc}</span>
              </div>
            ))}
          </div>

          {/* ── Custom Slash Commands ── */}
          <div style={sectionBox(C.blue)}>
            <div style={sectionLabel(C.blue)}>Custom Slash Commands</div>
            <div style={{ padding: '10px 14px' }}>
              <p style={cmdDesc}>
                Create reusable prompts as markdown files in <span style={inlineCode}>.claude/commands/</span> — shared with the team via git.
              </p>
              <div style={{ background: C.bg, border: `1px solid ${C.lightGray}`, borderRadius: 4, padding: '10px 12px', marginTop: 8, fontFamily: 'var(--mono)', fontSize: 10.5, color: C.dark, lineHeight: 1.7 }}>
                <div style={{ color: C.faint }}>{'# .claude/commands/deploy-check.md'}</div>
                <div>Run pre-deployment checklist:</div>
                <div>1. Run all tests</div>
                <div>2. Check for lint errors</div>
                <div>3. Verify env variables</div>
                <div>4. Summarize changes since last deploy</div>
              </div>
              <p style={{ ...cmdDesc, marginTop: 8 }}>
                Invoke with <span style={inlineCode}>/deploy-check</span>. Arguments are passed via <span style={inlineCode}>$ARGUMENTS</span> placeholder.
              </p>
            </div>
          </div>

          {/* ── Keyboard Shortcuts ── */}
          <div style={sectionBox(C.green)}>
            <div style={sectionLabel(C.green)}>Keyboard Shortcuts</div>
            {[
              { cmd: 'Shift + Tab', desc: 'Toggle Plan Mode on/off. Claude plans without executing — useful for reviewing strategy before committing.' },
              { cmd: 'Escape', desc: 'Interrupt Claude mid-response. Use when you see it heading in the wrong direction.' },
              { cmd: 'Up arrow', desc: 'Recall previous message for editing and re-sending.' },
              { cmd: '@ + filename', desc: 'Mention a file to add it to context. Helps Claude focus on specific files.' },
            ].map(c => (
              <div key={c.cmd} style={cmdRow}>
                <span style={{ ...cmdName, minWidth: 110 }}>{c.cmd}</span>
                <span style={cmdDesc}>{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ RIGHT COLUMN ═══ */}
        <div>
          {/* ── CLI Commands ── */}
          <div style={sectionBox(C.dark)}>
            <div style={sectionLabel(C.dark)}>CLI Commands</div>
            <h2 style={{ ...subHeading, padding: '6px 14px 0' }}>Getting Started</h2>
            {[
              { cmd: 'claude', desc: 'Launch an interactive session in the current directory. Reads codebase, CLAUDE.md, and project structure automatically.' },
              { cmd: 'claude auth', desc: 'Authenticate with your Anthropic account. Required before first use.' },
              { cmd: 'claude --version', desc: 'Display the installed Claude Code version.' },
              { cmd: 'claude --help', desc: 'Show all available CLI flags and subcommands.' },
            ].map(c => (
              <div key={c.cmd} style={cmdRow}>
                <span style={{ ...cmdName, minWidth: 130 }}>{c.cmd}</span>
                <span style={cmdDesc}>{c.desc}</span>
              </div>
            ))}

            <h2 style={{ ...subHeading, padding: '14px 14px 0' }}>Non-Interactive / Scripting</h2>
            {[
              { cmd: 'claude -p "..."', desc: 'Run a single prompt and exit. Output goes to stdout — great for piping into other tools.' },
              { cmd: 'claude -c', desc: 'Continue the most recent conversation instead of starting a new one.' },
              { cmd: 'claude -r "..."', desc: 'Resume with a specific session ID.' },
              { cmd: 'echo "..." | claude', desc: 'Pipe input to Claude as a prompt. Combine with -p for fully scripted workflows.' },
            ].map(c => (
              <div key={c.cmd} style={cmdRow}>
                <span style={{ ...cmdName, minWidth: 130 }}>{c.cmd}</span>
                <span style={cmdDesc}>{c.desc}</span>
              </div>
            ))}

            <h2 style={{ ...subHeading, padding: '14px 14px 0' }}>Output & Format</h2>
            {[
              { cmd: '--output-format json', desc: 'Return structured JSON output. Useful for CI/CD integration and scripting.' },
              { cmd: '--verbose', desc: 'Show detailed logging including tool calls and internal reasoning.' },
              { cmd: '--max-turns N', desc: 'Limit the number of agentic turns. Safety valve for automated runs.' },
            ].map(c => (
              <div key={c.cmd} style={cmdRow}>
                <span style={{ ...cmdName, minWidth: 130 }}>{c.cmd}</span>
                <span style={cmdDesc}>{c.desc}</span>
              </div>
            ))}
          </div>

          {/* ── Permission Modes ── */}
          <div style={sectionBox(C.blue)}>
            <div style={sectionLabel(C.blue)}>Permission Modes</div>
            {[
              { cmd: 'Default', desc: 'Claude asks before writing files, running commands, or making network requests. Best for learning or sensitive work.', color: C.blue },
              { cmd: 'Plan Mode', desc: 'Claude reads and proposes but takes no actions. Toggle with Shift+Tab. Great for demos where reasoning should be visible.', color: C.green },
              { cmd: 'Auto-accept', desc: 'Claude executes within configured boundaries without asking. Hooks and permission rules still apply.', color: C.orange },
              { cmd: 'Headless', desc: 'No human in the loop. For CI/CD pipelines. All permissions via settings files and managed policies.', color: C.dark },
            ].map(c => (
              <div key={c.cmd} style={cmdRow}>
                <div style={{ minWidth: 90, flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: c.color + '14', color: c.color }}>{c.cmd}</span>
                </div>
                <span style={cmdDesc}>{c.desc}</span>
              </div>
            ))}
          </div>

          {/* ── Configuration Files ── */}
          <div style={sectionBox(C.gray)}>
            <div style={sectionLabel(C.muted)}>Configuration Files</div>
            {[
              { cmd: 'CLAUDE.md', desc: 'Project context — architecture, conventions, testing, deployment. Read automatically every session. The single most impactful configuration.' },
              { cmd: '.claude/settings.json', desc: 'Project settings — MCP servers, permission rules, model preferences. Shared via git.' },
              { cmd: '.claude/commands/', desc: 'Custom slash commands as markdown files. Shared via git.' },
              { cmd: '~/.claude/', desc: 'User-level config — personal memory, preferences. Follows you across projects.' },
            ].map(c => (
              <div key={c.cmd} style={cmdRow}>
                <span style={{ ...cmdName, minWidth: 145 }}>{c.cmd}</span>
                <span style={cmdDesc}>{c.desc}</span>
              </div>
            ))}
          </div>

          {/* ── Environment Variables ── */}
          <div style={sectionBox(C.green)}>
            <div style={sectionLabel(C.green)}>Environment Variables</div>
            {[
              { cmd: 'ANTHROPIC_API_KEY', desc: 'API key for authentication. Required for CI/CD and headless mode.' },
              { cmd: 'CLAUDE_CODE_USE_BEDROCK', desc: 'Route requests through AWS Bedrock instead of direct API.' },
              { cmd: 'CLAUDE_CODE_USE_VERTEX', desc: 'Route requests through Google Vertex AI.' },
              { cmd: 'CLAUDE_CODE_ENABLE_TELEMETRY', desc: 'Opt-in OpenTelemetry. Exports token usage, cost, and tool decisions as OTel metrics.' },
            ].map(c => (
              <div key={c.cmd} style={cmdRow}>
                <span style={{ ...cmdName, fontSize: 10, minWidth: 145 }}>{c.cmd}</span>
                <span style={cmdDesc}>{c.desc}</span>
              </div>
            ))}
          </div>

          {/* ── Tip ── */}
          <div style={tipBox}>
            <strong style={{ color: C.green }}>Session hygiene rule of thumb:</strong> <span style={inlineCode}>/compact</span> between steps, <span style={inlineCode}>/clear</span> between tasks, <span style={inlineCode}>/cost</span> before wrapping up. A clean context window is the difference between a good session and a frustrating one.
          </div>
        </div>
      </div>
    </MaterialLayout>
  );
}

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

const checkboxLine = {
  fontFamily: 'var(--sans)',
  fontSize: 12,
  color: C.dark,
  lineHeight: 1.6,
  display: 'flex',
  alignItems: 'flex-start',
  gap: 8,
  marginBottom: 6,
};

const checkbox = {
  width: 14,
  height: 14,
  border: `1.5px solid ${C.gray}`,
  borderRadius: 2,
  flexShrink: 0,
  marginTop: 2,
};

export default function M1c_WhatIsClaudeCode() {
  return (
    <MaterialLayout
      id="M1c"
      title="What is Claude Code"
      subtitle="From autocomplete to agentic coding"
      color={C.orange}
      category="Day 1"
      format="Cheat Sheet"
    >
      {/* ════════════ PAGE 1 ════════════ */}
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Left column */}
          <div>
            {/* What is Agentic Coding? */}
            <div style={sectionBox}>
              <h2 style={sectionHeading}>What is Agentic Coding?</h2>
              <p style={{ ...bodyText, marginBottom: 10 }}>
                Claude Code reads your entire codebase, plans multi-step changes, edits multiple files, runs commands, and verifies its own work &mdash; all from a single prompt.
              </p>
              <p style={{ ...bodyText, margin: 0 }}>
                Unlike autocomplete tools that suggest the <strong>next line</strong>, Claude Code operates at the <strong>project level</strong>.
              </p>
            </div>

            {/* 4 Surfaces */}
            <div style={sectionBox}>
              <h2 style={subHeading}>4 Surfaces</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { name: 'CLI', desc: 'Terminal — raw speed' },
                  { name: 'VS Code Extension', desc: 'Inline diffs, visual file tree' },
                  { name: 'JetBrains Plugin', desc: 'IntelliJ, PyCharm, WebStorm' },
                  { name: 'Desktop App', desc: '' },
                ].map((s) => (
                  <div key={s.name} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                    <span style={{ ...bodyText, fontWeight: 600 }}>{s.name}</span>
                    {s.desc && <span style={{ ...bodyText, color: C.muted, fontSize: 11 }}>&mdash; {s.desc}</span>}
                  </div>
                ))}
              </div>
              <p style={{ ...bodyText, color: C.muted, fontSize: 11, marginTop: 10, marginBottom: 0, fontStyle: 'italic' }}>
                All use the same agentic engine.
              </p>
            </div>
          </div>

          {/* Right column */}
          <div>
            {/* CLI Install */}
            <div style={sectionBox}>
              <h2 style={subHeading}>CLI Install</h2>
              <pre style={codeBlock}>
{`curl -fsSL https://cli.anthropic.com/install.sh | sh
claude auth
claude --version`}
              </pre>
            </div>

            {/* VS Code Setup */}
            <div style={sectionBox}>
              <h2 style={subHeading}>VS Code Setup</h2>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li style={listItem}>
                  Install <strong>"Claude Code"</strong> extension from marketplace
                </li>
                <li style={listItem}>
                  Open Command Palette &rarr; <strong>"Claude Code: Open"</strong>
                </li>
                <li style={listItem}>
                  Or click Claude icon in sidebar
                </li>
              </ul>
            </div>

            {/* JetBrains Setup */}
            <div style={sectionBox}>
              <h2 style={subHeading}>JetBrains Setup</h2>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li style={listItem}>Install from JetBrains Marketplace</li>
                <li style={listItem}>Settings &rarr; Tools &rarr; Claude Code</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════ PAGE 2 ════════════ */}
      <div className="page-break-before" style={{ marginTop: 32 }}>
        {/* Your First Interaction */}
        <div style={sectionBox}>
          <h2 style={sectionHeading}>Your First Interaction</h2>
          <p style={{ ...bodyText, margin: 0 }}>
            When you run <span style={inlineCode}>claude</span> in a project directory, Claude reads the directory structure, <span style={inlineCode}>package.json</span>, and <span style={inlineCode}>CLAUDE.md</span> before you type anything. Autocomplete tools don&rsquo;t do this.
          </p>
        </div>

        {/* Troubleshooting */}
        <div style={sectionBox}>
          <h2 style={sectionHeading}>Troubleshooting</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              {
                num: 1,
                problem: '"Command not found"',
                fix: (
                  <>
                    Check PATH, try <span style={inlineCode}>npx @anthropic-ai/claude-code</span>
                  </>
                ),
              },
              {
                num: 2,
                problem: '"Authentication error"',
                fix: (
                  <>
                    Run <span style={inlineCode}>claude auth</span> or check API key
                  </>
                ),
              },
              {
                num: 3,
                problem: '"Corporate proxy/VPN"',
                fix: (
                  <>
                    Set <span style={inlineCode}>NODE_EXTRA_CA_CERTS</span> or <span style={inlineCode}>HTTPS_PROXY</span>, try <span style={inlineCode}>claude /doctor</span>
                  </>
                ),
              },
            ].map((t) => (
              <div key={t.num} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#fff',
                    background: C.orange,
                    borderRadius: '50%',
                    width: 22,
                    height: 22,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  {t.num}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...bodyText, fontWeight: 600, marginBottom: 2 }}>{t.problem}</div>
                  <div style={{ ...bodyText, color: C.muted, fontSize: 11 }}>{t.fix}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </MaterialLayout>
  );
}

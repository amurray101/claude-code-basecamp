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

export default function M1_InstallFirstRun() {
  return (
    <MaterialLayout
      id="M1"
      title="Install & First Run"
      subtitle="From zero to first agentic task"
      color={C.orange}
      category="Day 1"
      format="Cheat Sheet"
    >
      {/* ════════════ PAGE 1 ════════════ */}
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Left column */}
          <div>
            {/* CLI Install */}
            <div style={sectionBox}>
              <h2 style={subHeading}>CLI Install</h2>
              <pre style={codeBlock}>
{`npm install -g @anthropic-ai/claude-code
claude`}
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
                  Or use the Claude Code icon in the sidebar
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

          {/* Right column */}
          <div>
            {/* First Run Checklist */}
            <div style={sectionBox}>
              <h2 style={subHeading}>First Run Checklist</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  'Install Claude Code CLI',
                  <>Run <span style={inlineCode}>claude</span> in the sample Express API repo</>,
                  <>Watch Claude read the codebase (the &ldquo;aha&rdquo; moment)</>,
                  'Add a GET /health endpoint with tests (first agentic task)',
                  'Narrate the agentic loop: Read \u2192 Plan \u2192 Edit \u2192 Test \u2192 Iterate',
                  'Install IDE extension and compare CLI vs IDE experience',
                ].map((item, i) => (
                  <div key={i} style={checkboxLine}>
                    <div style={checkbox} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 3 Troubleshooting Issues */}
            <div style={sectionBox}>
              <h2 style={subHeading}>Top 3 Troubleshooting Issues</h2>
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
                        Run <span style={inlineCode}>claude auth</span> or check API key in env
                      </>
                    ),
                  },
                  {
                    num: 3,
                    problem: '"Slow first response"',
                    fix: "Normal! Claude is reading your codebase. Subsequent prompts are faster.",
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
        </div>
      </div>

      {/* ════════════ PAGE 2 ════════════ */}
      <div className="page-break-before" style={{ marginTop: 32 }}>
        {/* The Agentic Loop — What to Watch For */}
        <div
          style={{
            background: C.orange + '0a',
            border: `1px solid ${C.orange}25`,
            borderRadius: 6,
            padding: '12px 16px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
          }}
        >
          {['Read', 'Plan', 'Edit', 'Test', 'Iterate'].map((phase, i) => (
            <span key={phase} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: C.orange }}>{phase}</span>
              {i < 4 && <span style={{ color: C.gray }}>&rarr;</span>}
            </span>
          ))}
        </div>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.muted, marginBottom: 16, lineHeight: 1.6, textAlign: 'center', fontStyle: 'italic' }}>
          Every task Claude performs follows this cycle. Today&rsquo;s goal: observe it, recognize it, and learn to explain it to a customer.
        </div>

        <h2 style={sectionHeading}>The Agentic Loop &mdash; What to Watch For</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {[
            {
              step: 1,
              text: (
                <>
                  Open terminal in the sample Express API repo. Claude will read the codebase before you type anything.
                </>
              ),
            },
            {
              step: 2,
              text: (
                <>
                  Run <span style={inlineCode}>claude</span>. Watch it scan the directory structure, package.json, and existing code. This is the <strong>Read</strong> phase.
                </>
              ),
            },
            {
              step: 3,
              text: (
                <>
                  Prompt: <em>&ldquo;Add a GET /health endpoint with tests.&rdquo;</em> Watch Claude <strong>Plan</strong> the changes before touching any files.
                </>
              ),
            },
            {
              step: 4,
              text: (
                <>
                  As it works: notice it reading existing routes, <strong>editing</strong> files to add the endpoint, then <strong>testing</strong> to verify &mdash; all autonomously.
                </>
              ),
            },
            {
              step: 5,
              text: (
                <>
                  One prompt produced a working endpoint with passing tests. This is the agentic difference &mdash; project-level, not line-level.
                </>
              ),
            },
          ].map((s) => (
            <div
              key={s.step}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
                background: C.cream,
                border: `1px solid ${C.lightGray}`,
                borderRadius: 6,
                padding: '12px 16px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#fff',
                  background: C.orange,
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {s.step}
              </div>
              <div style={{ ...bodyText, flex: 1 }}>{s.text}</div>
            </div>
          ))}
        </div>

        {/* Basic Prompting Patterns */}
        <h2 style={sectionHeading}>Basic Prompting Patterns</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            {
              label: 'Be outcome-focused',
              desc: (
                <>
                  <em>&ldquo;Add a health check endpoint&rdquo;</em> not <em>&ldquo;Create a file called...&rdquo;</em>
                </>
              ),
            },
            {
              label: 'Give constraints',
              desc: (
                <>
                  <em>&ldquo;...using our existing Express patterns and Jest for tests&rdquo;</em>
                </>
              ),
            },
            {
              label: 'Let Claude plan',
              desc: "Don't micromanage steps. Describe what you want, not how.",
            },
            {
              label: 'Iterate',
              desc: (
                <>
                  <em>&ldquo;Now add rate limiting to that endpoint&rdquo;</em> builds on context
                </>
              ),
            },
          ].map((p) => (
            <div
              key={p.label}
              style={{
                background: C.cream,
                border: `1px solid ${C.lightGray}`,
                borderRadius: 6,
                padding: '12px 16px',
              }}
            >
              <div style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600, color: C.dark, marginBottom: 3 }}>
                {p.label}
              </div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.muted, lineHeight: 1.5 }}>
                {p.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MaterialLayout>
  );
}

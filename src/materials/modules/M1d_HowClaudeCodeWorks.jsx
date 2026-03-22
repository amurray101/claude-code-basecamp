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

export default function M1d_HowClaudeCodeWorks() {
  return (
    <MaterialLayout
      id="M1d"
      title="How Claude Code Works"
      subtitle="Agentic loop, context, tools, and permissions"
      color={C.orange}
      category="Day 1"
      format="Quick Reference Card"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* ═══ LEFT COLUMN ═══ */}
        <div>
          {/* ── The Agentic Loop ── */}
          <h2 style={sectionHeading}>The Agentic Loop</h2>

          {/* Arrow visual */}
          <div
            style={{
              background: C.orange + '0a',
              border: `1px solid ${C.orange}25`,
              borderRadius: 6,
              padding: '10px 16px',
              marginBottom: 14,
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

          {/* Step descriptions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {[
              { step: 'Read', desc: 'Scans codebase, reads relevant files, understands patterns' },
              { step: 'Plan', desc: 'Determines what changes to make and in what order' },
              { step: 'Edit', desc: 'Makes changes across one or more files' },
              { step: 'Test', desc: 'Runs tests, linters, or other verification' },
              { step: 'Iterate', desc: 'If tests fail, reads error, reasons about fix, tries again' },
            ].map((s) => (
              <div
                key={s.step}
                style={{
                  background: C.cream,
                  border: `1px solid ${C.lightGray}`,
                  borderRadius: 6,
                  padding: '8px 14px',
                  display: 'flex',
                  gap: 10,
                  alignItems: 'baseline',
                }}
              >
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: C.orange, flexShrink: 0, minWidth: 48 }}>
                  {s.step}
                </span>
                <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.muted, lineHeight: 1.5 }}>
                  {s.desc}
                </span>
              </div>
            ))}
          </div>

          {/* ── Context Window ── */}
          <h2 style={sectionHeading}>Context Window</h2>
          <div style={sectionBox}>
            <p style={{ ...bodyText, margin: '0 0 8px 0' }}>
              Claude Code has a context window of up to <strong>200K tokens</strong> (~150K words).
              Everything Claude reads, writes, and thinks goes into this window. As you work, it fills
              up &mdash; leading to eventual quality degradation.
            </p>
            <p style={{ ...bodyText, margin: '0 0 8px 0' }}>
              <strong>Fix:</strong>{' '}
              <span style={inlineCode}>/compact</span> (summarize) or{' '}
              <span style={inlineCode}>/clear</span> (start fresh).
            </p>
            <p style={{ ...bodyText, margin: 0, color: C.muted, fontStyle: 'italic', fontSize: 11 }}>
              One focused task per session works best.
            </p>
          </div>
        </div>

        {/* ═══ RIGHT COLUMN ═══ */}
        <div>
          {/* ── Tool Overview ── */}
          <h2 style={sectionHeading}>Tool Overview</h2>
          <div style={{ ...sectionBox, padding: 0, overflow: 'hidden', marginBottom: 20 }}>
            {[
              { tool: 'File read/write', desc: 'Read any file, create new files, edit existing ones' },
              { tool: 'Bash/terminal', desc: 'Run commands: npm test, git status, curl, etc.' },
              { tool: 'Search', desc: 'Grep for patterns, glob for files, search entire codebase' },
              { tool: 'Browser', desc: 'Fetch web pages for documentation or API references' },
              { tool: 'MCP tools', desc: 'Connect to external services (covered Day 3)' },
            ].map((t, i) => (
              <div
                key={t.tool}
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'baseline',
                  padding: '9px 14px',
                  borderBottom: i < 4 ? `1px solid ${C.lightGray}` : 'none',
                }}
              >
                <span style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600, color: C.dark, minWidth: 90, flexShrink: 0 }}>
                  {t.tool}
                </span>
                <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.muted, lineHeight: 1.5 }}>
                  {t.desc}
                </span>
              </div>
            ))}
          </div>

          {/* ── Permission System ── */}
          <h2 style={sectionHeading}>Permission System</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            {[
              {
                mode: 'Suggest mode',
                desc: 'Proposes changes, waits for approval',
                tag: 'default',
                color: C.blue,
              },
              {
                mode: 'Auto-edit mode',
                desc: 'File edits automatic, terminal commands need approval',
                tag: null,
                color: C.green,
              },
              {
                mode: 'Full auto',
                desc: 'Everything runs automatically',
                tag: null,
                color: C.orange,
              },
            ].map((p) => (
              <div
                key={p.mode}
                style={{
                  background: C.cream,
                  border: `1px solid ${C.lightGray}`,
                  borderLeft: `3px solid ${p.color}`,
                  borderRadius: 6,
                  padding: '10px 14px',
                  display: 'flex',
                  gap: 10,
                  alignItems: 'baseline',
                }}
              >
                <span style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600, color: C.dark, flexShrink: 0 }}>
                  {p.mode}
                  {p.tag && (
                    <span
                      style={{
                        fontFamily: 'var(--mono)',
                        fontSize: 9,
                        fontWeight: 600,
                        color: p.color,
                        background: p.color + '14',
                        borderRadius: 3,
                        padding: '1px 5px',
                        marginLeft: 6,
                      }}
                    >
                      {p.tag}
                    </span>
                  )}
                </span>
                <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.muted, lineHeight: 1.5 }}>
                  {p.desc}
                </span>
              </div>
            ))}
          </div>

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
            <strong style={{ color: C.green }}>Tip:</strong>{' '}
            Start with default. Seeing what Claude wants to do before it does it helps you learn the agentic loop.
          </div>
        </div>
      </div>
    </MaterialLayout>
  );
}

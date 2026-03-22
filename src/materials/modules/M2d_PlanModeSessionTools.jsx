import MaterialLayout from '../components/MaterialLayout';

const C = {
  bg: '#faf9f5', dark: '#141413', orange: '#d97757', blue: '#6a9bcc',
  green: '#788c5d', gray: '#b0aea5', lightGray: '#e8e6dc', cream: '#f5f3ee',
  muted: '#6a685e', faint: '#b0aea5',
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

export default function M2d_PlanModeSessionTools() {
  return (
    <MaterialLayout
      id="M2d"
      title="Plan Mode & Session Tools"
      subtitle="Think before acting, manage your context"
      color={C.blue}
      category="Day 2"
      format="Quick Reference Card"
    >
      {/* ════════════ SINGLE PAGE ════════════ */}
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Left column */}
          <div>
            {/* Plan Mode */}
            <h2 style={sectionHeading}>Plan Mode</h2>
            <p style={{ ...bodyText, marginBottom: 12 }}>
              Tell Claude to analyze without making changes. Use the{' '}
              <span style={inlineCode}>plan:</span> prefix.
            </p>
            <div
              style={{
                background: C.bg,
                border: `1px solid ${C.lightGray}`,
                borderLeft: `3px solid ${C.blue}`,
                borderRadius: 4,
                padding: '12px 14px',
                marginBottom: 12,
              }}
            >
              <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.dark, lineHeight: 1.6, fontStyle: 'italic' }}>
                &ldquo;plan: Analyze this codebase and propose a TypeScript migration strategy.&rdquo;
              </div>
            </div>
            <p style={{ ...bodyText, marginBottom: 12 }}>
              Claude produces a detailed plan <strong>without</strong> editing files. Review it,
              give feedback, then execute.
            </p>
            <div
              style={{
                background: C.blue + '0a',
                border: `1px solid ${C.blue}25`,
                borderLeft: `3px solid ${C.blue}`,
                borderRadius: 6,
                padding: '12px 14px',
                marginBottom: 20,
              }}
            >
              <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.dark, lineHeight: 1.6 }}>
                Start complex tasks in Plan Mode. It builds trust and keeps you in control.
              </div>
            </div>

            {/* Session Management */}
            <h2 style={sectionHeading}>Session Management</h2>
            <p style={{ ...bodyText, marginBottom: 14 }}>
              One focused task per session. When you mix tasks, context fills with
              irrelevant code and quality drops.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { num: 1, text: 'Start with a clear task' },
                { num: 2, text: <>Use <span style={inlineCode}>/compact</span> every 15&ndash;20 min</> },
                { num: 3, text: <><span style={inlineCode}>/clear</span> or new session when switching tasks</> },
              ].map((step) => (
                <div
                  key={step.num}
                  style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-start',
                    background: C.cream,
                    border: `1px solid ${C.lightGray}`,
                    borderRadius: 6,
                    padding: '10px 14px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#fff',
                      background: C.blue,
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
                    {step.num}
                  </div>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.dark, lineHeight: 1.6 }}>
                    {step.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div>
            {/* Built-in Commands */}
            <h2 style={sectionHeading}>Built-in Commands</h2>
            <div style={sectionBox}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { cmd: '/compact', desc: 'Summarize conversation, free context space' },
                  { cmd: '/clear', desc: 'Reset entire context (start fresh)' },
                  { cmd: '/cost', desc: 'Show token usage and cost' },
                  { cmd: '/help', desc: 'Show available commands' },
                  { cmd: '/doctor', desc: 'Diagnose installation issues' },
                  { cmd: '/config', desc: 'View or modify settings' },
                ].map((item) => (
                  <div key={item.cmd} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                    <span style={{ ...inlineCode, flexShrink: 0, minWidth: 70 }}>{item.cmd}</span>
                    <span style={bodyText}>{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <h2 style={subHeading}>Keyboard Shortcuts</h2>
            <div style={{
              background: C.cream,
              border: `1px solid ${C.lightGray}`,
              borderRadius: 6,
              overflow: 'hidden',
            }}>
              {[
                { key: 'Esc', desc: 'Cancel current generation' },
                { key: 'Tab', desc: 'Accept suggestion' },
                { key: 'Up arrow', desc: 'Recall previous prompts' },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'baseline',
                    padding: '9px 16px',
                    borderBottom: i < 2 ? `1px solid ${C.lightGray}` : 'none',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 11,
                    fontWeight: 600,
                    color: C.dark,
                    minWidth: 80,
                    flexShrink: 0,
                  }}>
                    {item.key}
                  </span>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MaterialLayout>
  );
}

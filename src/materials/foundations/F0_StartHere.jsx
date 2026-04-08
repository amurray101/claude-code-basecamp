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

const bodyText = {
  fontFamily: 'var(--sans)',
  fontSize: 12,
  color: C.dark,
  lineHeight: 1.6,
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
  margin: '0 0 14px 0',
};

const sectionBox = {
  background: C.cream,
  border: `1px solid ${C.lightGray}`,
  borderRadius: 6,
  padding: '16px 18px',
  marginBottom: 16,
};

const checkbox = {
  width: 14,
  height: 14,
  border: `1.5px solid ${C.gray}`,
  borderRadius: 2,
  flexShrink: 0,
  marginTop: 2,
};

export default function F0_StartHere() {
  return (
    <MaterialLayout
      id="F0"
      title="Start Here"
      subtitle="Your first 10 minutes with Claude Code"
      color={C.orange}
      category="Foundations"
      format="Pocket Guide"
    >
      {/* ════════════ PAGE 1 ════════════ */}
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Left column */}
          <div>
            {/* The Shift */}
            <div
              style={{
                ...sectionBox,
                borderLeft: `4px solid ${C.orange}`,
              }}
            >
              <p style={{ ...bodyText, fontWeight: 500, margin: 0 }}>
                This isn&rsquo;t autocomplete. Claude Code reads your entire codebase, plans multi-step changes, edits files, runs tests, and fixes what breaks &mdash; autonomously. It operates at the <strong>project level</strong>, not the line level.
              </p>
            </div>

            {/* The Agentic Loop */}
            <h2 style={sectionHeading}>The Agentic Loop</h2>

            {/* Arrow visual */}
            <div
              style={{
                background: C.orange + '0a',
                border: `1px solid ${C.orange}25`,
                borderRadius: 6,
                padding: '10px 16px',
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
              }}
            >
              {['Read', 'Plan', 'Edit', 'Test', 'Iterate'].map((phase, i) => (
                <span key={phase} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: C.orange }}>{phase}</span>
                  {i < 4 && <span style={{ color: C.gray }}>&rarr;</span>}
                </span>
              ))}
            </div>
            <div style={{ textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 10, color: C.muted, marginBottom: 14 }}>
              &#x21A9; loops back from Iterate to Read
            </div>

            {/* Step descriptions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              {[
                { step: 'Read', desc: 'Scans codebase, reads relevant files' },
                { step: 'Plan', desc: 'Determines what to change and in what order' },
                { step: 'Edit', desc: 'Makes changes across one or more files' },
                { step: 'Test', desc: 'Runs tests, linters, or other verification' },
                { step: 'Iterate', desc: 'If tests fail, reads error, reasons, tries again' },
              ].map((s) => (
                <div
                  key={s.step}
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'baseline',
                    padding: '4px 0',
                  }}
                >
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: C.orange, minWidth: 44 }}>
                    {s.step}
                  </span>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.muted, lineHeight: 1.4 }}>
                    {s.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* Your First 5 Minutes */}
            <h2 style={subHeading}>Your First 5 Minutes</h2>
            <pre style={codeBlock}>
{`$ claude
> Reading project structure...
> Found: package.json, 14 routes, 89 tests
> Ready.

You: "Add a GET /health endpoint with tests"`}
            </pre>
            <p style={{ ...bodyText, fontSize: 11, color: C.muted, fontStyle: 'italic', margin: 0 }}>
              Claude reads before you ask. Give it one task. Watch the loop.
            </p>
          </div>

          {/* Right column */}
          <div>
            {/* How to Talk to It */}
            <div style={sectionBox}>
              <h2 style={subHeading}>How to Talk to It</h2>
              <p style={{ ...bodyText, fontSize: 11, color: C.muted, marginBottom: 10 }}>
                Minimum viable prompting &mdash; three rules:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { num: 1, rule: 'Describe the outcome, not the steps', example: '"Add JWT auth following existing middleware patterns" not "Create auth.js and write a function that..."' },
                  { num: 2, rule: 'Give context', example: '"The login endpoint returns 403 for valid tokens — trace the auth middleware and fix" not "Fix the bug"' },
                  { num: 3, rule: 'Iterate, don\u2019t restart', example: '"That\u2019s close but use the existing auth middleware instead" builds on context. Don\u2019t start a new session.' },
                ].map((r) => (
                  <div key={r.num} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div
                      style={{
                        fontFamily: 'var(--mono)',
                        fontSize: 12,
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
                      {r.num}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...bodyText, fontWeight: 600, marginBottom: 2 }}>{r.rule}</div>
                      <div style={{ fontFamily: 'var(--sans)', fontSize: 10, color: C.muted, lineHeight: 1.5, fontStyle: 'italic' }}>
                        {r.example}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Make It Yours: CLAUDE.md */}
            <div style={sectionBox}>
              <h2 style={subHeading}>Make It Yours: CLAUDE.md</h2>
              <pre style={{ ...codeBlock, margin: '0 0 10px 0' }}>
{`# Project: Meridian API
- Node.js + Express, TypeScript
- Tests: Jest + Supertest, run \`npm test\`
- Style: functional, no classes, async/await
- All routes follow patterns in src/routes/`}
              </pre>
              <p style={{ ...bodyText, fontSize: 11, color: C.muted, margin: 0 }}>
                Write once, Claude reads every session. This single file transforms generic output into code that matches your conventions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════ PAGE 2 ════════════ */}
      <div className="page-break-before" style={{ marginTop: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Left column */}
          <div>
            {/* Where It Runs */}
            <h2 style={sectionHeading}>Where It Runs</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {[
                { name: 'CLI', desc: 'Terminal — raw speed, full agentic autonomy' },
                { name: 'IDE Extensions', desc: 'VS Code, JetBrains — inline diffs, visual file tree' },
                { name: 'Desktop & Mobile', desc: 'Visual feedback, async workflows, on-call' },
                { name: 'Web (claude.ai)', desc: 'Zero install — demos, non-technical stakeholders' },
              ].map((s) => (
                <div
                  key={s.name}
                  style={{
                    background: C.cream,
                    border: `1px solid ${C.lightGray}`,
                    borderRadius: 6,
                    padding: '10px 14px',
                    display: 'flex',
                    gap: 10,
                    alignItems: 'baseline',
                  }}
                >
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600, color: C.dark, minWidth: 100, flexShrink: 0 }}>
                    {s.name}
                  </span>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.muted, lineHeight: 1.4 }}>
                    {s.desc}
                  </span>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.muted, fontStyle: 'italic', margin: '0 0 20px 0' }}>
              Same agentic engine. Match the surface to the audience.
            </p>

            {/* Three Traps */}
            <div
              style={{
                background: C.orange + '06',
                border: `1px solid ${C.orange}25`,
                borderRadius: 6,
                padding: '16px 18px',
              }}
            >
              <h2 style={{ ...subHeading, color: C.orange }}>Three Traps to Avoid</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  {
                    trap: 'Context Exhaustion',
                    desc: 'Quality degrades silently as the context window fills.',
                    fix: 'Use /compact to summarize or /clear to start fresh. One focused task per session.',
                  },
                  {
                    trap: 'Vague Prompts',
                    desc: '"Fix the bug" gives you a guess.',
                    fix: '"Login returns 403 for valid tokens \u2014 trace the auth middleware" gives you a fix.',
                  },
                  {
                    trap: 'Accepting Bad Output',
                    desc: 'Claude is not always right.',
                    fix: 'Say what\u2019s wrong and why: "That won\u2019t work because X \u2014 try Y instead." Correction makes it better.',
                  },
                ].map((t) => (
                  <div key={t.trap}>
                    <div style={{ ...bodyText, fontWeight: 600, marginBottom: 2 }}>{t.trap}</div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.muted, lineHeight: 1.5 }}>
                      {t.desc} <strong style={{ color: C.green }}>{t.fix}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div>
            {/* What It's Not */}
            <div
              style={{
                ...sectionBox,
                borderLeft: `4px solid ${C.green}`,
                marginBottom: 20,
              }}
            >
              <h2 style={subHeading}>What It&rsquo;s Not</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  'Not a replacement for code review. It writes code; humans approve it.',
                  'Not omniscient. It works with what it can see in your project and its context window.',
                  'Not deterministic. Same prompt can give different results. That\u2019s useful when iterating, but worth knowing.',
                ].map((line, i) => (
                  <div
                    key={i}
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: 12,
                      color: C.dark,
                      lineHeight: 1.5,
                      paddingLeft: 12,
                      borderLeft: `2px solid ${C.lightGray}`,
                    }}
                  >
                    {line}
                  </div>
                ))}
              </div>
              <p style={{ ...bodyText, fontSize: 11, color: C.green, fontStyle: 'italic', marginTop: 10, marginBottom: 0 }}>
                Honesty about limits builds trust.
              </p>
            </div>

            {/* Try It Now */}
            <div
              style={{
                background: C.cream,
                border: `1px solid ${C.lightGray}`,
                borderTop: `3px solid ${C.orange}`,
                borderRadius: 6,
                padding: '16px 18px',
              }}
            >
              <h2 style={subHeading}>Try It Now</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  'Open a terminal in any project directory',
                  'Run claude',
                  'Wait for it to read the codebase',
                  'Ask: "Explain the architecture of this project in 3 sentences"',
                  'Watch the Read \u2192 Plan \u2192 Respond cycle',
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={checkbox} />
                    <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.dark, lineHeight: 1.5 }}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 14,
                  padding: '10px 14px',
                  background: C.orange + '08',
                  borderRadius: 4,
                  fontFamily: 'var(--sans)',
                  fontSize: 11,
                  color: C.orange,
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                Next step: Day 1 lab &mdash; build something real.
              </div>
            </div>
          </div>
        </div>
      </div>
    </MaterialLayout>
  );
}

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
  padding: '1px 5px',
};

const sectionBox = {
  background: C.cream,
  border: `1px solid ${C.lightGray}`,
  borderRadius: 6,
  padding: '14px 16px',
  marginBottom: 14,
};

export default function M2b_PromptPatterns() {
  return (
    <MaterialLayout
      id="M2b"
      title="Prompt Patterns for Agentic Coding"
      subtitle="The art of steering multi-step workflows"
      color={C.blue}
      category="Day 2"
      format="Cheat Sheet"
    >
      {/* ════════════ FRONT ════════════ */}
      <div className="card-front">
        {/* Agentic Prompt Anatomy */}
        <div style={sectionBox}>
          <h2 style={sectionHeading}>Agentic Prompt Anatomy</h2>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 13,
              color: C.blue,
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            WHAT (outcome) + HOW (constraints &amp; conventions) + VERIFY (success criteria)
          </div>
          <div
            style={{
              background: C.bg,
              border: `1px solid ${C.lightGray}`,
              borderLeft: `3px solid ${C.blue}`,
              borderRadius: 4,
              padding: '12px 14px',
              fontFamily: 'var(--sans)',
              fontSize: 12,
              color: C.dark,
              lineHeight: 1.6,
              fontStyle: 'italic',
            }}
          >
            &ldquo;Refactor the auth module to use JWT{' '}
            <span style={{ color: C.blue, fontWeight: 600, fontStyle: 'normal' }}>[outcome]</span>.
            Keep the existing API contract stable{' '}
            <span style={{ color: C.blue, fontWeight: 600, fontStyle: 'normal' }}>[constraint]</span>.
            All tests pass, no new dependencies beyond jsonwebtoken{' '}
            <span style={{ color: C.blue, fontWeight: 600, fontStyle: 'normal' }}>[success criteria]</span>.&rdquo;
          </div>
        </div>

        {/* Anti-Patterns */}
        <div
          style={{
            background: '#fef6f4',
            border: `1px solid #e8c5bb`,
            borderLeft: `3px solid ${C.orange}`,
            borderRadius: 6,
            padding: '14px 16px',
            marginBottom: 16,
          }}
        >
          <h2 style={{ ...subHeading, color: C.orange }}>Anti-Patterns</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              {
                bad: '"Create a file called auth.js and write..."',
                fix: 'Too prescriptive. Let Claude plan.',
              },
              {
                bad: '"Do step 1, then step 2, then..."',
                fix: 'Micromanaging. Describe the destination, not the route.',
              },
              {
                bad: '"Fix the bug"',
                fix: 'Too vague. Describe symptoms, context, expected behavior.',
              },
              {
                bad: 'Refactor A, then add feature B, then fix bug C, then update README \u2014 all in one session',
                fix: 'Kitchen-sink session. Context overload. One job per session, or /compact between tasks.',
              },
              {
                bad: '"No, use TypeScript. Actually wait, make it async. Also change the naming..."',
                fix: 'Correction spiral. Rapid corrections degrade output. Start fresh with a clear, complete prompt.',
              },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: 11,
                    color: C.orange,
                    fontWeight: 600,
                    lineHeight: 1.5,
                  }}
                >
                  {a.bad}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: 11,
                    color: C.muted,
                    lineHeight: 1.5,
                    paddingLeft: 12,
                  }}
                >
                  &rarr; {a.fix}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Five Proven Patterns */}
        <h2 style={sectionHeading}>Five Proven Patterns</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            {
              num: 1,
              name: 'Migration',
              template: 'Migrate [system] from [old] to [new]. Maintain [invariant]. Verify with [test approach].',
              example: 'Migrate the payment module from Stripe v2 to v3. Maintain all existing webhook handlers. Run the integration test suite.',
            },
            {
              num: 2,
              name: 'Testing',
              template: 'Write [test type] for [module]. Cover [scenarios]. Use [framework]. Aim for [target].',
              example: 'Write integration tests for the orders API. Cover creation, cancellation, and refund flows. Use Jest + Supertest. Aim for 90% coverage.',
            },
            {
              num: 3,
              name: 'Debugging',
              template: '[Error description] when [trigger]. Trace across [scope]. Identify root cause and fix.',
              example: 'Intermittent 502 errors when orders service calls inventory. Trace HTTP client, retry logic, timeouts. Fix with proper error handling.',
            },
            {
              num: 4,
              name: 'Documentation',
              template: 'Generate [doc type] for [scope]. Include [elements]. Format as [output].',
              example: 'Generate onboarding docs for the codebase. Include architecture overview, setup guide, key patterns. Format as markdown.',
            },
            {
              num: 5,
              name: 'Refactor',
              template: 'Refactor [target] to [improve quality]. Preserve [constraint]. Verify [success criteria].',
              example: 'Refactor the notification service to use a plugin architecture. Preserve all existing notification channels. All tests pass.',
            },
          ].map((p) => (
            <div
              key={p.num}
              style={{
                background: C.cream,
                border: `1px solid ${C.lightGray}`,
                borderLeft: `3px solid ${C.blue}`,
                borderRadius: 4,
                padding: '10px 14px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  fontWeight: 600,
                  color: C.blue,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: 4,
                }}
              >
                {p.num}. {p.name}
              </div>
              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 11,
                  color: C.dark,
                  lineHeight: 1.5,
                  marginBottom: 4,
                }}
              >
                <strong>Template:</strong> &ldquo;{p.template}&rdquo;
              </div>
              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 11,
                  color: C.muted,
                  lineHeight: 1.5,
                  fontStyle: 'italic',
                }}
              >
                <strong style={{ fontStyle: 'normal' }}>Example:</strong> &ldquo;{p.example}&rdquo;
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════ BACK ════════════ */}
      <div className="card-back page-break-before" style={{ marginTop: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Left column */}
          <div>
            {/* The WHAT + HOW Pattern in Practice */}
            <h2 style={sectionHeading}>The WHAT + HOW Pattern</h2>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.muted, lineHeight: 1.6, marginBottom: 12 }}>
              Before/after comparisons from the Day 2 exercise. Same task, better prompt.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {[
                {
                  before: 'Refactor the helpers module',
                  after: 'Refactor src/utils/helpers.js to use async/await, add JSDoc comments, and co-locate tests. Follow the patterns in CLAUDE.md.',
                  why: 'WHAT (refactor helpers) + HOW (async/await, JSDoc, co-located tests, follow CLAUDE.md)',
                },
                {
                  before: 'Add a shipments endpoint',
                  after: 'Add a POST /api/shipments endpoint that creates a shipment record. Follow the same route patterns, validation, and error handling as the existing routes in src/routes/.',
                  why: 'WHAT (add endpoint) + HOW (match existing patterns) + VERIFY (implicit: tests pass)',
                },
              ].map((ex, i) => (
                <div
                  key={i}
                  style={{
                    background: C.cream,
                    border: `1px solid ${C.lightGray}`,
                    borderRadius: 6,
                    padding: '12px 14px',
                  }}
                >
                  <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.orange, marginBottom: 4 }}>
                    <strong>Before:</strong> &ldquo;{ex.before}&rdquo;
                  </div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.green, marginBottom: 6 }}>
                    <strong>After:</strong> &ldquo;{ex.after}&rdquo;
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: C.muted }}>
                    {ex.why}
                  </div>
                </div>
              ))}
            </div>

            {/* Command cross-reference */}
            <div style={{ fontFamily: 'var(--sans)', fontSize: 10, color: C.faint, marginBottom: 16, lineHeight: 1.6 }}>
              Command reference: see M1b (Command Glossary). Key commands for today: <span style={inlineCode}>/compact</span> (between tasks), <span style={inlineCode}>/clear</span> (new topic), <span style={inlineCode}>/cost</span> (check spend).
            </div>

            {/* Key Insight */}
            <div
              style={{
                background: C.cream,
                border: `1px solid ${C.lightGray}`,
                borderTop: `3px solid ${C.blue}`,
                borderRadius: 6,
                padding: '16px 18px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 10,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: C.blue,
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                Key Insight
              </div>
              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 12,
                  color: C.dark,
                  lineHeight: 1.65,
                  fontStyle: 'italic',
                }}
              >
                The best agentic prompts describe the destination, not the route. Give Claude the
                outcome you want, the constraints it must respect, and how to verify success &mdash;
                then let it plan the approach. You&rsquo;re the architect; Claude is the builder.
              </div>
            </div>
          </div>

          {/* Right column */}
          <div>
            {/* Session Workflow Checklist */}
            <h2 style={sectionHeading}>Session Workflow Checklist</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Start each session with a clear objective',
                <>Use <span style={inlineCode}>/compact</span> after completing a major step (don&rsquo;t let context bloat)</>,
                'Switch to Plan Mode for complex multi-step work before executing',
                <>Use <span style={inlineCode}>/clear</span> when switching to an unrelated task</>,
                <>Let CLAUDE.md carry persistent context &mdash; don&rsquo;t repeat it every session</>,
              ].map((item, i) => (
                <div
                  key={i}
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
                    {i + 1}
                  </div>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.dark, lineHeight: 1.6 }}>
                    {item}
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

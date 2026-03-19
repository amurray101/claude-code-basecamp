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

const loopSteps = ['Read', 'Plan', 'Edit', 'Test', 'Iterate'];

const stats = [
  { value: '72.7%+', label: 'SWE-bench Verified (Sonnet 4)' },
  { value: '200K\u20131M', label: 'Token context window' },
  { value: '2\u00d7', label: 'Code output per engineer (internal)' },
  { value: '46%', label: '\u201cMost loved\u201d AI coding tool (2026)' },
  { value: '~70%', label: 'Fortune 100 companies use Claude' },
  { value: '7 min', label: 'Median time to first agentic task' },
];

const surfaces = [
  {
    icon: '\u2588\u2588',
    name: 'CLI',
    desc: 'Full agentic autonomy. Best for power users, complex tasks, automation.',
  },
  {
    icon: '\u25a3',
    name: 'Desktop App',
    desc: 'Visual feedback. Best for onboarding, code review.',
  },
  {
    icon: '\u25c7',
    name: 'Mobile (iOS/Android)',
    desc: 'Async workflows. Best for on-call, idea capture.',
  },
  {
    icon: '\u25cb',
    name: 'Web (claude.ai)',
    desc: 'Zero install. Best for demos, non-technical stakeholders.',
  },
];

const personas = [
  {
    name: 'Software Engineer',
    tasks: 'Multi-file refactors, test generation, debugging',
  },
  {
    name: 'Data Scientist',
    tasks: 'ETL pipelines, SQL, visualizations, notebooks',
  },
  {
    name: 'DevOps',
    tasks: 'Terraform, K8s, CI/CD debugging, automation',
  },
  {
    name: 'Tech Lead',
    tasks: 'PR review, prototyping, ADRs, documentation',
  },
  {
    name: 'PM / Designer',
    tasks: 'Strategy, competitive analysis, prototyping',
  },
];

export default function F3a_ClaudeCodeGlance() {
  return (
    <MaterialLayout
      id="F3a"
      title="Claude Code at a Glance"
      subtitle="Everything you need in one card"
      color={C.orange}
      category="Foundations"
      format="Quick Reference Card"
    >
      {/* ── FRONT ── */}
      <div className="card-front">
        {/* Positioning line */}
        <div
          style={{
            background: C.cream,
            border: `1px solid ${C.lightGray}`,
            borderLeft: `4px solid ${C.orange}`,
            borderRadius: 6,
            padding: '14px 20px',
            marginBottom: 28,
          }}
        >
          <p
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 16,
              fontWeight: 400,
              color: C.dark,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Claude Code operates at the project level, not the line level.
          </p>
        </div>

        {/* The Agentic Loop */}
        <h2
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 18,
            fontWeight: 400,
            color: C.dark,
            margin: '0 0 16px 0',
          }}
        >
          The Agentic Loop
        </h2>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            marginBottom: 8,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {loopSteps.map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  background: i === 0 ? C.orange : C.cream,
                  color: i === 0 ? '#fff' : C.dark,
                  border: `1px solid ${i === 0 ? C.orange : C.lightGray}`,
                  borderRadius: 6,
                  padding: '10px 18px',
                  fontFamily: 'var(--mono)',
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: 'center',
                  minWidth: 70,
                }}
              >
                {step}
              </div>
              {i < loopSteps.length - 1 && (
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 18,
                    color: C.gray,
                    padding: '0 6px',
                  }}
                >
                  &rarr;
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Loop-back arrow */}
        <div
          style={{
            textAlign: 'center',
            fontFamily: 'var(--mono)',
            fontSize: 12,
            color: C.muted,
            marginBottom: 28,
          }}
        >
          &#x21A9; loops back from Iterate to Read
        </div>

        {/* Key Stats */}
        <h2
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 18,
            fontWeight: 400,
            color: C.dark,
            margin: '0 0 14px 0',
          }}
        >
          Key Stats
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 10,
            marginBottom: 28,
          }}
        >
          {stats.map((s) => (
            <div
              key={s.value}
              style={{
                background: C.cream,
                border: `1px solid ${C.lightGray}`,
                borderRadius: 6,
                padding: '14px 14px 12px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 20,
                  fontWeight: 700,
                  color: C.orange,
                  marginBottom: 4,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 11,
                  color: C.muted,
                  lineHeight: 1.4,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* The Differentiator */}
        <div
          style={{
            background: C.cream,
            border: `1px solid ${C.lightGray}`,
            borderLeft: `4px solid ${C.orange}`,
            borderRadius: 6,
            padding: '16px 20px',
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 15,
              fontWeight: 400,
              color: C.dark,
              margin: '0 0 8px 0',
            }}
          >
            The Differentiator
          </h3>
          <p
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 13,
              color: C.dark,
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Autocomplete tools suggest the next line. Claude Code reads your entire
            codebase, plans multi-step changes, edits files, runs tests, and fixes
            what breaks &mdash; autonomously.
          </p>
        </div>
      </div>

      {/* ── BACK ── */}
      <div className="card-back page-break-before" style={{ marginTop: 32 }}>
        {/* Four Surfaces */}
        <h2
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 18,
            fontWeight: 400,
            color: C.dark,
            margin: '0 0 14px 0',
          }}
        >
          Four Surfaces
        </h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            marginBottom: 28,
          }}
        >
          {surfaces.map((s) => (
            <div
              key={s.name}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                background: C.cream,
                border: `1px solid ${C.lightGray}`,
                borderRadius: 6,
                padding: '12px 16px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 16,
                  color: C.orange,
                  flexShrink: 0,
                  width: 24,
                  textAlign: 'center',
                  lineHeight: '20px',
                }}
              >
                {s.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.dark,
                    marginBottom: 2,
                  }}
                >
                  {s.name}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: 12,
                    color: C.muted,
                    lineHeight: 1.5,
                  }}
                >
                  {s.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Five Personas */}
        <h2
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 18,
            fontWeight: 400,
            color: C.dark,
            margin: '0 0 14px 0',
          }}
        >
          Five Personas
        </h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            marginBottom: 28,
          }}
        >
          {personas.map((p) => (
            <div
              key={p.name}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 12,
                padding: '8px 0',
                borderBottom: `1px solid ${C.lightGray}`,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.dark,
                  minWidth: 140,
                  flexShrink: 0,
                }}
              >
                {p.name}
              </div>
              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 12,
                  color: C.muted,
                  lineHeight: 1.5,
                }}
              >
                {p.tasks}
              </div>
            </div>
          ))}
        </div>

        {/* The Job-Fear Reframe */}
        <div
          style={{
            background: C.cream,
            border: `1px solid ${C.lightGray}`,
            borderLeft: `4px solid ${C.green}`,
            borderRadius: 6,
            padding: '16px 20px',
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 15,
              fontWeight: 400,
              color: C.dark,
              margin: '0 0 8px 0',
            }}
          >
            The Job-Fear Reframe
          </h3>
          <p
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 13,
              color: C.dark,
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Claude Code doesn&rsquo;t replace engineers &mdash; it removes the parts
            of their job they like least. Boilerplate, migration grunt work, chasing
            test failures. What&rsquo;s left is creative, high-judgment work.
          </p>
        </div>
      </div>
    </MaterialLayout>
  );
}

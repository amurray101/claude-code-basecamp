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

function TimingBadge({ seconds, color }) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: 'var(--mono)',
        fontSize: 11,
        fontWeight: 700,
        color: '#fff',
        background: color,
        borderRadius: 4,
        padding: '3px 10px 2px',
        marginRight: 10,
        verticalAlign: 'middle',
        letterSpacing: '0.02em',
      }}
    >
      {seconds}s
    </span>
  );
}

const audienceVariations = [
  {
    audience: 'For a CTO/VP Eng',
    advice:
      'Lead with 2\u00d7 output and enterprise deployment (Bedrock/Vertex). Emphasize security model.',
  },
  {
    audience: 'For a developer',
    advice:
      'Lead with the agentic loop demo. Show extended thinking. Let the product sell itself.',
  },
  {
    audience: 'For a skeptic',
    advice:
      'Acknowledge the concern, then show the multi-file refactor. Numbers second, demo first.',
  },
];

export default function F3b_SixtySecondPitch() {
  return (
    <MaterialLayout
      id="F3b"
      title="The 60-Second Pitch"
      subtitle="Your elevator pitch for Claude Code"
      color={C.orange}
      category="Foundations"
      format="Talk Track Script"
    >
      {/* ── Setup (10s) ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ marginBottom: 10 }}>
          <TimingBadge seconds={10} color={C.orange} />
          <h2
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 18,
              fontWeight: 400,
              color: C.dark,
              margin: 0,
              display: 'inline',
              verticalAlign: 'middle',
            }}
          >
            Setup
          </h2>
        </div>
        <div
          style={{
            background: C.cream,
            border: `1px solid ${C.lightGray}`,
            borderRadius: 6,
            padding: '16px 20px',
            fontFamily: 'var(--sans)',
            fontSize: 14,
            color: C.dark,
            lineHeight: 1.7,
            fontStyle: 'italic',
          }}
        >
          &ldquo;Most AI coding tools suggest the next line. Claude Code operates at
          the project level &mdash; it reads your entire codebase, plans multi-step
          changes, and executes them autonomously.&rdquo;
        </div>
      </div>

      {/* ── Proof (20s) ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ marginBottom: 10 }}>
          <TimingBadge seconds={20} color={C.blue} />
          <h2
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 18,
              fontWeight: 400,
              color: C.dark,
              margin: 0,
              display: 'inline',
              verticalAlign: 'middle',
            }}
          >
            Proof
          </h2>
        </div>
        <div
          style={{
            background: C.cream,
            border: `1px solid ${C.lightGray}`,
            borderRadius: 6,
            padding: '16px 20px',
            fontFamily: 'var(--sans)',
            fontSize: 14,
            color: C.dark,
            lineHeight: 1.7,
            fontStyle: 'italic',
          }}
        >
          &ldquo;When you say &lsquo;refactor the auth module to use JWT,&rsquo; it
          doesn&rsquo;t suggest a snippet. It reads fourteen files, plans the
          migration, creates the new module, updates every import, and runs your test
          suite &mdash; all in one loop. You watch it think through the problem in
          real time.&rdquo;
        </div>
      </div>

      {/* ── Numbers (15s) ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ marginBottom: 10 }}>
          <TimingBadge seconds={15} color={C.green} />
          <h2
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 18,
              fontWeight: 400,
              color: C.dark,
              margin: 0,
              display: 'inline',
              verticalAlign: 'middle',
            }}
          >
            Numbers
          </h2>
        </div>
        <p
          style={{
            fontFamily: 'var(--sans)',
            fontSize: 13,
            color: C.muted,
            margin: '0 0 12px 0',
            lineHeight: 1.5,
          }}
        >
          Pick 2&ndash;3 stats for your audience:
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {[
            {
              label: 'For technical',
              stats:
                '72.7% on SWE-bench, 200K\u20131M token context, reads your whole codebase',
            },
            {
              label: 'For business',
              stats:
                '~70% of Fortune 100, 2\u00d7 code output, ~$6/dev/day average cost',
            },
            {
              label: 'For skeptics',
              stats:
                '46% most loved AI coding tool, 7 minutes to first task, no lock-in',
            },
          ].map((row) => (
            <div
              key={row.label}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 12,
                padding: '8px 14px',
                background: C.cream,
                border: `1px solid ${C.lightGray}`,
                borderRadius: 6,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  fontWeight: 600,
                  color: C.green,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  minWidth: 100,
                  flexShrink: 0,
                }}
              >
                {row.label}
              </span>
              <span
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 13,
                  color: C.dark,
                  lineHeight: 1.5,
                }}
              >
                {row.stats}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Close (15s) ── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ marginBottom: 10 }}>
          <TimingBadge seconds={15} color={C.gray} />
          <h2
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 18,
              fontWeight: 400,
              color: C.dark,
              margin: 0,
              display: 'inline',
              verticalAlign: 'middle',
            }}
          >
            Close
          </h2>
        </div>
        <div
          style={{
            background: C.cream,
            border: `1px solid ${C.lightGray}`,
            borderRadius: 6,
            padding: '16px 20px',
            fontFamily: 'var(--sans)',
            fontSize: 14,
            color: C.dark,
            lineHeight: 1.7,
            fontStyle: 'italic',
          }}
        >
          &ldquo;It runs in the terminal, desktop app, phone, or browser &mdash;
          whichever fits your workflow. Most teams are productive in their first
          session. Want to see it work on your codebase?&rdquo;
        </div>
      </div>

      {/* ── Audience Variations sidebar ── */}
      <div
        style={{
          background: C.cream,
          border: `1px solid ${C.lightGray}`,
          borderTop: `3px solid ${C.orange}`,
          borderRadius: 6,
          padding: '20px 24px',
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 16,
            fontWeight: 400,
            color: C.dark,
            margin: '0 0 14px 0',
          }}
        >
          Audience Variations
        </h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {audienceVariations.map((v) => (
            <div key={v.audience}>
              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.dark,
                  marginBottom: 3,
                }}
              >
                {v.audience}
              </div>
              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 12,
                  color: C.muted,
                  lineHeight: 1.55,
                }}
              >
                {v.advice}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MaterialLayout>
  );
}

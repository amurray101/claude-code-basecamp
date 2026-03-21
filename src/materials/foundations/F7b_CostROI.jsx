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
  fontSize: 18,
  fontWeight: 400,
  color: C.dark,
  margin: '0 0 14px 0',
};

const monoLabel = {
  fontFamily: 'var(--mono)',
  fontSize: 10,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: C.muted,
};

const keyNumbers = [
  { value: '~$6/dev/day', label: 'Real-world average across all Claude Code usage' },
  { value: '$100\u2013200/dev/mo', label: 'Typical Sonnet usage for daily development' },
  { value: '90% of devs', label: 'Spend less than $12/day' },
];

const spendControls = [
  'Workspace-level limits in Anthropic Console',
  'Cloud provider budget controls (Bedrock/Vertex)',
  'Per-user rate limits configurable',
  'Model tiering reduces cost 40\u201360%',
];

const optimizations = [
  { action: 'Default to Sonnet', detail: 'for daily work (best value)' },
  { action: 'Drop to Haiku', detail: 'for CI/CD automation (10\u201320\u00d7 cheaper)' },
  { action: 'Escalate to Opus', detail: 'only for genuinely hard problems' },
  { action: 'Enable prompt caching', detail: '(90% reduction on repeated reads)' },
];

const napkinRows = [
  { label: 'Team size:', template: '___ developers' },
  { label: 'Daily cost:', template: '___ devs \u00d7 $6/day = $___/day' },
  { label: 'Time saved:', template: '___ hr/dev/day \u00d7 ___ devs = ___ hrs/day' },
  { label: 'Daily value:', template: '___ hrs \u00d7 $150/hr = $___/day' },
  { label: 'ROI:', template: '$___/day value \u00f7 $___/day cost = ___\u00d7' },
  { label: 'Monthly:', template: '$___/day \u00d7 22 days = $___/month' },
];

export default function F7b_CostROI() {
  return (
    <MaterialLayout
      id="F7b"
      title="Cost & ROI Pocket Math"
      subtitle="The numbers you need for every cost conversation"
      color={C.green}
      category="Foundations"
      format="Quick Reference Card"
    >
      {/* ── FRONT ── */}
      <div className="card-front">
        {/* Key Numbers */}
        <h2 style={sectionHeading}>Key Numbers</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 10,
            marginBottom: 28,
          }}
        >
          {keyNumbers.map((s) => (
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
                  color: C.green,
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

        {/* Pricing Models */}
        <h2 style={sectionHeading}>Pricing Models</h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              background: C.cream,
              border: `1px solid ${C.lightGray}`,
              borderRadius: 6,
              padding: '14px 18px',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--sans)',
                fontSize: 13,
                fontWeight: 600,
                color: C.dark,
                marginBottom: 4,
              }}
            >
              Pay-as-you-go (API / Cloud)
            </div>
            <div
              style={{
                fontFamily: 'var(--sans)',
                fontSize: 12,
                color: C.muted,
                lineHeight: 1.55,
              }}
            >
              Usage-based, no per-seat commitment. Bedrock, Vertex, Foundry billing.
            </div>
          </div>
          <div
            style={{
              background: C.cream,
              border: `1px solid ${C.lightGray}`,
              borderRadius: 6,
              padding: '14px 18px',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--sans)',
                fontSize: 13,
                fontWeight: 600,
                color: C.dark,
                marginBottom: 4,
              }}
            >
              Per-seat plans
            </div>
            <div
              style={{
                fontFamily: 'var(--sans)',
                fontSize: 12,
                color: C.muted,
                lineHeight: 1.55,
              }}
            >
              Teams at $150/seat/month (Premium). Enterprise pricing custom. Includes Claude.ai + Claude Code.
            </div>
          </div>
        </div>

        {/* Spend Controls */}
        <h2 style={sectionHeading}>Spend Controls</h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          {spendControls.map((item) => (
            <div
              key={item}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 10,
                padding: '8px 0',
                borderBottom: `1px solid ${C.lightGray}`,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  color: C.green,
                  flexShrink: 0,
                }}
              >
                &bull;
              </span>
              <span
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 12,
                  color: C.dark,
                  lineHeight: 1.5,
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── BACK ── */}
      <div className="card-back page-break-before" style={{ marginTop: 32 }}>
        {/* Worked ROI Example */}
        <div
          style={{
            background: C.cream,
            border: `1px solid ${C.lightGray}`,
            borderLeft: `4px solid ${C.orange}`,
            borderRadius: 6,
            padding: '20px 24px',
            marginBottom: 28,
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 17,
              fontWeight: 400,
              color: C.dark,
              margin: '0 0 14px 0',
            }}
          >
            Worked ROI Example
          </h2>
          <div
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 12,
              color: C.dark,
              lineHeight: 1.8,
            }}
          >
            <div style={{ marginBottom: 4 }}>
              <span style={{ ...monoLabel, textTransform: 'none', letterSpacing: 0 }}>Scenario:</span>{' '}
              200 developers, Sonnet usage
            </div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ ...monoLabel, textTransform: 'none', letterSpacing: 0 }}>Daily Claude Code cost:</span>{' '}
              200 devs &times; $6/day = <strong style={{ color: C.dark }}>$1,200/day</strong>
            </div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ ...monoLabel, textTransform: 'none', letterSpacing: 0 }}>Time saved:</span>{' '}
              1 hr/dev/day &times; 200 devs = <strong style={{ color: C.dark }}>200 hours/day</strong>
            </div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ ...monoLabel, textTransform: 'none', letterSpacing: 0 }}>Value at $150/hr fully-loaded:</span>{' '}
              200 hrs &times; $150 = <strong style={{ color: C.dark }}>$30,000/day</strong>
            </div>
            <div style={{ marginBottom: 4, fontSize: 11, color: C.muted }}>
              Monthly: $1,200/day &times; 22 days = $26,400/mo cost &nbsp;|&nbsp; $30,000/day &times; 22 = $660,000/mo value
            </div>
            <div
              style={{
                marginTop: 10,
                padding: '10px 14px',
                background: C.orange + '15',
                border: `1px solid ${C.orange}30`,
                borderRadius: 4,
                fontFamily: 'var(--mono)',
                fontSize: 14,
                fontWeight: 700,
                color: C.orange,
                textAlign: 'center',
              }}
            >
              ROI: $30,000 / $1,200 = 25&times; return
            </div>
          </div>
        </div>

        {/* Model Cost Optimization */}
        <h2 style={sectionHeading}>Model Cost Optimization</h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            marginBottom: 28,
          }}
        >
          {optimizations.map((opt) => (
            <div
              key={opt.action}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 10,
                padding: '8px 14px',
                background: C.cream,
                border: `1px solid ${C.lightGray}`,
                borderRadius: 6,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.dark,
                  flexShrink: 0,
                }}
              >
                {opt.action}
              </span>
              <span
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 12,
                  color: C.muted,
                  lineHeight: 1.5,
                }}
              >
                {opt.detail}
              </span>
            </div>
          ))}
        </div>

        {/* Back-of-Napkin Template */}
        <h2 style={sectionHeading}>Back-of-Napkin Template</h2>
        <div
          style={{
            background: C.cream,
            border: `1px solid ${C.lightGray}`,
            borderRadius: 6,
            padding: '18px 22px',
          }}
        >
          {napkinRows.map((row) => (
            <div
              key={row.label}
              className="fill-line"
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 10,
                padding: '10px 0',
                borderBottom: `1.5px solid ${C.lightGray}`,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.dark,
                  flexShrink: 0,
                  minWidth: 160,
                }}
              >
                {row.label}
              </span>
              <span
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 12,
                  color: C.muted,
                  flex: 1,
                }}
              >
                {row.template}
              </span>
            </div>
          ))}
        </div>
      </div>
    </MaterialLayout>
  );
}

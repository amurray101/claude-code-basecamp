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

const models = [
  {
    name: 'Haiku',
    tier: 'Speed tier',
    desc: 'Simple tasks, CI/CD, high-volume. 10\u201320\u00d7 cheaper than Opus.',
    color: C.green,
  },
  {
    name: 'Sonnet',
    tier: 'Default',
    desc: 'Multi-file refactors, debugging, architecture. Best balance.',
    color: C.blue,
  },
  {
    name: 'Opus',
    tier: 'Depth tier',
    desc: 'Novel architecture, complex debugging, deep reasoning.',
    color: C.orange,
  },
];

const tokenTypes = [
  {
    label: 'Input',
    desc: 'What Claude reads',
    color: C.blue,
  },
  {
    label: 'Output',
    desc: 'What Claude writes',
    color: C.green,
  },
  {
    label: 'Thinking',
    desc: 'Reasoning steps',
    color: C.orange,
  },
];

export default function F4_HowItThinks() {
  return (
    <MaterialLayout
      id="F4"
      title="How Claude Code Thinks"
      subtitle="Intelligence, context, models, and cost"
      color={C.blue}
      category="Foundations"
      format="Quick Reference Card"
    >
      {/* ── FRONT ── */}
      <div className="card-front">
        {/* Extended Thinking */}
        <h2
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 18,
            fontWeight: 400,
            color: C.dark,
            margin: '0 0 10px 0',
          }}
        >
          Extended Thinking
        </h2>
        <p
          style={{
            fontFamily: 'var(--sans)',
            fontSize: 13,
            color: C.dark,
            lineHeight: 1.65,
            margin: '0 0 14px 0',
          }}
        >
          Claude doesn&rsquo;t just generate code. It thinks first &mdash; analyzing
          the problem, considering approaches, anticipating edge cases, and planning
          before writing.
        </p>
        <div
          style={{
            background: C.cream,
            border: `1px solid ${C.lightGray}`,
            borderLeft: `4px solid ${C.blue}`,
            borderRadius: 6,
            padding: '14px 20px',
            marginBottom: 28,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              color: C.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 6,
            }}
          >
            Demo Moment
          </div>
          <p
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 13,
              color: C.dark,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            When a prospect sees Claude pause to think, break a problem into steps,
            then execute &mdash; that&rsquo;s when they stop comparing it to
            autocomplete.
          </p>
        </div>

        {/* Context Window */}
        <h2
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 18,
            fontWeight: 400,
            color: C.dark,
            margin: '0 0 10px 0',
          }}
        >
          Context Window
        </h2>
        <p
          style={{
            fontFamily: 'var(--sans)',
            fontSize: 13,
            color: C.dark,
            lineHeight: 1.65,
            margin: '0 0 12px 0',
          }}
        >
          200K tokens (Sonnet 4) &mdash; roughly 500+ files of source code.
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            marginBottom: 28,
          }}
        >
          {[
            {
              label: 'Prompt caching',
              detail: '90% cheaper, 85% faster',
            },
            {
              label: 'Smart file selection',
              detail: 'For large repos',
            },
          ].map((item) => (
            <div
              key={item.label}
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
                  fontFamily: 'var(--mono)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.blue,
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 12,
                  color: C.muted,
                }}
              >
                {item.detail}
              </span>
            </div>
          ))}
        </div>

        {/* Model Selection */}
        <h2
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 18,
            fontWeight: 400,
            color: C.dark,
            margin: '0 0 14px 0',
          }}
        >
          Model Selection
        </h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            border: `1px solid ${C.lightGray}`,
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          {models.map((m, i) => (
            <div
              key={m.name}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                padding: '14px 18px',
                background: i % 2 === 0 ? C.cream : C.bg,
                borderBottom:
                  i < models.length - 1 ? `1px solid ${C.lightGray}` : 'none',
              }}
            >
              <div
                style={{
                  width: 4,
                  height: 36,
                  background: m.color,
                  borderRadius: 2,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: 14,
                      fontWeight: 600,
                      color: C.dark,
                    }}
                  >
                    {m.name}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 10,
                      color: m.color,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {m.tier}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: 12,
                    color: C.muted,
                    lineHeight: 1.5,
                    marginTop: 3,
                  }}
                >
                  {m.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BACK ── */}
      <div className="card-back page-break-before" style={{ marginTop: 32 }}>
        {/* Cost Model */}
        <h2
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 18,
            fontWeight: 400,
            color: C.dark,
            margin: '0 0 14px 0',
          }}
        >
          Cost Model
        </h2>

        {/* Three token types */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            marginBottom: 16,
          }}
        >
          {tokenTypes.map((t) => (
            <div
              key={t.label}
              style={{
                flex: 1,
                background: C.cream,
                border: `1px solid ${C.lightGray}`,
                borderTop: `3px solid ${t.color}`,
                borderRadius: 6,
                padding: '12px 14px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 13,
                  fontWeight: 700,
                  color: t.color,
                  marginBottom: 3,
                }}
              >
                {t.label}
              </div>
              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 11,
                  color: C.muted,
                }}
              >
                {t.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Cost ranges */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            marginBottom: 28,
          }}
        >
          {[
            'Typical range: $50\u2013200/dev/month',
            '~$6/dev/day average',
            '90% of developers spend less than $12/day',
          ].map((line) => (
            <div
              key={line}
              style={{
                fontFamily: 'var(--sans)',
                fontSize: 13,
                color: C.dark,
                lineHeight: 1.5,
                paddingLeft: 14,
                borderLeft: `2px solid ${C.lightGray}`,
              }}
            >
              {line}
            </div>
          ))}
        </div>

        {/* ROI Math */}
        <div
          style={{
            background: C.cream,
            border: `1px solid ${C.lightGray}`,
            borderLeft: `4px solid ${C.green}`,
            borderRadius: 6,
            padding: '18px 22px',
            marginBottom: 28,
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 16,
              fontWeight: 400,
              color: C.dark,
              margin: '0 0 12px 0',
            }}
          >
            ROI Math
          </h3>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {[
              {
                label: '30 min saved/day',
                value: '= 10+ hours/month',
              },
              {
                label: 'At $150\u2013250/hr fully-loaded eng cost',
                value: '= $1,500\u20132,500/mo recovered',
              },
              {
                label: 'vs. $100\u2013200 Claude Code cost',
                value: '= 7.5\u201325\u00d7 ROI',
              },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: 12,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: 13,
                    color: C.dark,
                  }}
                >
                  {row.label}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.green,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Control Strategy */}
        <h2
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 18,
            fontWeight: 400,
            color: C.dark,
            margin: '0 0 12px 0',
          }}
        >
          Cost Control Strategy
        </h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            marginBottom: 28,
          }}
        >
          {[
            {
              strategy: 'Model tiering',
              detail: 'Sonnet default, Haiku for CI, Opus for hard problems',
            },
            {
              strategy: 'Prompt caching',
              detail: 'Dramatically reduces repeated context costs',
            },
            {
              strategy: 'Spend limits',
              detail: 'Workspace-level controls prevent surprise bills',
            },
          ].map((item) => (
            <div
              key={item.strategy}
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
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.blue,
                  minWidth: 110,
                  flexShrink: 0,
                }}
              >
                {item.strategy}
              </span>
              <span
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 12,
                  color: C.muted,
                  lineHeight: 1.5,
                }}
              >
                {item.detail}
              </span>
            </div>
          ))}
        </div>

        {/* Objection Response */}
        <div
          style={{
            background: C.cream,
            border: `1px solid ${C.orange}`,
            borderLeft: `4px solid ${C.orange}`,
            borderRadius: 6,
            padding: '18px 22px',
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
            Objection Response
          </h3>
          <p
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 12,
              color: C.orange,
              fontWeight: 600,
              margin: '0 0 8px 0',
              lineHeight: 1.4,
            }}
          >
            &lsquo;Worried about runaway costs?&rsquo;
          </p>
          <p
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 13,
              color: C.dark,
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Tiered model selection, workspace spend limits, and usage-based pricing
            mean you pay for value delivered. Compare to an engineering hire
            ($15&ndash;25K/mo), not a Copilot seat ($19/mo). Different category.
          </p>
        </div>
      </div>
    </MaterialLayout>
  );
}

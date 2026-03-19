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

/* ── Shared styles ── */
const sectionHeading = {
  fontFamily: 'var(--serif)',
  fontSize: 18,
  fontWeight: 400,
  color: C.dark,
  margin: '0 0 16px 0',
};

const monoLabel = {
  fontFamily: 'var(--mono)',
  fontSize: 10,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: C.muted,
};

const stackBox = {
  background: C.cream,
  border: `1px solid ${C.lightGray}`,
  borderRadius: 6,
  padding: '14px 16px',
  textAlign: 'center',
};

const connectorArrow = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '8px 0',
  color: C.gray,
  fontSize: 18,
  fontFamily: 'var(--sans)',
  userSelect: 'none',
};

export default function F2_AnthropicStack() {
  return (
    <MaterialLayout
      id="F2"
      title="The Anthropic Stack"
      subtitle="Platform map and model family"
      color={C.blue}
      category="Foundations"
      format="Quick Reference Card"
    >
      {/* ════════════ FRONT ════════════ */}
      <div className="card-front">
        <h2 style={sectionHeading}>Platform Map</h2>

        {/* ── Product surfaces (top row) ── */}
        <div style={{ ...monoLabel, marginBottom: 8 }}>Product Surfaces</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div style={stackBox}>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600, color: C.dark, marginBottom: 4 }}>
              Claude.ai
            </div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.muted, lineHeight: 1.5 }}>
              Chat &middot; Projects &middot; Skills
            </div>
          </div>
          <div style={{ ...stackBox, border: `2px solid ${C.orange}` }}>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600, color: C.dark, marginBottom: 4 }}>
              Claude Code
            </div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.muted, lineHeight: 1.5 }}>
              Agentic CLI &middot; Agent SDK
            </div>
          </div>
          <div style={stackBox}>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600, color: C.dark, marginBottom: 4 }}>
              API + SDKs
            </div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.muted, lineHeight: 1.5 }}>
              Custom applications
            </div>
          </div>
        </div>

        {/* Arrow connector */}
        <div style={connectorArrow}>&darr;</div>

        {/* ── Messages API ── */}
        <div
          style={{
            background: C.blue + '12',
            border: `1px solid ${C.blue}30`,
            borderRadius: 6,
            padding: '14px 20px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600, color: C.dark, marginBottom: 4 }}>
            Messages API
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: C.muted, lineHeight: 1.7 }}>
            Tool use &middot; Streaming &middot; Extended thinking &middot; Structured outputs &middot; Batch
          </div>
        </div>

        {/* Arrow connector */}
        <div style={connectorArrow}>&darr;</div>

        {/* ── Extension layer ── */}
        <div style={{ ...monoLabel, marginBottom: 8 }}>Extension Layer</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
          {[
            { name: 'MCP', desc: 'Tool discovery' },
            { name: 'Skills', desc: 'Packaged expertise' },
            { name: 'Projects', desc: 'Persistent context' },
            { name: 'Agent SDK', desc: 'Custom agents' },
          ].map((ext) => (
            <div key={ext.name} style={stackBox}>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 3 }}>
                {ext.name}
              </div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 10, color: C.muted }}>
                {ext.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Arrow connector */}
        <div style={connectorArrow}>&darr;</div>

        {/* ── Model tiers ── */}
        <div style={{ ...monoLabel, marginBottom: 8 }}>Model Tiers</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { name: 'Opus', desc: 'Deepest reasoning', color: C.orange },
            { name: 'Sonnet', desc: 'Best all-around', color: C.blue },
            { name: 'Haiku', desc: 'Fastest + cheapest', color: C.green },
          ].map((model) => (
            <div
              key={model.name}
              style={{
                ...stackBox,
                borderTop: `3px solid ${model.color}`,
              }}
            >
              <div style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600, color: C.dark, marginBottom: 3 }}>
                {model.name}
              </div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.muted }}>
                {model.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════ BACK ════════════ */}
      <div className="card-back page-break-before">
        {/* ── Model Comparison Table ── */}
        <h2 style={sectionHeading}>Model Comparison</h2>
        <div style={{ overflowX: 'auto', marginBottom: 28 }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: 'var(--sans)',
              fontSize: 12,
            }}
          >
            <thead>
              <tr>
                {['Model', 'Intelligence', 'Speed', 'Cost', 'Best For', 'Context Window'].map((h) => (
                  <th
                    key={h}
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 10,
                      fontWeight: 600,
                      color: C.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderBottom: `2px solid ${C.lightGray}`,
                      background: C.cream,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  model: 'Opus',
                  color: C.orange,
                  intelligence: 'Highest',
                  speed: 'Moderate',
                  cost: '$$$',
                  bestFor: 'Complex reasoning / research / architecture',
                  context: '200K',
                },
                {
                  model: 'Sonnet',
                  color: C.blue,
                  intelligence: 'High',
                  speed: 'Fast',
                  cost: '$$',
                  bestFor: 'Agentic coding / daily workflows / most deployments',
                  context: '200K',
                },
                {
                  model: 'Haiku',
                  color: C.green,
                  intelligence: 'Good',
                  speed: 'Fastest',
                  cost: '$',
                  bestFor: 'High-volume tasks / CI-CD / routing',
                  context: '200K',
                },
              ].map((row) => (
                <tr key={row.model}>
                  <td
                    style={{
                      padding: '10px 12px',
                      borderBottom: `1px solid ${C.lightGray}`,
                      fontWeight: 600,
                      color: row.color,
                    }}
                  >
                    {row.model}
                  </td>
                  <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.lightGray}`, color: C.dark }}>
                    {row.intelligence}
                  </td>
                  <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.lightGray}`, color: C.dark }}>
                    {row.speed}
                  </td>
                  <td
                    style={{
                      padding: '10px 12px',
                      borderBottom: `1px solid ${C.lightGray}`,
                      fontFamily: 'var(--mono)',
                      fontSize: 12,
                      color: C.dark,
                    }}
                  >
                    {row.cost}
                  </td>
                  <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.lightGray}`, color: C.muted, fontSize: 11 }}>
                    {row.bestFor}
                  </td>
                  <td
                    style={{
                      padding: '10px 12px',
                      borderBottom: `1px solid ${C.lightGray}`,
                      fontFamily: 'var(--mono)',
                      fontSize: 11,
                      color: C.dark,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {row.context}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Extension Layer Cheat Sheet ── */}
        <h2 style={{ ...sectionHeading, marginTop: 0 }}>Extension Layer Cheat Sheet</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {[
            {
              name: 'MCP',
              desc: 'Connects Claude to external services (Slack, GitHub, Jira, DBs). 1000+ pre-built connectors.',
            },
            {
              name: 'Skills',
              desc: 'Packaged procedural expertise. Pre-built + custom team workflows.',
            },
            {
              name: 'Projects',
              desc: 'Persistent context scoped to a use case. Custom instructions + reference docs.',
            },
            {
              name: 'Agent SDK',
              desc: 'Build custom agents. Multi-agent orchestration and specialized workflows.',
            },
          ].map((item) => (
            <div
              key={item.name}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'baseline',
                padding: '10px 14px',
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
                  color: C.blue,
                  minWidth: 72,
                  flexShrink: 0,
                }}
              >
                {item.name}
              </span>
              <span
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 12,
                  color: C.muted,
                  lineHeight: 1.5,
                }}
              >
                {item.desc}
              </span>
            </div>
          ))}
        </div>

        {/* ── Key Talking Point ── */}
        <div
          style={{
            background: C.blue + '0a',
            border: `1px solid ${C.blue}25`,
            borderLeft: `3px solid ${C.blue}`,
            borderRadius: 6,
            padding: '16px 20px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              fontWeight: 600,
              color: C.blue,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Key Talking Point
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
            Every surface talks to the same API. Claude.ai for non-technical users, API for
            custom apps, Claude Code for developers. The extensions compose across all surfaces.
          </p>
        </div>
      </div>
    </MaterialLayout>
  );
}

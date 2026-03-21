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

const bodyText = {
  fontFamily: 'var(--sans)',
  fontSize: 12,
  color: C.dark,
  lineHeight: 1.6,
};

const calloutBox = {
  background: C.cream,
  border: `1px solid ${C.orange}`,
  borderLeft: `4px solid ${C.orange}`,
  borderRadius: 6,
  padding: '14px 18px',
  marginBottom: 16,
};

const dimensions = [
  {
    dim: 'Interaction model',
    claude: 'Project-level agentic',
    copilot: 'Line-level autocomplete',
    cursor: 'File-level chat + edit',
    devin: 'Fully autonomous agent',
    advantage: true,
  },
  {
    dim: 'Context window',
    claude: '200K-1M tokens',
    copilot: '~8K tokens',
    cursor: '~100K tokens',
    devin: 'Varies',
    advantage: true,
  },
  {
    dim: 'Multi-file editing',
    claude: 'Full codebase',
    copilot: 'Limited',
    cursor: 'Good (within project)',
    devin: 'Full codebase',
    advantage: true,
  },
  {
    dim: 'Extended thinking',
    claude: 'Yes, visible',
    copilot: 'No',
    cursor: 'Limited',
    devin: 'Yes',
    advantage: true,
  },
  {
    dim: 'Terminal/CLI',
    claude: 'Native',
    copilot: 'No (IDE only)',
    cursor: 'No (IDE only)',
    devin: 'Web-based',
    advantage: true,
  },
  {
    dim: 'Enterprise security',
    claude: 'Defense-in-depth, managed settings',
    copilot: 'GitHub SSO',
    cursor: 'Basic',
    devin: 'Limited',
    advantage: true,
  },
  {
    dim: 'CI/CD integration',
    claude: 'GitHub Actions',
    copilot: 'GitHub native (deeper)',
    cursor: 'No',
    devin: 'API-based',
    advantage: false,
  },
  {
    dim: 'Pricing',
    claude: 'Usage-based (~$6/dev/day)',
    copilot: '$19-39/seat/month',
    cursor: '$20-40/seat/month',
    devin: '$500/month',
    advantage: false,
  },
];

const objections = [
  {
    objection: '"Copilot is cheaper."',
    response:
      'Copilot is $19-39/seat \u2014 Claude Code averages ~$6/dev/day ($120-180/month). Comparable cost, dramatically different capability. Copilot suggests lines; Claude Code executes multi-file refactors, runs tests, and debugs autonomously. Compare the value delivered, not the price tag.',
  },
  {
    objection: '"Cursor is more visual."',
    response:
      "Cursor is a great IDE. Claude Code is an agentic platform. It runs in the terminal, VS Code, JetBrains, desktop, mobile, and web. For teams that need CI/CD integration, headless automation, and enterprise security controls, Claude Code operates where Cursor can't.",
  },
  {
    objection: '"Devin is fully autonomous."',
    response:
      'Devin runs in a cloud sandbox \u2014 Claude Code runs in YOUR environment, with YOUR tools, on YOUR codebase. Developers maintain control and context. At $500/month vs ~$150/month, Claude Code delivers comparable autonomy at a fraction of the cost, with enterprise-grade security.',
  },
  {
    objection: '"We already use X."',
    response:
      "Most teams using Claude Code also use other tools. Claude Code isn't a replacement for autocomplete \u2014 it's a different category. Keep Copilot/Cursor for line-level suggestions. Use Claude Code for the project-level work that autocomplete can't touch: migrations, refactors, debugging, architecture.",
  },
];

const thStyle = {
  fontFamily: 'var(--mono)',
  fontSize: 10,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  padding: '8px 10px',
  textAlign: 'left',
  borderBottom: `2px solid ${C.dark}`,
};

const tdStyle = {
  fontFamily: 'var(--sans)',
  fontSize: 11,
  padding: '7px 10px',
  borderBottom: `1px solid ${C.lightGray}`,
  verticalAlign: 'top',
  lineHeight: 1.5,
};

export default function M4a_CompetitiveBattlecard() {
  return (
    <MaterialLayout
      id="M4a"
      title="Claude Code vs. Competition"
      subtitle="Know the landscape, win the conversation. Compare your role-play battlecard against this reference."
      color={C.orange}
      category="Day 4"
      format="Battlecard"
    >
      {/* ════════════ FRONT ════════════ */}
      <div className="card-front">
        <h2 style={sectionHeading}>Comparison Matrix</h2>
        <div style={{ overflowX: 'auto', marginBottom: 16 }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: '#fff',
              borderRadius: 6,
              overflow: 'hidden',
            }}
          >
            <thead>
              <tr style={{ background: C.cream }}>
                <th style={{ ...thStyle, width: '18%' }}>Dimension</th>
                <th style={{ ...thStyle, width: '22%', color: C.green }}>Claude Code</th>
                <th style={{ ...thStyle, width: '20%' }}>GitHub Copilot</th>
                <th style={{ ...thStyle, width: '20%' }}>Cursor</th>
                <th style={{ ...thStyle, width: '20%' }}>Devin</th>
              </tr>
            </thead>
            <tbody>
              {dimensions.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : C.cream }}>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{row.dim}</td>
                  <td
                    style={{
                      ...tdStyle,
                      background: row.advantage ? 'rgba(120,140,93,0.12)' : undefined,
                      fontWeight: row.advantage ? 600 : 400,
                      color: row.advantage ? C.green : C.dark,
                    }}
                  >
                    {row.claude}
                  </td>
                  <td style={tdStyle}>{row.copilot}</td>
                  <td style={tdStyle}>{row.cursor}</td>
                  <td style={tdStyle}>{row.devin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ════════════ BACK ════════════ */}
      <div className="card-back page-break-before" style={{ marginTop: 32 }}>
        <h2 style={sectionHeading}>Objection Responses</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
          {objections.map((obj, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                border: `1px solid ${C.lightGray}`,
                borderRadius: 6,
                padding: '14px 18px',
                borderLeft: `4px solid ${C.orange}`,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 14,
                  fontWeight: 400,
                  color: C.dark,
                  marginBottom: 8,
                }}
              >
                {obj.objection}
              </div>
              <div
                style={{
                  ...bodyText,
                  color: C.muted,
                  fontSize: 11,
                  lineHeight: 1.7,
                  paddingLeft: 12,
                  borderLeft: `2px solid ${C.lightGray}`,
                }}
              >
                {obj.response}
              </div>
            </div>
          ))}
        </div>

        {/* Competitive Reframe */}
        <div
          style={{
            background: C.cream,
            border: `1px solid ${C.blue}`,
            borderLeft: `4px solid ${C.blue}`,
            borderRadius: 6,
            padding: '14px 18px',
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: C.blue,
              marginBottom: 6,
            }}
          >
            Competitive Reframe
          </div>
          <div style={{ ...bodyText, color: C.muted, fontSize: 11, lineHeight: 1.7 }}>
            Compare to an engineering hire ($15&ndash;25K/month fully loaded), not a Copilot seat
            ($19/month). Different category, different value proposition. Claude Code doesn&rsquo;t
            do one thing faster &mdash; it does things that weren&rsquo;t possible before.
          </div>
        </div>

        {/* Closing Question */}
        <div style={calloutBox}>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: C.orange,
              marginBottom: 6,
            }}
          >
            Closing Question
          </div>
          <div style={{ ...bodyText, fontStyle: 'italic', color: C.muted }}>
            "When they say they already have a tool, ask: 'What's the biggest coding task your team keeps putting off because it's too complex or time-consuming?' That's Claude Code's sweet spot."
          </div>
        </div>
      </div>
    </MaterialLayout>
  );
}

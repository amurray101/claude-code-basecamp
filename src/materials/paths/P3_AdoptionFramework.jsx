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

const bodyText = {
  fontFamily: 'var(--sans)',
  fontSize: 12,
  color: C.dark,
  lineHeight: 1.6,
};

const listItem = {
  fontFamily: 'var(--sans)',
  fontSize: 11,
  color: C.dark,
  lineHeight: 1.5,
  marginBottom: 4,
};

const monoLabel = {
  fontFamily: 'var(--mono)',
  fontSize: 10,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: C.muted,
};

const branches = [
  {
    stage: 'Early-Stage',
    description: 'No AI tools in use',
    color: C.blue,
    timeline: '4\u20136 weeks to first value',
    budget: 'Start with pay-as-you-go API',
    approach: [
      'Week 1\u20132: Install + first use with 2\u20133 champions',
      'Week 3\u20134: CLAUDE.md + basic hooks',
      'Week 5\u20136: Measure time saved, present results',
    ],
    risk: 'Developer adoption',
    mitigation: 'mitigate with hands-on pairing',
    nextStep: 'Run a 2-week pilot with champion developers',
  },
  {
    stage: 'Growth',
    description: 'Some AI tools, evaluating Claude Code',
    color: C.green,
    timeline: '2\u20134 weeks to migration',
    budget: 'Per-seat plan or cloud provider billing',
    approach: [
      'Week 1: Side-by-side comparison with existing tool',
      'Week 2: CLAUDE.md + MCP integration',
      'Week 3\u20134: Expand to team, add hooks + managed settings',
    ],
    risk: 'Migration friction',
    mitigation: 'mitigate with \u201cuse alongside\u201d positioning',
    nextStep: 'Start with the team\u2019s most painful workflow',
  },
  {
    stage: 'Enterprise',
    description: 'Org-wide AI strategy',
    color: C.orange,
    timeline: '6\u201312 weeks to full deployment',
    budget: 'Enterprise agreement + cloud provider',
    approach: [
      'Week 1\u20134: Security review + pilot (3\u20135 devs)',
      'Week 5\u20138: Team expansion (25 devs) + integrations',
      'Week 9\u201312: Org rollout + managed settings + training',
    ],
    risk: 'Security/compliance',
    mitigation: 'mitigate with defense-in-depth walkthrough',
    nextStep: 'Schedule security team briefing + pilot kickoff',
  },
];

const assessmentQuestions = [
  'How many developers? What\u2019s their AI tool experience?',
  'What cloud provider? What security requirements?',
  'What\u2019s the biggest time sink in the dev workflow?',
  'Who needs to approve the purchase?',
  'What does success look like in 90 days?',
];

export default function P3_AdoptionFramework() {
  return (
    <MaterialLayout
      id="P3"
      title="Adoption Assessment Framework"
      subtitle="Solutions Architect: Map the adoption journey"
      color={C.green}
      category="Solutions Architect"
      format="Decision Tree"
      landscape={true}
    >
      <div className="print-landscape">
        {/* Starting Question */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              background: C.dark,
              color: '#fff',
              fontFamily: 'var(--serif)',
              fontSize: 16,
              fontWeight: 400,
              padding: '14px 28px',
              borderRadius: 8,
            }}
          >
            Where is the customer in their AI adoption journey?
          </div>
        </div>

        {/* Three Branches */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 16,
            marginBottom: 28,
          }}
        >
          {branches.map((branch) => (
            <div
              key={branch.stage}
              style={{
                border: `2px solid ${branch.color}`,
                borderRadius: 8,
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div
                style={{
                  background: branch.color,
                  padding: '12px 16px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--serif)',
                    fontSize: 16,
                    fontWeight: 400,
                    color: '#fff',
                  }}
                >
                  {branch.stage}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.8)',
                    marginTop: 2,
                  }}
                >
                  {branch.description}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '14px 16px' }}>
                {/* Timeline & Budget */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                    <span style={{ ...monoLabel, fontSize: 9, flexShrink: 0 }}>Timeline:</span>
                    <span style={{ ...bodyText, fontSize: 11 }}>{branch.timeline}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ ...monoLabel, fontSize: 9, flexShrink: 0 }}>Budget:</span>
                    <span style={{ ...bodyText, fontSize: 11 }}>{branch.budget}</span>
                  </div>
                </div>

                {/* Approach */}
                <div style={{ ...monoLabel, fontSize: 9, marginBottom: 4 }}>Approach</div>
                <ul style={{ margin: '0 0 10px 0', paddingLeft: 16 }}>
                  {branch.approach.map((step, i) => (
                    <li key={i} style={listItem}>{step}</li>
                  ))}
                </ul>

                {/* Key Risk */}
                <div
                  style={{
                    background: branch.color + '15',
                    border: `1px solid ${branch.color}30`,
                    borderRadius: 4,
                    padding: '8px 10px',
                    marginBottom: 10,
                  }}
                >
                  <div style={{ ...monoLabel, fontSize: 9, color: branch.color, marginBottom: 2 }}>
                    Key Risk
                  </div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.dark, lineHeight: 1.4 }}>
                    {branch.risk} ({branch.mitigation})
                  </div>
                </div>

                {/* Next Step */}
                <div
                  style={{
                    background: C.cream,
                    border: `1px solid ${C.lightGray}`,
                    borderRadius: 4,
                    padding: '8px 10px',
                  }}
                >
                  <div style={{ ...monoLabel, fontSize: 9, color: branch.color, marginBottom: 2 }}>
                    Next Step
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.dark,
                      lineHeight: 1.4,
                    }}
                  >
                    &ldquo;{branch.nextStep}&rdquo;
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Assessment Questions */}
        <div
          style={{
            background: C.cream,
            border: `1px solid ${C.green}`,
            borderLeft: `4px solid ${C.green}`,
            borderRadius: 6,
            padding: '14px 18px',
          }}
        >
          <div
            style={{
              ...monoLabel,
              fontWeight: 600,
              color: C.green,
              marginBottom: 8,
            }}
          >
            Assessment Questions
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px 24px',
            }}
          >
            {assessmentQuestions.map((q, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 10,
                    color: C.green,
                    flexShrink: 0,
                  }}
                >
                  &bull;
                </span>
                <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.dark, lineHeight: 1.5 }}>
                  {q}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MaterialLayout>
  );
}

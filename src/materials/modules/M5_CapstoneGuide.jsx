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

const listItem = {
  fontFamily: 'var(--sans)',
  fontSize: 12,
  color: C.dark,
  lineHeight: 1.6,
  marginBottom: 6,
};

const monoLabel = {
  fontFamily: 'var(--mono)',
  fontSize: 10,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: C.muted,
};

const timelineSteps = [
  { duration: '15 min', task: 'Read the blind brief + analyze', color: C.blue },
  { duration: '5 min', task: 'Plan your 3\u20134 demo moments (before building)', color: C.green },
  { duration: '45 min', task: 'Architect + build working demo with Claude Code', color: C.orange },
  { duration: '10 min', task: 'Prepare and rehearse presentation', color: C.gray },
  { duration: '10 min', task: 'Present to cohort + Q&A', color: C.dark },
];

const presentationStructure = [
  { step: 1, name: 'Their Problem', time: '2 min', detail: 'Customer situation, industry, pain points \u2014 start with their world, not your solution' },
  { step: 2, name: 'Live Demo', time: '6 min', detail: 'Working Claude Code demo on their use case \u2014 3\u20134 moments max, show extended thinking' },
  { step: 3, name: 'Next Steps', time: '2 min', detail: 'Rollout plan, cost estimate, pilot proposal \u2014 end with a specific ask' },
];

const scoringCriteria = [
  { criterion: 'Problem framing (25%)', question: 'Did they understand and articulate the customer\u2019s problem?' },
  { criterion: 'Technical depth (25%)', question: 'Was the demo technically sound and working?' },
  { criterion: 'Relevance to brief (25%)', question: 'Did the solution address the specific customer brief?' },
  { criterion: 'Confidence under Q&A (25%)', question: 'Did they handle questions with poise and accuracy?' },
];

const materialsIndex = [
  { question: 'What is Claude Code?', ref: 'F3a', card: 'Claude Code at a Glance' },
  { question: 'How does it work technically?', ref: 'F4', card: 'How Claude Code Thinks' },
  { question: 'Is it secure?', ref: 'F6a', card: 'Security Objection Handler' },
  { question: 'How does it compare to X?', ref: 'M4a', card: 'Competitive Battlecard' },
  { question: 'What does it cost?', ref: 'F7b', card: 'Cost & ROI Pocket Math' },
  { question: 'How do we deploy it?', ref: 'F7a', card: 'Deployment Path Finder' },
  { question: 'How do we configure it?', ref: 'F5', card: 'Configuration & Customization' },
  { question: 'How do I write good prompts?', ref: 'M2b', card: 'Prompt Patterns' },
  { question: 'What integrations are available?', ref: 'M3', card: 'Integration Patterns' },
  { question: 'How do I run the demo?', ref: 'M1', card: 'Install & First Run' },
];

const presentationTips = [
  'Start with the customer\u2019s problem, not your solution',
  'Demo on THEIR use case \u2014 never a generic example',
  'Show extended thinking \u2014 it\u2019s your best demo moment',
  'Have F6a ready when security comes up (it always does)',
  'End with a specific ask \u2014 \u201cHere\u2019s what I recommend as a next step\u201d',
  'Be honest about limitations \u2014 trust is worth more than a close',
];

export default function M5_CapstoneGuide() {
  return (
    <MaterialLayout
      id="M5"
      title="Capstone Presentation Guide"
      subtitle="Your Day 5 reference card"
      color={C.green}
      category="Day 5"
      format="Quick Reference Card"
    >
      {/* ════════════ FRONT ════════════ */}
      <div className="card-front">
        {/* Timebox Framework */}
        <h2 style={sectionHeading}>Timebox Framework</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 24 }}>
          {timelineSteps.map((step, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderLeft: `4px solid ${step.color}`,
                background: i % 2 === 0 ? C.cream : 'transparent',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 13,
                  fontWeight: 700,
                  color: step.color,
                  minWidth: 60,
                  flexShrink: 0,
                }}
              >
                {step.duration}
              </span>
              <span style={{ ...bodyText, flex: 1 }}>{step.task}</span>
            </div>
          ))}
        </div>

        {/* Presentation Structure */}
        <h2 style={sectionHeading}>Presentation Structure</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {presentationStructure.map((item) => (
            <div
              key={item.step}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 12,
                padding: '10px 14px',
                background: C.cream,
                border: `1px solid ${C.lightGray}`,
                borderRadius: 6,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 14,
                  fontWeight: 700,
                  color: C.green,
                  flexShrink: 0,
                  width: 20,
                  textAlign: 'center',
                }}
              >
                {item.step}
              </span>
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.dark,
                  }}
                >
                  {item.name}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 10,
                    color: C.muted,
                    marginLeft: 8,
                  }}
                >
                  ({item.time})
                </span>
                <div style={{ ...bodyText, color: C.muted, marginTop: 2 }}>{item.detail}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Scoring Criteria */}
        <h2 style={sectionHeading}>Scoring Criteria</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {scoringCriteria.map((item) => (
            <div
              key={item.criterion}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 12,
                padding: '8px 14px',
                borderBottom: `1px solid ${C.lightGray}`,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.dark,
                  flexShrink: 0,
                  minWidth: 140,
                }}
              >
                {item.criterion}
              </span>
              <span
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 12,
                  color: C.muted,
                  lineHeight: 1.5,
                }}
              >
                {item.question}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════ BACK ════════════ */}
      <div className="card-back page-break-before" style={{ marginTop: 32 }}>
        {/* Materials Index */}
        <h2 style={sectionHeading}>Materials Index &mdash; Which card do I need?</h2>
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto',
              gap: 0,
              border: `1px solid ${C.lightGray}`,
              borderRadius: 6,
              overflow: 'hidden',
            }}
          >
            {/* Header row */}
            <div
              style={{
                ...monoLabel,
                fontWeight: 600,
                padding: '8px 12px',
                background: C.dark,
                color: C.lightGray,
              }}
            >
              Question
            </div>
            <div
              style={{
                ...monoLabel,
                fontWeight: 600,
                padding: '8px 12px',
                background: C.dark,
                color: C.lightGray,
                textAlign: 'center',
              }}
            >
              Ref
            </div>
            <div
              style={{
                ...monoLabel,
                fontWeight: 600,
                padding: '8px 12px',
                background: C.dark,
                color: C.lightGray,
              }}
            >
              Card
            </div>

            {/* Data rows */}
            {materialsIndex.map((row, i) => (
              <>
                <div
                  key={`q-${i}`}
                  style={{
                    ...bodyText,
                    padding: '7px 12px',
                    background: i % 2 === 0 ? C.cream : 'transparent',
                    borderBottom: `1px solid ${C.lightGray}`,
                  }}
                >
                  &ldquo;{row.question}&rdquo;
                </div>
                <div
                  key={`r-${i}`}
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.green,
                    padding: '7px 12px',
                    textAlign: 'center',
                    background: i % 2 === 0 ? C.cream : 'transparent',
                    borderBottom: `1px solid ${C.lightGray}`,
                  }}
                >
                  {row.ref}
                </div>
                <div
                  key={`c-${i}`}
                  style={{
                    ...bodyText,
                    color: C.muted,
                    padding: '7px 12px',
                    background: i % 2 === 0 ? C.cream : 'transparent',
                    borderBottom: `1px solid ${C.lightGray}`,
                  }}
                >
                  {row.card}
                </div>
              </>
            ))}
          </div>
        </div>

        {/* Presentation Tips */}
        <h2 style={sectionHeading}>Presentation Tips</h2>
        <div
          style={{
            background: C.cream,
            border: `1px solid ${C.green}`,
            borderLeft: `4px solid ${C.green}`,
            borderRadius: 6,
            padding: '14px 18px',
          }}
        >
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {presentationTips.map((tip, i) => (
              <li key={i} style={listItem}>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MaterialLayout>
  );
}

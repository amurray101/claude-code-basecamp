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

const monoLabel = {
  fontFamily: 'var(--mono)',
  fontSize: 10,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: C.muted,
};



const evalPhases = [
  {
    phase: 1,
    name: 'Pre-call',
    time: '15 min',
    tasks: 'Research customer\u2019s tech stack, prepare relevant demo, load CLAUDE.md for their framework',
  },
  {
    phase: 2,
    name: 'Discovery',
    time: '10 min',
    tasks: 'Understand team size, cloud provider, security requirements, current tools, biggest pain points',
  },
  {
    phase: 3,
    name: 'Live Demo',
    time: '20 min',
    tasks: 'Multi-file refactor on similar codebase, show extended thinking, customize CLAUDE.md live',
  },
  {
    phase: 4,
    name: 'Architecture',
    time: '10 min',
    tasks: 'Deployment recommendation (Bedrock/Vertex/Foundry), integration points, security walkthrough',
  },
  {
    phase: 5,
    name: 'Close',
    time: '5 min',
    tasks: 'Pilot proposal, timeline, champion identification',
  },
];

const demoScript = [
  { cue: 'Open Claude Code', narration: 'Let me show you this on a codebase similar to yours.' },
  { cue: 'First prompt', narration: 'Watch what happens \u2014 it reads the codebase first, then plans.' },
  { cue: 'During thinking', narration: 'This is extended thinking. It\u2019s analyzing your architecture before making changes.' },
  { cue: 'During execution', narration: 'It\u2019s editing multiple files, maintaining consistency across the codebase.' },
  { cue: 'After completion', narration: 'One prompt. It understood the codebase, made the change, ran the tests.' },
  { cue: 'CLAUDE.md moment', narration: 'Now watch what happens when we add context about your conventions.' },
];

const objectionMatrix = [
  { objection: 'Is it secure?', response: 'Defense-in-depth model, 5 layers', ref: 'F6a' },
  { objection: 'Too expensive', response: '~$6/dev/day, compare to eng hire', ref: 'F7b' },
  { objection: 'We use Copilot', response: 'Different category (line vs project)', ref: 'M4a' },
  { objection: 'Our devs won\u2019t use it', response: '7 min to first task, 46% most loved', ref: 'F3a' },
  { objection: 'Can it handle our codebase?', response: '200K\u20131M tokens, smart file selection', ref: 'F4' },
  { objection: 'What about data privacy?', response: 'Opt-out training, cloud deployment', ref: 'F6a' },
];

export default function P1_PreSalesPlaybook() {
  return (
    <MaterialLayout
      id="P1"
      title="Technical Evaluation Playbook"
      subtitle="PE Pre-Sales: Guide technical evaluations that close"
      color={C.orange}
      category="PE Pre-Sales"
      format="Talk Track Script"
    >
      {/* ════════════ PAGE 1 ════════════ */}
      <div>
        {/* Evaluation Structure */}
        <h2 style={sectionHeading}>Evaluation Structure</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {evalPhases.map((phase) => (
            <div
              key={phase.phase}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '10px 14px',
                background: C.cream,
                border: `1px solid ${C.lightGray}`,
                borderRadius: 6,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 18,
                  fontWeight: 700,
                  color: C.orange,
                  flexShrink: 0,
                  width: 24,
                  textAlign: 'center',
                  lineHeight: 1,
                  marginTop: 2,
                }}
              >
                {phase.phase}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                  <span
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.dark,
                    }}
                  >
                    {phase.name}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 10,
                      color: C.muted,
                    }}
                  >
                    ({phase.time})
                  </span>
                </div>
                <div style={{ ...bodyText, color: C.muted }}>{phase.tasks}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Demo Script with Narration Cues */}
        <h2 style={sectionHeading}>Demo Script with Narration Cues</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {demoScript.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '8px 14px',
                borderLeft: `3px solid ${C.orange}`,
                background: i % 2 === 0 ? C.cream : 'transparent',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 10,
                  fontWeight: 600,
                  color: C.orange,
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  flexShrink: 0,
                  minWidth: 110,
                  marginTop: 2,
                }}
              >
                {item.cue}
              </span>
              <span
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 12,
                  color: C.dark,
                  lineHeight: 1.6,
                  fontStyle: 'italic',
                }}
              >
                &ldquo;{item.narration}&rdquo;
              </span>
            </div>
          ))}
        </div>

        {/* Reference Architecture Template */}
        <h2 style={sectionHeading}>Reference Architecture Template</h2>
        <div
          style={{
            background: C.dark,
            borderRadius: 6,
            padding: '16px 20px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: C.orange,
              marginBottom: 10,
            }}
          >
            Deployment Recommendation
          </div>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 11,
              color: C.lightGray,
              lineHeight: 2,
            }}
          >
            <div>
              <span style={{ color: C.faint }}>Cloud:</span> [Provider] &rarr; [Bedrock/Vertex/Foundry]
            </div>
            <div>
              <span style={{ color: C.faint }}>Auth:</span> [IAM/WIF/Azure AD]
            </div>
            <div>
              <span style={{ color: C.faint }}>CI/CD:</span> GitHub Actions + claude-code-action
            </div>
            <div>
              <span style={{ color: C.faint }}>Security:</span> Managed settings + hooks + permissions
            </div>
            <div>
              <span style={{ color: C.faint }}>Rollout:</span> Phase 1 (3-5 devs, 2 weeks) &rarr; Phase 2 &rarr; Phase 3
            </div>
          </div>
        </div>
      </div>

      {/* ════════════ PAGE 2 ════════════ */}
      <div className="page-break-before" style={{ marginTop: 32 }}>
        {/* Objection Matrix */}
        <h2 style={sectionHeading}>Objection Matrix</h2>
        <div
          style={{
            border: `1px solid ${C.lightGray}`,
            borderRadius: 6,
            overflow: 'hidden',
            marginBottom: 28,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.4fr auto',
              background: C.dark,
            }}
          >
            <div style={{ ...monoLabel, fontWeight: 600, padding: '8px 12px', color: C.lightGray }}>
              Objection
            </div>
            <div style={{ ...monoLabel, fontWeight: 600, padding: '8px 12px', color: C.lightGray }}>
              Key Response
            </div>
            <div
              style={{
                ...monoLabel,
                fontWeight: 600,
                padding: '8px 12px',
                color: C.lightGray,
                textAlign: 'center',
              }}
            >
              Ref
            </div>
          </div>

          {/* Rows */}
          {objectionMatrix.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.4fr auto',
                borderBottom: `1px solid ${C.lightGray}`,
                background: i % 2 === 0 ? C.cream : 'transparent',
              }}
            >
              <div
                style={{
                  ...bodyText,
                  fontWeight: 600,
                  padding: '8px 12px',
                }}
              >
                &ldquo;{row.objection}&rdquo;
              </div>
              <div style={{ ...bodyText, color: C.muted, padding: '8px 12px' }}>
                {row.response}
              </div>
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.orange,
                  padding: '8px 12px',
                  textAlign: 'center',
                }}
              >
                {row.ref}
              </div>
            </div>
          ))}
        </div>

        {/* Close Templates */}
        <h2 style={sectionHeading}>Close Templates</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div
            style={{
              background: C.cream,
              border: `1px solid ${C.lightGray}`,
              borderLeft: `4px solid ${C.orange}`,
              borderRadius: 6,
              padding: '14px 18px',
            }}
          >
            <div
              style={{
                ...monoLabel,
                fontWeight: 600,
                color: C.orange,
                marginBottom: 6,
              }}
            >
              Pilot Close
            </div>
            <div style={{ ...bodyText, fontStyle: 'italic', color: C.muted }}>
              &ldquo;Let&apos;s start with 3-5 developers for two weeks. We&apos;ll set up [deployment], write the initial CLAUDE.md, and connect one integration.&rdquo;
            </div>
          </div>

          <div
            style={{
              background: C.cream,
              border: `1px solid ${C.lightGray}`,
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
                marginBottom: 6,
              }}
            >
              Expansion Close
            </div>
            <div style={{ ...bodyText, fontStyle: 'italic', color: C.muted }}>
              &ldquo;Based on the pilot data, here&apos;s what org-wide looks like: [cost], [deployment], [timeline].&rdquo;
            </div>
          </div>

          <div
            style={{
              background: C.cream,
              border: `1px solid ${C.lightGray}`,
              borderLeft: `4px solid ${C.blue}`,
              borderRadius: 6,
              padding: '14px 18px',
            }}
          >
            <div
              style={{
                ...monoLabel,
                fontWeight: 600,
                color: C.blue,
                marginBottom: 6,
              }}
            >
              Security Close
            </div>
            <div style={{ ...bodyText, fontStyle: 'italic', color: C.muted }}>
              &ldquo;I&apos;ll send our Trust Center links and can arrange a security team briefing. What&apos;s the best way to loop in your CISO&apos;s team?&rdquo;
            </div>
          </div>
        </div>
      </div>
    </MaterialLayout>
  );
}

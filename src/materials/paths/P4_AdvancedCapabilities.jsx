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

const sectionBox = {
  background: C.cream,
  border: `1px solid ${C.lightGray}`,
  borderRadius: 6,
  padding: '16px 18px',
  marginBottom: 16,
};

const codeBlock = {
  fontFamily: 'var(--mono)',
  fontSize: 11,
  lineHeight: 1.6,
  color: '#e8e6dc',
  background: C.dark,
  borderRadius: 6,
  padding: '14px 16px',
  whiteSpace: 'pre',
  overflowX: 'auto',
  margin: '0 0 18px 0',
};

const coreComponents = [
  { name: 'Agent Loop', desc: 'The main execution cycle (observe \u2192 think \u2192 act \u2192 evaluate)', color: C.orange },
  { name: 'Tool Definitions', desc: 'Custom tools the agent can use (file I/O, API calls, shell)', color: C.blue },
  { name: 'Memory', desc: 'Short-term (conversation) + long-term (persistent state)', color: C.green },
  { name: 'Orchestrator', desc: 'Multi-agent coordination and task delegation', color: C.gray },
];

const evalPatterns = [
  { name: 'Benchmark suite', desc: 'Run Claude Code against known tasks, measure success rate' },
  { name: 'A/B testing', desc: 'Compare model versions / prompt strategies on same tasks' },
  { name: 'Regression testing', desc: 'Ensure model updates don\u2019t break existing capabilities' },
  { name: 'Quality scoring', desc: 'Automated code review scoring on Claude\u2019s outputs' },
];

const strengths = [
  'Multi-file reasoning',
  'Test generation',
  'Refactoring',
  'Debugging',
  'Documentation',
];

const growingEdges = [
  'Very large monorepos (>1M lines)',
  'Real-time collaboration',
  'Visual/UI design from scratch',
];

const notSuited = [
  'Production runtime decisions',
  'Security-critical code without review',
  'Replacing human architecture judgment',
];

const researchPoints = [
  { area: 'Model fine-tuning feedback', detail: 'Use eval pipeline outputs to inform training priorities' },
  { area: 'Prompt engineering research', detail: 'Systematic testing of prompt patterns on real codebases' },
  { area: 'Tool use optimization', detail: 'Analyze which tool calls are most/least effective' },
  { area: 'Context utilization', detail: 'Study how effectively Claude uses long context windows' },
  { area: 'Safety research', detail: 'Test adversarial inputs, measure guardrail effectiveness' },
];

const bringBack = [
  'Eval pipeline results showing capability gaps',
  'Customer use cases that push model boundaries',
  'Tool use patterns that could be optimized at the model level',
  'Safety edge cases discovered during deployment',
  'Feature requests that require model-level changes',
];

export default function P4_AdvancedCapabilities() {
  return (
    <MaterialLayout
      id="P4"
      title="Advanced Capabilities & Agent SDK"
      subtitle="Applied Research: Deep dive into what's possible"
      color={C.gray}
      category="Applied Research"
      format="Cheat Sheet"
    >
      {/* ════════════ PAGE 1 ════════════ */}
      <div>
        {/* Agent SDK Architecture */}
        <h2 style={sectionHeading}>Agent SDK Architecture</h2>

        {/* Core Components Diagram */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            marginBottom: 16,
          }}
        >
          {coreComponents.map((comp) => (
            <div
              key={comp.name}
              style={{
                border: `2px solid ${comp.color}`,
                borderRadius: 6,
                padding: '12px 14px',
                background: comp.color + '0a',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  fontWeight: 700,
                  color: comp.color,
                  marginBottom: 4,
                }}
              >
                {comp.name}
              </div>
              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 11,
                  color: C.muted,
                  lineHeight: 1.4,
                }}
              >
                {comp.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Key APIs and Languages */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div style={sectionBox}>
            <div style={{ ...monoLabel, marginBottom: 6 }}>Key APIs</div>
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 11,
                color: C.dark,
                lineHeight: 1.8,
              }}
            >
              Agent() &middot; Tool() &middot; Memory() &middot; Orchestrator()
            </div>
          </div>
          <div style={sectionBox}>
            <div style={{ ...monoLabel, marginBottom: 6 }}>Languages</div>
            <div style={{ ...bodyText, fontSize: 11 }}>Python SDK, TypeScript SDK</div>
          </div>
        </div>

        {/* Evaluation Pipeline Patterns */}
        <h2 style={sectionHeading}>Evaluation Pipeline Patterns</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {evalPatterns.map((pattern, i) => (
            <div
              key={i}
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
                  fontSize: 10,
                  fontWeight: 700,
                  color: C.gray,
                  flexShrink: 0,
                  textTransform: 'uppercase',
                }}
              >
                Pattern {i + 1}
              </span>
              <div style={{ flex: 1 }}>
                <span style={{ ...bodyText, fontWeight: 600 }}>{pattern.name}</span>
                <span style={{ ...bodyText, color: C.muted }}> &mdash; {pattern.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: C.cream,
            border: `1px solid ${C.lightGray}`,
            borderRadius: 6,
            padding: '10px 14px',
            marginBottom: 24,
          }}
        >
          <div style={{ ...monoLabel, marginBottom: 4 }}>Setup</div>
          <div style={{ ...bodyText, fontSize: 11, color: C.muted }}>
            Define eval tasks &rarr; Run Claude Code &rarr; Score outputs &rarr; Track metrics over time
          </div>
        </div>

        {/* Capability Boundaries */}
        <h2 style={sectionHeading}>Capability Boundaries</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 10,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              border: `1px solid ${C.green}`,
              borderTop: `3px solid ${C.green}`,
              borderRadius: 6,
              padding: '12px 14px',
            }}
          >
            <div style={{ ...monoLabel, color: C.green, marginBottom: 6 }}>Strengths</div>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {strengths.map((s, i) => (
                <li key={i} style={{ ...listItem, fontSize: 11 }}>{s}</li>
              ))}
            </ul>
          </div>
          <div
            style={{
              border: `1px solid ${C.orange}`,
              borderTop: `3px solid ${C.orange}`,
              borderRadius: 6,
              padding: '12px 14px',
            }}
          >
            <div style={{ ...monoLabel, color: C.orange, marginBottom: 6 }}>Growing Edges</div>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {growingEdges.map((s, i) => (
                <li key={i} style={{ ...listItem, fontSize: 11 }}>{s}</li>
              ))}
            </ul>
          </div>
          <div
            style={{
              border: `1px solid ${C.faint}`,
              borderTop: `3px solid ${C.faint}`,
              borderRadius: 6,
              padding: '12px 14px',
            }}
          >
            <div style={{ ...monoLabel, color: C.faint, marginBottom: 6 }}>Not Suited For</div>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {notSuited.map((s, i) => (
                <li key={i} style={{ ...listItem, fontSize: 11 }}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        <div
          style={{
            background: C.cream,
            border: `1px solid ${C.gray}`,
            borderLeft: `4px solid ${C.gray}`,
            borderRadius: 6,
            padding: '10px 14px',
          }}
        >
          <div style={{ ...bodyText, fontStyle: 'italic', color: C.muted }}>
            Key principle: &ldquo;Claude Code augments engineering judgment &mdash; it doesn&apos;t replace it&rdquo;
          </div>
        </div>
      </div>

      {/* ════════════ PAGE 2 ════════════ */}
      <div className="page-break-before" style={{ marginTop: 32 }}>
        {/* Research Integration Points */}
        <h2 style={sectionHeading}>Research Integration Points</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {researchPoints.map((point, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 12,
                padding: '8px 14px',
                borderLeft: `3px solid ${C.gray}`,
                background: i % 2 === 0 ? C.cream : 'transparent',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.dark,
                  flexShrink: 0,
                  minWidth: 180,
                }}
              >
                {point.area}
              </span>
              <span style={{ ...bodyText, color: C.muted }}>{point.detail}</span>
            </div>
          ))}
        </div>

        {/* Building Custom Agents */}
        <h2 style={sectionHeading}>Building Custom Agents</h2>

        <div
          style={{
            ...monoLabel,
            fontWeight: 600,
            color: C.gray,
            marginBottom: 6,
          }}
        >
          Example Agent Config
        </div>
        <pre style={codeBlock}>
{`Agent({
  name: "code-reviewer",
  model: "claude-sonnet-4",
  tools: [read_file, write_file, run_tests, git_diff],
  system: "You are a senior code reviewer. Focus on
    correctness, security, and maintainability.",
  memory: persistent("reviews/"),
  maxSteps: 20
})`}
        </pre>

        <div
          style={{
            ...monoLabel,
            fontWeight: 600,
            color: C.gray,
            marginBottom: 6,
          }}
        >
          Multi-Agent Orchestration Pattern
        </div>
        <pre style={codeBlock}>
{`Orchestrator({
  agents: [planner, implementer, reviewer, tester],
  workflow: "planner → implementer → [reviewer, tester] → planner",
  convergence: "all agents approve"
})`}
        </pre>

        {/* What to Bring Back */}
        <div
          style={{
            background: C.cream,
            border: `1px solid ${C.gray}`,
            borderLeft: `4px solid ${C.gray}`,
            borderRadius: 6,
            padding: '14px 18px',
          }}
        >
          <div
            style={{
              ...monoLabel,
              fontWeight: 600,
              color: C.gray,
              marginBottom: 8,
            }}
          >
            What to Bring Back to the Research Team
          </div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {bringBack.map((item, i) => (
              <li key={i} style={listItem}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </MaterialLayout>
  );
}

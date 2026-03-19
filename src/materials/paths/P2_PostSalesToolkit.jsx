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

const sectionBox = {
  background: C.cream,
  border: `1px solid ${C.lightGray}`,
  borderRadius: 6,
  padding: '16px 18px',
  marginBottom: 16,
};



const pairProgrammingSteps = [
  { action: 'Start by understanding their codebase', detail: '\u201cShow me the repo. What are the hot spots?\u201d' },
  { action: 'Let them drive', detail: 'Customer types the prompt, you guide the approach' },
  { action: 'Teach the pattern', detail: 'Show outcome-focused prompting, then let them practice' },
  { action: 'Celebrate wins', detail: 'When Claude nails a task, connect it to their daily workflow' },
  { action: 'Leave behind', detail: 'Every session should produce a tangible artifact (CLAUDE.md, working hook, etc.)' },
];

const claudeMdQuestions = [
  'What does your project do in 2-3 sentences?',
  'What framework and language? Any style guides?',
  'Where do tests live? What test framework?',
  'What commands run before a commit?',
  'What would you tell a new dev on day one?',
  'Any off-limits directories or files?',
];

const troubleshooting = [
  { issue: 'It\u2019s not reading my codebase', fix: 'Check project directory, run from repo root' },
  { issue: 'Responses are slow', fix: 'First run reads codebase. Check model selection (Haiku for speed)' },
  { issue: 'It keeps making the same mistake', fix: 'Update CLAUDE.md with the constraint' },
  { issue: 'Authentication issues', fix: 'claude auth, check API key, verify cloud provider config' },
  { issue: 'It broke my code', fix: 'Git history is preserved. git diff to review, git checkout to revert' },
  { issue: 'Context seems lost', fix: 'Use /compact, check session length, restart if needed' },
  { issue: 'It won\u2019t run commands', fix: 'Check permissions mode, review managed settings' },
  { issue: 'MCP server not connecting', fix: 'Verify .claude/mcp.json, check auth, restart' },
  { issue: 'Hook failures blocking work', fix: 'Review hook output, fix the underlying issue' },
  { issue: 'Cost higher than expected', fix: 'Check model usage, enable prompt caching, review Opus usage' },
];

const handoffChecklist = [
  'CLAUDE.md written and committed',
  'At least 2 developers comfortable with daily use',
  'Hooks configured for team quality gates',
  'MCP connected to at least one internal tool',
  'Managed settings configured (if enterprise)',
  'GitHub Actions set up (if using CI/CD)',
  'Internal champion identified for ongoing adoption',
  'Cost monitoring and spend limits in place',
];

const escalationPaths = [
  { issue: 'Technical issues', path: 'Anthropic support (support.anthropic.com)' },
  { issue: 'Security concerns', path: 'Trust Center + security team briefing' },
  { issue: 'Feature requests', path: 'Account team \u2192 Product feedback channel' },
  { issue: 'Billing questions', path: 'Cloud provider support (Bedrock/Vertex/Foundry billing)' },
  { issue: 'Training needs', path: 'Basecamp materials + custom workshop' },
];

export default function P2_PostSalesToolkit() {
  return (
    <MaterialLayout
      id="P2"
      title="Customer Delivery Toolkit"
      subtitle="PE Post-Sales: Pair programming and delivery guide"
      color={C.blue}
      category="PE Post-Sales"
      format="Cheat Sheet"
    >
      {/* ════════════ PAGE 1 ════════════ */}
      <div>
        {/* Pair Programming Guide */}
        <h2 style={sectionHeading}>Pair Programming Guide</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {pairProgrammingSteps.map((step, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '10px 14px',
                borderLeft: `3px solid ${C.blue}`,
                background: i % 2 === 0 ? C.cream : 'transparent',
              }}
            >
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
                  {step.action}
                </div>
                <div style={{ ...bodyText, color: C.muted }}>{step.detail}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CLAUDE.md Co-Authoring Questions */}
        <h2 style={sectionHeading}>CLAUDE.md Co-Authoring Questions</h2>
        <div style={sectionBox}>
          <p style={{ ...bodyText, color: C.muted, marginBottom: 10 }}>
            Ask the customer:
          </p>
          <ol style={{ margin: 0, paddingLeft: 20, marginBottom: 10 }}>
            {claudeMdQuestions.map((q, i) => (
              <li key={i} style={listItem}>
                &ldquo;{q}&rdquo;
              </li>
            ))}
          </ol>
          <p style={{ ...bodyText, fontWeight: 600, color: C.blue }}>
            Build the CLAUDE.md together during the session.
          </p>
        </div>

        {/* Top 10 Troubleshooting Scenarios */}
        <h2 style={sectionHeading}>Top 10 Troubleshooting Scenarios</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {troubleshooting.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '8px 12px',
                borderBottom: `1px solid ${C.lightGray}`,
                background: i % 2 === 0 ? C.cream : 'transparent',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.blue,
                  flexShrink: 0,
                  width: 18,
                  textAlign: 'right',
                  marginTop: 1,
                }}
              >
                {i + 1}.
              </span>
              <div style={{ flex: 1 }}>
                <span style={{ ...bodyText, fontWeight: 600 }}>
                  &ldquo;{item.issue}&rdquo;
                </span>
                <span style={{ ...bodyText, color: C.muted }}>
                  {' '}&rarr; {item.fix}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════ PAGE 2 ════════════ */}
      <div className="page-break-before" style={{ marginTop: 32 }}>
        {/* Handoff Checklist */}
        <h2 style={sectionHeading}>Handoff Checklist</h2>
        <div
          style={{
            background: C.cream,
            border: `1px solid ${C.lightGray}`,
            borderRadius: 6,
            padding: '16px 18px',
            marginBottom: 24,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {handoffChecklist.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    border: `2px solid ${C.blue}`,
                    borderRadius: 3,
                    flexShrink: 0,
                  }}
                />
                <span style={bodyText}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Escalation Paths */}
        <h2 style={sectionHeading}>Escalation Paths</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {escalationPaths.map((item, i) => (
            <div
              key={i}
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
                  fontFamily: 'var(--sans)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.dark,
                  flexShrink: 0,
                  minWidth: 120,
                }}
              >
                {item.issue}
              </span>
              <span
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 12,
                  color: C.muted,
                  lineHeight: 1.5,
                }}
              >
                {item.path}
              </span>
            </div>
          ))}
        </div>
      </div>
    </MaterialLayout>
  );
}

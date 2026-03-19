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

const subHeading = {
  fontFamily: 'var(--serif)',
  fontSize: 16,
  fontWeight: 400,
  color: C.dark,
  margin: '0 0 10px 0',
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

const inlineCode = {
  fontFamily: 'var(--mono)',
  fontSize: 11,
  background: C.lightGray,
  borderRadius: 3,
  padding: '1px 5px',
};

const sectionBox = {
  background: C.cream,
  border: `1px solid ${C.lightGray}`,
  borderRadius: 6,
  padding: '16px 18px',
  marginBottom: 16,
};

const calloutBox = {
  background: C.cream,
  border: `1px solid ${C.green}`,
  borderLeft: `4px solid ${C.green}`,
  borderRadius: 6,
  padding: '14px 18px',
  marginBottom: 16,
};

export default function M3_IntegrationPatterns() {
  return (
    <MaterialLayout
      id="M3"
      title="Integration Patterns"
      subtitle="Hooks, MCP, Skills, Subagents, and Agent SDK"
      color={C.green}
      category="Day 3"
      format="Architecture Reference"
    >
      {/* ════════════ PAGE 1 ════════════ */}
      <div>
        {/* Integration Architecture Diagram */}
        <h2 style={sectionHeading}>Integration Architecture</h2>
        <div
          style={{
            position: 'relative',
            height: 320,
            marginBottom: 24,
            background: C.cream,
            border: `1px solid ${C.lightGray}`,
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          {/* Center: Claude Code */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: C.dark,
              color: '#fff',
              fontFamily: 'var(--mono)',
              fontSize: 13,
              fontWeight: 700,
              padding: '16px 24px',
              borderRadius: 8,
              textAlign: 'center',
              zIndex: 2,
              boxShadow: `0 2px 12px rgba(0,0,0,0.15)`,
            }}
          >
            Claude Code
          </div>

          {/* Extension Points */}
          {[
            { label: 'Hooks', desc: 'Pre/post command automation', top: '50%', left: '8%', transform: 'translateY(-50%)' },
            { label: 'MCP', desc: 'External service protocol', top: '12%', left: '68%', transform: 'none' },
            { label: 'Skills', desc: 'Reusable prompt templates', top: '50%', left: '78%', transform: 'translateY(-50%)' },
            { label: 'Subagents', desc: 'Specialized Claude instances', top: '78%', left: '68%', transform: 'none' },
            { label: 'Agent SDK', desc: 'Custom agent orchestration', top: '85%', left: '38%', transform: 'none' },
          ].map((node) => (
            <div
              key={node.label}
              style={{
                position: 'absolute',
                top: node.top,
                left: node.left,
                transform: node.transform,
                background: '#fff',
                border: `2px solid ${C.green}`,
                borderRadius: 6,
                padding: '10px 14px',
                textAlign: 'center',
                zIndex: 1,
                minWidth: 120,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.green,
                  marginBottom: 2,
                }}
              >
                {node.label}
              </div>
              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 10,
                  color: C.muted,
                  lineHeight: 1.4,
                }}
              >
                {node.desc}
              </div>
            </div>
          ))}

          {/* Connecting lines (SVG) */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
          >
            {/* Hooks to center */}
            <line x1="22%" y1="50%" x2="42%" y2="50%" stroke={C.green} strokeWidth="1.5" strokeDasharray="4 3" />
            {/* MCP to center */}
            <line x1="72%" y1="22%" x2="56%" y2="42%" stroke={C.green} strokeWidth="1.5" strokeDasharray="4 3" />
            {/* Skills to center */}
            <line x1="78%" y1="50%" x2="58%" y2="50%" stroke={C.green} strokeWidth="1.5" strokeDasharray="4 3" />
            {/* Subagents to center */}
            <line x1="72%" y1="78%" x2="56%" y2="58%" stroke={C.green} strokeWidth="1.5" strokeDasharray="4 3" />
            {/* Agent SDK to center */}
            <line x1="46%" y1="85%" x2="48%" y2="58%" stroke={C.green} strokeWidth="1.5" strokeDasharray="4 3" />
          </svg>
        </div>

        {/* Hook Config Template */}
        <h2 style={subHeading}>Hook Config Template</h2>
        <pre style={codeBlock}>
{`{
  "pre-commit": ["npm run lint", "npm run type-check"],
  "post-edit": ["npm test -- --related"],
  "pre-push": ["npm run test:e2e", "npm run security:audit"]
}`}
        </pre>

        {/* MCP Quick-Start */}
        <div style={sectionBox}>
          <h2 style={subHeading}>MCP Quick-Start</h2>
          <p style={{ ...bodyText, marginBottom: 10 }}>
            <strong>What it is:</strong> Protocol connecting Claude to external services
          </p>
          <div style={{ ...bodyText, fontWeight: 600, marginBottom: 6 }}>
            Top 5 Enterprise MCP Servers
          </div>
          <ol style={{ margin: 0, paddingLeft: 20, marginBottom: 12 }}>
            {[
              { name: 'Jira/Linear', desc: 'Ticket context for issue-driven development' },
              { name: 'Datadog/PagerDuty', desc: 'Error logs and monitoring data' },
              { name: 'Confluence/Notion', desc: 'Documentation and knowledge bases' },
              { name: 'Figma', desc: 'Design specs and component libraries' },
              { name: 'Internal APIs', desc: 'Domain-specific data and services' },
            ].map((server, i) => (
              <li key={i} style={listItem}>
                <strong>{server.name}</strong> &mdash; {server.desc}
              </li>
            ))}
          </ol>
          <p style={{ ...bodyText, color: C.muted }}>
            <strong>Setup:</strong> Add to <span style={inlineCode}>.claude/mcp.json</span>, authenticate, restart Claude Code
          </p>
        </div>
      </div>

      {/* ════════════ PAGE 2 ════════════ */}
      <div className="page-break-before" style={{ marginTop: 32 }}>
        {/* Custom Skill Template */}
        <h2 style={subHeading}>Custom Skill Template</h2>
        <pre style={codeBlock}>
{`---
name: deploy-check
description: Pre-deployment checklist
---
Run the following checks:
1. Full test suite
2. TODO/FIXME scan
3. Env vars documented
4. API error handling verified
5. Changes summary since last deploy`}
        </pre>

        {/* Subagent Configuration */}
        <div style={sectionBox}>
          <h2 style={subHeading}>Subagent Configuration</h2>
          <p style={{ ...bodyText, marginBottom: 6 }}>
            <strong>What:</strong> Specialized Claude instances for specific tasks
          </p>
          <p style={{ ...bodyText, marginBottom: 6 }}>
            <strong>Use cases:</strong> Code review agent, test generation agent, documentation agent
          </p>
          <p style={{ ...bodyText, color: C.muted }}>
            <strong>Config:</strong> Define in <span style={inlineCode}>.claude/agents/</span> with role, tools, and constraints
          </p>
        </div>

        {/* Agent SDK Overview */}
        <div style={sectionBox}>
          <h2 style={subHeading}>Agent SDK Overview</h2>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li style={listItem}>Build custom agents with the Claude API</li>
            <li style={listItem}>Multi-agent orchestration patterns</li>
            <li style={listItem}>
              <strong>Key components:</strong> Agent loop, tool definitions, memory management
            </li>
            <li style={listItem}>
              <strong>Use cases:</strong> Automated code review pipelines, evaluation harnesses, CI/CD integration
            </li>
          </ul>
        </div>

        {/* Composability Example */}
        <div
          style={{
            background: C.dark,
            color: '#e8e6dc',
            borderRadius: 6,
            padding: '16px 20px',
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: C.green,
              marginBottom: 8,
            }}
          >
            Composability Example
          </div>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 12, lineHeight: 1.7 }}>
            A developer pushes code &rarr; Hook runs lint + tests &rarr; MCP pulls Jira context &rarr; Skill formats the commit message &rarr; Subagent reviews the diff &rarr; All in one workflow
          </div>
        </div>

        {/* Enterprise Pitch Callout */}
        <div style={calloutBox}>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: C.green,
              marginBottom: 6,
            }}
          >
            Enterprise Pitch
          </div>
          <div style={{ ...bodyText, fontStyle: 'italic', color: C.muted }}>
            "MCP is often the unlock for enterprise deals. When a customer connects Claude Code to their Jira, Datadog, and internal APIs &mdash; it stops being a dev tool and becomes an engineering platform."
          </div>
        </div>
      </div>
    </MaterialLayout>
  );
}

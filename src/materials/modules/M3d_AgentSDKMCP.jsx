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

export default function M3d_AgentSDKMCP() {
  return (
    <MaterialLayout
      id="M3d"
      title="Agent SDK & MCP Servers"
      subtitle="Custom agents and tool integrations"
      color={C.green}
      category="Day 3"
      format="Quick Reference Card"
    >
      {/* ════════════ SINGLE PAGE — 2-column grid ════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {/* ═══ LEFT COLUMN ═══ */}
        <div>
          <div style={sectionBox}>
            <h2 style={sectionHeading}>Agent SDK</h2>
            <p style={{ ...bodyText, marginBottom: 12 }}>
              Build custom agents that go beyond Claude Code&apos;s built-in capabilities.
            </p>
            <h3 style={subHeading}>When to Use</h3>
            <ul style={{ margin: 0, paddingLeft: 18, marginBottom: 14 }}>
              <li style={listItem}>Custom agent logic</li>
              <li style={listItem}>Multi-agent orchestration</li>
              <li style={listItem}>Structured output</li>
              <li style={listItem}>Embedding in your apps</li>
            </ul>
            <pre style={codeBlock}>
{`import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1024,
  messages: [
    { role: 'user', content: 'Analyze this...' }
  ],
  tools: [{ /* your custom tools */ }]
});`}
            </pre>
          </div>
        </div>

        {/* ═══ RIGHT COLUMN ═══ */}
        <div>
          <div style={sectionBox}>
            <h2 style={sectionHeading}>Building MCP Servers</h2>
            <p style={{ ...bodyText, marginBottom: 12 }}>
              An MCP server exposes tools, resources, and prompts that Claude can use.
            </p>
            <h3 style={subHeading}>Three Things a Server Provides</h3>
            <ul style={{ margin: 0, paddingLeft: 18, marginBottom: 14 }}>
              <li style={listItem}>
                <strong>Tools</strong> &mdash; functions Claude calls
              </li>
              <li style={listItem}>
                <strong>Resources</strong> &mdash; data Claude reads
              </li>
              <li style={listItem}>
                <strong>Prompts</strong> &mdash; templates for common tasks
              </li>
            </ul>
            <pre style={codeBlock}>
{`import { McpServer } from
  '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from
  '@modelcontextprotocol/sdk/server/stdio.js';

const server = new McpServer({
  name: 'my-server',
  version: '1.0.0'
});

server.tool(
  'search_tickets',
  { query: { type: 'string' } },
  async ({ query }) => {
    // Your search logic here
    return {
      content: [{
        type: 'text',
        text: \`Results for: \${query}\`
      }]
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);`}
            </pre>
          </div>

          <p style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.faint, lineHeight: 1.5, margin: 0 }}>
            Start with a simple server returning hardcoded data, then add real integrations.
          </p>
        </div>
      </div>
    </MaterialLayout>
  );
}

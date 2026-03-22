import MaterialLayout from '../components/MaterialLayout';

const C = {
  bg: '#faf9f5', dark: '#141413', orange: '#d97757', blue: '#6a9bcc',
  green: '#788c5d', gray: '#b0aea5', lightGray: '#e8e6dc', cream: '#f5f3ee',
  muted: '#6a685e', faint: '#b0aea5',
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

export default function M2c_ClaudeMdConfig() {
  return (
    <MaterialLayout
      id="M2c"
      title="Configuration Reference"
      subtitle="Authoring, hierarchy, and best practices"
      color={C.blue}
      category="Day 2"
      format="Cheat Sheet"
    >
      {/* ════════════ PAGE 1 ════════════ */}
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Left column */}
          <div>
            <h2 style={sectionHeading}>What is CLAUDE.md?</h2>
            <p style={{ ...bodyText, marginBottom: 16 }}>
              A file at the root of your project that tells Claude about your codebase.
              Without it, Claude guesses at conventions. With it, Claude follows your
              standards consistently.
            </p>

            <h2 style={subHeading}>What to Include</h2>
            <ul style={{ paddingLeft: 18, marginBottom: 16 }}>
              <li style={listItem}>Project overview</li>
              <li style={listItem}>Architecture (directory structure, key files)</li>
              <li style={listItem}>Conventions (code style, naming, test location)</li>
              <li style={listItem}>Quality gates (lint, types, tests)</li>
            </ul>

            <h2 style={subHeading}>Example CLAUDE.md</h2>
            <div style={codeBlock}>{`# Project Overview
Express API for shipment tracking. Node.js 20, TypeScript strict mode.

# Architecture
- src/routes/ \u2014 API endpoints, one file per resource
- src/services/ \u2014 Business logic, no HTTP concerns
- src/models/ \u2014 Database models (Prisma)
- tests/ \u2014 Co-located with source using .test.ts suffix

# Conventions
- async/await, never raw Promises
- JSDoc on all exported functions
- Error handling: throw AppError, never generic Error

# Quality Gates
- npm run lint && npm run type-check && npm test`}</div>
          </div>

          {/* Right column */}
          <div>
            <h2 style={sectionHeading}>CLAUDE.md Hierarchy</h2>
            <div style={sectionBox}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  {
                    path: '~/.claude/CLAUDE.md',
                    label: 'Personal preferences (everywhere)',
                  },
                  {
                    path: 'repo/CLAUDE.md',
                    label: 'Project conventions (this repo)',
                  },
                  {
                    path: 'repo/src/api/CLAUDE.md',
                    label: 'Subdirectory overrides (this folder)',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 10,
                      borderLeft: `3px solid ${C.blue}`,
                      paddingLeft: 12,
                      paddingTop: 4,
                      paddingBottom: 4,
                    }}
                  >
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600, color: C.blue, flexShrink: 0 }}>
                      {item.path}
                    </span>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.muted }}>
                      &rarr; {item.label}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.muted, lineHeight: 1.6, marginTop: 12, fontStyle: 'italic' }}>
                Each layer can override the one above &mdash; same pattern as <span style={inlineCode}>.eslintrc</span>
              </div>
            </div>

            <div
              style={{
                background: C.blue + '0a',
                border: `1px solid ${C.blue}25`,
                borderLeft: `3px solid ${C.blue}`,
                borderRadius: 6,
                padding: '14px 16px',
              }}
            >
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                Key Tip
              </div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.dark, lineHeight: 1.6 }}>
                20 focused lines beat 200 generic ones. Be specific about conventions, not exhaustive.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════ PAGE 2 ════════════ */}
      <div className="page-break-before" style={{ marginTop: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Left column — Settings Files */}
          <div>
            <h2 style={sectionHeading}>Settings Files</h2>
            <p style={{ ...bodyText, marginBottom: 12 }}>
              <span style={inlineCode}>.claude/settings.json</span> for project-level settings,{' '}
              <span style={inlineCode}>~/.claude/settings.json</span> for global settings.
            </p>
            <div style={sectionBox}>
              <h3 style={subHeading}>Key Fields</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { field: 'allowedTools', desc: 'Control which tools Claude can use (Edit, Write, Bash, etc.)' },
                  { field: 'mcpServers', desc: 'Configure MCP server connections for external integrations' },
                  { field: 'hooks', desc: 'Run scripts before/after tool calls or notifications' },
                ].map((item) => (
                  <div key={item.field} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                    <span style={{ ...inlineCode, flexShrink: 0 }}>{item.field}</span>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.muted, lineHeight: 1.5 }}>
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — CLI Flags */}
          <div>
            <h2 style={sectionHeading}>Useful CLI Flags</h2>
            <div style={{
              background: C.cream,
              border: `1px solid ${C.lightGray}`,
              borderRadius: 6,
              overflow: 'hidden',
            }}>
              {[
                { flag: '--model sonnet', desc: 'Use a specific model' },
                { flag: '--print "prompt"', desc: 'Non-interactive mode' },
                { flag: '--allowedTools "Edit,Write"', desc: 'Restrict tools' },
                { flag: '--resume', desc: 'Continue previous conversation' },
                { flag: '--verbose', desc: 'Show tool calls' },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'baseline',
                    padding: '9px 16px',
                    borderBottom: i < 4 ? `1px solid ${C.lightGray}` : 'none',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 11,
                    fontWeight: 600,
                    color: C.dark,
                    minWidth: 160,
                    flexShrink: 0,
                  }}>
                    {item.flag}
                  </span>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.muted, lineHeight: 1.5 }}>
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MaterialLayout>
  );
}

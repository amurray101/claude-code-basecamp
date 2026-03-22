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

export default function M3c_CICDAutomation() {
  return (
    <MaterialLayout
      id="M3c"
      title="CI/CD & Headless Mode"
      subtitle="Running Claude Code in pipelines"
      color={C.green}
      category="Day 3"
      format="Quick Reference Card"
    >
      {/* ════════════ SINGLE PAGE — 2-column grid ════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {/* ═══ LEFT COLUMN ═══ */}
        <div>
          <div style={sectionBox}>
            <h2 style={sectionHeading}>Headless Mode</h2>
            <p style={{ ...bodyText, marginBottom: 14 }}>
              Run Claude non-interactively with <span style={inlineCode}>--print</span>. Send a
              prompt, get a response, exit.
            </p>
            <pre style={codeBlock}>
{`# Review a PR
claude --print "Review this PR for security
vulnerabilities and code quality issues."

# Pipe output to a file
claude --print "Generate API docs for
src/routes/" > docs/api.md

# Use in a script
REVIEW=$(claude --print "Summarize changes
since last release tag")
echo "$REVIEW" | mail -s "Release notes" team@co.com`}
            </pre>
            <p style={{ ...bodyText, color: C.muted, margin: 0 }}>
              <strong>When to use:</strong> CI pipelines, automated scripts, batch processing
            </p>
          </div>
        </div>

        {/* ═══ RIGHT COLUMN ═══ */}
        <div>
          <div style={sectionBox}>
            <h2 style={sectionHeading}>GitHub Actions</h2>
            <pre style={{ ...codeBlock, margin: '0 0 14px 0' }}>
{`# .github/workflows/claude-review.yml
name: Claude Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Claude Code
        run: |
          curl -fsSL https://cli.anthropic.com/install.sh | sh
      - name: Review PR
        run: |
          claude --print "Review changes for
          code quality and security." > review.md
      - name: Post Review Comment
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review.md','utf8');
            github.rest.issues.createComment({
              ...context.repo,
              issue_number: context.issue.number,
              body: review
            });`}
            </pre>
          </div>

          <p style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.faint, lineHeight: 1.5, margin: 0 }}>
            This is a starting point &mdash; production workflows add auth, model selection, error
            handling, and cost controls.
          </p>
        </div>
      </div>
    </MaterialLayout>
  );
}

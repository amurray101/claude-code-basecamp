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
  fontSize: 15,
  fontWeight: 400,
  color: C.dark,
  margin: '0 0 10px 0',
};

const sectionBox = {
  background: C.cream,
  border: `1px solid ${C.lightGray}`,
  borderRadius: 6,
  padding: '14px 16px',
  marginBottom: 14,
};

const bodyText = {
  fontFamily: 'var(--sans)',
  fontSize: 12,
  color: C.dark,
  lineHeight: 1.6,
};

const checkboxLine = {
  fontFamily: 'var(--sans)',
  fontSize: 12,
  color: C.dark,
  lineHeight: 1.6,
  display: 'flex',
  alignItems: 'flex-start',
  gap: 8,
  marginBottom: 6,
};

const checkbox = {
  width: 14,
  height: 14,
  border: `1.5px solid ${C.gray}`,
  borderRadius: 2,
  flexShrink: 0,
  marginTop: 2,
};

const inlineCode = {
  fontFamily: 'var(--mono)',
  fontSize: 11,
  background: C.lightGray,
  borderRadius: 3,
  padding: '1px 5px',
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
  margin: '0 0 14px 0',
};

const listItem = {
  fontFamily: 'var(--sans)',
  fontSize: 12,
  color: C.dark,
  lineHeight: 1.6,
  marginBottom: 4,
};

export default function M2a_ClaudeMdBuilder() {
  return (
    <MaterialLayout
      id="M2a"
      title="CLAUDE.md Builder Guide"
      subtitle="Your reference for writing effective project context"
      color={C.blue}
      category="Day 2"
      format="Lab Guide"
    >
      {/* ════════════ PAGE 1 ════════════ */}
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Left column */}
          <div>
            <h2 style={sectionHeading}>What is CLAUDE.md?</h2>
            <p style={{ ...bodyText, marginBottom: 14 }}>
              A Markdown file at the root of your project that gives Claude persistent context about your codebase. Think of it as the system prompt for your repo &mdash; it&apos;s read automatically at the start of every conversation.
            </p>

            <div
              style={{
                background: C.blue + '0a',
                border: `1px solid ${C.blue}25`,
                borderLeft: `3px solid ${C.blue}`,
                borderRadius: 6,
                padding: '12px 14px',
                marginBottom: 16,
              }}
            >
              <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.dark, lineHeight: 1.6 }}>
                <strong>Without it,</strong> Claude guesses at conventions, invents directory structures, and produces inconsistent code style.
              </div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.dark, lineHeight: 1.6, marginTop: 6 }}>
                <strong>With it,</strong> Claude follows your standards from the first message &mdash; right naming, right patterns, right quality gates.
              </div>
            </div>

            <h2 style={subHeading}>Why Write One?</h2>
            <ul style={{ paddingLeft: 18, marginBottom: 16 }}>
              <li style={listItem}><strong>Consistency</strong> &mdash; every conversation starts with the same conventions</li>
              <li style={listItem}><strong>Onboarding</strong> &mdash; new teammates (and Claude) get up to speed instantly</li>
              <li style={listItem}><strong>Quality</strong> &mdash; pre-commit checks are followed without reminding</li>
              <li style={listItem}><strong>Shareability</strong> &mdash; checked into git, so the whole team benefits</li>
            </ul>

            <h2 style={subHeading}>Where It Lives</h2>
            <div style={sectionBox}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { path: '~/.claude/CLAUDE.md', label: 'Personal preferences (all projects)' },
                  { path: 'repo/CLAUDE.md', label: 'Project conventions (this repo)' },
                  { path: 'repo/src/api/CLAUDE.md', label: 'Subdirectory overrides (this folder)' },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 10,
                      borderLeft: `3px solid ${C.blue}`,
                      paddingLeft: 12,
                      paddingTop: 3,
                      paddingBottom: 3,
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
              <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.muted, lineHeight: 1.5, marginTop: 10, fontStyle: 'italic' }}>
                Each layer merges with and can override the one above.
              </div>
            </div>
          </div>

          {/* Right column */}
          <div>
            <h2 style={sectionHeading}>What to Include</h2>
            <p style={{ ...bodyText, marginBottom: 14 }}>
              Focus on things Claude can&apos;t easily infer from reading the code alone. 20 focused lines beat 200 generic ones.
            </p>

            <div style={sectionBox}>
              <h3 style={subHeading}>Project Overview</h3>
              <p style={{ ...bodyText, fontSize: 11, color: C.muted, marginBottom: 0 }}>
                What does this project do? Language, framework, key dependencies. One paragraph is enough.
              </p>
            </div>

            <div style={sectionBox}>
              <h3 style={subHeading}>Architecture</h3>
              <p style={{ ...bodyText, fontSize: 11, color: C.muted, marginBottom: 0 }}>
                Directory layout, where key pieces live (routes, services, models, tests). Not every folder &mdash; just the ones that matter.
              </p>
            </div>

            <div style={sectionBox}>
              <h3 style={subHeading}>Conventions</h3>
              <p style={{ ...bodyText, fontSize: 11, color: C.muted, marginBottom: 0 }}>
                Code style, naming patterns, import ordering, error handling approach. The stuff a linter can&apos;t catch.
              </p>
            </div>

            <div style={sectionBox}>
              <h3 style={subHeading}>Quality Gates</h3>
              <p style={{ ...bodyText, fontSize: 11, color: C.muted, marginBottom: 0 }}>
                Commands to run before committing: lint, type-check, test. Claude will run these if you tell it to.
              </p>
            </div>

            <div style={sectionBox}>
              <h3 style={subHeading}>Team Knowledge</h3>
              <p style={{ ...bodyText, fontSize: 11, color: C.muted, marginBottom: 0 }}>
                Gotchas, off-limits areas, things you&apos;d tell a new teammate on day one.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════ PAGE 2 ════════════ */}
      <div className="page-break-before" style={{ marginTop: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Left column */}
          <div>
            <h2 style={sectionHeading}>Example</h2>
            <div style={codeBlock}>{`# Project Overview
Express API for shipment tracking.
Node.js 20, TypeScript strict mode.

# Architecture
- src/routes/   — one file per resource
- src/services/ — business logic, no HTTP
- src/models/   — Prisma schema + generated
- tests/        — co-located .test.ts files

# Conventions
- async/await, never raw Promises
- Errors: throw AppError, not generic Error
- Imports: node builtins → packages → local

# Before Committing
npm run lint && npm run type-check && npm test`}</div>

            <h2 style={subHeading}>The Iteration Loop</h2>
            <div style={sectionBox}>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.dark, lineHeight: 1.8 }}>
                <strong>1.</strong> Explore the codebase, draft your CLAUDE.md<br />
                <strong>2.</strong> Give Claude a task, observe the output<br />
                <strong>3.</strong> Ask: <em>&ldquo;What conventions should I add to CLAUDE.md?&rdquo;</em><br />
                <strong>4.</strong> Refine and repeat &mdash; plan 2&ndash;3 iterations
              </div>
            </div>
          </div>

          {/* Right column */}
          <div>
            <h2 style={sectionHeading}>Lab Checklist</h2>
            <p style={{ ...bodyText, marginBottom: 14 }}>
              Use this as you work through the exercise. Each item is a milestone, not a strict order.
            </p>

            <div style={sectionBox}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
                Explore
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  'Identified the project\u2019s language & framework',
                  'Mapped the key directories and what lives in each',
                  'Found at least one coding convention (naming, style, patterns)',
                  'Found the test framework and where tests live',
                ].map((item, i) => (
                  <div key={i} style={checkboxLine}>
                    <div style={checkbox} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={sectionBox}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
                Draft
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  'Created a CLAUDE.md file at the project root',
                  'Included a project overview section',
                  'Documented architecture / directory layout',
                  'Specified coding conventions',
                  'Added quality gate commands (lint, test, etc.)',
                ].map((item, i) => (
                  <div key={i} style={checkboxLine}>
                    <div style={checkbox} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={sectionBox}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
                Test & Iterate
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  'Ran Claude on a task WITH your CLAUDE.md',
                  'Compared output to what Claude produces WITHOUT it',
                  'Asked Claude what conventions to add',
                  'Refined your CLAUDE.md based on what you observed',
                ].map((item, i) => (
                  <div key={i} style={checkboxLine}>
                    <div style={checkbox} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MaterialLayout>
  );
}

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

const fieldLabel = {
  fontFamily: 'var(--sans)',
  fontSize: 12,
  color: C.muted,
  marginBottom: 4,
  display: 'flex',
  alignItems: 'baseline',
  gap: 6,
};

const fillLine = {
  borderBottom: `1.5px solid ${C.lightGray}`,
  minHeight: '1.6em',
  width: '100%',
  marginBottom: 8,
};

const sectionBox = {
  background: C.cream,
  border: `1px solid ${C.lightGray}`,
  borderRadius: 6,
  padding: '14px 16px',
  marginBottom: 14,
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

function FieldRow({ label, lines = 1 }) {
  return (
    <div style={{ marginBottom: lines > 1 ? 4 : 8 }}>
      <div style={fieldLabel}>{label}</div>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="fill-line" style={fillLine} />
      ))}
    </div>
  );
}

export default function M2a_ClaudeMdBuilder() {
  return (
    <MaterialLayout
      id="M2a"
      title="CLAUDE.md Builder"
      subtitle="Build your project's AI configuration"
      color={C.blue}
      category="Day 2"
      format="Worksheet"
    >
      {/* ════════════ PAGE 1 ════════════ */}
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Left column */}
          <div>
            {/* Project Overview */}
            <div style={sectionBox}>
              <h2 style={subHeading}>Project Overview</h2>
              <FieldRow label="Project name:" />
              <FieldRow label="Primary language/framework:" />
              <FieldRow label="What does this project do? (2-3 sentences):" lines={2} />
            </div>

            {/* Architecture */}
            <div style={sectionBox}>
              <h2 style={subHeading}>Architecture</h2>
              <FieldRow label="Backend:" />
              <FieldRow label="Frontend:" />
              <FieldRow label="Database / ORM:" />
              <FieldRow label="Key directories:" />
            </div>

            {/* Conventions */}
            <div style={sectionBox}>
              <h2 style={subHeading}>Conventions</h2>
              <FieldRow label="Code style:" />
              <FieldRow label="Naming conventions:" />
              <FieldRow label="Test framework & location:" />
              <FieldRow label="Import ordering:" />
            </div>
          </div>

          {/* Right column */}
          <div>
            {/* Pre-Commit Checks */}
            <div style={sectionBox}>
              <h2 style={subHeading}>Pre-Commit Checks</h2>
              <FieldRow label="Linting command:" />
              <FieldRow label="Type checking command:" />
              <FieldRow label="Test command:" />
              <FieldRow label="Other checks:" />
            </div>

            {/* Team Notes */}
            <div style={sectionBox}>
              <h2 style={subHeading}>Team Notes</h2>
              <FieldRow label="Things you'd tell a new teammate on day one:" lines={2} />
              <FieldRow label="Common gotchas:" />
              <FieldRow label="Off-limits areas:" />
            </div>
          </div>
        </div>
      </div>

      {/* ════════════ PAGE 2 ════════════ */}
      <div className="page-break-before" style={{ marginTop: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Left column */}
          <div>
            {/* Prompt Pattern Library */}
            <h2 style={sectionHeading}>Prompt Pattern Library</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                {
                  num: 1,
                  name: 'Migration',
                  template: 'Refactor [module] to use [new approach]. Keep [constraint]. All tests passing.',
                },
                {
                  num: 2,
                  name: 'Testing',
                  template: 'Write comprehensive tests for [module]. Cover happy paths, errors, edge cases. Aim for [X]% coverage.',
                },
                {
                  num: 3,
                  name: 'Debugging',
                  template: 'We\'re seeing [error] when [condition]. Trace across [scope]. Find root cause and fix.',
                },
                {
                  num: 4,
                  name: 'Documentation',
                  template: 'Analyze [codebase area] and generate [doc type]. Include [specific elements].',
                },
                {
                  num: 5,
                  name: 'Refactor',
                  template: 'Refactor [area] to improve [quality]. Maintain [constraint]. Verify with tests.',
                },
              ].map((p) => (
                <div
                  key={p.num}
                  style={{
                    background: C.cream,
                    border: `1px solid ${C.lightGray}`,
                    borderLeft: `3px solid ${C.blue}`,
                    borderRadius: 4,
                    padding: '10px 14px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.blue,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: 4,
                    }}
                  >
                    {p.num}. {p.name}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: 11,
                      color: C.dark,
                      lineHeight: 1.5,
                      fontStyle: 'italic',
                    }}
                  >
                    &ldquo;{p.template}&rdquo;
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div>
            {/* Session Hygiene */}
            <h2 style={sectionHeading}>Session Hygiene</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
              {[
                {
                  cmd: '/compact',
                  desc: 'Compress conversation context. Use after completing a major step.',
                },
                {
                  cmd: '/clear',
                  desc: 'Fresh start. Use when switching tasks entirely.',
                },
                {
                  cmd: 'Plan Mode',
                  desc: 'Claude plans without executing. Use for complex tasks before committing.',
                },
                {
                  cmd: '/review',
                  desc: 'Code review mode. Use before committing.',
                },
              ].map((c) => (
                <div
                  key={c.cmd}
                  style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-start',
                    background: C.cream,
                    border: `1px solid ${C.lightGray}`,
                    borderRadius: 6,
                    padding: '10px 14px',
                  }}
                >
                  <span style={inlineCode}>{c.cmd}</span>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.muted, lineHeight: 1.5 }}>
                    {c.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* Monorepo Strategy */}
            <div
              style={{
                background: C.cream,
                border: `1px solid ${C.lightGray}`,
                borderTop: `3px solid ${C.blue}`,
                borderRadius: 6,
                padding: '14px 16px',
                marginBottom: 18,
              }}
            >
              <h2 style={{ ...subHeading, color: C.blue }}>Monorepo Strategy</h2>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.dark, lineHeight: 1.6, marginBottom: 4 }}>
                  <strong>Root CLAUDE.md:</strong> shared conventions (language, testing, CI)
                </li>
                <li style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.dark, lineHeight: 1.6, marginBottom: 4 }}>
                  <strong>Package CLAUDE.md files:</strong> team-specific patterns
                </li>
                <li style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.dark, lineHeight: 1.6 }}>
                  <strong>Hierarchy:</strong> subdirectory files inherit from and can override root
                </li>
              </ul>
            </div>

            {/* Quality Checklist */}
            <div style={sectionBox}>
              <h2 style={subHeading}>Quality Checklist</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  'Does your CLAUDE.md cover architecture?',
                  'Are coding conventions documented?',
                  'Are pre-commit checks specified?',
                  'Would a new teammate find this useful?',
                  "Have you tested Claude's output with this CLAUDE.md?",
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

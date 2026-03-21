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
        {/* Session-specific framing */}
        <div
          style={{
            background: C.cream,
            borderLeft: `3px solid ${C.blue}`,
            borderRadius: 4,
            padding: '10px 14px',
            marginBottom: 16,
            fontFamily: 'var(--sans)',
            fontSize: 11,
            color: C.muted,
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: C.dark }}>In today&apos;s session:</strong> You&apos;ll explore the basecamp-messy-repo &mdash; a codebase with no documentation, inconsistent patterns, and no CLAUDE.md. Use this worksheet to capture what you find, then write the CLAUDE.md that transforms Claude&apos;s output.
        </div>

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
            {/* CLAUDE.md Hierarchy */}
            <h2 style={sectionHeading}>CLAUDE.md Hierarchy</h2>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.muted, lineHeight: 1.6, marginBottom: 12 }}>
              Works like <span style={inlineCode}>.eslintrc</span> &mdash; cascading configuration that scales from one developer to 200.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                {
                  level: '~/.claude/CLAUDE.md',
                  scope: 'Personal',
                  desc: 'Your preferences across all projects. Follows you everywhere.',
                },
                {
                  level: 'repo-root/CLAUDE.md',
                  scope: 'Project',
                  desc: 'Project conventions shared with the team via git. Start here.',
                },
                {
                  level: 'repo-root/src/CLAUDE.md',
                  scope: 'Subdirectory',
                  desc: 'Team-specific overrides. Inherits from root, can override for this scope.',
                },
              ].map((h) => (
                <div
                  key={h.level}
                  style={{
                    background: C.cream,
                    border: `1px solid ${C.lightGray}`,
                    borderLeft: `3px solid ${C.blue}`,
                    borderRadius: 4,
                    padding: '10px 14px',
                  }}
                >
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600, color: C.blue, marginBottom: 2 }}>
                    {h.level}
                  </div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.dark, lineHeight: 1.5 }}>
                    <strong>{h.scope}:</strong> {h.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Enterprise scaling note */}
            <div
              style={{
                background: C.blue + '0a',
                border: `1px solid ${C.blue}25`,
                borderRadius: 6,
                padding: '12px 14px',
                marginTop: 14,
              }}
            >
              <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.dark, lineHeight: 1.6 }}>
                <strong>Enterprise answer:</strong> &ldquo;How does this scale to 200 developers?&rdquo; &mdash; The engineering director writes the root CLAUDE.md with company-wide standards. Each team adds their own file with team-specific conventions. Developers don&apos;t need to know it exists; it just works.
              </div>
            </div>

            {/* Cross-references */}
            <div style={{ fontFamily: 'var(--sans)', fontSize: 10, color: C.faint, marginTop: 14, lineHeight: 1.6 }}>
              Prompt patterns: see M2b &nbsp;|&nbsp; Session commands: see M1b (Command Glossary)
            </div>
          </div>

          {/* Right column */}
          <div>
            {/* Quality Checklist */}
            <div style={sectionBox}>
              <h2 style={subHeading}>Quality Checklist</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  'Does your CLAUDE.md cover architecture?',
                  'Are coding conventions documented?',
                  'Are pre-commit checks specified?',
                  'Would a new teammate find this useful on day one?',
                  'Have you compared Claude\u2019s output WITH vs. WITHOUT this CLAUDE.md?',
                ].map((item, i) => (
                  <div key={i} style={checkboxLine}>
                    <div style={checkbox} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Iteration Loop */}
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
              <h2 style={{ ...subHeading, color: C.blue }}>The Iteration Loop</h2>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.dark, lineHeight: 1.7 }}>
                <strong>1.</strong> Write CLAUDE.md based on codebase exploration<br />
                <strong>2.</strong> Run Claude on a task, observe output<br />
                <strong>3.</strong> Ask Claude: &ldquo;What conventions should I add to my CLAUDE.md?&rdquo;<br />
                <strong>4.</strong> Refine and repeat (plan 2&ndash;3 iterations in a customer engagement)
              </div>
            </div>

            {/* Before/After reminder */}
            <div
              style={{
                background: C.blue + '0a',
                border: `1px solid ${C.blue}25`,
                borderLeft: `3px solid ${C.blue}`,
                borderRadius: 6,
                padding: '12px 14px',
              }}
            >
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                Key demo moment
              </div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.dark, lineHeight: 1.6 }}>
                The before/after comparison &mdash; Claude without CLAUDE.md vs. with &mdash; is the single most persuasive demo in the program. Same task, same repo, different output. Conventions followed automatically.
              </div>
            </div>
          </div>
        </div>
      </div>
    </MaterialLayout>
  );
}

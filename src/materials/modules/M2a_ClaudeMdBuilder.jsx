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
          </div>

          {/* Right column */}
          <div>
            {/* Iteration Loop */}
            <div style={sectionBox}>
              <h2 style={subHeading}>The Iteration Loop</h2>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.dark, lineHeight: 1.7 }}>
                <strong>1.</strong> Write CLAUDE.md based on codebase exploration<br />
                <strong>2.</strong> Run Claude on a task, observe output<br />
                <strong>3.</strong> Ask Claude: &ldquo;What conventions should I add to my CLAUDE.md?&rdquo;<br />
                <strong>4.</strong> Refine and repeat (plan 2&ndash;3 iterations in a customer engagement)
              </div>
            </div>

            {/* Before/After reminder */}
            <div style={sectionBox}>
              <h2 style={subHeading}>Key Demo Moment</h2>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.dark, lineHeight: 1.6 }}>
                Show same task with vs. without CLAUDE.md &mdash; conventions followed automatically.
              </div>
            </div>
          </div>
        </div>
      </div>
    </MaterialLayout>
  );
}

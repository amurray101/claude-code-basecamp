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

const subHeading = {
  fontFamily: 'var(--serif)',
  fontSize: 16,
  fontWeight: 400,
  color: C.dark,
  margin: '0 0 10px 0',
};

const sectionBox = {
  background: C.cream,
  border: `1px solid ${C.lightGray}`,
  borderRadius: 6,
  padding: '16px 18px',
  marginBottom: 16,
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

const fillLine = {
  display: 'block',
  width: '100%',
  borderBottom: `1.5px solid ${C.gray}`,
  minHeight: 24,
  marginBottom: 6,
};

const fieldRow = (label) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 4 }}>
    <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.dark, fontWeight: 600, whiteSpace: 'nowrap' }}>
      {label}
    </span>
    <div className="fill-line" style={fillLine} />
  </div>
);

const doubleFieldRow = (label) => (
  <div style={{ marginBottom: 4 }}>
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 4 }}>
      <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.dark, fontWeight: 600, whiteSpace: 'nowrap' }}>
        {label}
      </span>
      <div className="fill-line" style={fillLine} />
    </div>
    <div className="fill-line" style={{ ...fillLine, marginLeft: 16 }} />
  </div>
);

export default function M4c_DemoPlanning() {
  return (
    <MaterialLayout
      id="M4c"
      title="Demo Planning"
      subtitle="Prepare a killer demo in 15 minutes"
      color={C.orange}
      category="Day 4"
      format="Worksheet"
    >
      <div>
        {/* Customer Context */}
        <div style={sectionBox}>
          <h2 style={subHeading}>Customer Context</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {fieldRow('Company:')}
            {fieldRow('Industry:')}
            {fieldRow('Team size:')}
            {fieldRow('Cloud provider:')}
            {fieldRow('Current AI tools:')}
            {doubleFieldRow('Key pain points:')}
          </div>
        </div>

        {/* Demo Moments Checklist */}
        <div style={sectionBox}>
          <h2 style={subHeading}>Demo Moments</h2>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 10, color: C.orange, fontWeight: 600, marginBottom: 8 }}>
            Choose your top 3&ndash;4 (not all of them). More features = less impact.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              'Multi-file refactor \u2014 show the agentic loop in action',
              'Extended thinking \u2014 highlight the planning step',
              'CLAUDE.md customization \u2014 show it adapts to their codebase',
              'Test generation \u2014 practical value they\'ll use immediately',
              'Terminal + IDE comparison \u2014 show flexibility',
              'CI/CD integration \u2014 GitHub Actions for automation',
            ].map((item, i) => (
              <div key={i} style={checkboxLine}>
                <div style={checkbox} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Objection Prep */}
        <div style={sectionBox}>
          <h2 style={subHeading}>Objection Prep</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {fieldRow('Expected objection #1:')}
            {doubleFieldRow('My response:')}
            <div style={{ height: 6 }} />
            {fieldRow('Expected objection #2:')}
            {doubleFieldRow('My response:')}
          </div>
        </div>

        {/* Demo Story Arc */}
        <div style={{ ...sectionBox, borderLeft: `3px solid ${C.orange}` }}>
          <h2 style={subHeading}>Demo Story Arc</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {doubleFieldRow('Opening hook (their problem):')}
            {doubleFieldRow('Demo flow (3\u20134 moments in order):')}
            {fieldRow('Closing ask (specific next step):')}
          </div>
        </div>

        {/* Close Plan */}
        <div style={sectionBox}>
          <h2 style={subHeading}>Close Plan</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {fieldRow('What I\'m asking for:')}
            {doubleFieldRow('Pilot proposal:')}
            {fieldRow('Decision maker:')}
            {fieldRow('Timeline:')}
          </div>
        </div>

        {/* Post-Demo Follow-Up */}
        <div style={sectionBox}>
          <h2 style={subHeading}>Post-Demo Follow-Up</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              'Send summary email within 24 hours',
              'Include ROI calculation (use F7b template)',
              'Attach relevant materials (F3a, F6a, M4a)',
              'Schedule pilot kickoff call',
              'Identify champion developer(s)',
            ].map((item, i) => (
              <div key={i} style={checkboxLine}>
                <div style={checkbox} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MaterialLayout>
  );
}

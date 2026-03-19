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
  margin: '0 0 16px 0',
};

const objections = [
  {
    objection: 'We can\'t have AI writing arbitrary code on our machines.',
    response:
      'Claude Code writes within a sandbox \u2014 filesystem writes are restricted to the project directory, network access requires explicit approval, and dangerous commands are blocked by default. The permission system is an independent enforcement layer \u2014 even if the model is influenced by a prompt injection, it can\'t bypass the sandbox.',
  },
  {
    objection: 'What about prompt injection from malicious code in our repo?',
    response:
      'Claude Code defends with multiple layers: the permission system prevents unauthorized actions regardless of model influence, context-aware analysis flags suspicious patterns, and command injection detection catches breakout attempts. The key insight: permissions are evaluated independently of the model\'s output.',
  },
  {
    objection: 'Where does our code/data go?',
    response:
      'Your code is processed through the API with limited retention. Customers can opt out of data being used for training entirely. For maximum control, deploy through Bedrock/Vertex/Foundry \u2014 your data stays in your cloud, billed through your existing agreement.',
  },
  {
    objection: 'Do you have compliance documentation?',
    response:
      'SOC 2 Type 2 and ISO 27001 certifications are available through the Anthropic Trust Center. We also provide data processing agreements, security whitepapers, and can arrange security team briefings for enterprise evaluations.',
  },
  {
    objection: 'How do we maintain developer control at scale?',
    response:
      'Managed settings give administrators centralized control \u2014 enforce permission rules, restrict MCP servers to an approved list, disable bypass modes, and require specific hook configurations. These take highest precedence and can\'t be overridden by individual developers.',
  },
];

export default function F6a_SecurityBattlecard() {
  return (
    <MaterialLayout
      id="F6a"
      title="Security Objection Handler"
      subtitle="Defense-in-depth for every security conversation"
      color={C.orange}
      category="Foundations"
      format="Battlecard"
    >
      {/* ════════════ FRONT ════════════ */}
      <div className="card-front">
        <h2 style={sectionHeading}>Defense-in-Depth Model</h2>

        {/* Nested concentric layers */}
        <div
          style={{
            border: `2px solid ${C.faint}`,
            borderRadius: 10,
            padding: 16,
            background: C.faint + '08',
          }}
        >
          {/* Layer 1 label */}
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: C.muted,
              marginBottom: 6,
            }}
          >
            Layer 1 &mdash; Compliance
          </div>
          <ul style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.dark, lineHeight: 1.6, margin: '0 0 12px 16px', padding: 0 }}>
            <li>SOC 2 Type 2, ISO 27001 certifications</li>
            <li>Anthropic Trust Center for documentation</li>
            <li>Data processing agreements for enterprise</li>
          </ul>

          <div
            style={{
              border: `2px solid ${C.blue}`,
              borderRadius: 8,
              padding: 14,
              background: C.blue + '0c',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: C.blue,
                marginBottom: 6,
              }}
            >
              Layer 2 &mdash; Managed Settings
            </div>
            <ul style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.dark, lineHeight: 1.6, margin: '0 0 12px 16px', padding: 0 }}>
              <li>Centralized admin control over all users</li>
              <li>Enforced policies that can&apos;t be overridden</li>
              <li>Restrict MCP servers to approved list</li>
            </ul>

            <div
              style={{
                border: `2px solid ${C.green}`,
                borderRadius: 8,
                padding: 14,
                background: C.green + '10',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: C.green,
                  marginBottom: 6,
                }}
              >
                Layer 3 &mdash; Hooks
              </div>
              <ul style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.dark, lineHeight: 1.6, margin: '0 0 12px 16px', padding: 0 }}>
                <li>Custom scripts enforce guardrails</li>
                <li>Pre-commit linting, post-edit testing</li>
                <li>Pre-push security audits</li>
              </ul>

              <div
                style={{
                  border: `2px solid ${C.orange}`,
                  borderRadius: 8,
                  padding: 14,
                  background: C.orange + '14',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: C.orange,
                    marginBottom: 6,
                  }}
                >
                  Layer 4 &mdash; Permissions
                </div>
                <ul style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.dark, lineHeight: 1.6, margin: '0 0 12px 16px', padding: 0 }}>
                  <li>Three tiers: Interactive / Auto-accept / Headless</li>
                  <li>Evaluated independently of model output</li>
                  <li>Blocks unauthorized actions even under prompt injection</li>
                </ul>

                <div
                  style={{
                    border: `2px solid ${C.dark}`,
                    borderRadius: 6,
                    padding: 14,
                    background: C.dark + '0a',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: C.dark,
                      marginBottom: 6,
                    }}
                  >
                    Layer 5 &mdash; Sandboxing
                  </div>
                  <ul style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.dark, lineHeight: 1.6, margin: '0 0 0 16px', padding: 0 }}>
                    <li>OS-level filesystem + network isolation</li>
                    <li>Write access limited to project directory</li>
                    <li>Dangerous commands blocked by default</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════ BACK ════════════ */}
      <div className="card-back page-break-before" style={{ marginTop: 32 }}>
        <h2 style={sectionHeading}>Objection Responses</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {objections.map((o, i) => (
            <div
              key={i}
              style={{
                background: C.cream,
                border: `1px solid ${C.lightGray}`,
                borderRadius: 6,
                padding: '16px 18px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 13,
                  fontStyle: 'italic',
                  color: C.orange,
                  lineHeight: 1.5,
                  marginBottom: 10,
                }}
              >
                &ldquo;{o.objection}&rdquo;
              </div>
              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 12,
                  color: C.dark,
                  lineHeight: 1.6,
                }}
              >
                {o.response}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MaterialLayout>
  );
}

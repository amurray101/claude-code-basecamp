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

const cloudOptions = [
  {
    label: 'AWS',
    color: C.orange,
    path: 'Bedrock',
    details: 'IAM roles + OIDC auth. Data in customer\u2019s AWS account. CloudTrail audit logging.',
  },
  {
    label: 'GCP',
    color: C.blue,
    path: 'Vertex AI',
    details: 'Workload Identity Federation + service accounts. Google Cloud security & billing.',
  },
  {
    label: 'Azure',
    color: '#0078d4',
    path: 'Foundry',
    details: 'Azure-managed credentials. Azure AD integration.',
  },
  {
    label: 'Multi-cloud / No preference',
    color: C.green,
    path: 'Anthropic API Direct',
    details: 'API key auth. Usage-based billing. Most flexible.',
  },
];

const ciUseCases = [
  'Automated code review',
  'PR implementation',
  'Security audits',
  'Test generation',
];

const phases = [
  {
    phase: 'Phase 1: Pilot',
    size: '1\u20135 devs',
    actions: 'Install, write CLAUDE.md, daily coding.',
    goal: 'Prove individual value.',
  },
  {
    phase: 'Phase 2: Team',
    size: '5\u201325 devs',
    actions: 'Standardize CLAUDE.md, add hooks, connect MCP.',
    goal: 'Team productivity gains.',
  },
  {
    phase: 'Phase 3: Org',
    size: '25+ devs',
    actions: 'Deploy via cloud provider, managed settings, GitHub Actions, training.',
    goal: 'Engineering platform.',
  },
];

const sectionHeading = {
  fontFamily: 'var(--serif)',
  fontSize: 17,
  fontWeight: 400,
  color: C.dark,
  margin: '0 0 14px 0',
};

const monoLabel = {
  fontFamily: 'var(--mono)',
  fontSize: 10,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: C.muted,
};

export default function F7a_DeploymentPathFinder() {
  return (
    <MaterialLayout
      id="F7a"
      title="Deployment Path Finder"
      subtitle="Find the right deployment path for any customer"
      color={C.green}
      category="Foundations"
      format="Decision Tree"
      landscape={true}
    >
      <div className="print-landscape">
        {/* ── Primary Decision ── */}
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              background: C.green + '18',
              border: `2px solid ${C.green}`,
              borderRadius: 8,
              padding: '14px 24px',
              textAlign: 'center',
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 16,
                fontWeight: 400,
                color: C.dark,
              }}
            >
              What is the customer&rsquo;s primary cloud provider?
            </span>
          </div>

          {/* Vertical connector from question */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 2,
                height: 20,
                background: C.gray,
              }}
            />
          </div>

          {/* Horizontal connector line */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              position: 'relative',
              marginBottom: 0,
            }}
          >
            {/* Horizontal line behind the boxes */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '12.5%',
                right: '12.5%',
                height: 2,
                background: C.gray,
              }}
            />
          </div>

          {/* Branch boxes */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              gap: 12,
            }}
          >
            {cloudOptions.map((opt) => (
              <div key={opt.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Vertical connector into box */}
                <div
                  style={{
                    width: 2,
                    height: 16,
                    background: C.gray,
                    marginBottom: 0,
                  }}
                />
                {/* Arrow */}
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 14,
                    color: C.gray,
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  &darr;
                </div>
                {/* Box */}
                <div
                  style={{
                    background: C.cream,
                    border: `1px solid ${C.lightGray}`,
                    borderTop: `3px solid ${opt.color}`,
                    borderRadius: 6,
                    padding: '14px 16px',
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.dark,
                      marginBottom: 4,
                    }}
                  >
                    {opt.label}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 12,
                      fontWeight: 600,
                      color: opt.color,
                      marginBottom: 8,
                    }}
                  >
                    &rarr; {opt.path}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: 11,
                      color: C.muted,
                      lineHeight: 1.5,
                    }}
                  >
                    {opt.details}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Secondary Branch: CI/CD ── */}
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              background: C.blue + '12',
              border: `2px solid ${C.blue}60`,
              borderRadius: 8,
              padding: '14px 24px',
              textAlign: 'center',
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 16,
                fontWeight: 400,
                color: C.dark,
              }}
            >
              Do they need CI/CD integration?
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
            }}
          >
            {/* Yes branch */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.green,
                  marginBottom: 8,
                }}
              >
                YES &darr;
              </div>
              <div
                style={{
                  background: C.cream,
                  border: `1px solid ${C.lightGray}`,
                  borderLeft: `4px solid ${C.green}`,
                  borderRadius: 6,
                  padding: '16px 20px',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.dark,
                    marginBottom: 10,
                  }}
                >
                  GitHub Actions
                </div>
                <pre
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 11,
                    color: C.dark,
                    background: C.bg,
                    border: `1px solid ${C.lightGray}`,
                    borderRadius: 4,
                    padding: '12px 14px',
                    margin: '0 0 12px 0',
                    overflow: 'auto',
                    lineHeight: 1.6,
                    whiteSpace: 'pre',
                  }}
                >
{`- uses: anthropics/claude-code-action@v1
  with:
    anthropic_api_key: \${{ secrets.ANTHROPIC_API_KEY }}`}
                </pre>
                <div
                  style={{
                    ...monoLabel,
                    marginBottom: 6,
                  }}
                >
                  Common CI/CD Use Cases
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {ciUseCases.map((uc) => (
                    <span
                      key={uc}
                      style={{
                        fontFamily: 'var(--sans)',
                        fontSize: 11,
                        color: C.muted,
                        background: C.bg,
                        border: `1px solid ${C.lightGray}`,
                        borderRadius: 4,
                        padding: '4px 10px',
                      }}
                    >
                      {uc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* No branch */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.gray,
                  marginBottom: 8,
                }}
              >
                NO &darr;
              </div>
              <div
                style={{
                  background: C.cream,
                  border: `1px solid ${C.lightGray}`,
                  borderLeft: `4px solid ${C.gray}`,
                  borderRadius: 6,
                  padding: '16px 20px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 120,
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: 13,
                    color: C.muted,
                    margin: 0,
                    textAlign: 'center',
                    lineHeight: 1.6,
                  }}
                >
                  Skip to Phased Rollout below.
                  <br />
                  CI/CD can be added later in Phase 3.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Phased Rollout Timeline ── */}
        <div>
          <h2
            style={{
              ...sectionHeading,
              fontSize: 18,
              marginBottom: 16,
            }}
          >
            Phased Rollout
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 0,
              position: 'relative',
            }}
          >
            {phases.map((p, i) => (
              <div
                key={p.phase}
                style={{
                  display: 'flex',
                  alignItems: 'stretch',
                }}
              >
                {/* Phase box */}
                <div
                  style={{
                    background: C.cream,
                    border: `1px solid ${C.lightGray}`,
                    borderTop: `3px solid ${C.green}`,
                    borderRadius: 6,
                    padding: '16px 18px',
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: 14,
                      fontWeight: 600,
                      color: C.dark,
                      marginBottom: 2,
                    }}
                  >
                    {p.phase}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 11,
                      color: C.green,
                      marginBottom: 10,
                    }}
                  >
                    {p.size}
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: 12,
                      color: C.muted,
                      lineHeight: 1.55,
                      margin: '0 0 10px 0',
                    }}
                  >
                    {p.actions}
                  </p>
                  <div
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.dark,
                    }}
                  >
                    Goal:{' '}
                    <span style={{ fontWeight: 400, color: C.muted }}>
                      {p.goal}
                    </span>
                  </div>
                </div>

                {/* Arrow connector between phases */}
                {i < phases.length - 1 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 8px',
                      fontFamily: 'var(--mono)',
                      fontSize: 20,
                      color: C.gray,
                      userSelect: 'none',
                    }}
                  >
                    &rarr;
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MaterialLayout>
  );
}

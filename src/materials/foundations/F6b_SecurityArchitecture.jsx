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

const ringLabel = {
  fontFamily: 'var(--mono)',
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  marginBottom: 6,
};

const ringDetail = {
  fontFamily: 'var(--sans)',
  fontSize: 11,
  color: C.dark,
  lineHeight: 1.5,
};

const monoSnippet = {
  fontFamily: 'var(--mono)',
  fontSize: 10,
  color: C.muted,
  lineHeight: 1.5,
  background: C.dark + '0a',
  borderRadius: 4,
  padding: '4px 8px',
  display: 'inline-block',
  marginTop: 4,
};

const arrowBox = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 14px',
  background: C.cream,
  border: `1px solid ${C.lightGray}`,
  borderRadius: 6,
  fontFamily: 'var(--sans)',
  fontSize: 11,
  color: C.dark,
  lineHeight: 1.5,
};

export default function F6b_SecurityArchitecture() {
  return (
    <MaterialLayout
      id="F6b"
      title="Security Architecture Diagram"
      subtitle="Visual security model reference"
      color={C.orange}
      category="Foundations"
      format="Architecture Reference"
    >
      {/* ── Concentric Rings Diagram ── */}
      <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: C.muted, marginBottom: 10, fontStyle: 'italic' }}>
        Present from the outside in: start with Sandboxing, then add each layer.
      </div>
      <div
        style={{
          border: `2px solid ${C.dark}`,
          borderRadius: 12,
          padding: 18,
          background: C.dark + '06',
          marginBottom: 24,
        }}
      >
        {/* Ring 1: Sandboxing (OS) */}
        <div style={{ ...ringLabel, color: C.dark, display: 'flex', alignItems: 'center', gap: 8 }}>
          Sandboxing (OS)
          <span style={{ fontFamily: 'var(--sans)', fontSize: 9, fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: C.orange }}>&larr; Start here</span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            marginBottom: 12,
          }}
        >
          {['Filesystem isolation', 'Network restriction', 'Command blocklist'].map(
            (item) => (
              <span
                key={item}
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 10,
                  color: C.dark,
                  background: C.bg,
                  border: `1px solid ${C.lightGray}`,
                  borderRadius: 4,
                  padding: '3px 8px',
                }}
              >
                {item}
              </span>
            )
          )}
        </div>

        {/* Ring 2: Permissions */}
        <div
          style={{
            border: `2px solid ${C.orange}`,
            borderRadius: 10,
            padding: 16,
            background: C.orange + '08',
            marginBottom: 0,
          }}
        >
          <div style={{ ...ringLabel, color: C.orange }}>Permissions (User)</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 10,
                color: C.dark,
                background: C.bg,
                border: `1px solid ${C.lightGray}`,
                borderRadius: 4,
                padding: '3px 8px',
              }}
            >
              Interactive
            </span>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.gray }}>&rarr;</span>
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 10,
                color: C.dark,
                background: C.bg,
                border: `1px solid ${C.lightGray}`,
                borderRadius: 4,
                padding: '3px 8px',
              }}
            >
              Auto-accept
            </span>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: C.gray }}>&rarr;</span>
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 10,
                color: C.dark,
                background: C.bg,
                border: `1px solid ${C.lightGray}`,
                borderRadius: 4,
                padding: '3px 8px',
              }}
            >
              Headless
            </span>
          </div>

          {/* Ring 3: Hooks */}
          <div
            style={{
              border: `2px solid ${C.green}`,
              borderRadius: 8,
              padding: 14,
              background: C.green + '0a',
            }}
          >
            <div style={{ ...ringLabel, color: C.green }}>Hooks (Team)</div>
            <div style={ringDetail}>
              Custom scripts enforce guardrails at every stage
            </div>
            <div style={monoSnippet}>
              {`"pre-commit": ["npm run lint"], "pre-push": ["npm run test:e2e"]`}
            </div>

            {/* Ring 4: Managed Settings */}
            <div
              style={{
                border: `2px solid ${C.blue}`,
                borderRadius: 8,
                padding: 14,
                background: C.blue + '0c',
                marginTop: 12,
              }}
            >
              <div style={{ ...ringLabel, color: C.blue }}>Managed Settings (Admin)</div>
              <div style={ringDetail}>
                Centralized admin control, enforced policies, can&apos;t be overridden by users
              </div>
              <div style={monoSnippet}>
                {`{"disableBypassPermissionsMode": true, "allowManagedMcpServersOnly": true}`}
              </div>

              {/* Ring 5 (center): Compliance & Governance */}
              <div
                style={{
                  border: `2px solid ${C.faint}`,
                  borderRadius: 6,
                  padding: 14,
                  background: C.faint + '08',
                  marginTop: 12,
                  textAlign: 'center',
                }}
              >
                <div style={{ ...ringLabel, color: C.muted }}>Compliance &amp; Governance</div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 10,
                      color: C.green,
                      background: C.green + '15',
                      border: `1px solid ${C.green}30`,
                      borderRadius: 4,
                      padding: '3px 8px',
                    }}
                  >
                    SOC 2 Type 2
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 10,
                      color: C.blue,
                      background: C.blue + '15',
                      border: `1px solid ${C.blue}30`,
                      borderRadius: 4,
                      padding: '3px 8px',
                    }}
                  >
                    ISO 27001
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 10,
                      color: C.muted,
                      background: C.cream,
                      border: `1px solid ${C.lightGray}`,
                      borderRadius: 4,
                      padding: '3px 8px',
                    }}
                  >
                    Trust Center
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Data Flow Arrows ── */}
      <div
        style={{
          fontFamily: 'var(--mono)',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: C.muted,
          marginBottom: 10,
        }}
      >
        Data Flow
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {/* Flow 1: Developer → Claude Code → Sandbox → Project Files */}
        <div style={arrowBox}>
          <span style={{ fontWeight: 600 }}>Developer</span>
          <span style={{ color: C.gray }}>&rarr;</span>
          <span style={{ fontWeight: 600 }}>Claude Code</span>
          <span style={{ color: C.gray }}>&rarr;</span>
          <span style={{ fontWeight: 600 }}>Sandbox</span>
          <span style={{ color: C.gray }}>&rarr;</span>
          <span style={{ fontWeight: 600 }}>Project Files</span>
          <span
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 9,
              color: C.green,
              background: C.green + '12',
              borderRadius: 3,
              padding: '2px 6px',
              marginLeft: 'auto',
            }}
          >
            Write access: project directory only
          </span>
        </div>

        {/* Flow 2: Claude Code → API → Cloud Provider */}
        <div style={arrowBox}>
          <span style={{ fontWeight: 600 }}>Claude Code</span>
          <span style={{ color: C.gray }}>&rarr;</span>
          <span style={{ fontWeight: 600 }}>API</span>
          <span style={{ color: C.gray }}>&rarr;</span>
          <span style={{ fontWeight: 600 }}>Cloud Provider</span>
          <span
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 9,
              color: C.blue,
              background: C.blue + '12',
              borderRadius: 3,
              padding: '2px 6px',
              marginLeft: 'auto',
            }}
          >
            Data stays in your cloud
          </span>
        </div>

        {/* Callouts */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div
            style={{
              flex: 1,
              fontFamily: 'var(--mono)',
              fontSize: 10,
              color: C.muted,
              background: C.cream,
              border: `1px solid ${C.lightGray}`,
              borderRadius: 4,
              padding: '6px 10px',
              textAlign: 'center',
            }}
          >
            No local API key storage
          </div>
          <div
            style={{
              flex: 1,
              fontFamily: 'var(--mono)',
              fontSize: 10,
              color: C.muted,
              background: C.cream,
              border: `1px solid ${C.lightGray}`,
              borderRadius: 4,
              padding: '6px 10px',
              textAlign: 'center',
            }}
          >
            Secure credential handling
          </div>
        </div>
      </div>

      {/* ── Compliance Badges ── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '10px 12px',
            background: C.green + '12',
            border: `1px solid ${C.green}30`,
            borderRadius: 6,
          }}
        >
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600, color: C.green }}>
            SOC 2 Type 2
          </div>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 10, color: C.muted, marginTop: 2 }}>
            Certified
          </div>
        </div>
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '10px 12px',
            background: C.blue + '12',
            border: `1px solid ${C.blue}30`,
            borderRadius: 6,
          }}
        >
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600, color: C.blue }}>
            ISO 27001
          </div>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 10, color: C.muted, marginTop: 2 }}>
            Certified
          </div>
        </div>
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '10px 12px',
            background: C.orange + '12',
            border: `1px solid ${C.orange}30`,
            borderRadius: 6,
          }}
        >
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600, color: C.orange }}>
            Anthropic Trust Center
          </div>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 10, color: C.muted, marginTop: 2 }}>
            Documentation
          </div>
        </div>
      </div>

      {/* ── Highlighted Callout ── */}
      <div
        style={{
          background: C.orange + '0a',
          border: `1px solid ${C.orange}25`,
          borderLeft: `3px solid ${C.orange}`,
          borderRadius: 6,
          padding: '16px 20px',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 10,
            fontWeight: 600,
            color: C.orange,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Enterprise Deployment
        </div>
        <p
          style={{
            fontFamily: 'var(--sans)',
            fontSize: 13,
            color: C.dark,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          For Bedrock, Vertex, and Foundry deployments: your data stays in your cloud, billed
          through your existing cloud agreement, with no additional Anthropic account required.
        </p>
      </div>
    </MaterialLayout>
  );
}

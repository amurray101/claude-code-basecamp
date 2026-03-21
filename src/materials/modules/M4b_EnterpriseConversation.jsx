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

const sectionBox = {
  background: C.cream,
  border: `1px solid ${C.lightGray}`,
  borderRadius: 6,
  padding: '16px 18px',
  marginBottom: 16,
};

const badge = (color) => ({
  display: 'inline-block',
  fontFamily: 'var(--mono)',
  fontSize: 10,
  fontWeight: 700,
  color: '#fff',
  background: color,
  borderRadius: 10,
  padding: '2px 10px',
  marginLeft: 8,
  verticalAlign: 'middle',
  letterSpacing: '0.03em',
});

const fillLine = {
  display: 'block',
  width: '100%',
  borderBottom: `1.5px solid ${C.gray}`,
  minHeight: 22,
  marginBottom: 4,
};

export default function M4b_EnterpriseConversation() {
  return (
    <MaterialLayout
      id="M4b"
      title="Enterprise Deployment Conversation"
      subtitle="Guide the conversation from discovery to close"
      color={C.orange}
      category="Day 4"
      format="Talk Track Script"
    >
      {/* ════════════ PAGE 1 ════════════ */}
      <div>
        <h2 style={sectionHeading}>Conversation Flow</h2>

        {/* Opening */}
        <div style={{ ...sectionBox, borderLeft: `4px solid ${C.orange}` }}>
          <h3 style={subHeading}>
            Opening (2-3 min)
            <span style={badge(C.orange)}>OPEN</span>
          </h3>
          <div style={{ ...bodyText, fontStyle: 'italic', color: C.muted }}>
            "Thanks for making time. I'd like to understand your engineering workflow, then show you how Claude Code fits &mdash; and give you honest numbers on what it would look like for your team."
          </div>
        </div>

        {/* Discovery Questions */}
        <div style={{ ...sectionBox, borderLeft: `4px solid ${C.blue}` }}>
          <h3 style={subHeading}>
            Discovery Questions (5-10 min)
            <span style={badge(C.blue)}>DISCOVER</span>
          </h3>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li style={listItem}>"How many developers on the team? What's the breakdown by role?"</li>
            <li style={listItem}>"What's your cloud environment? AWS, GCP, Azure, multi-cloud?"</li>
            <li style={listItem}>"What does your CI/CD pipeline look like today?"</li>
            <li style={listItem}>"What's the most time-consuming coding task your team does regularly?"</li>
            <li style={listItem}>"Have you evaluated other AI coding tools? What worked and what didn't?"</li>
            <li style={listItem}>"What are your security requirements? Who needs to sign off?"</li>
          </ul>
        </div>

        {/* Architecture Recommendation */}
        <div style={{ ...sectionBox, borderLeft: `4px solid ${C.green}` }}>
          <h3 style={subHeading}>
            Architecture Recommendation (5 min)
            <span style={badge(C.green)}>RECOMMEND</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              {
                provider: 'AWS',
                rec: '"We recommend Bedrock deployment. Data stays in your account, IAM auth, CloudTrail logging."',
              },
              {
                provider: 'GCP',
                rec: '"Vertex AI is the path. Workload Identity Federation, native billing."',
              },
              {
                provider: 'Azure',
                rec: '"Foundry integration. Azure AD, managed credentials."',
              },
              {
                provider: 'Multi-cloud',
                rec: '"Direct API with proxy support. Most flexible."',
              },
            ].map((item) => (
              <div key={item.provider} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.green,
                    background: 'rgba(120,140,93,0.12)',
                    borderRadius: 4,
                    padding: '2px 8px',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  {item.provider}
                </div>
                <div style={{ ...bodyText, fontStyle: 'italic', color: C.muted, fontSize: 11 }}>
                  {item.rec}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phased Rollout */}
        <div style={{ ...sectionBox, borderLeft: `4px solid ${C.gray}` }}>
          <h3 style={subHeading}>
            Phased Rollout (3 min)
            <span style={badge(C.gray)}>PLAN</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              {
                phase: 'Phase 1',
                timing: 'Weeks 1-2',
                detail: '3-5 champion developers. Install, write CLAUDE.md, daily use.',
              },
              {
                phase: 'Phase 2',
                timing: 'Weeks 3-6',
                detail: 'Expand to 15-25. Standardize CLAUDE.md, add hooks, connect MCP.',
              },
              {
                phase: 'Phase 3',
                timing: 'Month 2+',
                detail: 'Org-wide via cloud provider. Managed settings, GitHub Actions, training.',
              },
            ].map((p) => (
              <div key={p.phase} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#fff',
                    background: C.gray,
                    borderRadius: 4,
                    padding: '2px 8px',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  {p.phase}
                </div>
                <div style={bodyText}>
                  <strong>{p.timing}:</strong> {p.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════ PAGE 2 ════════════ */}
      <div className="page-break-before" style={{ marginTop: 32 }}>
        {/* Live Cost Calculation */}
        <div style={sectionBox}>
          <h2 style={subHeading}>Live Cost Calculation</h2>
          <p style={{ ...bodyText, color: C.muted, marginBottom: 12 }}>
            Walk through with the customer (see F7b for full ROI reference):
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Team size: ___ developers',
              'Daily cost: ___ devs \u00d7 $6/day = $___/day',
              'Time saved: ___ devs \u00d7 1 hr/day = ___ hours/day',
              'Daily value: ___ hrs \u00d7 $150/hr = $___/day',
              'ROI: $___/day value \u00f7 $___/day cost = ___\u00d7',
            ].map((line, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={fillLine}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: C.dark }}>
                    {line}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Bridge */}
        <div style={{ ...sectionBox, borderLeft: `4px solid ${C.blue}` }}>
          <h2 style={subHeading}>Security Bridge</h2>
          <div style={{ ...bodyText, fontStyle: 'italic', color: C.muted }}>
            "When security comes up: 'Let me walk you through our defense-in-depth model.' Hand them F6a (Security Objection Handler). Walk the five layers."
          </div>
        </div>

        {/* Competitive Bridge */}
        <div style={{ ...sectionBox, borderLeft: `4px solid ${C.orange}` }}>
          <h2 style={subHeading}>Competitive Bridge</h2>
          <div style={{ ...bodyText, fontStyle: 'italic', color: C.muted }}>
            "If they mention competitors: 'Happy to compare directly.' Reference M4a (Competitive Battlecard). Key reframe: different category, not different product."
          </div>
        </div>

        {/* Close with Pilot Proposal */}
        <div
          style={{
            background: C.dark,
            color: '#e8e6dc',
            borderRadius: 6,
            padding: '18px 20px',
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: C.orange,
              marginBottom: 10,
            }}
          >
            Close with Pilot Proposal
          </div>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 12, lineHeight: 1.7, marginBottom: 12 }}>
            "Here's what I'd suggest: let's start with 3-5 developers for two weeks. We'll help set up [cloud provider] deployment, write the initial CLAUDE.md for your main repo, and connect one MCP integration. At the end of two weeks, those developers will have concrete data on time saved. That's usually enough to make the expansion decision easy."
          </div>
          <div
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 12,
              lineHeight: 1.7,
              color: C.orange,
              fontWeight: 600,
            }}
          >
            "What are the next steps to get a pilot approved on your side?"
          </div>
        </div>
      </div>
    </MaterialLayout>
  );
}

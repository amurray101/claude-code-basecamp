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

export default function F1_WhoWeAre() {
  return (
    <MaterialLayout
      id="F1"
      title="Who We Are"
      subtitle="Anthropic at a glance"
      color={C.orange}
      category="Foundations"
      format="Pocket Guide"
    >
      {/* 2x2 panel grid with fold marks */}
      <div
        className="fold-marks"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'auto auto',
          gap: 0,
          border: `1px solid ${C.lightGray}`,
          borderRadius: 8,
          overflow: 'hidden',
          background: C.cream,
        }}
      >
        {/* ── Panel 1: Front (top-left) ── */}
        <div
          style={{
            padding: '36px 32px',
            borderRight: `1px dashed ${C.gray}`,
            borderBottom: `1px dashed ${C.gray}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 220,
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 32,
              fontWeight: 400,
              color: C.dark,
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            Anthropic
          </h2>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 11,
              color: C.muted,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginTop: 8,
            }}
          >
            Claude Code Basecamp
          </div>
          {/* Decorative orange accent line */}
          <div
            style={{
              width: 48,
              height: 3,
              background: C.orange,
              borderRadius: 2,
              marginTop: 20,
            }}
          />
        </div>

        {/* ── Panel 2: Our founding premise (top-right) ── */}
        <div
          style={{
            padding: '28px 28px',
            borderBottom: `1px dashed ${C.gray}`,
            minHeight: 220,
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 17,
              fontWeight: 400,
              color: C.dark,
              margin: '0 0 14px 0',
            }}
          >
            Our founding premise
          </h3>
          <p
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 13,
              color: C.dark,
              lineHeight: 1.65,
              margin: '0 0 16px 0',
            }}
          >
            AI has the potential to pose unprecedented risks to humanity if things go badly.
            It also has the potential to create unprecedented benefits for humanity if things
            go well.
          </p>
          <div
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 12,
              color: C.muted,
              lineHeight: 1.6,
            }}
          >
            <p style={{ margin: '0 0 6px 0' }}>
              Founded 2021 by Dario and Daniela Amodei.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ fontWeight: 600, color: C.dark }}>Public Benefit Corporation</strong>{' '}
              &mdash; charter legally requires weighing mission alongside business outcomes.
            </p>
          </div>
        </div>

        {/* ── Panel 3: How we work (bottom-left) ── */}
        <div
          style={{
            padding: '28px 28px',
            borderRight: `1px dashed ${C.gray}`,
            minHeight: 220,
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 17,
              fontWeight: 400,
              color: C.dark,
              margin: '0 0 14px 0',
            }}
          >
            How we work
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              {
                label: 'High-trust, low-ego',
                desc: 'Communicate kindly and directly, assume good intentions',
              },
              {
                label: 'Empirical first',
                desc: 'Care about impact size, not method sophistication',
              },
              {
                label: 'Simplest solution',
                desc: "Don't invent a spaceship if all we need is a bicycle",
              },
              {
                label: 'Safety as science',
                desc: 'Treat AI safety as systematic science, not rules',
              },
            ].map((v) => (
              <div
                key={v.label}
                style={{
                  background: C.bg,
                  border: `1px solid ${C.lightGray}`,
                  borderRadius: 6,
                  padding: '10px 12px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: 12,
                    fontWeight: 600,
                    color: C.dark,
                    marginBottom: 3,
                  }}
                >
                  {v.label}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: 11,
                    color: C.muted,
                    lineHeight: 1.5,
                  }}
                >
                  {v.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Panel 4: Your role in the mission (bottom-right) ── */}
        <div
          style={{
            padding: '28px 28px',
            minHeight: 220,
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 17,
              fontWeight: 400,
              color: C.dark,
              margin: '0 0 14px 0',
            }}
          >
            Your role in the mission
          </h3>
          <p
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 13,
              color: C.dark,
              lineHeight: 1.65,
              margin: '0 0 20px 0',
            }}
          >
            Every role here contributes to this mission. Whether advising customers, building
            implementations, or pushing the frontier &mdash; the quality of your work directly
            shapes whether organizations trust AI to do important things.
          </p>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 11,
              color: C.muted,
              letterSpacing: '0.02em',
              marginBottom: 10,
            }}
          >
            My personal mission statement:
          </div>
          <div className="fill-line" style={{ borderBottom: `1.5px solid ${C.lightGray}`, minHeight: '1.6em', width: '100%', marginBottom: 8 }} />
          <div className="fill-line" style={{ borderBottom: `1.5px solid ${C.lightGray}`, minHeight: '1.6em', width: '100%', marginBottom: 8 }} />
          <div className="fill-line" style={{ borderBottom: `1.5px solid ${C.lightGray}`, minHeight: '1.6em', width: '100%', marginBottom: 8 }} />
          <div className="fill-line" style={{ borderBottom: `1.5px solid ${C.lightGray}`, minHeight: '1.6em', width: '100%', marginBottom: 0 }} />
        </div>
      </div>
    </MaterialLayout>
  );
}

import './PrintStyles.css';

// ─── BRAND TOKENS ───
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

/**
 * MaterialLayout — shared wrapper for all Basecamp printable materials.
 *
 * Props:
 *   id        – material identifier, e.g. "QRC-001"
 *   title     – main heading
 *   subtitle  – optional secondary heading
 *   color     – accent color (hex string, defaults to C.orange)
 *   category  – context label, e.g. "Foundations", "Day 2", "PE Pre-Sales"
 *   format    – material type, e.g. "Quick Reference Card", "Battlecard"
 *   landscape – boolean, adds print-landscape class for landscape PDF
 *   children  – material content
 */
export default function MaterialLayout({
  id,
  title,
  subtitle,
  color = C.orange,
  category,
  format,
  children,
  landscape = false,
}) {
  return (
    <div
      className={`material-layout${landscape ? ' print-landscape' : ''}`}
      style={{
        fontFamily: 'var(--sans)',
        color: C.dark,
        background: C.bg,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Header strip ── */}
      <header
        className="material-header no-break"
        style={{
          borderBottom: `3px solid ${color}`,
          padding: '20px 32px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Category & format label */}
          {(category || format) && (
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 11,
                color: C.muted,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              {[category, format].filter(Boolean).join(' \u00b7 ')}
            </div>
          )}

          {/* Title */}
          <h1
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 28,
              fontWeight: 400,
              lineHeight: 1.15,
              color: C.dark,
              margin: 0,
            }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p
              style={{
                fontFamily: 'var(--sans)',
                fontSize: 15,
                color: C.muted,
                marginTop: 4,
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* ID badge with colored accent */}
        {id && (
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 11,
              color: C.faint,
              background: C.cream,
              border: `1px solid ${C.lightGray}`,
              borderTop: `3px solid ${color}`,
              borderRadius: 4,
              padding: '6px 12px 5px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              alignSelf: 'flex-start',
            }}
          >
            {id}
          </div>
        )}
      </header>

      {/* ── Body ── */}
      <main
        style={{
          flex: 1,
          padding: '24px 32px',
        }}
      >
        {children}
      </main>

      {/* ── Footer ── */}
      <footer
        className="material-footer"
        style={{
          borderTop: `1px solid ${C.lightGray}`,
          padding: '12px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 10,
            color: C.faint,
            letterSpacing: '0.03em',
          }}
        >
          Claude Code Basecamp
        </span>

        <span
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 10,
            color: C.faint,
          }}
        >
          {[id, category, format].filter(Boolean).join(' \u2014 ')}
        </span>
      </footer>
    </div>
  );
}

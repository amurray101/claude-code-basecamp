import MaterialLayout from '../components/MaterialLayout';

const C = {
  bg: '#faf9f5', dark: '#141413', orange: '#d97757', blue: '#6a9bcc',
  green: '#788c5d', gray: '#b0aea5', lightGray: '#e8e6dc', cream: '#f5f3ee',
  muted: '#6a685e', faint: '#b0aea5',
};

const sectionHeading = { fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 400, color: C.dark, margin: '0 0 14px 0' };
const subHeading = { fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 400, color: C.dark, margin: '0 0 10px 0' };
const bodyText = { fontFamily: 'var(--sans)', fontSize: 12, color: C.dark, lineHeight: 1.6 };
const listItem = { fontFamily: 'var(--sans)', fontSize: 12, color: C.dark, lineHeight: 1.6, marginBottom: 6 };
const inlineCode = { fontFamily: 'var(--mono)', fontSize: 11, background: C.lightGray, borderRadius: 3, padding: '1px 5px' };
const sectionBox = { background: C.cream, border: `1px solid ${C.lightGray}`, borderRadius: 6, padding: '16px 18px', marginBottom: 16 };

export default function M3e_IDEIntegration() {
  return (
    <MaterialLayout
      id="M3e"
      title="IDE Integration"
      subtitle="Claude Code inside your editor"
      color={C.green}
      category="Day 3"
      format="Quick Reference Card"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Left column — VS Code */}
        <div>
          <h2 style={sectionHeading}>VS Code Extension</h2>

          <div style={sectionBox}>
            <h3 style={subHeading}>Setup</h3>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li style={listItem}>Search <strong>&ldquo;Claude Code&rdquo;</strong> in Extensions marketplace</li>
              <li style={listItem}>Click Install</li>
              <li style={listItem}><span style={inlineCode}>Cmd/Ctrl+Shift+P</span> &rarr; <strong>&ldquo;Claude Code: Sign In&rdquo;</strong></li>
            </ul>
          </div>

          <div style={sectionBox}>
            <h3 style={subHeading}>Key Features</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { name: 'Inline diffs', desc: 'See exactly what Claude wants to change, highlighted in the editor' },
                { name: 'Claude panel', desc: 'Dedicated sidebar for the conversation — click the Claude icon or use Command Palette' },
                { name: 'Command palette', desc: 'All Claude commands accessible via Cmd/Ctrl+Shift+P' },
                { name: 'File context', desc: 'Claude automatically knows which file you have open' },
              ].map((f) => (
                <div key={f.name}>
                  <div style={{ ...bodyText, fontWeight: 600, marginBottom: 1 }}>{f.name}</div>
                  <div style={{ ...bodyText, color: C.muted, fontSize: 11 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — JetBrains + When to use which */}
        <div>
          <h2 style={sectionHeading}>JetBrains Plugin</h2>

          <div style={sectionBox}>
            <h3 style={subHeading}>Setup</h3>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li style={listItem}>Search <strong>&ldquo;Claude Code&rdquo;</strong> in JetBrains Marketplace</li>
              <li style={listItem}>Works with IntelliJ IDEA, PyCharm, WebStorm, and other JetBrains IDEs</li>
              <li style={listItem}>Settings &rarr; Tools &rarr; Claude Code to sign in</li>
            </ul>
          </div>

          <div style={sectionBox}>
            <h3 style={subHeading}>Key Differences from VS Code</h3>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li style={listItem}>Same core capabilities (inline diffs, dedicated panel, command palette)</li>
              <li style={listItem}>Uses a <strong>tool window</strong> instead of a sidebar panel</li>
              <li style={listItem}>Same agentic engine underneath &mdash; choice is about editor preference</li>
            </ul>
          </div>

          <div style={{ background: C.green + '08', border: `1px solid ${C.green}20`, borderRadius: 6, padding: '16px 18px' }}>
            <h3 style={{ ...subHeading, color: C.green }}>When to Use IDE vs. CLI</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <div style={{ ...bodyText, fontWeight: 600 }}>IDE</div>
                <div style={{ ...bodyText, color: C.muted, fontSize: 11 }}>Inline diffs, visual file tree, working with files you&rsquo;re actively reading</div>
              </div>
              <div>
                <div style={{ ...bodyText, fontWeight: 600 }}>CLI</div>
                <div style={{ ...bodyText, color: C.muted, fontSize: 11 }}>Raw speed, working across many files, terminal-first workflow</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MaterialLayout>
  );
}

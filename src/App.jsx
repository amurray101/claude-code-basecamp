import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import MaterialsView from "./materials/MaterialsView";

// ─── BRAND TOKENS ───
const C = {
  bg: "#faf9f5", dark: "#141413", orange: "#d97757", blue: "#6a9bcc",
  green: "#788c5d", gray: "#b0aea5", lightGray: "#e8e6dc", cream: "#f5f3ee",
  text: "#141413", muted: "#6a685e", faint: "#b0aea5",
};

// ─── HELPERS ───
function openInClaude(prompt) {
  window.open(`https://claude.ai/new?q=${encodeURIComponent(prompt)}`, "_blank", "noopener,noreferrer");
}

// ─── PERSISTENT PROGRESS (localStorage) ───
const PROGRESS_DEFAULTS = {
  foundationsDone: false,
  path: null,
  completed: [],
  userName: null,
  foundationSectionsViewed: [],
  moduleSubProgress: {},
  checkpointsCompleted: [],
  certificateEarnedDate: null,
  preworkCompleted: [],
  diagnosticResults: {},
};

function loadProgress() {
  try {
    const raw = localStorage.getItem("basecamp-progress");
    if (!raw) return { ...PROGRESS_DEFAULTS };
    const data = { ...PROGRESS_DEFAULTS, ...JSON.parse(raw) };
    // Migration: if foundationsDone but no sections tracked, backfill all
    if (data.foundationsDone && data.foundationSectionsViewed.length === 0) {
      data.foundationSectionsViewed = ["welcome", "products", "claude-ai", "cowork", "cc-overview", "model-family", "extensions", "claude-code", "how-it-thinks", "configuration", "security", "enterprise"];
    }
    // Migration: backfill cc-overview for users who already have progress tracked
    if (data.foundationSectionsViewed.length > 0 && !data.foundationSectionsViewed.includes("cc-overview")) {
      data.foundationSectionsViewed.push("cc-overview");
    }
    return data;
  } catch {
    return { ...PROGRESS_DEFAULTS };
  }
}
function saveProgress(data) {
  try {
    localStorage.setItem("basecamp-progress", JSON.stringify(data));
  } catch {}
}

// ─── TERMINAL BLOCK COMPONENT ───
function TerminalBlock({ lines, title }) {
  return (
    <div style={{ margin: "16px 0 20px", borderRadius: 10, overflow: "hidden", border: `1px solid #2a2a2a`, background: "#1a1a1a" }}>
      <div style={{ padding: "8px 14px", background: "#222", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
        </div>
        {title && <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#888", marginLeft: 8 }}>{title}</span>}
      </div>
      <div style={{ padding: "14px 16px", overflowX: "auto" }}>
        {lines.map((line, i) => (
          <div key={i} style={{ fontFamily: "var(--mono)", fontSize: 12.5, lineHeight: 1.7, color: line.startsWith("$") ? "#7ec699" : line.startsWith("→") ? C.orange : line.startsWith("✓") || line.startsWith("✔") ? "#28c840" : line.startsWith("#") ? "#666" : "#d4d4d4", whiteSpace: "pre" }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CLAUDE CODE ARCHITECTURE DIAGRAM ───
function ClaudeCodeDiagram() {
  return (
    <div style={{ margin: "20px 0", border: `1px solid ${C.lightGray}`, borderRadius: 12, overflow: "hidden", background: C.cream }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.lightGray}` }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: C.faint, textTransform: "uppercase" }}>Claude Code architecture</div>
      </div>
      <div style={{ padding: 16 }}>
        <svg width="100%" viewBox="0 0 680 520" style={{ display: "block" }}>
          <defs>
            <marker id="a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M2 1L8 5L2 9" fill="none" stroke={C.gray} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </marker>
          </defs>
          {/* Top: User */}
          <text x="340" y="16" textAnchor="middle" fill={C.faint} fontSize="11" fontFamily="IBM Plex Mono, monospace" letterSpacing="1.5">DEVELOPER</text>
          <rect x="230" y="28" width="220" height="48" rx="8" fill={C.orange + "10"} stroke={C.orange + "40"} strokeWidth="0.5" />
          <text x="340" y="48" textAnchor="middle" dominantBaseline="central" fill={C.orange} fontSize="13" fontWeight="500" fontFamily="IBM Plex Sans, sans-serif">Terminal / IDE</text>
          <text x="340" y="64" textAnchor="middle" dominantBaseline="central" fill={C.muted} fontSize="10" fontFamily="IBM Plex Sans, sans-serif">Natural language prompts + slash commands</text>

          <line x1="340" y1="76" x2="340" y2="104" stroke={C.gray} strokeWidth="1" markerEnd="url(#a)" />

          {/* Claude Code core */}
          <rect x="25" y="108" width="630" height="280" rx="16" fill="none" stroke={C.lightGray} strokeWidth="0.5" strokeDasharray="6 4" />
          <text x="340" y="128" textAnchor="middle" fill={C.faint} fontSize="11" fontFamily="IBM Plex Mono, monospace" letterSpacing="1.5">CLAUDE CODE</text>

          {/* Agentic loop */}
          <rect x="180" y="140" width="320" height="52" rx="8" fill={C.blue + "10"} stroke={C.blue + "40"} strokeWidth="0.5" />
          <text x="340" y="160" textAnchor="middle" dominantBaseline="central" fill={C.blue} fontSize="13" fontWeight="500" fontFamily="IBM Plex Sans, sans-serif">Agentic Loop</text>
          <text x="340" y="178" textAnchor="middle" dominantBaseline="central" fill={C.muted} fontSize="10" fontFamily="IBM Plex Sans, sans-serif">Read → Plan → Edit → Test → Iterate</text>

          {/* Arrows to tools */}
          {[137, 340, 543].map((x, i) => <line key={i} x1={x} y1="192" x2={x} y2="216" stroke={C.gray} strokeWidth="1" markerEnd="url(#a)" />)}

          {/* Three tool categories */}
          {[
            { x: 45, label: "Built-in Tools", lines: ["File read/write", "Bash execution", "Git operations", "Search (grep/glob)"], color: C.green },
            { x: 248, label: "Configuration", lines: ["CLAUDE.md context", "Hooks (pre/post)", "Permissions model", "Settings + memory"], color: C.orange },
            { x: 451, label: "Extensions", lines: ["MCP servers", "Custom slash commands", "Agent SDK", "IDE integrations"], color: C.blue },
          ].map((b, i) => (
            <g key={i}>
              <rect x={b.x} y="220" width="185" height="100" rx="8" fill={b.color + "08"} stroke={b.color + "30"} strokeWidth="0.5" />
              <text x={b.x + 92.5} y="240" textAnchor="middle" dominantBaseline="central" fill={b.color} fontSize="13" fontWeight="500" fontFamily="IBM Plex Sans, sans-serif">{b.label}</text>
              {b.lines.map((line, j) => (
                <text key={j} x={b.x + 92.5} y={258 + j * 16} textAnchor="middle" dominantBaseline="central" fill={C.muted} fontSize="10" fontFamily="IBM Plex Sans, sans-serif">{line}</text>
              ))}
            </g>
          ))}

          {/* Composability arrows */}
          <line x1="230" y1="270" x2="248" y2="270" stroke={C.lightGray} strokeWidth="0.8" strokeDasharray="3 3" />
          <line x1="433" y1="270" x2="451" y2="270" stroke={C.lightGray} strokeWidth="0.8" strokeDasharray="3 3" />

          {/* Bottom: what it accesses */}
          {[137, 340, 543].map((x, i) => <line key={i} x1={x} y1="320" x2={x} y2="344" stroke={C.gray} strokeWidth="1" markerEnd="url(#a)" />)}
          {[
            { x: 45, label: "Your codebase", sub: "Full filesystem access" },
            { x: 248, label: "Dev environment", sub: "Shell · processes · ports" },
            { x: 451, label: "External services", sub: "APIs · DBs · CI/CD" },
          ].map((b, i) => (
            <g key={i}>
              <rect x={b.x} y="348" width="185" height="52" rx="8" fill={C.cream} stroke={C.lightGray} strokeWidth="0.5" />
              <text x={b.x + 92.5} y="368" textAnchor="middle" dominantBaseline="central" fill={C.dark} fontSize="12" fontWeight="500" fontFamily="IBM Plex Sans, sans-serif">{b.label}</text>
              <text x={b.x + 92.5} y="386" textAnchor="middle" dominantBaseline="central" fill={C.faint} fontSize="10" fontFamily="IBM Plex Sans, sans-serif">{b.sub}</text>
            </g>
          ))}

          {/* Model tier */}
          <text x="340" y="428" textAnchor="middle" fill={C.faint} fontSize="11" fontFamily="IBM Plex Mono, monospace" letterSpacing="1.5">POWERED BY</text>
          <line x1="340" y1="436" x2="340" y2="456" stroke={C.gray} strokeWidth="1" markerEnd="url(#a)" />
          <rect x="155" y="460" width="370" height="44" rx="8" fill={C.dark + "06"} stroke={C.lightGray} strokeWidth="0.5" />
          <text x="340" y="478" textAnchor="middle" dominantBaseline="central" fill={C.dark} fontSize="13" fontWeight="500" fontFamily="IBM Plex Sans, sans-serif">Claude Sonnet 4 — optimized for agentic coding</text>
          <text x="340" y="494" textAnchor="middle" dominantBaseline="central" fill={C.faint} fontSize="10" fontFamily="IBM Plex Sans, sans-serif">Extended thinking · Tool use · Multi-step planning</text>
        </svg>
      </div>
    </div>
  );
}

// ─── ANTHROPIC PLATFORM DIAGRAM ───
function PlatformDiagram() {
  return (
    <div style={{ margin: "20px 0", border: `1px solid ${C.lightGray}`, borderRadius: 12, overflow: "hidden", background: C.cream }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.lightGray}` }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: C.faint, textTransform: "uppercase" }}>Where Claude Code fits</div>
      </div>
      <div style={{ padding: 16 }}>
        <svg width="100%" viewBox="0 0 680 320" style={{ display: "block" }}>
          <defs>
            <marker id="b" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M2 1L8 5L2 9" fill="none" stroke={C.gray} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </marker>
          </defs>
          <text x="340" y="16" textAnchor="middle" fill={C.faint} fontSize="11" fontFamily="IBM Plex Mono, monospace" letterSpacing="1.5">ANTHROPIC PRODUCT SURFACES</text>
          {[
            { x: 30, label: "Claude.ai", sub: "Chat · Projects · Cowork", color: C.faint, highlight: false },
            { x: 240, label: "Claude Code", sub: "Agentic CLI", color: C.orange, highlight: true },
            { x: 450, label: "API + SDKs", sub: "Custom applications", color: C.faint, highlight: false },
          ].map((b, i) => (
            <g key={i}>
              <rect x={b.x} y="30" width="200" height="56" rx="8" fill={b.highlight ? C.orange + "10" : C.bg} stroke={b.highlight ? C.orange + "60" : C.lightGray} strokeWidth={b.highlight ? "1.5" : "0.5"} />
              <text x={b.x + 100} y="52" textAnchor="middle" dominantBaseline="central" fill={b.color} fontSize="14" fontWeight="500" fontFamily="IBM Plex Sans, sans-serif">{b.label}</text>
              <text x={b.x + 100} y="72" textAnchor="middle" dominantBaseline="central" fill={C.muted} fontSize="10" fontFamily="IBM Plex Sans, sans-serif">{b.sub}</text>
              {b.highlight && <text x={b.x + 100} y="104" textAnchor="middle" fill={C.orange} fontSize="10" fontFamily="IBM Plex Mono, monospace">← this track</text>}
            </g>
          ))}
          {[130, 340, 550].map((x, i) => <line key={i} x1={x} y1="86" x2={x} y2="130" stroke={C.gray} strokeWidth="1" markerEnd="url(#b)" />)}

          <rect x="30" y="134" width="620" height="52" rx="8" fill={C.blue + "10"} stroke={C.blue + "40"} strokeWidth="0.5" />
          <text x="340" y="154" textAnchor="middle" dominantBaseline="central" fill={C.blue} fontSize="13" fontWeight="500" fontFamily="IBM Plex Sans, sans-serif">Messages API</text>
          <text x="340" y="172" textAnchor="middle" dominantBaseline="central" fill={C.muted} fontSize="10" fontFamily="IBM Plex Sans, sans-serif">Tool use · Streaming · Extended thinking · Structured outputs · Batch</text>

          <line x1="340" y1="186" x2="340" y2="212" stroke={C.gray} strokeWidth="1" markerEnd="url(#b)" />

          {[
            { x: 100, label: "MCP", sub: "Tool discovery" },
            { x: 275, label: "Skills", sub: "Packaged expertise" },
            { x: 450, label: "Agent SDK", sub: "Custom agents" },
          ].map((b, i) => (
            <g key={i}>
              <rect x={b.x} y="216" width="130" height="44" rx="6" fill={C.cream} stroke={C.lightGray} strokeWidth="0.5" />
              <text x={b.x + 65} y="234" textAnchor="middle" dominantBaseline="central" fill={C.dark} fontSize="12" fontWeight="500" fontFamily="IBM Plex Sans, sans-serif">{b.label}</text>
              <text x={b.x + 65} y="250" textAnchor="middle" dominantBaseline="central" fill={C.faint} fontSize="10" fontFamily="IBM Plex Sans, sans-serif">{b.sub}</text>
            </g>
          ))}

          <line x1="340" y1="260" x2="340" y2="280" stroke={C.gray} strokeWidth="1" markerEnd="url(#b)" />
          {[
            { x: 100, label: "Opus", sub: "Deepest reasoning" },
            { x: 275, label: "Sonnet", sub: "Best all-around" },
            { x: 450, label: "Haiku", sub: "Speed + efficiency" },
          ].map((b, i) => (
            <g key={i}>
              <rect x={b.x} y="284" width="130" height="30" rx="6" fill={C.dark + "06"} stroke={C.lightGray} strokeWidth="0.5" />
              <text x={b.x + 65} y="300" textAnchor="middle" dominantBaseline="central" fill={C.dark} fontSize="11" fontFamily="IBM Plex Sans, sans-serif"><tspan fontWeight="500">{b.label}</tspan> — {b.sub}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

// ─── PROGRESS BAR COMPONENT ───
function ProgressIndicator({ foundationsDone, foundationStep, totalFoundations, completedModules, totalModules }) {
  const foundationPct = foundationsDone ? 100 : Math.round((foundationStep / totalFoundations) * 100);
  const modulePct = Math.round((completedModules / totalModules) * 100);
  const overallPct = foundationsDone ? Math.round((30 + (modulePct * 0.7))) : Math.round(foundationPct * 0.3);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 200, background: C.lightGray }}>
      <div style={{ height: "100%", width: `${overallPct}%`, background: `linear-gradient(90deg, ${C.orange}, ${C.blue})`, borderRadius: "0 2px 2px 0", transition: "width 0.6s ease" }} />
    </div>
  );
}

// ─── CONFIG HIERARCHY DIAGRAM ───
function ConfigHierarchyDiagram() {
  const levels = [
    { label: "~/.claude/CLAUDE.md", sub: "Personal defaults", color: C.blue, y: 20 },
    { label: "repo/CLAUDE.md", sub: "Project conventions", color: C.orange, y: 110 },
    { label: "repo/src/CLAUDE.md", sub: "Subdirectory overrides", color: C.green, y: 200 },
  ];
  return (
    <div style={{ margin: "20px 0", border: `1px solid ${C.lightGray}`, borderRadius: 12, overflow: "hidden", background: C.cream }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.lightGray}` }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: C.faint, textTransform: "uppercase" }}>CLAUDE.md hierarchy</div>
      </div>
      <div style={{ padding: 16 }}>
        <svg width="100%" viewBox="0 0 680 280" style={{ display: "block" }}>
          {levels.map((l, i) => (
            <g key={i}>
              <rect x="190" y={l.y} width="300" height="52" rx="8" fill={l.color + "10"} stroke={l.color + "40"} strokeWidth="1" />
              <text x="340" y={l.y + 22} textAnchor="middle" dominantBaseline="central" fill={l.color} fontSize="12" fontWeight="500" fontFamily="IBM Plex Mono, monospace">{l.label}</text>
              <text x="340" y={l.y + 40} textAnchor="middle" dominantBaseline="central" fill={C.muted} fontSize="10" fontFamily="IBM Plex Sans, sans-serif">{l.sub}</text>
              {i < levels.length - 1 && <g>
                <line x1="340" y1={l.y + 52} x2="340" y2={levels[i + 1].y} stroke={C.gray} strokeWidth="1" />
                <text x="356" y={l.y + 78} fill={C.faint} fontSize="9" fontFamily="IBM Plex Mono, monospace">overrides</text>
              </g>}
            </g>
          ))}
          <text x="120" y="46" textAnchor="end" fill={C.faint} fontSize="10" fontFamily="IBM Plex Sans, sans-serif">Lowest priority</text>
          <text x="120" y="226" textAnchor="end" fill={C.faint} fontSize="10" fontFamily="IBM Plex Sans, sans-serif">Highest priority</text>
          <line x1="140" y1="56" x2="140" y2="216" stroke={C.lightGray} strokeWidth="1" strokeDasharray="4 3" />
          <polygon points="136,216 144,216 140,224" fill={C.lightGray} />
        </svg>
      </div>
    </div>
  );
}

// ─── SECURITY LAYERS DIAGRAM ───
function SecurityLayersDiagram() {
  const layers = [
    { label: "Managed Settings", sub: "Admin-enforced policies", color: C.blue, inset: 0 },
    { label: "Permission Rules", sub: "Allow / deny controls", color: C.green, inset: 40 },
    { label: "Hooks", sub: "Pre/post action scripts", color: C.orange, inset: 80 },
    { label: "Sandbox", sub: "OS-level isolation", color: C.dark, inset: 120 },
  ];
  return (
    <div style={{ margin: "20px 0", border: `1px solid ${C.lightGray}`, borderRadius: 12, overflow: "hidden", background: C.cream }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.lightGray}` }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: C.faint, textTransform: "uppercase" }}>Defense in depth</div>
      </div>
      <div style={{ padding: 16 }}>
        <svg width="100%" viewBox="0 0 680 300" style={{ display: "block" }}>
          {layers.map((l, i) => {
            const x = l.inset + 20, y = i * 28 + 10;
            const w = 640 - l.inset * 2, h = 300 - i * 56 - 20;
            return (
              <g key={i}>
                <rect x={x} y={y} width={w} height={h} rx={12 - i * 2} fill={l.color + (i === 3 ? "08" : "06")} stroke={l.color + "30"} strokeWidth="1" />
                <text x={x + 14} y={y + 18} fill={l.color} fontSize="11" fontWeight="500" fontFamily="IBM Plex Sans, sans-serif">{l.label}</text>
                <text x={x + 14} y={y + 32} fill={C.faint} fontSize="9" fontFamily="IBM Plex Sans, sans-serif">{l.sub}</text>
              </g>
            );
          })}
          <text x="340" y="170" textAnchor="middle" dominantBaseline="central" fill={C.dark} fontSize="13" fontWeight="500" fontFamily="IBM Plex Sans, sans-serif">Your Code</text>
          <text x="340" y="186" textAnchor="middle" dominantBaseline="central" fill={C.faint} fontSize="10" fontFamily="IBM Plex Sans, sans-serif">Protected by every layer</text>
        </svg>
      </div>
    </div>
  );
}

// ─── MODEL SELECTION DIAGRAM ───
function ModelSelectionDiagram() {
  const mdls = [
    { name: "Haiku", x: 160, y: 60, r: 28, color: C.green },
    { name: "Sonnet", x: 340, y: 120, r: 38, color: C.blue },
    { name: "Opus", x: 520, y: 60, r: 48, color: C.orange },
  ];
  return (
    <div style={{ margin: "20px 0", border: `1px solid ${C.lightGray}`, borderRadius: 12, overflow: "hidden", background: C.cream }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.lightGray}` }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: C.faint, textTransform: "uppercase" }}>Model comparison</div>
      </div>
      <div style={{ padding: 16 }}>
        <svg width="100%" viewBox="0 0 680 200" style={{ display: "block" }}>
          <text x="80" y="180" textAnchor="middle" fill={C.faint} fontSize="9" fontFamily="IBM Plex Mono, monospace">SPEED</text>
          <text x="600" y="180" textAnchor="middle" fill={C.faint} fontSize="9" fontFamily="IBM Plex Mono, monospace">INTELLIGENCE</text>
          <line x1="110" y1="176" x2="570" y2="176" stroke={C.lightGray} strokeWidth="0.5" strokeDasharray="4 3" />
          {mdls.map((m) => (
            <g key={m.name}>
              <circle cx={m.x} cy={m.y + 40} r={m.r} fill={m.color + "15"} stroke={m.color} strokeWidth="1.5" />
              <text x={m.x} y={m.y + 38} textAnchor="middle" dominantBaseline="central" fill={m.color} fontSize="13" fontWeight="600" fontFamily="IBM Plex Sans, sans-serif">{m.name}</text>
              <text x={m.x} y={m.y + 54} textAnchor="middle" dominantBaseline="central" fill={C.muted} fontSize="9" fontFamily="IBM Plex Sans, sans-serif">{m.name === "Haiku" ? "Fastest" : m.name === "Sonnet" ? "Balanced" : "Deepest"}</text>
            </g>
          ))}
          <text x="340" y="16" textAnchor="middle" fill={C.faint} fontSize="9" fontFamily="IBM Plex Sans, sans-serif">Circle size = relative cost</text>
        </svg>
      </div>
    </div>
  );
}

// ─── DEPLOYMENT PATHS DIAGRAM ───
function DeploymentPathsDiagram() {
  const dpaths = [
    { label: "AWS", path: "Bedrock", color: C.orange, x: 45 },
    { label: "GCP", path: "Vertex AI", color: C.blue, x: 215 },
    { label: "Azure", path: "Foundry", color: "#0078d4", x: 385 },
    { label: "Multi / Direct", path: "Anthropic API", color: C.green, x: 555 },
  ];
  return (
    <div style={{ margin: "20px 0", border: `1px solid ${C.lightGray}`, borderRadius: 12, overflow: "hidden", background: C.cream }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.lightGray}` }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: C.faint, textTransform: "uppercase" }}>Deployment options</div>
      </div>
      <div style={{ padding: 16 }}>
        <svg width="100%" viewBox="0 0 680 200" style={{ display: "block" }}>
          <rect x="190" y="4" width="300" height="36" rx="6" fill={C.green + "12"} stroke={C.green + "40"} strokeWidth="1" />
          <text x="340" y="22" textAnchor="middle" dominantBaseline="central" fill={C.dark} fontSize="11" fontWeight="500" fontFamily="IBM Plex Sans, sans-serif">{"\u201CCustomer\u2019s primary cloud?\u201D"}</text>
          <line x1="340" y1="40" x2="340" y2="56" stroke={C.gray} strokeWidth="1" />
          <line x1="90" y1="56" x2="600" y2="56" stroke={C.gray} strokeWidth="0.5" />
          {dpaths.map((p) => (
            <g key={p.label}>
              <line x1={p.x + 45} y1="56" x2={p.x + 45} y2="72" stroke={C.gray} strokeWidth="1" />
              <rect x={p.x} y="72" width="90" height="52" rx="6" fill={C.bg} stroke={p.color + "40"} strokeWidth="1" />
              <rect x={p.x} y="72" width="90" height="3" rx="1.5" fill={p.color} />
              <text x={p.x + 45} y="92" textAnchor="middle" dominantBaseline="central" fill={C.dark} fontSize="11" fontWeight="500" fontFamily="IBM Plex Sans, sans-serif">{p.label}</text>
              <text x={p.x + 45} y="110" textAnchor="middle" dominantBaseline="central" fill={p.color} fontSize="10" fontFamily="IBM Plex Mono, monospace">{p.path}</text>
              <line x1={p.x + 45} y1="124" x2={p.x + 45} y2="148" stroke={C.gray} strokeWidth="0.5" />
            </g>
          ))}
          <rect x="170" y="148" width="340" height="40" rx="8" fill={C.dark + "06"} stroke={C.lightGray} strokeWidth="0.5" />
          <text x="340" y="168" textAnchor="middle" dominantBaseline="central" fill={C.dark} fontSize="12" fontWeight="500" fontFamily="IBM Plex Sans, sans-serif">{"Claude Code \u2014 data stays in customer\u2019s cloud"}</text>
        </svg>
      </div>
    </div>
  );
}


// ─── COST COMPARISON DIAGRAM ───
function CostComparisonDiagram() {
  const items = [
    { label: "Copilot seat", cost: "$19/mo", w: 32, color: C.faint },
    { label: "Claude Code avg", cost: "$100\u2013200/mo", w: 140, color: C.orange },
    { label: "Engineering hire", cost: "$15\u201325K/mo", w: 580, color: C.green },
  ];
  return (
    <div style={{ margin: "20px 0", border: `1px solid ${C.lightGray}`, borderRadius: 12, overflow: "hidden", background: C.cream }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.lightGray}` }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: C.faint, textTransform: "uppercase" }}>The right comparison</div>
      </div>
      <div style={{ padding: 16 }}>
        <svg width="100%" viewBox="0 0 680 160" style={{ display: "block" }}>
          {items.map((item, i) => {
            const y = i * 48 + 10;
            return (
              <g key={i}>
                <text x="0" y={y + 6} fill={C.dark} fontSize="11" fontWeight="500" fontFamily="IBM Plex Sans, sans-serif" dominantBaseline="central">{item.label}</text>
                <text x="0" y={y + 22} fill={C.faint} fontSize="10" fontFamily="IBM Plex Mono, monospace" dominantBaseline="central">{item.cost}</text>
                <rect x="160" y={y} width={item.w} height="28" rx="4" fill={item.color + "20"} stroke={item.color + "40"} strokeWidth="0.5" />
              </g>
            );
          })}
          <text x="340" y="155" textAnchor="middle" fill={C.faint} fontSize="9" fontFamily="IBM Plex Sans, sans-serif">Compare to the cost of an engineer, not the cost of a Copilot seat</text>
        </svg>
      </div>
    </div>
  );
}

// ─── FOUNDATIONS JOURNEY MAP ───
function FoundationsJourneyMap({ foundations, foundationStep, subPage }) {
  // Build flat list of nodes: each top-level foundation + its sub-pages
  const nodes = [];
  foundations.forEach((f, fi) => {
    nodes.push({ type: "main", label: f.label, active: fi === foundationStep && subPage === -1, done: fi < foundationStep, fIndex: fi });
    if (f.pages) {
      f.pages.forEach((p, pi) => {
        nodes.push({ type: "sub", label: p.label, active: fi === foundationStep && subPage === pi, done: fi < foundationStep || (fi === foundationStep && subPage > pi), fIndex: fi, pIndex: pi });
      });
    }
  });

  const nodeW = 80, gap = 6, subDotR = 3, mainH = 28, rowH = 44;
  const totalW = nodes.length * (nodeW + gap) - gap;

  return (
    <div style={{ padding: "8px 20px 4px", maxWidth: 640, margin: "0 auto", overflow: "hidden" }}>
      <svg width="100%" viewBox={`0 0 ${totalW} ${rowH}`} style={{ display: "block" }}>
        {nodes.map((n, i) => {
          const x = i * (nodeW + gap);
          const color = n.active ? C.orange : n.done ? C.green : C.lightGray;
          const textColor = n.active ? C.dark : n.done ? C.green : C.faint;

          if (n.type === "main") {
            return (
              <g key={i}>
                <rect x={x} y={2} width={nodeW} height={mainH} rx={6} fill={n.active ? C.orange + "12" : "transparent"} stroke={color} strokeWidth={n.active ? 1.5 : 0.5} />
                <text x={x + nodeW / 2} y={18} textAnchor="middle" dominantBaseline="central" fill={textColor} fontSize="10" fontWeight={n.active ? 600 : 400} fontFamily="IBM Plex Sans, sans-serif">{n.label}</text>
                {i > 0 && <line x1={x - gap} y1={mainH / 2 + 2} x2={x} y2={mainH / 2 + 2} stroke={C.lightGray} strokeWidth="0.5" />}
              </g>
            );
          }
          return (
            <g key={i}>
              <circle cx={x + nodeW / 2} cy={mainH / 2 + 2} r={n.active ? subDotR + 2 : subDotR} fill={color} />
              <text x={x + nodeW / 2} y={mainH + 10} textAnchor="middle" dominantBaseline="central" fill={textColor} fontSize="8" fontFamily="IBM Plex Sans, sans-serif">{n.label}</text>
              {i > 0 && <line x1={x - gap + nodeW} y1={mainH / 2 + 2} x2={x + nodeW / 2 - (n.active ? subDotR + 2 : subDotR)} y2={mainH / 2 + 2} stroke={C.lightGray} strokeWidth="0.5" />}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── FOUNDATIONS CONTENT ───
const FOUNDATIONS = [
  {
    id: "welcome", label: "Anthropic", title: "Welcome to Anthropic",
    content: [
      { type: "text", value: "You've joined a company that believes AI will be the most transformative technology in human history — and that getting it right matters more than getting there first.", simple: "Welcome to Anthropic. We believe AI will change the world more than any technology before it — and that building it safely matters more than being the fastest to ship." },
      { type: "quote", value: "AI has the potential to pose unprecedented risks to humanity if things go badly. It also has the potential to create unprecedented benefits for humanity if things go well.", attr: "Anthropic's founding premise", simple: "Anthropic believes AI will be incredibly powerful. Rather than slow it down, they want to be the ones building it — so they can make it safe." },
      { type: "text", value: "Anthropic was founded in 2021 by Dario and Daniela Amodei, along with a team of researchers who believed safety couldn't be an afterthought — it had to be the organizing principle. We're a Public Benefit Corporation, meaning our charter legally requires us to weigh mission alongside business outcomes.", simple: "Dario and Daniela Amodei started Anthropic in 2021 with AI researchers who believed safety had to be the main goal from day one. The company is a Public Benefit Corporation — a legal structure that requires considering its mission to society alongside making money." },
      { type: "values", items: [
        { title: "High-trust, low-ego", desc: "We communicate kindly and directly, assuming good intentions even in disagreement.", simpleDesc: "Be straightforward but kind. Assume good intentions when you disagree." },
        { title: "Empirical first", desc: "We care about the size of our impact, not the sophistication of our methods.", simpleDesc: "What matters is whether something works, not how clever the approach looks." },
        { title: "Simplest solution", desc: "We don't invent a spaceship if all we need is a bicycle.", simpleDesc: "Always pick the simplest approach that works." },
        { title: "Safety as science", desc: "We treat AI safety as a systematic science, not a set of rules.", simpleDesc: "Anthropic treats AI safety like a research problem — publishing findings, building measurement tools, and testing whether techniques actually work." },
      ]},
      { type: "text", value: "Every role here contributes to this mission. The quality of your work — whether advising customers, building implementations, or pushing the frontier — directly shapes whether organizations trust AI to do important things.", simple: "No matter your job title, your work feeds into Anthropic's mission. The quality of what you build directly affects whether people trust AI for things that matter." },
    ],
  },
  {
    id: "products", label: "Products", title: "The Anthropic platform",
    content: [
      { type: "text", value: "Anthropic's products are a composable stack. Understanding where Claude Code fits influences how you talk about it with customers.", simple: "Anthropic makes several products that snap together like building blocks. Claude Code is one of them — knowing how the pieces fit helps you explain it to customers." },
      { type: "overview", heading: "What we'll cover", items: [
        { label: "Product surfaces", desc: "Claude.ai, the API, and Claude Code — and how they connect" },
        { label: "Claude.ai", desc: "The conversational surface — where most users start and what your customers already know" },
        { label: "Cowork", desc: "Claude.ai's agentic execution mode — AI that acts, not just answers" },
        { label: "Claude Code", desc: "The agentic coding partner — AI that reads, plans, edits, and verifies at the project level" },
        { label: "Model family", desc: "Opus, Sonnet, and Haiku — when to use each" },
        { label: "Extension layers", desc: "MCP, Skills, and Projects — the customization toolkit" },
      ]},
      { type: "outcomes", items: [
        "Map the full Anthropic product stack and explain how each surface connects to the API",
        "Articulate what claude.ai already offers so you can clearly explain what Claude Code adds beyond it",
        "Differentiate Cowork from chat and from Claude Code — and know when to recommend each to a customer",
        "Recommend the right Claude model (Opus, Sonnet, Haiku) for a given customer use case",
        "Identify which extension layers (MCP, Skills, Projects) solve a customer's specific workflow needs",
      ]},
      { type: "platform-diagram" },
      { type: "text", value: "Every surface talks to the same API. Claude.ai gives non-technical users chat, Projects, Skills, and Cowork. The API lets developers build custom apps. Claude Code — the focus of this track — gives developers an agentic coding partner in their terminal, IDE, or browser.", simple: "All Anthropic products connect through one shared API. Claude.ai is the web app for everyday users. The API is for developers building custom apps. Claude Code is the agentic coding assistant that runs in a terminal, desktop app, phone, or browser." },
    ],
    pages: [
      {
        id: "claude-ai", label: "Claude.ai", title: "Claude.ai: the conversational surface",
        content: [
          { type: "section-intro", step: "1", label: "Claude.ai", context: "Products > Claude.ai" },
          { type: "text", value: "Claude.ai is the front door to Claude — the web and mobile app that most people picture when they hear 'Claude.' It's a conversational interface for thinking, writing, analysis, and creation. Your customers almost certainly already use it, which means the conversation isn't 'have you heard of Claude?' — it's 'here's what else Claude can do.'", simple: "Claude.ai is the app most people already know — the website and mobile app where you chat with Claude. Your customers probably use it already, so the real conversation is about what else Claude can do beyond chat." },
          { type: "models", items: [
            { name: "Chat", color: C.green, desc: "Conversational thinking partner for brainstorming, drafting, analysis, and Q&A. Supports file uploads, image understanding, and web search. The interaction most users know.", tag: "Conversational AI", simpleDesc: "The core chat experience — ask questions, upload files, analyze images, search the web. This is what most people think of when they think of Claude." },
            { name: "Projects", color: C.orange, desc: "Persistent workspaces with custom instructions and reference documents. Teams standardize Claude's behavior without writing code — brand guidelines, analysis templates, onboarding playbooks.", tag: "Persistent context", simpleDesc: "Saved workspaces where you set instructions and upload reference docs. Like setting up a desk for Claude with everything it needs for a specific job." },
            { name: "Artifacts", color: C.blue, desc: "Rich interactive output — documents, code previews, visualizations, websites, diagrams — created and iterated on directly in the conversation. Not just text replies, but finished deliverables.", tag: "Rich output", simpleDesc: "Claude creates real things inside the conversation — documents, code, charts, even small websites — that you can see, use, and refine on the spot." },
          ]},
          { type: "text", value: "For individual knowledge workers and non-technical teams, claude.ai is often the right answer on its own. A marketing team using Projects with brand guidelines, a finance analyst iterating on models through Artifacts, a support lead drafting playbooks in chat — these are real, high-value deployments that don't require a single line of code.", simple: "For many teams, claude.ai is all they need. Marketing uses Projects for brand voice, analysts build models with Artifacts, support leads draft playbooks in chat — all without writing any code." },
          { type: "divider" },
          { type: "heading", value: "Where claude.ai ends and Claude Code begins", simple: "When you need Claude Code instead" },
          { type: "text", value: "Claude.ai is designed for human-in-the-loop interaction — a person asks, Claude responds, the person iterates. It works inside the browser and operates on content the user provides. Claude Code breaks three of those boundaries: it reads your entire codebase instead of waiting for you to paste snippets, it executes commands and edits files autonomously instead of producing text you copy elsewhere, and it lives in the terminal and IDE where engineers already work. In enterprise deployments, both coexist — claude.ai for the broader organization, Claude Code for engineering.", simple: "Claude.ai is a conversation — you ask, Claude answers, you refine. Claude Code is different: it reads your whole codebase, runs commands and edits files on its own, and lives in the developer's terminal. Most companies use both — claude.ai for everyone, Claude Code for engineers." },
        ],
      },
      {
        id: "cowork", label: "Cowork", title: "Cowork: agentic execution",
        content: [
          { type: "section-intro", step: "2", label: "Cowork", context: "Products > Cowork" },
          { type: "text", value: "Chat is for thinking together. Cowork is for delegating. Claude plans, executes multi-step workflows, connects to external tools, and delivers finished work — the same agentic loop that powers Claude Code, but for non-coding knowledge work.", simple: "Chat is a conversation. Cowork is delegation — you hand off a task and Claude works on it independently: planning, taking steps, connecting to tools, and delivering finished work." },
          { type: "models", items: [
            { name: "Connectors", color: C.green, desc: "Connects to Gmail, Calendar, Drive, Slack, Notion, and more. No API keys or developer setup required.", tag: "External integrations", simpleDesc: "Claude plugs into everyday work tools — Gmail, Calendar, Drive, Slack, Notion — as part of completing tasks. No coding setup required." },
            { name: "Autonomous reasoning", color: C.orange, desc: "Breaks tasks into steps, gathers information, evaluates results, adjusts, and delivers complete output — not a suggestion, but finished work.", tag: "Think → Act → Deliver", simpleDesc: "Claude breaks tasks into steps, gathers info, checks its own work, and delivers a finished result — not just suggestions." },
            { name: "Permission modes", color: C.blue, desc: "Three autonomy levels: 'Ask Me First' confirms each action, 'Informed Autonomy' acts and reports, 'Full Autonomy' works independently.", tag: "Trust at your pace", simpleDesc: "You control Claude's independence. Start cautious ('Ask Me First'), then expand as trust builds." },
          ]},
          { type: "text", value: "Cowork expands the buyer beyond engineering. When a marketing lead sees Claude research a topic, pull data, and produce a deliverable — that's a different conversation than 'we have a chatbot.'", simple: "Cowork helps you talk to people outside engineering. When non-developers see Claude autonomously produce finished work, that's very different from showing a chatbot." },
          { type: "divider" },
          { type: "heading", value: "Cowork vs. Claude Code", simple: "When to recommend Cowork vs. Claude Code" },
          { type: "text", value: "In enterprise deployments, both coexist — engineering teams use Claude Code while the rest of the organization uses Cowork through Claude.ai.", simple: "In large companies, developers use Claude Code while everyone else uses Cowork. Knowing which to suggest to which person is key." },
        ],
      },
      {
        id: "claude-code", label: "Claude Code", title: "What is Claude Code?",
        content: [
          { type: "section-intro", step: "3", label: "Claude Code", context: "Products > Claude Code" },
          { type: "text", value: "You've seen where Claude Code fits in the Anthropic stack. Now let's go deeper on how it actually works — the agentic loop, the interaction model, and what makes it different from every other coding tool.", simple: "You already know what Claude Code is. Now let's understand how it works under the hood — how it reads code, plans changes, and verifies its own work.", engineer: "Claude Code is a CLI-native agentic coding tool. It uses the same Messages API as other Claude integrations but wraps it in a persistent tool-use loop with filesystem access, shell execution, and git operations. This section covers the architecture, tool dispatch, and context management internals." },
          { type: "outcomes", items: [
            "Explain in 60 seconds how agentic coding differs from autocomplete tools like Copilot",
            "Walk through the agentic loop — read, plan, act, verify — using a concrete example",
          ]},
          { type: "heading", value: "A different interaction model", simple: "How Claude Code works differently from other coding tools", engineer: "Architecture: agentic loop and tool dispatch" },
          { type: "text", value: <>Most AI coding tools operate at the line level — suggesting the next autocomplete. Claude Code operates at the project level. It reads your codebase, plans multi-step changes, edits files, runs tests, and fixes what breaks — all in one agentic loop. When you say <a href="https://claude.ai/new?q=refactor%20the%20auth%20module%20to%20use%20JWT" target="_blank" rel="noopener noreferrer" style={{ color: C.orange, textDecoration: "underline", textUnderlineOffset: "3px", cursor: "pointer" }}>"refactor the auth module to use JWT,"</a> it doesn't suggest a snippet. It executes the entire migration.</> },
          { type: "terminal", title: "Claude Code in action", lines: [
            "$ claude",
            "",
            "→ What would you like to work on?",
            "",
            "$ Refactor the auth module to use JWT instead of sessions",
            "",
            "→ I'll analyze the current auth implementation and plan the migration.",
            "→ Let me start by reading the relevant files...",
            "",
            "  Reading src/auth/session.ts",
            "  Reading src/middleware/auth.ts",
            "  Reading src/routes/login.ts",
            "  Reading package.json",
            "",
            "→ I see the current session-based auth. Here's my plan:",
            "  1. Install jsonwebtoken and @types/jsonwebtoken",
            "  2. Create src/auth/jwt.ts with token generation/verification",
            "  3. Update middleware to validate JWT from Authorization header",
            "  4. Update login route to return JWT instead of setting session",
            "  5. Remove express-session dependency",
            "  6. Run existing tests and fix any failures",
            "",
            "  Shall I proceed?",
          ]},
          { type: "heading", value: "The architecture", simple: "How Claude Code is built -- the steps it follows to get work done" },
          { type: "diagram" },
          { type: "stats", heading: "Fast Stats", items: [
            { stat: "72.7%", label: "SWE-bench Verified score — the industry benchmark for real-world coding ability", source: "Anthropic Sonnet 4 model card, May 2025" },
            { stat: "200K", label: "Token context window — Claude reads entire codebases, not just open files", source: "API docs", sourceUrl: "https://docs.anthropic.com" },
            { stat: "~$6/day", label: "Average cost per developer — 90% of users spend less than $12/day", source: "Costs docs", sourceUrl: "https://docs.anthropic.com/en/docs/claude-code/costs" },
            { stat: "3", label: "Cloud deployment options — AWS Bedrock, Google Vertex AI, Microsoft Foundry", source: "Deployment docs", sourceUrl: "https://docs.anthropic.com/en/docs/claude-code/bedrock-vertex" },
            { stat: "24", label: "Hook events available for custom automation — from pre-commit to post-edit to CI/CD", source: "Hooks docs", sourceUrl: "https://docs.anthropic.com/en/docs/claude-code/hooks" },
            { stat: "4", label: "Permission modes — default, plan, auto-accept, and headless for CI/CD pipelines", source: "Security docs", sourceUrl: "https://docs.anthropic.com/en/docs/claude-code/security" },
          ]},
          { type: "reflect", prompt: "Think about the difference between a developer using GitHub Copilot (line-level autocomplete) versus Claude Code (agentic, multi-step). How would you explain this difference to a VP of Engineering in 60 seconds?" },
        ],
      },
      {
        id: "model-family", label: "Models", title: "The model family",
        content: [
          { type: "section-intro", step: "4", label: "Model Family", context: "Products > Models" },
          { type: "models", items: [
            { name: "Claude Opus", color: C.orange, desc: "Maximum intelligence. Complex reasoning, nuanced analysis, research synthesis. For high-stakes decisions where depth matters more than speed.", tag: "Deepest reasoning", simpleDesc: "The most powerful model — the senior expert for the hardest problems. Takes more time and costs more, but catches things others miss.",
              greatFor: [
                "Complex multi-file refactors across large codebases",
                "Debugging subtle concurrency or logic bugs",
                "Architecture design and system-level reasoning",
                "Research synthesis — reading 50 files to answer a nuanced question",
                "High-stakes code review where missing an edge case is costly",
              ],
              notSuitedFor: [
                "High-volume, latency-sensitive pipelines (cost and speed add up)",
                "Simple formatting, linting, or boilerplate generation",
                "Real-time autocomplete or keystroke-level suggestions",
              ],
            },
            { name: "Claude Sonnet", color: C.blue, desc: "The workhorse powering Claude Code. Fast, intelligent, and versatile. Ideal for agentic coding, daily workflows, and most deployments.", tag: "Best all-around", simpleDesc: "The everyday model that balances speed, smarts, and cost. Powers Claude Code by default. Right starting point for most customers.",
              greatFor: [
                "Day-to-day agentic coding — features, bug fixes, test writing",
                "CLAUDE.md-guided workflows and prompt-driven development",
                "Code generation, inline edits, and multi-step tool use",
                "CI/CD automation via GitHub Actions (@claude in PRs)",
                "Most customer deployments — the default recommendation",
              ],
              notSuitedFor: [
                "Problems requiring Opus-level depth (novel algorithm design, ambiguous specs)",
                "Ultra-high-volume classification where Haiku's cost wins",
              ],
            },
            { name: "Claude Haiku", color: C.green, desc: "Speed and efficiency. Real-time applications, high-volume classification, routing layers. Makes multi-model architectures economical.", tag: "Fastest + cheapest", simpleDesc: "Lightest and fastest. Great for simple, repetitive tasks at low cost. Teams use Haiku for easy stuff and save bigger models for harder work.",
              greatFor: [
                "Routing and triage — classifying tickets, PRs, or support requests",
                "Log parsing, data extraction, and structured output at scale",
                "Real-time chat or embedded assistants where latency matters",
                "Pre-processing pipelines that feed results into Sonnet or Opus",
                "Cost-sensitive batch jobs — thousands of simple tasks per hour",
              ],
              notSuitedFor: [
                "Multi-file code changes or agentic workflows requiring planning",
                "Nuanced reasoning, ambiguous instructions, or open-ended research",
                "Tasks where getting it wrong has high cost — use Sonnet or Opus instead",
              ],
            },
          ]},
        ],
      },
      {
        id: "extensions", label: "Extensions", title: "Extension layers",
        content: [
          { type: "section-intro", step: "5", label: "Extensions", context: "Products > Extensions" },
          { type: "text", value: "Three capabilities extend what Claude can do across all surfaces. They compose — a customer might use MCP to pull Salesforce data, a Skill to format it, inside a Project loaded with brand guidelines.", simple: "Three add-ons expand Claude's abilities, and they combine. For example: MCP connects to Salesforce, a Skill formats the data, inside a Project that knows brand rules." },
          { type: "models", items: [
            { name: "MCP", color: C.green, desc: "Model Context Protocol connects Claude to external services — Slack, GitHub, Jira, databases, internal APIs. A standardized way to discover and use tools dynamically.", tag: "External tools + data", simpleDesc: "A universal adapter that lets Claude plug into other software — Slack, GitHub, Jira, databases — using a standard protocol instead of custom integrations." },
            { name: "Skills", color: C.orange, desc: "Packaged procedural expertise loaded on demand. Pre-built skills for common tasks, custom skills for team workflows — report formats, review checklists, analysis frameworks.", tag: "Packaged expertise", simpleDesc: "Recipe cards that teach Claude specific tasks. Some are pre-built; teams can write their own for custom workflows." },
            { name: "Projects", color: C.blue, desc: "Persistent context scoped to a use case. Custom instructions and reference documents make Claude already know your conventions.", tag: "Persistent context", simpleDesc: "Saved workspaces with instructions and reference docs — like setting up a desk for a new team member with everything they need." },
          ]},
          { type: "text", value: "These extensions are the bulk of customization work with customers. Knowing what's available — off-the-shelf MCP servers, matching Skills, accelerating onboarding with Projects — is the difference between a generic demo and a conversation that closes.", simple: "These add-ons are where customer-specific setup happens. Having answers ready about available MCP servers, matching Skills, and helpful Projects turns generic demos into tailored conversations." },
          { type: "reflect", prompt: "Think of a customer you've worked with (or imagine one). Which Anthropic surface would they start with? Which would they grow into? What would that journey look like?" },
        ],
      },
  {
    id: "how-to-use", label: "How to Use", title: "Four ways to use Claude Code",
    content: [
      { type: "text", value: "Claude Code meets developers where they work — terminal, desktop, phone, or browser. Each surface has a distinct strength, and knowing which to reach for makes your demos land.", simple: "You can use Claude Code in four places: terminal, desktop app, phone, or browser. Knowing which to recommend helps you match the tool to how someone works." },
      { type: "surfaces", items: [
        { id: "cli", title: "Command Line (CLI)", img: `${import.meta.env.BASE_URL}surfaces/cli.png`, bullets: [
          "The original and most powerful surface — full agentic autonomy in your terminal",
          "Supports headless mode for CI/CD pipelines and automated workflows",
          "Direct access to your filesystem, git, and dev tools with no abstraction layer",
          "Best for: power users, complex multi-file tasks, and automation",
        ]},
        { id: "desktop", title: "Desktop App", img: `${import.meta.env.BASE_URL}surfaces/desktop.png`, bullets: [
          "Native macOS/Windows app with the same agentic engine as the CLI",
          "Built-in file browser and diff viewer for visual feedback on changes",
          "Lower barrier to entry — no terminal experience required",
          "Best for: visual learners, code review, and onboarding new users",
        ]},
        { id: "mobile", title: "Mobile (iOS & Android)", img: `${import.meta.env.BASE_URL}surfaces/mobile.png`, bullets: [
          "Start or continue coding conversations from anywhere",
          "Review Claude's proposed changes and approve from your phone",
          "Great for triaging issues, brainstorming architecture, or quick fixes on the go",
          "Best for: async workflows, on-call debugging, and idea capture",
        ]},
        { id: "web", title: "Web (claude.ai)", img: `${import.meta.env.BASE_URL}surfaces/web.png`, bullets: [
          "Zero install — open a browser tab and start prompting immediately",
          "Integrated with Projects, Skills, and file uploads for rich context",
          "Shareable conversations make it easy to collaborate across teams",
          "Best for: first demos, non-technical stakeholders, and quick prototyping",
        ]},
      ]},
    ],
  },
  {
    id: "who-uses-it", label: "Who Uses It", title: "Who uses Claude Code — and why",
    content: [
      { type: "text", value: "Claude Code started as a developer tool, but its users go far beyond engineers. Anyone whose work involves files, data, or structured thinking gets value from an agentic partner.", simple: "Claude Code was built for programmers, but data analysts, managers, and designers all use it too." },
      { type: "personas", items: [
        { id: "swe", title: "Software Engineer", subtitle: "Full-stack development", color: C.green, desc: "The core use case — writing, refactoring, debugging, and shipping code across entire codebases. From individual features to full-stack migrations.", examples: [
          { label: "Refactor a 50-file auth module in one prompt", prompt: "Refactor our authentication module across all 50 files in src/auth/. Replace the legacy session-based auth with JWT tokens. Update all middleware, route handlers, and tests. Keep backward compatibility with existing API contracts and make sure all tests pass." },
          { label: "Write tests for an entire API surface", prompt: "Analyze every route in our Express API under src/routes/ and write comprehensive unit and integration tests using Jest and Supertest. Cover happy paths, error cases, auth checks, and edge cases. Aim for at least 90% code coverage." },
          { label: "Debug a production issue across microservices", prompt: "We're seeing intermittent 502 errors in production when the orders service calls the inventory service. Trace the issue across both services — check the HTTP client config, retry logic, timeout settings, and connection pooling. Identify the root cause and implement a fix with proper error handling." },
          { label: "Migrate from Express to Fastify with zero downtime", prompt: "Migrate our Node.js backend from Express to Fastify. Port all routes, middleware, error handlers, and plugins. Maintain the same API contract so clients don't break. Add Fastify-specific optimizations like schema validation and serialization. Update all tests to work with the new framework." },
        ]},
        { id: "data", title: "Data Scientist", subtitle: "Analysis & pipelines", color: C.blue, desc: "Exploring datasets, writing SQL and Python pipelines, generating visualizations, and iterating on analysis without context-switching between tools.", examples: [
          { label: "Build an ETL pipeline from CSV to PostgreSQL", prompt: "Build a Python ETL pipeline that reads CSV files from a data/ directory, cleans and validates the data (handle missing values, normalize date formats, deduplicate rows), then loads it into a PostgreSQL database. Use pandas for transformation and sqlalchemy for the database connection. Add logging and error handling for production use." },
          { label: "Generate matplotlib visualizations from raw data", prompt: "Read the sales data from data/sales_2024.csv and generate a comprehensive set of matplotlib visualizations: monthly revenue trends, top 10 products by volume, regional distribution as a choropleth, and year-over-year growth comparison. Style them with a clean, professional theme and save as high-res PNGs." },
          { label: "Write and optimize complex SQL queries", prompt: "Write SQL queries for our analytics dashboard against a PostgreSQL database with tables: users, orders, products, and sessions. I need: daily active users with 7-day rolling average, cohort retention analysis by signup month, product revenue attribution with category rollups, and funnel conversion rates. Optimize each query with proper indexing suggestions and explain the query plans." },
          { label: "Create a Jupyter notebook with full analysis", prompt: "Create a complete Jupyter notebook that analyzes our customer churn dataset (data/churn.csv). Include: exploratory data analysis with summary stats and distributions, correlation analysis, feature engineering, a logistic regression and random forest model comparison, ROC curves, feature importance plots, and a clear markdown narrative explaining each finding. Make it presentation-ready." },
        ]},
        { id: "devops", title: "DevOps Engineer", subtitle: "Infrastructure & CI/CD", color: C.orange, desc: "Writing infrastructure-as-code, debugging CI/CD pipelines, managing Kubernetes configs, and automating operational workflows.", examples: [
          { label: "Write Terraform modules for AWS infrastructure", prompt: "Write reusable Terraform modules for our AWS infrastructure: a VPC with public/private subnets across 3 AZs, an ECS Fargate cluster with auto-scaling, an RDS PostgreSQL instance with read replicas, and an ALB with SSL termination. Include proper security groups, IAM roles, and output values. Use variables for environment-specific configuration (dev/staging/prod)." },
          { label: "Debug a failing GitHub Actions workflow", prompt: "Our GitHub Actions CI/CD pipeline is failing intermittently on the 'deploy' step. Here's the workflow file. Debug the issue — check for race conditions, caching problems, environment variable misconfigurations, and Docker layer issues. Fix the workflow and add better error reporting so we can catch similar issues faster in the future." },
          { label: "Generate Kubernetes manifests with health checks", prompt: "Generate production-ready Kubernetes manifests for a microservices app with 3 services: api-gateway, user-service, and notification-service. Include Deployments with resource limits and requests, liveness and readiness probes with proper thresholds, HorizontalPodAutoscalers, Services, NetworkPolicies, and ConfigMaps. Use kustomize for environment overlays." },
          { label: "Automate log rotation and alerting scripts", prompt: "Write a comprehensive log management automation suite: a bash script for log rotation with configurable retention (compress logs older than 24h, delete after 30 days), a Python script that monitors log files for error patterns and sends Slack alerts via webhook, and a systemd timer unit to run rotation daily. Include monitoring for disk usage thresholds." },
        ]},
        { id: "leader", title: "Tech Lead", subtitle: "Architecture & oversight", color: C.green, desc: "Reviewing PRs, prototyping architectural ideas, generating documentation, and staying hands-on without blocking their team.", examples: [
          { label: "Review a PR and suggest architectural improvements", prompt: "Review this pull request that adds a new payment processing module. Evaluate the code for: separation of concerns, error handling and idempotency, security vulnerabilities (PCI compliance considerations), test coverage gaps, naming conventions and code style consistency, and potential performance bottlenecks. Provide specific, actionable suggestions with code examples for each issue found." },
          { label: "Prototype a new microservice in an afternoon", prompt: "Prototype a notification microservice in TypeScript with Fastify. It should support email (SendGrid), SMS (Twilio), and push notifications (Firebase) through a unified API. Include: a clean interface for adding new channels, a priority queue for rate limiting, template rendering with Handlebars, delivery status tracking, and retry logic with exponential backoff. Set up the project with proper TypeScript config, tests, and Docker." },
          { label: "Generate ADRs from codebase patterns", prompt: "Analyze our codebase and generate Architecture Decision Records (ADRs) for the major technical decisions you can infer. Look at: the framework and library choices, database and caching patterns, authentication approach, API design conventions, error handling strategy, and testing philosophy. Write each ADR in the standard format (Title, Status, Context, Decision, Consequences) and explain the tradeoffs." },
          { label: "Create onboarding docs from existing code", prompt: "Generate comprehensive developer onboarding documentation by analyzing our codebase. Include: a high-level architecture overview with a system diagram, how to set up the local development environment step-by-step, key code conventions and patterns used (with examples from actual code), a guide to the testing strategy, common debugging workflows, and a glossary of domain-specific terms found in the code." },
        ]},
        { id: "nondev", title: "PM / Designer", subtitle: "Strategy & prototyping", color: C.blue, desc: "Product managers brainstorming feature ideas, stress-testing positioning, and analyzing competitive landscapes. Designers tweaking front-end code and prototyping interactions. Anyone whose work shapes the product without writing code full-time.", examples: [
          { label: "Brainstorm and stress-test a product strategy", prompt: "I'm the PM for our checkout flow. We're considering adding a one-click reorder feature for returning customers. Help me think through this: what are the strongest arguments for and against? What edge cases could bite us (partial inventory, changed prices, expired payment methods)? Draft a one-page product brief I can bring to the eng lead, including success metrics and a proposed rollout plan." },
          { label: "Draft competitive positioning from market research", prompt: "I need to update our competitive positioning against [Competitor X] who just launched a new feature. Pull together a comparison framework covering: feature parity, pricing model differences, target persona overlap, and where we have genuine differentiation vs. where we're behind. Write it as a sales-ready one-pager with honest 'why us' and 'watch out for' sections." },
          { label: "Analyze user data to build a case for a product bet", prompt: "Write a Python script that reads our user analytics export (data/users_export.csv) and generates a summary report with: total users by signup month, most common user actions in the last 30 days, average session duration trends, top features by usage frequency, and users at risk of churning (no activity in 14+ days). Output the report as both a formatted terminal table and a simple HTML file I can share with the team." },
          { label: "Prototype a feature concept for stakeholder review", prompt: "I want to prototype a 'team activity feed' for our dashboard. Build a simple working version that shows recent actions (commits, deploys, PR reviews) in a timeline view with avatar, action type, and timestamp. Use our existing component library patterns. I don't need it production-ready — just enough to demo the concept in tomorrow's product review and get feedback on the interaction model." },
        ]},
        { id: "exec", title: "Engineering Leader", subtitle: "Strategy & org leverage", color: C.orange, desc: "VPs, CTOs, and directors evaluating AI adoption across their org. Using Claude Code to prototype technical strategies, draft RFCs, analyze codebases for migration readiness, and build the business case for broader rollout.", examples: [
          { label: "Assess codebase health before a platform bet", prompt: "Analyze our monorepo and produce an engineering health report: identify the largest modules by complexity (cyclomatic and dependency count), flag areas with no test coverage, list deprecated dependencies, and estimate the effort to migrate from our current ORM to Prisma. Format it as an executive summary with a detailed appendix I can share with the board." },
          { label: "Draft an RFC for a major architectural change", prompt: "Write an RFC for migrating our monolith to a service-oriented architecture. Include: motivation (current pain points you can infer from the codebase), proposed service boundaries based on domain analysis, a phased migration plan with risk assessment for each phase, rollback strategy, and success metrics. Use our existing RFC template format if you can find one in the repo." },
          { label: "Build an AI adoption ROI model", prompt: "Create a spreadsheet-ready analysis comparing our current engineering velocity (use git log data from the last 6 months — PR cycle time, commit frequency, deploy cadence) against projected improvements from Claude Code adoption. Model three scenarios: conservative (10% productivity gain), moderate (25%), and aggressive (40%). Include cost projections at $150/dev/month and break-even timelines." },
          { label: "Generate a technical due diligence summary", prompt: "I'm evaluating an acquisition target. Analyze this codebase as if you're doing technical due diligence: assess code quality, architecture maturity, test coverage, dependency health, security posture (secrets in code, outdated packages, known CVEs), and documentation completeness. Produce a red/yellow/green scorecard with a one-page narrative summary." },
        ]},
        { id: "sa", title: "Solutions Architect", subtitle: "Design & integration", color: C.green, desc: "Designing system architectures, evaluating integration patterns, prototyping reference implementations, and translating business requirements into technical blueprints. The bridge between what the customer needs and how to build it.", examples: [
          { label: "Design a multi-service integration architecture", prompt: "Design an integration architecture for a retail customer connecting Shopify, Stripe, a PostgreSQL inventory database, and a warehouse management API. Include: sequence diagrams for order flow, error handling and retry strategy for each integration point, data consistency approach (eventual vs. strong), and a recommended tech stack. Produce both a high-level diagram description and the actual implementation scaffolding." },
          { label: "Build a reference implementation for a common pattern", prompt: "Build a reference implementation of the 'event-driven microservices' pattern using Node.js, Redis Streams, and PostgreSQL. Include three services (order-service, inventory-service, notification-service) that communicate via events. Add idempotency keys, dead letter queues, and a simple dashboard that shows event flow. This needs to be clean enough to walk a customer through in a technical workshop." },
          { label: "Evaluate and compare deployment architectures", prompt: "Our customer runs on AWS and wants to deploy Claude Code via Bedrock. Compare three deployment architectures: direct API integration, a gateway pattern with rate limiting and caching, and a sidecar proxy model. For each, analyze: latency characteristics, cost at 500 developers, security boundaries, observability options, and failure modes. Recommend one with justification." },
          { label: "Create a migration playbook from competitor tooling", prompt: "A customer is migrating from GitHub Copilot to Claude Code across 200 developers. Write a migration playbook covering: feature mapping (what maps 1:1, what's new, what's different), a phased rollout plan (pilot team → department → org), CLAUDE.md bootstrapping strategy for their existing repos, training milestones, and success metrics to track adoption and productivity impact at each phase." },
        ]},
        { id: "security", title: "Security Engineer", subtitle: "Audit & hardening", color: C.blue, desc: "Auditing codebases for vulnerabilities, writing security policies as code, analyzing dependency chains, and automating compliance checks. Claude Code reads the full codebase — making it effective at finding issues that span multiple files.", examples: [
          { label: "Run a security audit across the full codebase", prompt: "Perform a comprehensive security audit of this codebase. Check for: hardcoded secrets or API keys, SQL injection and XSS vulnerabilities, insecure authentication patterns, missing input validation at API boundaries, outdated dependencies with known CVEs, overly permissive CORS or IAM policies, and insecure cryptographic usage. Categorize findings by severity (critical/high/medium/low) and provide specific remediation for each." },
          { label: "Write security policies as code", prompt: "Write Open Policy Agent (OPA) policies for our Kubernetes cluster that enforce: no containers running as root, all images must come from our approved registry, resource limits must be set on every pod, no hostPath mounts in production namespaces, and all ingress must terminate TLS. Include unit tests for each policy and a CI integration script that runs them on every PR." },
          { label: "Analyze dependency chain for supply chain risk", prompt: "Analyze our package.json and lock file for supply chain risks. For each direct dependency: check maintenance status (last publish date, open issues), identify transitive dependencies with known vulnerabilities, flag packages with install scripts that execute arbitrary code, and assess the blast radius if each dependency were compromised. Produce a risk-ranked report with recommended actions (pin, replace, vendor, or accept)." },
          { label: "Build an automated compliance evidence generator", prompt: "We need to pass SOC 2 Type II. Write a Python tool that automatically collects compliance evidence from our infrastructure: pull IAM policies from AWS and check least-privilege adherence, verify encryption at rest and in transit configurations, collect audit log samples showing access controls work, and check that our CI/CD pipeline enforces code review. Output a structured JSON report that maps each finding to the relevant SOC 2 control." },
        ]},
      ]},
      { type: "text", value: "This breadth matters for GTM. The buyer might be a VP of Engineering, but the value spreads across the org — you're showing a leader how agentic AI raises the floor for everyone.", simple: "The buyer is often an engineering leader, but the value reaches designers, data teams, and ops staff too. You're showing how agentic AI makes everyone more effective." },
      { type: "text", value: "Expect resistance — some prospects will worry agentic tools threaten jobs. Don't dismiss it; reframe. Claude Code removes boilerplate, migration grunt work, and test chasing. What's left is the creative, high-judgment work. The best framing: this tool doesn't shrink your team — it unlocks the work they never had time to start.", simple: "Some people worry this could replace developers. Take it seriously — then reframe: Claude Code handles the tedious parts nobody enjoys. Creative work stays with humans. Teams report feeling more productive, not more replaceable." },
    ],
  },
  {
    id: "what-it-costs", label: "What It Costs", title: "Model selection & pricing",
    content: [
      { type: "model-selection-diagram" },
      { type: "heading", value: "Model selection — Haiku, Sonnet, and Opus", simple: "Choosing the right AI model for each task" },
      { type: "text", value: "Claude Code defaults to Sonnet 4, but users can switch models mid-conversation. This matters because different tasks have different needs — and understanding the tradeoffs is essential for advising customers on their deployment.", simple: "Claude Code comes with a default AI model (Sonnet 4), but you can swap to a different one anytime during a conversation. Think of models like car engines -- some are built for speed and fuel economy, others for raw power. Picking the right one for the job helps balance performance and cost." },
      { type: "models", items: [
        { name: "Haiku", tag: "speed", color: C.blue, desc: "The fastest model. Best for simple, high-volume tasks: renaming variables, formatting files, generating boilerplate, running quick checks. 10-20x cheaper than Opus. Ideal for CI/CD automation where latency and cost matter more than reasoning depth.", simpleDesc: "The lightweight, fast option for quick, repetitive tasks. 10-20x cheaper than Opus — ideal for CI/CD automation." },
        { name: "Sonnet", tag: "default", color: C.orange, desc: "The balanced model and Claude Code's default. Excellent at multi-file refactors, test generation, debugging, and architecture analysis. The best tradeoff of intelligence, speed, and cost for daily coding work.", simpleDesc: "The all-rounder most people use daily. Best balance of intelligence, speed, and cost." },
        { name: "Opus", tag: "depth", color: C.green, desc: "The most intelligent model. Best for novel architecture decisions, complex debugging across systems, and tasks requiring deep reasoning about tradeoffs. Slower and more expensive, but produces solutions that Sonnet might miss.", simpleDesc: "The most powerful model for genuinely hard problems. Takes longer and costs more, but solves things others can't." },
      ]},
      { type: "text", value: "In sales conversations, model selection is often the answer to \"How do we control costs?\" Teams can default to Sonnet for daily work, drop to Haiku for automated CI tasks, and escalate to Opus only when they hit a genuinely hard problem. This tiered approach typically reduces cost by 40-60% versus running everything on the strongest model.", simple: "Model selection answers the cost question. Use Sonnet daily, Haiku for CI, Opus for hard problems — typically 40-60% cheaper than running everything on the strongest model." },
      { type: "divider" },
      { type: "heading", value: "What it costs", simple: "How pricing works" },
      { type: "text", value: "Claude Code is priced by token usage, not by seat. This is a fundamental shift from most developer tools and it changes the sales conversation. There's no per-user license to negotiate — customers pay for what they use, which means the conversation shifts from 'How many seats?' to 'How much value per dollar?'", simple: "Claude Code charges by usage, not per seat. Customers pay for what they use — the conversation shifts from 'How many seats?' to 'How much value per dollar?'" },
      { type: "values", items: [
        { title: "Input tokens", desc: "What Claude reads — your codebase files, CLAUDE.md, conversation history. Cached input tokens (repeated reads of the same files) cost 90% less.", simpleDesc: "Everything Claude reads — code files, instructions, conversation history. Cached reads cost 90% less." },
        { title: "Output tokens", desc: "What Claude writes — code, explanations, plans, terminal commands. This is the larger cost driver for most coding tasks.", simpleDesc: "Output tokens are the text Claude produces -- the code it writes, its explanations, and any commands it runs. Writing new content costs more than reading existing content, so the amount Claude generates is usually the biggest factor in the bill." },
        { title: "Thinking tokens", desc: "When extended thinking is active, Claude's reasoning steps are billed as output tokens. More complex problems = more thinking = higher cost, but also higher quality.", simpleDesc: "Claude's internal reasoning before acting. Harder problems need more thinking, costing more but producing better results." },
      ]},
      { type: "text", value: "A typical engineering team running Claude Code for daily development work sees costs between $50-200 per developer per month. Heavy users running large refactors or using Opus might see $300+. This is almost always cheaper than an additional engineering hire, which is the right comparison to draw in sales conversations — not the cost of a Copilot seat.", simple: "Most developers spend $50-200/month. Compare to an engineering hire ($15-25K/month), not a Copilot seat ($19/month)." },
      { type: "cost-comparison-diagram" },
      { type: "roi-card" },
      { type: "reflect", prompt: "A prospect says: 'We're worried about runaway costs if developers use this all day.' How would you structure a response using model selection, prompt caching, and the per-token pricing model? What's the right comparison point?" },
    ],
  },
  {
    id: "how-it-thinks", label: "How it thinks", title: "Under the hood",
    content: [
      { type: "text", value: "To demo Claude Code convincingly, you need to understand what's happening when it writes code — the reasoning, context management, model selection, and economics.", simple: "To show Claude Code to customers, you need to understand how it reasons, manages context, selects models, and what it costs." },
      { type: "overview", heading: "What we'll cover", items: [
        { label: "Extended thinking", desc: "How Claude reasons step-by-step on complex problems before acting" },
        { label: "Context window", desc: "Why Claude can read entire codebases — not just the open file" },
      ]},
      { type: "outcomes", items: [
        "Explain extended thinking and why it produces better code than instant generation",
        "Describe the context window's role and why it matters for enterprise codebases",
        "Recommend the right model and effort level for a given customer scenario",
        "Discuss token economics and cost ranges confidently with a buyer",
      ]},
      { type: "heading", value: "Extended thinking", simple: "How Claude stops to think before it acts" },
      { type: "text", value: "When Claude Code encounters a complex task, it doesn't generate code immediately — it thinks first. Extended thinking is a dedicated reasoning step where Claude analyzes the problem, considers approaches, and plans before writing a single line.", simple: "When Claude gets a hard task, it pauses to think first — like a developer sketching a plan before writing code. It considers approaches, anticipates edge cases, and maps out steps." },
      { type: "text", value: "This is a critical differentiator in demos. When a prospect sees Claude think, plan, and then execute — that's when they stop comparing it to autocomplete.", simple: "This thinking step is one of the best things to show in a demo. Watching Claude reason in real time is when people realize this isn't just autocomplete." },
      { type: "terminal", title: "Extended thinking in action", lines: [
        "$ Refactor the payment module to support multiple currencies",
        "",
        "→ Thinking...",
        "",
        "  Let me analyze the current payment module structure.",
        "  I see Money values are stored as integers (cents) with a",
        "  hardcoded 'USD' assumption in 14 files.",
        "",
        "  My approach:",
        "  1. Create a Currency type with conversion rates",
        "  2. Update the Money type to include currency field",
        "  3. Add conversion utilities",
        "  4. Update all 14 files that reference Money",
        "  5. Add tests for cross-currency edge cases",
        "  6. Verify existing tests still pass",
        "",
        "→ Proceeding with implementation...",
      ]},
      { type: "heading", value: "How Claude reads your entire codebase", simple: "How much code Claude can see at once" },
      { type: "text", value: "Most AI coding tools see one file at a time. Claude Code's 200K-token context window lets it read and reason across your entire codebase simultaneously — understanding how modules connect and where changes will ripple.", simple: "Most AI tools see one file at a time. Claude Code can hold 500+ files in context at once, seeing how different parts of your code connect." },
      { type: "text", value: "When a customer asks \"Can Claude understand my whole repo?\" the answer is usually yes. For larger codebases, it automatically prioritizes the most relevant files.", simple: "When customers ask if Claude can understand their whole codebase, the answer is usually yes. For very large repos, it automatically picks the most important files first." },
      { type: "values", items: [
        { title: "200K tokens (Sonnet 4)", desc: "Roughly equivalent to 500+ files of typical source code. Enough for most microservices, full-stack apps, and medium-sized monorepos.", simpleDesc: "About 500+ source files worth of working memory. Enough for most projects to be understood in full." },
        { title: "Prompt caching", desc: "Frequently-read files (like CLAUDE.md) are cached, reducing cost and latency. Cached tokens cost 90% less and load 85% faster.", simpleDesc: "Files Claude reads repeatedly are cached — 90% cheaper and 85% faster on repeat reads." },
        { title: "Smart file selection", desc: "For repos that exceed the window, Claude Code reads imports, directory structure, and type definitions to prioritize the most relevant files for the current task.", simpleDesc: "For large repos, Claude prioritizes the most relevant files by reading imports and directory structure first." },
      ]},
      { type: "reflect", prompt: "A customer asks how Claude Code handles large monorepos that exceed the context window. How would you explain the smart file selection and caching strategies?" },
    ],
  },
  {
    id: "configuration", label: "Configuration", title: "Customizing Claude Code",
    content: [
      { type: "text", value: "After understanding how Claude Code thinks, the next step is learning how it's configured — this is where the tool transforms from a generic assistant into one tailored to a customer's codebase, workflow, and security requirements. Every concept in this section maps directly to a customer conversation you'll have.", simple: "Configuration is what turns a general-purpose coding assistant into one that knows your team's rules, project structure, and security requirements. Everything in this section will come up in real customer conversations." },
      { type: "overview", heading: "What we'll cover", items: [
        { label: "CLAUDE.md", desc: "Persistent project context — the system prompt for your codebase" },
        { label: "Slash commands", desc: "Quick actions and custom workflows users can create and share" },
        { label: "Memory", desc: "How Claude remembers preferences and project context across sessions" },
        { label: "Hooks", desc: "Custom scripts that enforce guardrails before and after actions" },
        { label: "Permission modes", desc: "Four interaction modes — from supervised to fully autonomous" },
        { label: "Permission rules", desc: "Allow, deny, and managed policies that control what Claude can do" },
        { label: "MCP", desc: "Connecting Claude to your customer's internal tools and data" },
      ]},
      { type: "outcomes", items: [
        "Draft a CLAUDE.md for a customer's repo and explain how it shapes Claude's behavior",
        "Design a custom slash command for a team workflow and explain how it's shared via git",
        "Explain the four permission modes (default, plan, auto-accept, headless) and when each is appropriate",
        "Distinguish between permission modes and permission rules, and explain how deny rules override everything",
        "Describe how hooks enforce guardrails and answer 'how do I control what Claude does?'",
        "Articulate how MCP connects Claude Code to a customer's internal tools and why it unlocks enterprise deals",
      ]},
      { type: "heading", value: "CLAUDE.md — persistent context", simple: "The instruction file that tells Claude how your project works" },
      { type: "text", value: "CLAUDE.md is a markdown file at the root of a project that gives Claude Code persistent instructions — think of it as a system prompt for your codebase. It can include coding standards, architecture decisions, and testing conventions, making it the single most important configuration surface for every customer deployment.", simple: "CLAUDE.md is a plain text file at the top of your project folder containing instructions Claude reads every time it starts — like a welcome document for a new hire. It is the most important setup step for any team adopting Claude Code." },
      { type: "terminal", title: "CLAUDE.md", lines: [
        "# Project: Acme API",
        "",
        "## Architecture",
        "- Express.js backend, React frontend in /client",
        "- PostgreSQL via Prisma ORM",
        "- All API routes go in /src/routes/",
        "",
        "## Conventions",
        "- Use TypeScript strict mode everywhere",
        "- All functions must have JSDoc comments",
        "- Tests live next to source files: foo.ts → foo.test.ts",
        "",
        "## Before committing",
        "- Run `npm run lint && npm test`",
        "- Never commit .env files",
      ]},
      { type: "text", value: "CLAUDE.md files are hierarchical — a root file sets project-wide rules, while subdirectory files can add or override rules for specific packages. In a monorepo, the frontend team's CLAUDE.md might specify React patterns while the backend team's specifies API conventions, all inheriting from a shared root.", simple: "CLAUDE.md files are layered: a top-level one sets project-wide rules, and files in subfolders can add or override rules for specific parts. In a monorepo, each team can have its own rules while inheriting shared basics from the top-level file." },
      { type: "config-hierarchy-diagram" },
      { type: "placeholder", title: "Advanced CLAUDE.md patterns for enterprise teams", why: "When a team scales beyond a handful of developers, a single CLAUDE.md file isn't enough. Here's how enterprise teams structure their configuration. The .claude/rules/ directory lets you split rules into modular files — one per topic (e.g., testing-conventions.md, api-patterns.md, security-requirements.md). Each rule file can include YAML frontmatter with a 'paths' field that scopes it to specific directories using glob patterns, so your React component rules only activate when Claude is working in src/components/. The @import syntax (@path/to/shared-rules.md) lets you pull instructions from other files — even across repos via symlinks — so an org-wide style guide lives in one place and every repo inherits it. For monorepos, claudeMdExcludes lets you skip packages that shouldn't load CLAUDE.md files (e.g., third-party vendored code or legacy modules you don't want Claude touching). As a practical example: Meridian Health's monorepo has a root CLAUDE.md with org-wide standards (TypeScript strict, no any types, HIPAA logging requirements), a packages/api/CLAUDE.md with backend conventions (Express patterns, Prisma ORM usage), a packages/web/CLAUDE.md with frontend conventions (React hooks, Tailwind classes), and .claude/rules/hipaa-compliance.md with path-scoped rules that only activate for files handling patient data. The total across all files stays under 200 lines per scope. We'll go into this in more detail in the role-specific tracks coming up.", topics: [".claude/rules/", "@import syntax", "Path-specific rules", "claudeMdExcludes", "Monorepo strategies", "Size management"] },
      { type: "divider" },
      { type: "heading", value: "Slash commands and custom commands", simple: "Shortcuts that trigger common workflows with a single command" },
      { type: "text", value: "Slash commands are shortcuts that trigger predefined workflows — Claude Code ships with built-in ones like /review, /test, and /commit. The real power is custom commands, where teams create their own.", simple: "Slash commands are one-word shortcuts that kick off tasks, with built-ins like /review, /test, and /commit. The real value is that teams can create custom commands for workflows they repeat often." },
      { type: "terminal", title: "Custom slash commands", lines: [
        "# .claude/commands/deploy-check.md",
        "",
        "Run the following pre-deployment checklist:",
        "1. Run the full test suite",
        "2. Check for any TODO or FIXME comments",
        "3. Verify all environment variables are documented",
        "4. Check for console.log statements in production code",
        "5. Validate that API endpoints have error handling",
        "6. Generate a summary of changes since last deploy",
      ]},
      { type: "text", value: "Custom commands are stored as markdown files in .claude/commands/ and shared via git, so a tech lead can define workflows once and the entire team inherits them. This is a powerful selling point: standardized quality checks that don't require anyone to remember a process.", simple: "Custom commands are saved as text files in .claude/commands/ and shared via git, so a team leader writes them once and every developer gets them automatically. This standardizes quality checks without relying on people to remember checklists." },
      { type: "divider" },
      { type: "heading", value: "Memory and project settings", simple: "How Claude remembers your preferences between sessions" },
      { type: "text", value: "Claude Code remembers context across sessions through two mechanisms: project-level memory in CLAUDE.md (version-controlled, shared) and user-level memory in ~/.claude/settings.json (personal preferences, global defaults). When Claude learns you prefer functional components or Vitest over Jest, it remembers.", simple: "Claude Code stores project-level memory in CLAUDE.md (shared via git) and personal memory in a settings file on your computer. If you tell Claude you prefer a certain coding style, it remembers next time." },
      { type: "values", items: [
        { title: "Project memory (CLAUDE.md)", desc: "Shared across the team via git. Architecture decisions, coding standards, tool preferences. The 'team brain' for the codebase.", simpleDesc: "Shared team knowledge stored in CLAUDE.md and checked into git, so every team member gets the same instructions." },
        { title: "User memory (~/.claude/)", desc: "Personal preferences that follow you across projects. Output format preferences, default model choice, frequently used tools.", simpleDesc: "Your personal preferences stored on your computer, following you from project to project — like preferred output format or favorite model." },
        { title: "Session context", desc: "Within a single session, Claude remembers everything discussed. Useful for iterative work — 'Now do the same thing for the user module.'", simpleDesc: "Within a single conversation, Claude remembers everything discussed — you can say 'now do the same for the other module' and it knows what you mean. This resets when you start a new session." },
      ]},
      { type: "divider" },
      { type: "heading", value: "Hooks — control and guardrails", simple: "Automatic checks that run before or after Claude takes an action" },
      { type: "text", value: "Hooks let you run custom scripts before or after Claude Code takes actions — for example, enforcing linting before commits or running tests after file edits. Hooks are deterministic guardrails, not suggestions: if a hook fails, the action is blocked, making them the answer to 'How do I control what Claude does?'", simple: "Hooks are automatic checkpoints that run before or after Claude acts — like running style checks ('linting') before a commit or tests after an edit. If a hook fails, the action is blocked entirely, making them the answer when a security-focused customer asks how they keep Claude in check." },
      { type: "terminal", title: "Hook configuration (.claude/hooks.json)", lines: [
        "{",
        "  \"pre-commit\": [",
        "    \"npm run lint\",",
        "    \"npm run type-check\"",
        "  ],",
        "  \"post-edit\": [",
        "    \"npm test -- --related\"",
        "  ],",
        "  \"pre-push\": [",
        "    \"npm run test:e2e\",",
        "    \"npm run security:audit\"",
        "  ]",
        "}",
      ]},
      { type: "divider" },
      { type: "heading", value: "Permission modes — how much Claude asks", simple: "How you control how much supervision Claude gets in real time" },
      { type: "text", value: "Permission modes control how much autonomy Claude has during a session — how often it pauses to ask before acting. You set the mode when you start working and can switch between them anytime.", simple: "Permission modes are a dial that controls how independent Claude is while you work. You choose the setting and can change it anytime." },
      { type: "values", items: [
        { title: "Default mode", desc: "Claude asks permission before writing files, running commands, or making network requests. The user approves each action. Best for learning, exploring unfamiliar codebases, or sensitive work where you want to review every step.", simpleDesc: "Claude pauses and asks before making changes, running commands, or accessing the network. Best when learning the tool, working in a new codebase, or doing sensitive work." },
        { title: "Plan mode", desc: "Claude only thinks and plans — it reads files and proposes an approach but takes no actions. Useful for reviewing strategy before committing to changes, and for building trust in customer demos where the audience wants to see Claude's reasoning before it acts.", simpleDesc: "Claude reads your code and proposes an approach but takes no actions. Great for reviewing strategy before committing, and powerful in demos where the audience wants to see reasoning first." },
        { title: "Auto-accept mode", desc: "Claude executes without asking, within configured boundaries. Good for experienced users who trust their CLAUDE.md and hook setup. Also called 'Accept Edits' — Claude writes code and runs commands freely, but hooks and permission rules still apply.", simpleDesc: "Claude works without pausing for approval — writing code, running commands, and making changes freely. Hooks and permission rules still apply, like giving a trusted colleague the go-ahead within clear guardrails." },
        { title: "Headless mode", desc: "No human in the loop — Claude runs autonomously in CI/CD pipelines. Permissions are entirely configured via settings files and managed policies. This is the enterprise deployment pattern for GitHub Actions, automated code review, and scheduled tasks.", simpleDesc: "No human in the loop — Claude runs inside automated CI/CD pipelines with all permissions set in advance through config files. This is how large companies run Claude Code at scale in GitHub Actions and automated workflows." },
      ]},
      { type: "divider" },
      { type: "heading", value: "Permission rules — what Claude is allowed to do", simple: "The underlying rules that control what actions Claude can take, regardless of mode" },
      { type: "text", value: "Separate from modes, permission rules determine which actions are structurally allowed regardless of which mode is active. These rules persist across sessions, can be enforced by administrators, and override everything — even auto-accept mode.", simple: "Underneath modes, a separate layer of rules controls what Claude is actually allowed to do — think of modes as 'how often Claude checks in' and rules as 'what Claude is allowed to do at all.' Even in auto-accept mode, a deny rule will block the action." },
      { type: "values", items: [
        { title: "Allow rules", desc: "Actions Claude can take without asking — even in default mode. Example: allow running npm test without prompting every time. Reduces permission fatigue for safe, repeated commands.", simpleDesc: "Things Claude can do without asking, even in the most cautious mode — like allowing 'npm test' so it doesn't prompt every time. This prevents 'permission fatigue' from getting asked so often you start blindly approving." },
        { title: "Deny rules", desc: "Actions Claude is never allowed to take, regardless of mode. Example: deny running rm -rf or curl to prevent destructive commands and data exfiltration. Deny rules override everything — they can't be bypassed by any mode.", simpleDesc: "Things Claude can never do, no matter what — like blocking destructive commands ('rm -rf') or network calls ('curl'). Deny rules are absolute and cannot be overridden by any mode, setting, or prompt." },
        { title: "Managed policies", desc: "Organization-wide rules set by administrators that take highest precedence and can't be overridden by individual users. A security team can enforce deny rules, restrict MCP servers, and require specific configurations across every developer's install.", simpleDesc: "Rules set by an IT or security team that apply to every developer in the company — individual users cannot change them. Like a company-wide IT policy, but for AI." },
      ]},
      { type: "divider" },
      { type: "heading", value: "MCP in Claude Code", simple: "Connecting Claude to your company's other tools and systems" },
      { type: "text", value: "Claude Code connects to MCP (Model Context Protocol) servers, giving it access to your customer's internal tools — Jira, Datadog, Confluence, Figma. It's the bridge between 'AI coding assistant' and 'AI that understands our whole engineering workflow.'", simple: "MCP (Model Context Protocol) lets Claude talk to other software tools — pulling ticket details from Jira, reading error logs from Datadog, or viewing design files in Figma. It turns Claude from a coding helper into something that understands your entire engineering workflow." },
      { type: "text", value: "MCP also expands Claude Code beyond developers — product managers, data analysts, and technical writers can pull context from internal systems through 1000+ pre-built connectors. Custom MCP servers can be built in an afternoon.", simple: "MCP expands Claude Code beyond developers — product managers, data analysts, and technical writers can pull context from internal systems too. There are over 1,000 ready-made connectors, and building a custom one takes an afternoon." },
      { type: "placeholder", title: "Monitoring, observability, and usage tracking", why: "Enterprise customers will ask: 'How do I see what Claude Code is doing across my org?' Claude Code has a full observability stack. OpenTelemetry integration (opt-in via CLAUDE_CODE_ENABLE_TELEMETRY=1) exports session counts, token usage, cost per model, lines of code changed, and tool permission decisions — all as standard OTel metrics you can pipe into Prometheus, Grafana, or any existing monitoring setup. ConfigChange hooks fire when settings are modified and can block unauthorized changes, giving security teams an audit trail. The Anthropic Console provides workspace-level spend limits and usage reporting. In-session, /cost shows token usage for API users and /stats shows usage patterns for subscribers. This matters for security teams (who touched what?), finance teams (what's it costing us?), and engineering leadership (is it actually being adopted?) — the three stakeholders who gate every enterprise rollout.", topics: ["OpenTelemetry metrics and events", "Anthropic Console spend limits", "ConfigChange hooks for audit", "/cost and /stats commands", "Prometheus / Grafana integration"] },
      { type: "reflect", prompt: "A CISO at a Fortune 500 company asks: 'How do I know Claude Code won't push untested code to production?' Walk through how you'd answer using CLAUDE.md, hooks, and the permissions model." },
    ],
  },
  {
    id: "security", label: "Security", title: "Security & trust",
    content: [
      { type: "text", value: "Security is the first conversation in every enterprise deal and often the last obstacle before a 'yes.' Claude Code was built with a defense-in-depth model — multiple independent layers that each reduce risk, and understanding them fluently is the difference between reassurance and dismissal.", simple: "Security is usually the biggest concern for companies considering Claude Code, which uses a 'defense-in-depth' approach — multiple independent layers like a bank vault with several locks. If you can explain these layers clearly, customers feel safe; if you stumble, the deal stalls." },
      { type: "overview", heading: "What we'll cover", items: [
        { label: "Sandboxing", desc: "Filesystem and network isolation that constrains what Claude can touch" },
        { label: "Permission tiers", desc: "Read-only by default, explicit approval for writes and commands" },
        { label: "Prompt injection", desc: "Built-in protections against malicious input in code and docs" },
        { label: "Compliance", desc: "SOC 2 Type 2, ISO 27001, and the Anthropic Trust Center" },
        { label: "Data privacy", desc: "What data is retained, who can access it, and how to opt out" },
      ]},
      { type: "outcomes", items: [
        "Walk a security team through the full defense-in-depth model: sandbox, permissions, hooks, managed settings",
        "Explain how prompt injection protections work and why the permission system is an independent enforcement layer",
        "Point customers to the right compliance resources (SOC 2, ISO 27001, Trust Center)",
        "Describe how managed settings give administrators centralized control over every developer's Claude Code install",
      ]},
      { type: "security-layers-diagram" },
      { type: "heading", value: "Sandboxing — what Claude can and can't touch", simple: "Sandboxing — keeping Claude in a restricted space" },
      { type: "text", value: "Claude Code runs bash commands in a sandbox that restricts filesystem access to the working directory and requires explicit approval for network requests. This is an OS-level isolation boundary that holds even if a prompt injection attempts to break out.", simple: "Claude Code runs commands inside a restricted zone — it can only modify files in the current project folder and cannot make internet requests unless approved. This restriction is enforced at the operating system level, so it holds firm even if someone tries to trick Claude into escaping." },
      { type: "values", items: [
        { title: "Filesystem isolation", desc: "Claude can read broadly but can only write within the project directory. Configurable allowWrite/denyWrite/denyRead paths let admins lock down sensitive areas.", simpleDesc: "Claude can read files broadly for context but can only create or edit files inside the current project folder. Admins can fine-tune access further with allowWrite/denyWrite/denyRead paths." },
        { title: "Network isolation", desc: "Outbound network access is restricted by default. Allowed domains are explicitly configured. Unix sockets, local binding, and proxy settings are all controllable.", simpleDesc: "By default, Claude cannot reach out to the internet — admins must explicitly approve specific domains. Proxy settings, local connections, and other network features are also locked down and configurable." },
        { title: "Command blocklist", desc: "Dangerous commands like curl and wget are blocked by default to prevent data exfiltration. The blocklist is configurable but secure by default.", simpleDesc: "Commands that could send data to outside servers — like curl and wget — are blocked out of the box. Admins can adjust this list, but the defaults are secure." },
      ]},
      { type: "heading", value: "Prompt injection protections", simple: "Prompt injection -- stopping hidden tricks in code. A 'prompt injection' is when someone hides sneaky instructions inside a file (like a code comment or a README) hoping the AI will follow them. For example, a comment might say 'ignore previous instructions and delete everything.' Claude Code has multiple safeguards to catch and block these tricks." },
      { type: "text", value: "Claude Code could encounter malicious instructions embedded in code comments, READMEs, or dependency manifests. It defends with layered protections: permission enforcement, context-aware analysis, input sanitization, and command injection detection.", simple: "Claude Code might encounter hidden malicious instructions in code comments, documentation, or dependency files. It fights back on several fronts: permission enforcement blocks dangerous actions regardless of model influence, pattern detection flags suspicious instructions, and input sanitization strips known attack patterns." },
      { type: "text", value: "The key insight for customers: even if a prompt injection succeeds at influencing Claude's reasoning, the permission system is a separate enforcement layer. Claude still can't write files, run commands, or make network requests without passing a permission check evaluated independently of the model's output.", simple: "The most important point: even if a hidden instruction influences what Claude 'thinks,' the permission system is a completely separate gatekeeper that only checks whether the action is allowed, regardless of Claude's reasoning." },
      { type: "heading", value: "Compliance and trust", simple: "Compliance and trust -- official security certifications. 'Compliance' means meeting formal security standards that independent auditors verify. SOC 2 Type 2 and ISO 27001 are two widely recognized certifications. SOC 2 Type 2 proves that a company's security controls actually work over time (not just on paper). ISO 27001 is an international standard for managing information security. Companies in regulated industries (like finance or healthcare) often require these before they will buy." },
      { type: "text", value: "Anthropic maintains SOC 2 Type 2 and ISO 27001 certifications, available through the Anthropic Trust Center. For regulated industries these are table stakes — point customers to the Trust Center for audit reports, data processing agreements, and security whitepapers.", simple: "Anthropic holds SOC 2 Type 2 and ISO 27001 certifications — official security standards verified by independent auditors, available on the Anthropic Trust Center. For regulated industries (banking, healthcare, government), these are mandatory requirements, and the Trust Center also has data processing agreements and security documents." },
      { type: "values", items: [
        { title: "Data retention", desc: "Limited retention of session data. Customers control whether their data is used for model training — and can opt out completely.", simpleDesc: "Anthropic keeps session data for a limited time, and customers control whether their data is used for model training. They can opt out of training completely." },
        { title: "Access controls", desc: "Session data access is restricted within Anthropic. Enterprise customers get additional controls through Bedrock/Vertex deployments.", simpleDesc: "Only authorized people within Anthropic can see session data. Enterprise customers deploying through Bedrock or Vertex get even more control, with data staying in their own cloud account." },
        { title: "Credential handling", desc: "API keys and credentials are stored securely and never included in model context. Claude Code uses the operating system's secure credential storage.", simpleDesc: "API keys and passwords are stored in your operating system's built-in secure vault — the same place your computer keeps Wi-Fi passwords. These secrets are never included in model context, so Claude never 'sees' them." },
      ]},
      { type: "heading", value: "Managed settings for teams", simple: "Managed settings -- centralized admin controls for teams. 'Managed settings' are configuration rules that a company's IT or security team sets up once, and those rules then apply to every developer's Claude Code installation automatically. Individual developers cannot override them. Think of it like a school's Wi-Fi policy: the IT department sets the rules, and no student can change them on their own laptop." },
      { type: "text", value: "For enterprise deployments, administrators can enforce security policies across every developer's Claude Code install via managed settings that take highest precedence and can't be overridden. Security teams can enforce permission rules, restrict MCP servers, disable bypass modes, and require specific hook configurations — all centrally.", simple: "Administrators can set security rules that apply to every developer's Claude Code install — these 'managed settings' take highest priority and cannot be changed by individual users. From one central place, the security team can control permissions, restrict MCP servers, disable bypass modes, and require specific hooks." },
      { type: "terminal", title: "Managed settings (enforced by admin)", lines: [
        "{",
        "  \"permissions\": {",
        "    \"deny\": [\"Bash(rm -rf *)\", \"Bash(curl *)\"],",
        "    \"defaultMode\": \"default\"",
        "  },",
        "  \"disableBypassPermissionsMode\": true,",
        "  \"allowManagedMcpServersOnly\": true,",
        "  \"allowManagedHooksOnly\": true",
        "}",
      ]},
      { type: "reflect", prompt: "A customer's security team pushes back: 'We can't have an AI writing arbitrary code on our machines.' Walk through the full defense-in-depth story — sandbox, permissions, hooks, managed settings, and compliance. What order do you present these in to build confidence?" },
    ],
  },
  {
    id: "enterprise", label: "Enterprise", title: "Enterprise deployment & costs",
    content: [
      { type: "text", value: "Most enterprise customers deploy Claude Code through their cloud provider — AWS Bedrock, Google Vertex AI, or Microsoft Foundry — because procurement, compliance, and billing already live there. Understanding the deployment landscape and cost model is essential for every customer-facing role.", simple: "Most large companies run Claude Code through their existing cloud provider (AWS Bedrock, Google Vertex AI, or Microsoft Foundry) because their security, billing, and legal agreements are already set up there. Understanding how this works and what it costs is essential for customer conversations." },
      { type: "overview", heading: "What we'll cover", items: [
        { label: "Cloud providers", desc: "Bedrock, Vertex AI, and Foundry — how customers deploy through their existing cloud" },
        { label: "GitHub Actions", desc: "CI/CD integration for automated code review and headless workflows" },
        { label: "Cost model", desc: "What it actually costs, how to track spend, and how to talk about ROI" },
        { label: "Team rollout", desc: "Patterns for scaling from one developer to an entire engineering org" },
      ]},
      { type: "outcomes", items: [
        "Recommend the right deployment option (Bedrock, Vertex, Foundry, or direct API) based on a customer's cloud environment",
        "Explain how GitHub Actions integration works and demo common CI/CD use cases",
        "Provide accurate cost estimates and frame ROI for a buyer with a specific team size",
        "Design a phased rollout plan from pilot to org-wide deployment",
      ]},
      { type: "heading", value: "Cloud provider deployment", simple: "How companies run Claude Code through their cloud" },
      { type: "deployment-paths-diagram" },
      { type: "text", value: "Claude Code supports three major cloud providers, each with its own authentication model. The key message: your data stays in your cloud, billed through your existing agreement, with no additional Anthropic account required.", simple: "Claude Code works with three major cloud platforms, each with its own authentication system. The key message for customers: data stays in their cloud account, appears on their existing bill, and no separate Anthropic account is needed." },
      { type: "values", items: [
        { title: "AWS Bedrock", desc: "Uses IAM roles and OIDC authentication. Data stays in the customer's AWS account. Integrates with CloudTrail for audit logging. Most common in enterprises already on AWS.", simpleDesc: "Amazon's AI platform — uses IAM roles (access control like keycards) and OIDC (identity verification without sharing passwords), with CloudTrail audit logging. If a company already uses AWS, this is almost always their first choice." },
        { title: "Google Vertex AI", desc: "Uses Workload Identity Federation and service accounts. Integrates with Google Cloud's security and billing. Common in GCP-native organizations.", simpleDesc: "Google's AI platform — uses Workload Identity Federation (a trusted badge system for services) and service accounts (special accounts for software, not people). The natural fit for companies already on Google Cloud." },
        { title: "Microsoft Foundry", desc: "Uses Azure-managed credentials. Integrates with Azure Active Directory. Newer option — growing fast in Microsoft-heavy enterprises.", simpleDesc: "Microsoft's AI platform — uses Azure-managed credentials (automatic login handling) and Azure Active Directory (the access management system most enterprises already use for email and apps). Newest option of the three, growing fast with Microsoft-heavy companies." },
      ]},
      { type: "text", value: "For all three providers, setup is environment variables plus cloud-native auth — no API keys stored locally, no Anthropic account needed. Claude Code also supports HTTPS_PROXY, custom base URLs, and LLM gateway configurations out of the box.", simple: "Setup for all three clouds means configuring environment variables and using the cloud's built-in login — no API keys on laptops, no Anthropic account needed. If the company uses a proxy or gateway (a middleman server that monitors traffic), Claude Code supports that too." },
      { type: "heading", value: "GitHub Actions and CI/CD", simple: "Automating Claude Code in your development pipeline" },
      { type: "text", value: "Claude Code runs in CI/CD pipelines as a headless agent — the most common pattern is GitHub Actions, where developers @mention Claude in PRs and issues and it responds with code changes, reviews, or implementations. This 'always-on teammate' story excites engineering leaders.", simple: "Claude Code can run inside CI/CD pipelines (automated systems that test and ship code) without a human at the keyboard — developers @mention Claude in GitHub pull requests or issues, and it automatically responds with code changes or reviews. Think of it as an always-on teammate; engineering leaders love this pitch." },
      { type: "terminal", title: "GitHub Actions workflow", lines: [
        "# .github/workflows/claude.yml",
        "name: Claude Code",
        "on:",
        "  issue_comment:",
        "    types: [created]",
        "  pull_request_review_comment:",
        "    types: [created]",
        "",
        "jobs:",
        "  claude:",
        "    if: contains(github.event.comment.body, '@claude')",
        "    runs-on: ubuntu-latest",
        "    steps:",
        "      - uses: anthropics/claude-code-action@v1",
        "        with:",
        "          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}",
      ]},
      { type: "text", value: "Use cases that land well: automated code review on every PR, implementing changes from issue comments, running security audits before merge, and generating test coverage. Setup takes minutes — install the GitHub app, add an API key secret, and drop in the workflow file.", simple: "Use cases that excite customers: automatic PR reviews, code fixes from comments, pre-merge security checks, and test generation for untested code. Setup takes minutes — add the GitHub app, store an API key as a secret, and add a small config file." },
      { type: "heading", value: "What it costs", simple: "Pricing and how to talk about it" },
      { type: "text", value: "Cost is always part of the conversation. Here are the numbers you need:", simple: "Customers will always ask about price. Here are the key figures to have ready:" },
      { type: "values", items: [
        { title: "~$6/developer/day average", desc: "This is the real-world average across all Claude Code usage. 90% of developers spend less than $12/day. Monthly, expect ~$100–200/developer with Sonnet.", simpleDesc: "On average, each developer costs about $6 per day — 90% spend less than $12/day. Monthly, expect roughly $100 to $200 per developer when using the Sonnet model." },
        { title: "Pay-as-you-go", desc: "API and cloud provider deployments (Bedrock, Vertex, Foundry) are usage-based. No per-seat commitment — customers pay for what they use.", simpleDesc: "You only pay for what you use — like a utility bill, not a fixed subscription. When running through Bedrock, Vertex, or Foundry, there is no upfront commitment or per-person fee." },
        { title: "Per-seat plans", desc: "Claude for Teams at $150/seat/month (Premium). Enterprise pricing is custom. Both include Claude Code access alongside Claude.ai.", simpleDesc: "Claude for Teams costs $150 per person per month (Premium tier); Enterprise pricing is negotiated case by case. Both plans include Claude Code and Claude.ai together." },
        { title: "Spend controls", desc: "Workspace-level spend limits in the Anthropic Console. Bedrock/Vertex have their own budget controls. Rate limits are configurable per-user.", simpleDesc: "Companies can set spending caps in the Anthropic Console at the workspace level, and Bedrock/Vertex have their own budget tools. Per-user rate limits are also configurable." },
      ]},
      { type: "text", value: "The ROI framing that works: 30 minutes saved per day equals 10+ hours per month, which at a fully-loaded engineering cost of $150-250/hour means $1,500-2,500 in recovered time against $100-200 in Claude Code costs. Most teams report saving significantly more than 30 minutes.", simple: "ROI (Return on Investment) math: 30 minutes saved per day equals 10+ hours per month, and at a fully loaded cost of $150-$250/hour, that is $1,500-$2,500 in recovered value against $100-$200 in Claude Code costs. Most teams report saving well over 30 minutes a day." },
      { type: "heading", value: "Team rollout patterns", simple: "How to grow from one developer to the whole company" },
      { type: "text", value: "Enterprise adoption follows a consistent pattern — customers rarely go from zero to org-wide in one step. Help them plan the journey:", simple: "Big companies almost never roll out a tool to everyone at once — they start small, build confidence, and prove value at each stage. Here is the typical path:" },
      { type: "values", items: [
        { title: "Phase 1: Pilot (1–5 developers)", desc: "Install Claude Code, write a CLAUDE.md, use it for daily coding. Goal: prove individual value and build internal champions.", simpleDesc: "A handful of enthusiastic developers install Claude Code, create a CLAUDE.md (the project instruction file), and use it for everyday work. The goal: prove value and build internal champions who advocate to teammates." },
        { title: "Phase 2: Team (5–25 developers)", desc: "Standardize CLAUDE.md across repos, add hooks for quality gates, connect MCP to internal tools. Goal: show team-level productivity gains.", simpleDesc: "Expand to a full team — standardize CLAUDE.md across repos, add hooks (automated checks like requiring tests to pass), and connect MCP servers to internal tools like Jira or Datadog. The goal: show measurable team-level productivity gains." },
        { title: "Phase 3: Organization (25+ developers)", desc: "Deploy via Bedrock/Vertex, enforce managed settings, add GitHub Actions automation, roll out training. Goal: make Claude Code part of the engineering platform.", simpleDesc: "Go company-wide: deploy through Bedrock/Vertex for central IT management, lock down managed settings for security, enable GitHub Actions automation, and run training. The goal: Claude Code becomes a standard part of how the company builds software." },
      ]},
      { type: "placeholder", title: "Migration patterns from competing tools", why: "Most enterprise prospects aren't starting from zero — they already use Copilot, Cursor, or Cody. The good news: Claude Code doesn't require replacing anything. Here's the coexistence playbook. Copilot and Claude Code serve different layers: Copilot handles line-level autocomplete inside the editor (fast, low-effort suggestions while typing), while Claude Code handles project-level agentic tasks (multi-file refactors, test generation, debugging across modules). Many teams run both — Copilot for the small stuff, Claude Code for the big stuff. Don't position it as a replacement; position it as a new capability they didn't have. For teams coming from Cursor: Cursor is an AI-native editor that replaces VS Code. Claude Code is editor-agnostic — it works in their existing VS Code, JetBrains, terminal, or browser. The migration path is additive: keep your editor, add Claude Code alongside it. For the first 30 days, follow this playbook: Week 1, install Claude Code and use it for codebase Q&A and small fixes only (low risk, immediate value). Week 2, write a CLAUDE.md and use it for a real task — a refactor or feature the team has been deferring. Week 3, add hooks and connect one MCP server (Jira or Slack — whichever the team uses most). Week 4, run a retrospective: what worked, what didn't, what to expand. A side-by-side evaluation works well: give three developers the same task, have one use Copilot only, one use Claude Code only, and one use both. Compare time to completion, code quality, and test coverage. The results speak for themselves. Example: Prism Analytics ran this evaluation on a database migration task. The Copilot-only developer finished in 6 hours with 70% test coverage. The Claude Code developer finished in 2 hours with 95% test coverage. The developer using both finished in 90 minutes — Copilot for quick edits while Claude Code handled the multi-file migration logic.", topics: ["Copilot coexistence", "Cursor migration", "First 30 days playbook", "Side-by-side evaluation framework", "Developer change management"] },
      { type: "placeholder", title: "Customer case studies and voice of the customer", why: "Nothing closes a deal like another customer's story. Build a library of 3-5 case studies covering different industries, team sizes, and adoption stages. Each should follow a consistent structure: the team before Claude Code (size, stack, pain points), what they deployed (which features, what configuration, how long setup took), what changed in 90 days (measurable outcomes like hours saved, PR cycle time reduction, or onboarding acceleration), and what surprised them (unexpected use cases, initial resistance, what almost went wrong). When choosing which stories to bring into a sales call, match on two dimensions: industry similarity (a fintech prospect trusts a fintech story) and problem similarity (a team struggling with test coverage trusts a story about test coverage, even from a different industry). The second dimension is often more powerful — a healthcare company that cut migration time by 70% resonates with any prospect facing migration pain, regardless of industry. Trainees should internalize 2-3 stories deeply enough to tell them without notes: the company, the problem, the number, and the quote. A sentence like 'a 40-person fintech team reduced their PR cycle time by 60% in the first quarter' changes a room.", topics: ["Fintech case study", "Healthcare / regulated", "Large enterprise (500+ devs)", "Startup / fast-moving team", "Migration from competitor"] },
      { type: "reflect", prompt: "A VP of Engineering asks: 'We have 200 developers on AWS. What does a Claude Code rollout look like and what will it cost us?' Sketch out the deployment architecture, phasing plan, and back-of-napkin cost estimate." },
    ],
  },
    ],
  },
  // ─── DAY 1 PRE-WORK FOUNDATIONS ───
  {
    id: "day1-what-is-claude-code",
    label: "What is Claude Code",
    title: "What is Claude Code, Installation, First Interaction",
    content: [
      { type: "text", value: "Claude Code is an agentic coding tool built by Anthropic. Unlike autocomplete tools like GitHub Copilot that predict the next line of code as you type, Claude Code operates at the project level. It reads your entire codebase, plans multi-step changes across multiple files, edits those files, runs commands to verify its work, and iterates when something breaks — all from a single natural-language prompt. You describe what you want at the level of intent ('refactor auth to use JWT,' 'add pagination to every API endpoint'), and Claude Code figures out which files to read, what changes to make, what tests to run, and how to fix anything that fails. This is a fundamentally different interaction model from anything most developers have used before." },
      { type: "text", value: "This section covers what Claude Code is, how it differs from the autocomplete tools your customers already know, how to install it, and what happens during your very first interaction. By the end, you'll be ready to open a terminal and start your first agentic session." },
      { type: "divider" },
      { type: "heading", value: "Agentic coding vs. autocomplete" },
      { type: "text", value: "The distinction between agentic coding and autocomplete is the single most important concept to internalize before you demo Claude Code. Every customer has seen autocomplete — it's the gray text that appears as you type in VS Code or IntelliJ, predicting the next token, line, or block. It's fast and frictionless, but it's fundamentally reactive: it waits for you to type, and it suggests what comes next in that specific location. It cannot read a file you haven't opened, run a test, or decide that a change in one file requires an update in three others." },
      { type: "text", value: "Agentic coding inverts that relationship. Instead of the developer driving every keystroke while the AI suggests completions, the developer describes an outcome and the AI drives execution. Claude Code reads files across your project to build understanding, reasons about the best approach, creates a plan, makes edits across multiple files, runs commands to verify its work, and loops back to fix anything that broke. The developer shifts from writing code line-by-line to reviewing, guiding, and approving the AI's work." },
      { type: "values", items: [
        { title: "Autocomplete (e.g., Copilot)", desc: "Predicts the next token or line based on the current file. Operates inside a single file at the cursor position. The developer writes code; the AI accelerates typing. No ability to run commands, read other files, or verify its own output. Fast and low-friction, but limited to local context." },
        { title: "Agentic coding (Claude Code)", desc: "Reads your entire codebase, plans a multi-step approach, edits multiple files, runs terminal commands, and verifies its own work — all from one prompt. The developer describes intent; the AI executes. When a test fails, it reads the error, reasons about the fix, and retries autonomously. Operates at the project level, not the line level." },
      ]},
      { type: "text", value: "Both approaches have their place. Autocomplete is excellent for flow-state coding where you know what you want to write and just want to get there faster. Agentic coding shines for tasks that span multiple files, require investigation, or involve tedious multi-step changes you'd rather delegate entirely. Many developers use both — Copilot for in-the-moment completions, Claude Code for larger tasks." },
      { type: "divider" },
      { type: "heading", value: "Four surfaces" },
      { type: "text", value: "Claude Code is available in four environments. All four use the same underlying engine — the same agentic loop, the same model, the same tool capabilities. The difference is the interface wrapping it. You can start a task in the CLI and continue it in VS Code, or use the Desktop App for visual review. Choose the surface that matches your workflow." },
      { type: "overview", heading: "Where Claude Code runs", items: [
        { label: "CLI (Terminal)", desc: "The original and most powerful surface. Raw speed, full control, headless mode for CI/CD. Runs anywhere you have a terminal — local, SSH, containers. Best for power users and automation." },
        { label: "VS Code Extension", desc: "Inline diffs, a visual file tree, and the full agentic loop embedded in your editor. See changes as they happen. Approve or reject edits without leaving VS Code. Best for developers who live in VS Code." },
        { label: "JetBrains Plugin", desc: "Same agentic engine inside IntelliJ, PyCharm, WebStorm, and other JetBrains IDEs. Integrates with JetBrains' built-in diff viewer and project navigation. Best for teams standardized on JetBrains." },
        { label: "Desktop App", desc: "A standalone native application for macOS and Windows. Built-in file browser and diff viewer with a lower barrier to entry — no terminal experience required. Best for visual learners, code review, and onboarding new users." },
      ]},
      { type: "divider" },
      { type: "stats", items: [
        { stat: "72.7%", label: "SWE-bench Verified — the industry benchmark for real-world coding ability", source: "Anthropic Sonnet 4 model card, May 2025" },
        { stat: "200K", label: "token context window — Claude reads entire codebases, not just open files", source: "API docs" },
        { stat: "7 min", label: "average time to first agentic task after installation", source: "Anthropic internal data" },
        { stat: "2x", label: "code output — developers report doubling their throughput on multi-file tasks", source: "Anthropic customer research" },
      ]},
      { type: "divider" },
      { type: "heading", value: "Installation" },
      { type: "text", value: "Installing Claude Code takes about two minutes. You need Node.js 18+ installed (Claude Code is a Node.js CLI tool under the hood). The install script downloads the binary, adds it to your PATH, and you authenticate via your browser." },
      { type: "terminal", title: "Install Claude Code", lines: [
        "# Install the CLI",
        "$ curl -fsSL https://cli.anthropic.com/install.sh | sh",
        "",
        "# Authenticate (opens your browser)",
        "$ claude auth",
        "→ Opening browser for authentication...",
        "→ Authentication successful.",
        "",
        "# Verify the installation",
        "$ claude --version",
        "→ Claude Code v1.x.x",
      ]},
      { type: "text", value: "That's it. No API keys to manage manually, no config files to create, no environment variables to set. The auth command handles OAuth through your browser, and Claude Code stores your credentials securely. If you're behind a corporate proxy, see the Troubleshooting section below." },
      { type: "divider" },
      { type: "heading", value: "VS Code & JetBrains setup" },
      { type: "text", value: "If you prefer working inside an IDE rather than a standalone terminal, Claude Code has first-class extensions for both VS Code and JetBrains. These give you the full agentic engine with the added benefit of inline diffs, visual file trees, and editor-native approval flows." },
      { type: "terminal", title: "VS Code", lines: [
        "# Option 1: Install from the VS Code Marketplace",
        "  Search for 'Claude Code' in the Extensions panel (Cmd+Shift+X)",
        "  Click Install",
        "",
        "# Option 2: Install from the command line",
        "$ code --install-extension anthropic.claude-code",
        "",
        "# Open the Claude Code panel",
        "  Cmd+Shift+P → 'Claude Code: Open'",
      ]},
      { type: "terminal", title: "JetBrains (IntelliJ, PyCharm, WebStorm)", lines: [
        "# Install from JetBrains Marketplace",
        "  Settings → Plugins → Marketplace → Search 'Claude Code'",
        "  Click Install → Restart IDE",
        "",
        "# Open the Claude Code tool window",
        "  View → Tool Windows → Claude Code",
      ]},
      { type: "text", value: "Both extensions use the same CLI under the hood, so your authentication, CLAUDE.md files, and settings carry over automatically. You don't need to configure anything twice." },
      { type: "divider" },
      { type: "heading", value: "Your first interaction" },
      { type: "text", value: "When you run the `claude` command inside a project directory, something important happens before you type a single character. Claude Code automatically reads the directory structure, looks for a package.json (or equivalent), and loads any CLAUDE.md file it finds. This is context gathering — the first step of the agentic loop. Claude is building a mental model of your project before you even ask a question." },
      { type: "terminal", title: "Starting Claude Code in a project", lines: [
        "$ cd ~/projects/my-app",
        "$ claude",
        "",
        "→ Reading project structure...",
        "  Found package.json (Node.js project)",
        "  Found CLAUDE.md (project instructions)",
        "  Found tsconfig.json (TypeScript)",
        "  Indexed 147 files across 12 directories",
        "",
        "→ What would you like to work on?",
      ]},
      { type: "text", value: "This automatic context gathering is why Claude Code can give project-aware answers from the very first prompt. It already knows your tech stack, your file structure, and any instructions you've left in CLAUDE.md. You don't need to explain your project — just tell it what you want to accomplish." },
      { type: "text", value: "Try a simple first prompt to see the loop in action. Something like 'explain this project's architecture' or 'what does the auth module do?' — a read-only question that lets you watch Claude navigate your codebase without making any changes. You'll see it read files, reason about what it finds, and synthesize an answer. That's the agentic loop at work." },
      { type: "divider" },
      { type: "heading", value: "Troubleshooting" },
      { type: "text", value: "Most installation issues fall into a handful of categories. Here are the common ones and how to fix them." },
      { type: "overview", heading: "Common issues", items: [
        { label: "Command not found", desc: "The claude binary isn't on your PATH. Restart your terminal, or manually add the install directory to your shell profile (~/.zshrc or ~/.bashrc). Run 'which claude' to verify." },
        { label: "Authentication error", desc: "Run 'claude auth' again to re-authenticate. If your browser didn't open, copy the URL from the terminal output and paste it manually. Make sure you're signed in to the correct Anthropic account." },
        { label: "Corporate proxy / SSL errors", desc: "Set the NODE_EXTRA_CA_CERTS environment variable to point to your corporate CA bundle. Then run 'claude /doctor' — a built-in diagnostic that checks connectivity, auth, and proxy configuration." },
        { label: "Node.js version too old", desc: "Claude Code requires Node.js 18 or later. Run 'node --version' to check. Use nvm or your package manager to upgrade: 'nvm install 18' or 'brew install node@18'." },
        { label: "Permission denied on install", desc: "The install script needs write access to /usr/local/bin (or equivalent). Either run with sudo, or use the --prefix flag to install to a user-owned directory." },
      ]},
      { type: "divider" },
      { type: "reflect", prompt: "You've just read about what Claude Code is and how to install it. How would you explain the difference between agentic coding and autocomplete to someone who's never seen either?" },
    ],
  },

  {
    id: "day1-agentic-loop",
    label: "How Claude Code works",
    title: "Agentic Loop, Context Window Basics, Tool Overview, Permission System",
    content: [
      { type: "text", value: "To use Claude Code effectively — and to explain it convincingly to customers — you need to understand four things: the agentic loop (how it works), the context window (its working memory), the tools (what it can do), and the permission system (how you stay in control). These four concepts form the mental model that makes everything else in this training click. Once you understand them, you'll know why Claude Code makes certain choices, where it excels, and how to troubleshoot when something goes wrong." },
      { type: "outcomes", items: [
        "Trace the five steps of the agentic loop — Read, Plan, Edit, Test, Iterate — and explain what happens at each stage",
        "Describe the context window's size and role, and know when to use /compact or /clear",
        "List the core tool categories Claude Code uses and explain how it selects which tools to invoke",
        "Distinguish the three permission modes and recommend the right one for different scenarios",
        "Explain self-correction: why Claude Code fixes its own mistakes without developer intervention",
      ]},
      { type: "divider" },
      { type: "heading", value: "The agentic loop" },
      { type: "text", value: "The agentic loop is the core execution model of Claude Code. Every task — from a one-line fix to a multi-file refactor — follows the same five-step cycle: Read, Plan, Edit, Test, Iterate. Understanding this loop is essential because it's what makes Claude Code agentic rather than just generative. A generative tool produces output and stops. An agentic tool produces output, checks whether it worked, and keeps going until the job is done." },
      { type: "values", items: [
        { title: "1. Read", desc: "Claude examines relevant files, directory structures, configuration, and existing code. It doesn't guess at your project — it reads it. This step uses tools like file read, grep, and glob to gather the context it needs for the current task. The more specific your prompt, the more targeted this reading is." },
        { title: "2. Plan", desc: "Based on what it read, Claude formulates an approach. For complex tasks, it uses extended thinking to reason step-by-step — weighing tradeoffs, considering edge cases, and sequencing changes to minimize breakage. You'll see this plan surfaced in the output before any edits begin, giving you a chance to redirect before code is written." },
        { title: "3. Edit", desc: "Claude makes the actual changes — writing new files, modifying existing ones, updating configuration, adding dependencies. Edits happen across as many files as the task requires. In a JWT migration, this might mean touching 15 files in a single pass: creating new modules, updating middleware, modifying routes, and adjusting tests." },
        { title: "4. Test", desc: "After editing, Claude runs your test suite, linter, type checker, or whatever verification commands your project uses. It reads the output of these commands to determine if the changes worked. This step is critical — it closes the loop by producing evidence of success or failure rather than assuming the edits were correct." },
        { title: "5. Iterate", desc: "If tests fail or errors appear, Claude reads the failure output, reasons about the cause, and loops back to step 3 (or step 1 if it needs to gather more context). This cycle repeats until the task passes verification or Claude determines it needs your input. Most tasks converge in 1-3 iterations." },
      ]},
      { type: "text", value: "Here's what the loop looks like in practice. Watch how Claude reads files, forms a plan, makes edits, runs a test, encounters a failure, and self-corrects — all without the developer intervening." },
      { type: "terminal", title: "The agentic loop in action", lines: [
        "$ claude",
        "→ What would you like to work on?",
        "",
        "$ Add a /health endpoint that returns uptime and version from package.json",
        "",
        "→ I'll add a health endpoint. Let me read the current setup...",
        "",
        "  Reading src/routes/index.ts",
        "  Reading src/app.ts",
        "  Reading package.json",
        "",
        "→ Plan:",
        "  1. Create src/routes/health.ts with GET /health",
        "  2. Return { status: 'ok', uptime: process.uptime(), version } from package.json",
        "  3. Register the route in src/app.ts",
        "  4. Run existing tests to verify nothing breaks",
        "",
        "  Creating src/routes/health.ts",
        "  Editing src/app.ts — adding health route import and registration",
        "",
        "$ npm test",
        "",
        "→ 2 tests failed: 'route registration' expects 5 routes, now finds 6",
        "",
        "→ I see — the test has a hardcoded route count assertion.",
        "  Updating tests/routes.test.ts to expect 6 routes.",
        "",
        "$ npm test",
        "",
        "→ All 24 tests passed.",
        "→ Health endpoint is live at GET /health.",
      ]},
      { type: "text", value: "The self-correction step is what makes this agentic, not just generative. When Claude ran the test suite and it failed, it read the error message, reasoned that the route-count assertion was hardcoded, updated the test, and re-ran verification — all without you intervening. A generative tool would have created the health endpoint and stopped, leaving you to discover and fix the broken test yourself." },
      { type: "divider" },
      { type: "heading", value: "Context window" },
      { type: "text", value: "The context window is Claude's working memory. It's the total amount of information Claude can hold and reason about at any given moment. Claude Code has a 200K-token context window — roughly 150,000 words, or the equivalent of 500+ source files of typical code. Everything Claude reads, writes, and discusses during a session lives in this window: files it has read, code it has written, terminal output from commands, and the full conversation history." },
      { type: "text", value: "This window is large, but it's finite. As a session goes on and more files are read and more output is generated, the window fills up. When it gets too full, Claude's quality can degrade — it may lose track of earlier context or make less precise edits. The fix is simple: use /compact to summarize the conversation and free up space, or /clear to start fresh. One focused task per session gets the best results." },
      { type: "stats", items: [
        { stat: "200K", label: "tokens — roughly 150,000 words of working memory per session", source: "API docs" },
        { stat: "~500", label: "source files of typical code can fit in a single context window", source: "Anthropic engineering estimates" },
        { stat: "90%", label: "cache savings — repeated file reads cost 90% less via prompt caching", source: "API pricing" },
      ]},
      { type: "text", value: "Think of the context window as Claude's working memory. It's large but finite. One focused task per session gets the best results. If you're doing a massive refactor, break it into logical chunks — 'migrate the auth module,' then a new session for 'migrate the billing module' — rather than trying to do everything in a single marathon session." },
      { type: "divider" },
      { type: "heading", value: "Tool overview" },
      { type: "text", value: "Claude Code accomplishes tasks by invoking tools — discrete capabilities it can call during the agentic loop. When you give Claude a prompt, it decides which tools it needs based on the task. You don't need to tell it 'read this file' or 'run this command' — it figures that out from your prompt. Here are the core tool categories." },
      { type: "values", items: [
        { title: "File read/write", desc: "Read any file in your project, create new files, and edit existing ones. This is the most frequently used tool. Claude reads files to understand context and writes files to implement changes. It handles binary files, configuration files, source code, and documentation." },
        { title: "Bash / terminal", desc: "Execute shell commands — run tests, install packages, start servers, check git status, run linters, and anything else you'd do in a terminal. Claude reads the command output to inform its next step. This is how the 'Test' step of the agentic loop works." },
        { title: "Search (grep, glob)", desc: "Find files by name patterns (glob) or search file contents by regex (grep). Claude uses these to navigate codebases efficiently — finding all files that import a module, locating every usage of a function, or identifying configuration files by naming convention." },
        { title: "Browser / web", desc: "Fetch and read web pages. Claude can pull up documentation, check API references, read Stack Overflow answers, or review URLs you share. Useful for tasks that require external context beyond your local files." },
        { title: "MCP tools (external services)", desc: "Connect to external services through the Model Context Protocol — databases, Jira, Slack, GitHub, internal APIs, and any custom tool your team builds. MCP tools extend Claude Code's reach beyond the local filesystem into the systems your team uses daily." },
      ]},
      { type: "text", value: "Claude chooses which tools to use based on the task. You don't need to tell it 'read this file' — it figures that out from your prompt. If you say 'fix the failing test in auth,' Claude will search for test files related to auth, read them, run the tests to see the failure, read the source code under test, make the fix, and re-run the tests. The tool selection is part of the 'Plan' step in the agentic loop." },
      { type: "divider" },
      { type: "heading", value: "Permission system" },
      { type: "text", value: "The permission system is how you stay in control of what Claude Code does. Because Claude Code can read files, write files, and execute terminal commands, Anthropic built a layered permission model that lets you choose how much autonomy to grant. There are three main modes, each offering a different balance of control and speed." },
      { type: "overview", heading: "Permission modes", items: [
        { label: "Suggest mode (default)", desc: "Claude proposes every action — file edits, terminal commands, tool calls — and waits for your explicit approval before executing. You see exactly what Claude wants to do and approve or reject each step. This is the safest mode and the best starting point for new users." },
        { label: "Auto-edit mode", desc: "Claude applies file edits automatically but still asks permission before running terminal commands. This speeds up the edit-test cycle for trusted coding tasks while keeping you in the loop for anything that touches the shell. Good for developers who trust Claude's edits but want to review commands." },
        { label: "Full auto mode", desc: "Claude executes everything — file edits and terminal commands — without asking for approval. Designed for experienced users who trust their setup, or for CI/CD pipelines running in headless mode. Combine with hooks and permission rules (deny lists) to maintain guardrails even in full auto." },
      ]},
      { type: "text", value: "Start with the default Suggest mode. Seeing what Claude wants to do at each step helps you learn the agentic loop — you'll develop an intuition for how it reads, plans, and acts. As that intuition builds, you can progressively open up permissions. Most experienced users settle on auto-edit mode for daily work and reserve full auto for well-defined, repeatable tasks." },
      { type: "text", value: "Beyond the three modes, you can configure granular permission rules for specific commands and tools. For example, you can allow 'npm test' and 'npm run lint' to execute automatically while blocking 'rm -rf' or 'git push' from ever running without approval. Deny rules always take precedence — they override everything else, giving security teams a hard stop on dangerous operations regardless of the mode the developer has selected." },
      { type: "divider" },
      { type: "reflect", prompt: "Think about the agentic loop: Read, Plan, Edit, Test, Iterate. How is this different from how you currently write code? Where does self-correction add the most value?" },
    ],
  },
  // ─── DAY 2 PRE-WORK FOUNDATIONS ───
  {
    id: "day2-claude-md", label: "CLAUDE.md & config", title: "CLAUDE.md Files, Settings Files, CLI Flags",
    content: [
      { type: "text", value: "CLAUDE.md is the file that transforms Claude from a generic tool into a codebase expert. Without it, Claude infers conventions — sometimes right, sometimes wrong. With it, Claude follows your standards consistently. A single well-written CLAUDE.md can eliminate an entire class of code-review feedback: wrong naming conventions, missing tests, inconsistent error handling. It's the highest-leverage five minutes you'll spend configuring any AI tool." },
      { type: "outcomes", items: [
        "Explain what belongs in a CLAUDE.md and why each section matters",
        "Write a CLAUDE.md for a real project in under five minutes",
        "Describe the CLAUDE.md hierarchy and how layers cascade",
        "Configure settings.json for project-level and global preferences",
        "Use CLI flags to adjust Claude Code behavior on the fly",
      ]},
      { type: "heading", value: "What to put in a CLAUDE.md" },
      { type: "text", value: "A good CLAUDE.md answers the questions a senior engineer would ask on their first day: What does this project do? How is it organized? What patterns do we follow? How do I know my code is ready to ship? You don't need to document everything — just the things Claude would otherwise guess wrong." },
      { type: "values", items: [
        { title: "Project overview", desc: "One to two sentences: what the project is, what runtime it uses, any critical constraints. This orients Claude before it reads a single file." },
        { title: "Architecture", desc: "Directory structure and the role of each top-level folder. Claude uses this to decide where new code should live and which files to read for context." },
        { title: "Conventions", desc: "Coding patterns the team has agreed on — async/await vs. callbacks, error handling strategy, naming conventions. These are the rules Claude would have no way to infer from code alone." },
        { title: "Quality gates", desc: "The commands that must pass before code ships: lint, type-check, test. Claude will run these automatically after making changes if you list them here." },
        { title: "Team notes", desc: "Anything specific to how your team works — PR conventions, branch naming, areas of the codebase that are off-limits or in active migration." },
      ]},
      { type: "heading", value: "A real CLAUDE.md example" },
      { type: "text", value: "Here's a complete CLAUDE.md for a shipment-tracking API. Notice how every line is actionable — there's nothing generic or aspirational." },
      { type: "terminal", title: "CLAUDE.md", lines: [
        "# Project Overview",
        "Express API for shipment tracking. Node.js 20, TypeScript strict mode.",
        "",
        "# Architecture",
        "- src/routes/ — API endpoints, one file per resource",
        "- src/services/ — Business logic, no HTTP concerns",
        "- src/models/ — Database models (Prisma)",
        "- tests/ — Co-located with source using .test.ts suffix",
        "",
        "# Conventions",
        "- async/await, never raw Promises",
        "- JSDoc on all exported functions",
        "- Error handling: throw AppError, never generic Error",
        "",
        "# Quality Gates",
        "- npm run lint && npm run type-check && npm test",
      ]},
      { type: "text", value: "The CLAUDE.md doesn't need to be long — it needs to be specific. 20 focused lines beat 200 generic ones." },
      { type: "heading", value: "CLAUDE.md hierarchy" },
      { type: "text", value: "CLAUDE.md files cascade like CSS or .eslintrc — each layer adds to or overrides the one above it. There are three levels: personal (applies to everything you do), project (applies to this repo), and subdirectory (applies to a specific package or folder). When Claude starts a session, it merges all applicable layers top-down." },
      { type: "terminal", title: "CLAUDE.md hierarchy", lines: [
        "~/.claude/CLAUDE.md            # Personal — your preferences across all projects",
        "  ↓ merged with",
        "repo/CLAUDE.md                  # Project — team standards for this repo",
        "  ↓ merged with",
        "repo/src/CLAUDE.md              # Subdirectory — overrides for this folder",
        "",
        "# Example: personal CLAUDE.md",
        "# ~/.claude/CLAUDE.md",
        "- Always explain your reasoning before making changes",
        "- Use verbose commit messages",
        "",
        "# Example: subdirectory CLAUDE.md",
        "# repo/src/frontend/CLAUDE.md",
        "- Use React functional components with hooks",
        "- Style with Tailwind utility classes, never inline styles",
      ]},
      { type: "text", value: "This hierarchy scales to large organizations. An engineering director writes the root CLAUDE.md with company-wide standards — TypeScript strict, no any types, required test coverage. Each team adds their own subdirectory CLAUDE.md with framework-specific patterns. Individual developers add personal preferences that never touch the shared repo." },
      { type: "heading", value: "Settings files" },
      { type: "text", value: "While CLAUDE.md controls how Claude thinks about your code, settings files control how Claude Code itself behaves — which tools it can use, which MCP servers to connect to, and what hooks to run. There are two levels: project settings (committed to the repo, shared with the team) and global settings (personal, on your machine)." },
      { type: "terminal", title: ".claude/settings.json (project)", lines: [
        "{",
        "  \"allowedTools\": [",
        "    \"Bash(npm run lint)\",",
        "    \"Bash(npm test)\",",
        "    \"Bash(npx prisma generate)\"",
        "  ],",
        "  \"mcpServers\": {",
        "    \"postgres\": {",
        "      \"command\": \"npx\",",
        "      \"args\": [\"-y\", \"@anthropic/mcp-postgres\"]",
        "    }",
        "  }",
        "}",
      ]},
      { type: "text", value: "Project settings live in .claude/settings.json and get committed to git — so the whole team shares the same tool permissions and MCP connections. Global settings live in ~/.claude/settings.json and apply everywhere. Project settings override global settings when both define the same key." },
      { type: "heading", value: "CLI flags" },
      { type: "text", value: "CLI flags let you adjust Claude Code's behavior for a single session without changing any files. They're useful for one-off tasks, scripting, and CI/CD pipelines." },
      { type: "overview", heading: "Key CLI flags", items: [
        { label: "--model sonnet", desc: "Switch the model for this session. Use 'opus' for hard problems, 'haiku' for quick tasks." },
        { label: "--print \"prompt\"", desc: "Non-interactive mode — send a prompt, get a response, exit. Perfect for scripts and CI/CD." },
        { label: "--allowedTools", desc: "Grant tool permissions for this session only. Overrides settings files without editing them." },
        { label: "--resume", desc: "Resume the most recent conversation instead of starting fresh. Useful when you get interrupted." },
        { label: "--verbose", desc: "Show detailed output including tool calls and token usage. Helpful for debugging prompts." },
      ]},
      { type: "reflect", prompt: "Think about a codebase you work with. What would you put in its CLAUDE.md? What conventions would be most important to capture?" },
    ],
  },
  {
    id: "day2-plan-mode", label: "Plan mode & tools", title: "Plan Mode, Slash Commands, Keyboard Shortcuts, Session Management",
    content: [
      { type: "text", value: "These are the tools and techniques that separate surface-level users from power users. Plan mode builds trust by showing Claude's reasoning before it touches your code. Slash commands save time by packaging common workflows into single keystrokes. And session management keeps quality high by preventing context pollution. Together, they form the operational toolkit for working with Claude Code effectively." },
      { type: "outcomes", items: [
        "Use plan mode to preview Claude's approach before it edits any files",
        "Identify when plan mode is the right choice versus prompting directly",
        "List the built-in slash commands and what each one does",
        "Use keyboard shortcuts to control generation and navigate efficiently",
        "Apply the one-job-one-session rule to maintain output quality",
      ]},
      { type: "heading", value: "Plan mode" },
      { type: "text", value: "Plan mode tells Claude to analyze and reason without making any changes. It reads your code, identifies the problem, maps out a solution — then stops and shows you the plan. You review it, adjust if needed, and only then give the go-ahead to execute. This is critical for complex tasks, unfamiliar codebases, and any situation where you want to understand the approach before code gets modified." },
      { type: "terminal", title: "Plan mode in action", lines: [
        "$ plan: Migrate our auth module from sessions to JWT",
        "",
        "→ I'll analyze the current auth implementation and plan the migration.",
        "",
        "  Reading src/auth/session.ts",
        "  Reading src/middleware/auth.ts",
        "  Reading src/routes/login.ts",
        "  Reading tests/auth.test.ts",
        "  Reading package.json",
        "",
        "→ Here's my migration plan:",
        "",
        "  1. Install jsonwebtoken and @types/jsonwebtoken",
        "  2. Create src/auth/jwt.ts with sign() and verify() helpers",
        "  3. Update auth middleware to check Authorization header for Bearer token",
        "  4. Update login route to return JWT instead of setting session cookie",
        "  5. Update 3 other routes that read session data to use JWT claims",
        "  6. Remove express-session from dependencies",
        "  7. Update all 12 test cases to use JWT auth headers",
        "",
        "  Files affected: 7",
        "  Estimated scope: medium",
        "",
        "  Ready to proceed? (y/n)",
      ]},
      { type: "text", value: "Start complex tasks in Plan Mode. It shows the reasoning, builds trust, and lets you stay in control. For straightforward tasks — fixing a typo, adding a log line — just prompt directly. For anything involving multiple files or architectural decisions, plan first." },
      { type: "heading", value: "Built-in slash commands" },
      { type: "text", value: "Slash commands are single-word shortcuts you type at the prompt. They trigger built-in workflows without writing a full prompt. Think of them as keyboard shortcuts for common Claude Code operations." },
      { type: "overview", heading: "Built-in commands", items: [
        { label: "/compact", desc: "Summarize the conversation and free up context space. Use every 15-20 minutes in long sessions to keep Claude sharp." },
        { label: "/clear", desc: "Reset the conversation entirely. Use when switching tasks — starts a fresh context with no carryover." },
        { label: "/cost", desc: "Show token usage and cost for the current session. Useful for monitoring spend during long tasks." },
        { label: "/help", desc: "Show all available commands, including any custom commands the project defines." },
        { label: "/doctor", desc: "Diagnose configuration and connection issues. First thing to run when something isn't working." },
        { label: "/config", desc: "View or modify Claude Code settings for the current session without editing files." },
      ]},
      { type: "heading", value: "Keyboard shortcuts" },
      { type: "text", value: "These work during an active Claude Code session. They're small time-savers that add up over a full day of coding." },
      { type: "overview", heading: "Key shortcuts", items: [
        { label: "Esc", desc: "Cancel the current generation. Use when Claude is heading in the wrong direction — stop it early rather than waiting." },
        { label: "Tab", desc: "Accept Claude's suggestion or autocomplete. Moves the workflow forward without typing." },
        { label: "Up arrow", desc: "Recall your previous prompt. Useful for iterating on a prompt without retyping it." },
      ]},
      { type: "heading", value: "Session management" },
      { type: "text", value: "The single most important habit for maintaining quality output: one focused task per session. When you mix unrelated tasks in the same session, Claude's context fills up with irrelevant code, old conversations, and conflicting instructions. Quality degrades noticeably after two or three unrelated tasks in the same context window." },
      { type: "values", items: [
        { title: "Start with a clear task", desc: "Begin each session with one specific goal. 'Add JWT auth to the payments route' — not 'work on the backend.' Specificity gives Claude a clear target." },
        { title: "Compact every 15-20 minutes", desc: "Run /compact regularly in long sessions. It summarizes what's happened so far and frees up context for new work. Think of it as clearing your desk." },
        { title: "Clear when switching tasks", desc: "Run /clear when you move to an unrelated task. The small cost of re-establishing context is far less than the cost of Claude confusing two different tasks." },
      ]},
      { type: "text", value: "The 'one job, one session' rule separates power users from frustrated users. When someone says Claude Code 'lost the thread' or 'started making weird suggestions,' the cause is almost always a session that ran too long or mixed too many tasks." },
      { type: "reflect", prompt: "When would you reach for Plan Mode vs. just prompting directly? Think of a scenario where seeing the plan first would be critical." },
    ],
  },
  {
    id: "day2-prompt-patterns", label: "Prompt patterns", title: "Prompting Patterns, Common Workflows",
    content: [
      { type: "text", value: "The difference between a good prompt and a great prompt comes down to structure. Three patterns consistently get better output from Claude Code — not because they're magic formulas, but because they give Claude the same information a skilled colleague would need: what to build, how to build it, and what to avoid." },
      { type: "outcomes", items: [
        "Apply the WHAT + HOW pattern to get code that follows existing project conventions",
        "Use constraint specification to prevent unwanted side effects",
        "Break complex work into iterative refinement steps for higher-quality results",
        "Match common development tasks to proven prompt templates",
        "Recognize and avoid the anti-patterns that degrade output quality",
      ]},
      { type: "heading", value: "Pattern 1: WHAT + HOW" },
      { type: "text", value: "The most common prompting mistake is saying what to build without saying how. Claude will make reasonable guesses about patterns and conventions — but they're guesses. When you specify both the outcome and the approach, Claude follows your team's actual patterns instead of inventing its own." },
      { type: "terminal", title: "Bad vs. good: WHAT + HOW", lines: [
        "# Bad — what only, no how:",
        "$ Add a shipments endpoint",
        "",
        "# Good — what AND how:",
        "$ Add a POST /api/shipments endpoint that creates a shipment",
        "  record. Follow the same patterns as the existing routes in",
        "  src/routes/, including validation middleware and the AppError",
        "  error handling convention.",
      ]},
      { type: "text", value: "The good prompt does two things: it describes the feature, and it points Claude at existing code to use as a reference. Claude will read those files and match the patterns it finds — naming, error handling, middleware structure, test format — all without you spelling them out." },
      { type: "heading", value: "Pattern 2: Constraint specification" },
      { type: "text", value: "Tell Claude what NOT to do. Constraints prevent the over-eager refactoring that can turn a small change into a sprawling rewrite. They're especially important for refactoring tasks where you want to improve internals without breaking the external interface." },
      { type: "terminal", title: "Constraint specification", lines: [
        "$ Refactor the payment processing module to use the",
        "  strategy pattern. Constraints:",
        "  - Don't change the public API — all existing callers",
        "    must work without modification",
        "  - Keep backward compatibility with the current",
        "    database schema",
        "  - Don't add new dependencies",
      ]},
      { type: "text", value: "Without constraints, Claude might rename exports, restructure the database layer, or add a library that 'improves' the implementation. Constraints keep the scope tight and the blast radius small." },
      { type: "heading", value: "Pattern 3: Iterative refinement" },
      { type: "text", value: "For complex work, don't try to get everything in one prompt. Start broad to understand the landscape, then narrow down to specific changes. Each step gives you a checkpoint to verify direction before committing further." },
      { type: "terminal", title: "Iterative refinement", lines: [
        "# Step 1 — Understand the landscape:",
        "$ What are the top 3 code quality issues in src/utils/?",
        "",
        "# Step 2 — Fix one specific issue:",
        "$ Refactor src/utils/helpers.js to fix issue #1 (the",
        "  duplicated validation logic). Extract a shared validator.",
        "",
        "# Step 3 — Verify with tests:",
        "$ Add tests for the refactored validation functions.",
        "  Cover edge cases: empty input, null values, and",
        "  strings exceeding 255 characters.",
      ]},
      { type: "text", value: "Each prompt builds on the last. Claude retains context from the previous steps, so step 2 already knows what issue #1 was, and step 3 knows exactly which functions were refactored. This iterative approach catches problems early and keeps each change reviewable." },
      { type: "heading", value: "Common workflows" },
      { type: "text", value: "These are battle-tested prompt templates for the tasks developers do every day. Each one applies the patterns above — specific outcome, reference to existing code, and clear constraints." },
      { type: "values", items: [
        { title: "Refactoring", desc: "\"Refactor [file] to follow [conventions]. Don't change the public API. Keep all existing tests passing.\"" },
        { title: "Adding features", desc: "\"Add [feature] following the same patterns as [existing similar feature]. Include validation, error handling, and tests.\"" },
        { title: "Writing tests", desc: "\"Write tests for [module] using the same patterns as [existing test file]. Cover happy paths, error cases, and edge cases.\"" },
        { title: "Debugging", desc: "\"This test is failing: [paste error]. Diagnose the root cause and fix it. Explain what went wrong.\"" },
        { title: "Code review", desc: "\"Review [file or PR] for: separation of concerns, error handling, test coverage, and naming consistency. Flag issues by severity.\"" },
        { title: "Documentation", desc: "\"Add JSDoc to all exported functions in [directory]. Follow the style in [existing documented file]. Don't change any implementation code.\"" },
      ]},
      { type: "heading", value: "Anti-patterns to avoid" },
      { type: "text", value: "Three anti-patterns account for most frustrating Claude Code experiences. First, the kitchen-sink session: cramming five unrelated tasks into one conversation until context is polluted and output quality craters. Use /clear between unrelated tasks. Second, the correction spiral: instead of resetting after a wrong turn, stacking 'no, I meant...' corrections that confuse Claude further. If you're three corrections deep, start fresh with a better initial prompt. Third, the over-specified CLAUDE.md: a 500-line CLAUDE.md that tries to cover every edge case. Claude spends so many tokens reading instructions that it has less room for your actual code. Keep it under 50 lines per scope level." },
      { type: "reflect", prompt: "Which of the three patterns (WHAT+HOW, constraints, iterative) would be most useful for your daily work? Why?" },
    ],
  },
  // ─── DAY 3 PRE-WORK FOUNDATIONS ───
  {
    id: "day3-core-extensions", label: "Core extensions", title: "Hooks, MCP Servers, Sub-Agents, Custom Slash Commands",
    content: [
      { type: "text", value: "Claude Code's power comes from its extension points. Hooks enforce quality gates that can't be skipped, MCP connects Claude to external tools and data sources, sub-agents enable parallel work across files, and custom slash commands standardize team workflows. Together, they transform Claude Code from a coding assistant into a programmable engineering platform." },
      { type: "outcomes", items: [
        "Explain each extension point — hooks, MCP, sub-agents, and custom commands — and when to recommend each",
        "Configure a PostToolUse hook that enforces automated testing after file edits",
        "Set up an MCP server and describe how Claude discovers and uses its tools",
        "Describe how sub-agents enable parallel work and the cost tradeoffs involved",
        "Create a custom slash command and explain how it's shared across a team via git",
        "Choose the right extension point for a given customer workflow need",
      ]},
      { type: "heading", value: "Hooks" },
      { type: "text", value: "Hooks are automated actions that fire on specific events in the agentic loop. They are enforced gates — not suggestions. If a hook fails, the action is blocked. There are three hook types: PreToolUse fires before a tool runs (validate before acting), PostToolUse fires after a tool completes (verify after acting), and Notification fires on events like task completion or errors." },
      { type: "terminal", title: "Hook configuration — PostToolUse runs tests after file edits", lines: [
        "{",
        "  \"hooks\": {",
        "    \"PostToolUse\": [",
        "      {",
        "        \"matcher\": \"Write|Edit\",",
        "        \"hooks\": [",
        "          {",
        "            \"type\": \"command\",",
        "            \"command\": \"npm test -- --bail\"",
        "          }",
        "        ]",
        "      }",
        "    ]",
        "  }",
        "}",
      ]},
      { type: "text", value: "Hooks are the answer when someone asks 'How do we control what Claude does?' They're enforced gates, not suggestions. A failing hook blocks the action and feeds the error back to Claude, so it can self-correct — test failures become instant feedback loops." },
      { type: "divider" },
      { type: "heading", value: "MCP servers" },
      { type: "text", value: "Model Context Protocol (MCP) connects Claude to external tools and data sources. The flow: you configure an MCP server in settings, Claude discovers the tools it exposes on startup, and then uses them as part of the agentic loop — just like its built-in tools. No special prompting required." },
      { type: "terminal", title: "MCP server configuration", lines: [
        "// .claude/settings.json",
        "{",
        "  \"mcpServers\": {",
        "    \"jira\": {",
        "      \"command\": \"npx\",",
        "      \"args\": [\"-y\", \"@anthropic/mcp-server-jira\"],",
        "      \"env\": {",
        "        \"JIRA_URL\": \"https://yourcompany.atlassian.net\",",
        "        \"JIRA_TOKEN\": \"${JIRA_API_TOKEN}\"",
        "      }",
        "    }",
        "  }",
        "}",
      ]},
      { type: "overview", heading: "Common MCP servers", items: [
        { label: "Jira", desc: "Read tickets, create issues, update status — Claude understands the task before writing code" },
        { label: "Slack", desc: "Search messages, post updates — Claude can notify channels when work is done" },
        { label: "Datadog", desc: "Query metrics, read alerts — Claude can investigate production issues with real observability data" },
        { label: "Confluence", desc: "Read documentation, search knowledge bases — Claude gets context from your team's written knowledge" },
        { label: "GitHub", desc: "Read PRs, check CI status, review comments — Claude participates in the code review workflow" },
        { label: "PostgreSQL", desc: "Query databases, inspect schemas — Claude can verify its changes against real data" },
      ]},
      { type: "text", value: "MCP is where Claude Code stops being a coding tool and becomes a platform that understands your entire engineering workflow. When Claude can read the Jira ticket, check Datadog for related errors, and reference the Confluence architecture doc — all before writing a line of code — that's a fundamentally different value proposition." },
      { type: "divider" },
      { type: "heading", value: "Sub-agents" },
      { type: "text", value: "Claude can spawn additional Claude instances — sub-agents — to work in parallel. This is useful when a task naturally decomposes into independent pieces that don't need to wait on each other." },
      { type: "values", items: [
        { title: "Writer/reviewer pair", desc: "One agent writes the implementation, another reviews it independently — catching issues the writer is blind to, just like human code review." },
        { title: "Fan-out across files", desc: "When a change touches many files with the same pattern (e.g., updating 20 API endpoints), sub-agents handle files in parallel instead of sequentially." },
        { title: "Research agent", desc: "A dedicated sub-agent explores the codebase, reads documentation, or investigates a question — feeding findings back to the primary agent without interrupting its work." },
      ]},
      { type: "text", value: "The tradeoff is cost: each sub-agent consumes its own tokens and context window. Use sub-agents when the parallelism saves meaningful time — large refactors, multi-file migrations, or tasks where independent verification adds quality. For small, sequential tasks, a single agent is more efficient." },
      { type: "divider" },
      { type: "heading", value: "Custom slash commands" },
      { type: "text", value: "Create a markdown file in .claude/commands/ and it becomes a slash command available to everyone who clones the repo. The filename becomes the command name — deploy-check.md becomes /deploy-check. The file's content is the prompt Claude receives when the command is invoked." },
      { type: "terminal", title: ".claude/commands/deploy-check.md", lines: [
        "Run the following pre-deployment checklist:",
        "",
        "1. Run the full test suite and report results",
        "2. Check for any TODO or FIXME comments in changed files",
        "3. Verify all environment variables are documented in .env.example",
        "4. Check for console.log statements in production code",
        "5. Validate that API endpoints have error handling",
        "6. Generate a summary of changes since the last tag",
      ]},
      { type: "text", value: "A tech lead defines commands once, and the entire team inherits them via git. This is a powerful adoption pattern: standardized workflows that don't rely on anyone remembering a process, and that evolve alongside the codebase." },
      { type: "divider" },
      { type: "heading", value: "When to use what" },
      { type: "values", items: [
        { title: "Hooks", desc: "Use for enforcement and compliance — things that must happen and can't be skipped. Linting before commits, tests after edits, security scans before pushes. The answer to 'how do we guarantee quality?'" },
        { title: "Custom commands", desc: "Use for convenience and team workflows — things that should happen but are opt-in. Deploy checklists, status reports, onboarding guides. The answer to 'how do we standardize how we work?'" },
        { title: "MCP", desc: "Use for external data and integration — connecting Claude to tools and context beyond the codebase. Jira tickets, Datadog metrics, Confluence docs. The answer to 'how does Claude understand our workflow?'" },
      ]},
      { type: "reflect", prompt: "Think about your team's workflow. Which extension point would deliver the most value first — hooks for quality enforcement, MCP for external context, or commands for workflow consistency?" },
    ],
  },
  {
    id: "day3-ide-integration", label: "IDE integration", title: "IDE Integration (VS Code, JetBrains)",
    content: [
      { type: "text", value: "Claude Code works in your editor, not just the terminal. The VS Code extension and JetBrains plugin give you inline diffs, visual file trees, and the same agentic engine in a familiar environment. For many developers, this is the surface they'll use most." },
      { type: "outcomes", items: [
        "Install and configure the Claude Code VS Code extension and describe its key features",
        "Explain the JetBrains plugin setup and how it differs from VS Code",
        "Recommend when to use the IDE integration vs. the CLI based on the task at hand",
      ]},
      { type: "heading", value: "VS Code extension" },
      { type: "text", value: "Setup: search for 'Claude Code' in the VS Code Marketplace, install, and sign in via the Command Palette (Cmd/Ctrl+Shift+P, then 'Claude Code: Sign In'). Once connected, Claude appears as a sidebar panel with full agentic capabilities." },
      { type: "values", items: [
        { title: "Inline diffs", desc: "See exactly what Claude proposes to change, highlighted directly in the editor. Accept or reject hunks individually — the same review experience as a pull request, but in real time." },
        { title: "Claude panel", desc: "A dedicated sidebar for the conversation. Click the Claude icon or open via Command Palette. Your full chat history, tool use, and file changes are visible in one place." },
        { title: "Command palette", desc: "All Claude commands accessible via Cmd/Ctrl+Shift+P — start a session, switch modes, run slash commands, and manage settings without leaving the keyboard." },
        { title: "File context", desc: "Claude automatically knows which file you have open and uses it as context. Select a code block and ask Claude about it — no copy-pasting required." },
      ]},
      { type: "divider" },
      { type: "heading", value: "JetBrains plugin" },
      { type: "text", value: "The JetBrains plugin is available in the JetBrains Marketplace — search 'Claude Code' and install. It works with IntelliJ IDEA, PyCharm, WebStorm, and other JetBrains IDEs. Setup: install from Marketplace, then sign in via the plugin settings. JetBrains uses a tool window instead of a sidebar panel, but the core capabilities are the same — inline diffs, dedicated conversation view, and command access." },
      { type: "divider" },
      { type: "heading", value: "When to use IDE vs. CLI" },
      { type: "values", items: [
        { title: "IDE", desc: "Best when you want inline diffs, a visual file tree, or when the task involves files you're actively reading. Lower barrier to entry — great for onboarding developers who aren't terminal-first." },
        { title: "CLI", desc: "Best for raw speed, working across many files, terminal-first workflows, and automation. Supports headless mode for CI/CD. More powerful for complex multi-step tasks and scripting." },
      ]},
      { type: "text", value: "Both surfaces use the same agentic engine underneath — the choice is about your preferred workflow, not capability. Many developers use both: IDE when reading and reviewing code, CLI when executing large changes or running automated workflows." },
      { type: "reflect", prompt: "Think about your typical coding workflow. When would you reach for the IDE integration vs. the CLI? Is there a task you do daily that would benefit from switching surfaces?" },
    ],
  },
  {
    id: "day3-cicd", label: "CI/CD & automation", title: "CI/CD Automation, Headless Mode, GitHub Actions",
    content: [
      { type: "text", value: "Claude Code isn't just interactive — it can run in CI/CD pipelines, review PRs automatically, and generate code as part of automated workflows. Headless mode removes the human from the loop, turning Claude into an infrastructure component." },
      { type: "outcomes", items: [
        "Use the --print flag to run Claude Code non-interactively in scripts and pipelines",
        "Configure a GitHub Actions workflow that uses Claude Code for automated PR review",
        "Identify CI/CD tasks that benefit from Claude Code automation and explain the tradeoffs",
      ]},
      { type: "heading", value: "Headless mode" },
      { type: "text", value: "The --print flag (also called headless mode) runs Claude non-interactively. It takes a prompt, executes, and returns the result — no human in the loop. This is the foundation for all CI/CD integrations." },
      { type: "terminal", title: "Headless mode examples", lines: [
        "# Review a PR and output the result",
        "$ claude --print \"Review this PR for security issues and bugs\"",
        "",
        "# Pipe output to a file",
        "$ claude --print \"Generate a changelog from the last 10 commits\" > CHANGELOG.md",
        "",
        "# Use in a script with specific context",
        "$ claude --print \"Analyze src/auth/ for SQL injection vulnerabilities\" \\",
        "    --model sonnet",
        "",
        "# Chain with other tools",
        "$ git diff main..HEAD | claude --print \"Review this diff for breaking changes\"",
      ]},
      { type: "divider" },
      { type: "heading", value: "GitHub Actions integration" },
      { type: "text", value: "Claude Code can be embedded directly in GitHub Actions workflows. The most common pattern is automated PR review — Claude reads the diff, analyzes the changes, and posts a review comment." },
      { type: "terminal", title: "GitHub Actions workflow — automated PR review", lines: [
        "# .github/workflows/claude-review.yml",
        "name: Claude PR Review",
        "on:",
        "  pull_request:",
        "    types: [opened, synchronize]",
        "",
        "jobs:",
        "  review:",
        "    runs-on: ubuntu-latest",
        "    steps:",
        "      - uses: actions/checkout@v4",
        "        with:",
        "          fetch-depth: 0",
        "",
        "      - name: Install Claude Code",
        "        run: npm install -g @anthropic-ai/claude-code",
        "",
        "      - name: Run Claude review",
        "        env:",
        "          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}",
        "        run: |",
        "          claude --print \"Review this PR. Focus on bugs,",
        "          security issues, and breaking changes.",
        "          Post a summary with actionable feedback.\" > review.md",
        "",
        "      - name: Post review comment",
        "        uses: actions/github-script@v7",
        "        with:",
        "          script: |",
        "            const fs = require('fs');",
        "            const review = fs.readFileSync('review.md', 'utf8');",
        "            github.rest.issues.createComment({",
        "              owner: context.repo.owner,",
        "              repo: context.repo.repo,",
        "              issue_number: context.issue.number,",
        "              body: review",
        "            });",
      ]},
      { type: "text", value: "This is a starting point — production workflows add authentication, model selection, error handling, cost controls, and conditional logic based on file types or PR labels." },
      { type: "divider" },
      { type: "heading", value: "When to automate" },
      { type: "values", items: [
        { title: "PR review", desc: "Catch issues before human review — security vulnerabilities, style violations, missing tests, breaking changes. Claude provides a first pass so human reviewers can focus on architecture and design decisions." },
        { title: "Code generation", desc: "Automate boilerplate, database migrations, API client generation, and scaffolding. Triggered by events like new schema definitions or configuration changes." },
        { title: "Documentation", desc: "Keep docs in sync with code — auto-generate API docs, update changelogs, and flag stale documentation when the underlying code changes." },
        { title: "Compliance", desc: "Automated security scanning, license checking, and policy enforcement on every PR. Hooks and headless mode combine to create continuous compliance pipelines." },
      ]},
      { type: "reflect", prompt: "What's one task in your CI/CD pipeline that could benefit from Claude Code automation? What would the prompt look like, and what guardrails would you put around it?" },
    ],
  },
  {
    id: "day3-agent-sdk", label: "Agent SDK & MCP", title: "Agent SDK Intro, Building MCP Servers",
    content: [
      { type: "text", value: "For advanced use cases, the Agent SDK lets you build custom agents with Claude as the reasoning engine, and you can create your own MCP servers to connect Claude to any internal data source or tool. This is where Claude Code becomes a platform you build on, not just a tool you use." },
      { type: "outcomes", items: [
        "Describe what the Agent SDK is and identify use cases where it's the right tool",
        "Write a basic Agent SDK script that uses Claude with custom tools",
        "Explain the three primitives an MCP server provides: tools, resources, and prompts",
        "Build a minimal MCP server and connect it to Claude Code",
      ]},
      { type: "heading", value: "Agent SDK" },
      { type: "text", value: "The Agent SDK is a Python/TypeScript library for building custom agents powered by Claude. Use it when you need custom logic beyond what Claude Code provides out of the box — multi-agent orchestration, structured output pipelines, or embedding Claude's reasoning into your own applications." },
      { type: "terminal", title: "Basic Agent SDK usage", lines: [
        "import Anthropic from \"@anthropic-ai/sdk\";",
        "",
        "const client = new Anthropic();",
        "",
        "const tools = [",
        "  {",
        "    name: \"get_weather\",",
        "    description: \"Get current weather for a location\",",
        "    input_schema: {",
        "      type: \"object\",",
        "      properties: {",
        "        location: { type: \"string\", description: \"City name\" }",
        "      },",
        "      required: [\"location\"]",
        "    }",
        "  }",
        "];",
        "",
        "const response = await client.messages.create({",
        "  model: \"claude-sonnet-4-20250514\",",
        "  max_tokens: 1024,",
        "  tools: tools,",
        "  messages: [",
        "    { role: \"user\", content: \"What's the weather in SF?\" }",
        "  ]",
        "});",
      ]},
      { type: "text", value: "The SDK gives you full control over the agentic loop — you decide which tools are available, how to handle tool calls, when to continue the conversation, and how to structure the output. Claude Code itself is built on these same primitives." },
      { type: "divider" },
      { type: "heading", value: "Building MCP servers" },
      { type: "text", value: "An MCP server exposes three primitives to Claude: Tools are functions Claude can call (e.g., query a database, create a ticket), Resources are data Claude can read (e.g., configuration files, documentation), and Prompts are templates for common tasks (e.g., 'review this PR with our standards'). You build the server, Claude discovers it on startup, and uses it like any other tool." },
      { type: "terminal", title: "MCP server skeleton (TypeScript)", lines: [
        "import { McpServer } from \"@modelcontextprotocol/sdk/server/mcp.js\";",
        "import { StdioServerTransport } from",
        "  \"@modelcontextprotocol/sdk/server/stdio.js\";",
        "",
        "const server = new McpServer({",
        "  name: \"my-internal-tool\",",
        "  version: \"1.0.0\"",
        "});",
        "",
        "// Define a tool Claude can call",
        "server.tool(",
        "  \"get_ticket\",",
        "  \"Fetch a ticket by ID from our internal tracker\",",
        "  { ticket_id: { type: \"string\", description: \"Ticket ID\" } },",
        "  async ({ ticket_id }) => {",
        "    // Replace with real API call",
        "    const ticket = await fetchTicket(ticket_id);",
        "    return {",
        "      content: [",
        "        { type: \"text\", text: JSON.stringify(ticket) }",
        "      ]",
        "    };",
        "  }",
        ");",
        "",
        "// Start the server",
        "const transport = new StdioServerTransport();",
        "await server.connect(transport);",
      ]},
      { type: "text", value: "Start simple — build a server that returns hardcoded data, verify Claude can discover and use it, then add real integrations. A working MCP server with fake data is more valuable than a perfect one that's never finished. Most servers take an afternoon to build." },
      { type: "reflect", prompt: "If you could connect Claude to any internal system at your company, what would it be? What tools would that MCP server expose, and how would it change your team's workflow?" },
    ],
  },
];

// ─── ORIENTATION vs CONTEXTUAL FOUNDATIONS ───
// Orientation: required upfront before path selection (Anthropic, Products, Claude Code overview)
// Contextual: delivered just-in-time as prework for the module that uses them
const ORIENTATION_SECTIONS = [
  "welcome", "claude-ai", "cowork", "claude-code", "model-family", "extensions",
  "how-to-use", "who-uses-it", "what-it-costs", "how-it-thinks",
];

const ORIENTATION_FOUNDATIONS = FOUNDATIONS.map(f => {
  if (!f.pages) return f;
  return { ...f, pages: f.pages.filter(p => ORIENTATION_SECTIONS.includes(p.id)) };
});

const isOrientationComplete = (sections) =>
  ORIENTATION_SECTIONS.every(id => sections.includes(id));

// ─── MODULES (the 5-day curriculum) ───
const MODULES = [
  {
    id: 1, number: "01", day: "Day 1",
    title: "First contact",
    swbat: "Set up Claude Code, begin to create with it",
    subtitle: "Install Claude Code, have your first interaction, and understand the agentic loop that makes it different. Common core — everyone starts here.",
    materials: [
      { id: "M1", label: "Install & First Run cheat sheet", when: "Print before starting — follow alongside the installation steps" },
      { id: "M1b", label: "Command Glossary", when: "Desk reference — every command, shortcut, and flag in one place" },
    ],
    skills: ["Installation", "Authentication", "Agentic loop", "Context window basics", "Tool overview", "Permission system"],
    modality: { live: "45 min", lab: "45 min", selfPaced: "30 min pre-work" },
    steps: [
      // Hands-on only — self-guided content moved to pre-work handouts (M1c, M1d)
      { title: "Installation and authentication", contentType: "hands-on", desc: "Install Claude Code globally, authenticate, and verify everything works. Then set up the IDE extension.", commands: ["curl -fsSL https://cli.anthropic.com/install.sh | sh", "claude auth", "claude --version"], expected: "You should see the installed version number, a browser window for authentication, and the version confirmation. If you\u2019re on a corporate network that blocks the browser redirect, ask your facilitator for the manual token flow.", materialRef: { id: "M1c", note: "Follow along with the What is Claude Code handout for troubleshooting" }, tip: "For VS Code: search \u2018Claude Code\u2019 in Extensions and click Install, then Cmd/Ctrl+Shift+P \u2192 \u2018Claude Code: Sign In\u2019. For JetBrains: search in the JetBrains Marketplace under the same name." },
      { title: "Your first interaction", contentType: "hands-on", desc: "Launch Claude Code in a project directory and watch what happens before you type anything.", commands: ["git clone https://github.com/amurray101/claude-code-sample-api.git", "cd claude-code-sample-api && npm install", "claude"], expected: "Claude reads the directory structure, package.json, and any CLAUDE.md file automatically. This is context gathering \u2014 the first step of the agentic loop. You haven\u2019t typed a prompt yet, and Claude already knows what\u2019s in the project.", keyPoint: "This automatic codebase reading is the \u2018aha\u2019 moment for most people. Autocomplete tools don\u2019t do this \u2014 they wait for you to type." },
      { title: "Complete your first agentic task", contentType: "hands-on", desc: "Now give Claude a real task that exercises the full agentic loop \u2014 reading existing code, planning changes, editing multiple files, and verifying. Use the sample API repo you cloned earlier:", prompt: "Add a GET /health endpoint that returns { status: 'ok', timestamp: Date.now(), uptime: process.uptime() }. Put it in the existing routes file, following the same patterns as the other routes. Then write a test for it using the same testing patterns as the existing tests.", expected: "Watch what Claude does: (1) Reads the existing route files and test files to understand the patterns, (2) Plans the changes, (3) Adds the endpoint in the routes file, (4) Writes a matching test, (5) Optionally runs the tests to verify. This is the full agentic loop in action.", commands: ["npm test"], tip: "After Claude finishes, run the tests yourself to verify. Then try a second task: \u2018Add a GET /version endpoint that returns the package version from package.json. Write a test for it.\u2019 Notice how Claude follows the same patterns it learned from reading the codebase." },
      { type: "quick-check", question: "Claude Code just completed a multi-file task. Which sequence best describes what happened?", options: [
        { text: "Claude generated code line by line as you typed", correct: false },
        { text: "Claude read the codebase, planned changes, edited files, and ran tests to verify", correct: true },
        { text: "Claude copied a template from its training data and pasted it in", correct: false },
      ], explanation: "The agentic loop \u2014 read, plan, act, verify \u2014 is what makes Claude Code different from autocomplete tools. Claude understood the existing code before changing anything." },
      { type: "checkpoint", title: "Day 1 reflection", desc: "You\u2019ve installed Claude Code and completed your first agentic task. Before moving on, think about:\n\n\u2022 What surprised you about how Claude Code works?\n\u2022 How would you describe the agentic loop in one sentence?\n\u2022 What felt different between the terminal and IDE experience (if you tried both)?\n\u2022 When did Claude ask for permission, and when did it act on its own?" },
    ],
    challenge: "Install Claude Code in both the terminal and your IDE. Complete your first multi-file agentic task. Articulate what makes the agentic approach different from autocomplete.",
    output: "Working install (CLI + IDE) + first agentic task completed",
    color: C.orange,
    competencies: {
      "pe-pre": "Demo Claude Code's install and first-run experience — narrate the agentic loop as it happens and explain why it matters vs. autocomplete",
      "pe-post": "Set up Claude Code in a customer's dev environment, troubleshoot common installation issues, and guide a developer through their first agentic task",
      "sa": "Articulate the agentic coding value proposition to a technical audience and map it to common customer pain points",
      "ar": "Analyze Claude Code's agentic loop behavior — tool calls, planning steps, error recovery — and identify areas where model capabilities could be extended",
    },
  },
  {
    id: 2, number: "02", day: "Day 2",
    title: "Prompt craft",
    swbat: "Customize Claude Code and work more effectively with it",
    subtitle: "CLAUDE.md files, settings, plan mode, session management, and the prompt patterns that separate surface-level users from power users. Common core.",
    materials: [
      { id: "M2a", label: "CLAUDE.md Builder worksheet", when: "Use during the CLAUDE.md authoring exercise" },
      { id: "M2b", label: "Prompt Patterns cheat sheet", when: "Reference while practicing prompt craft" },
    ],
    skills: ["CLAUDE.md authoring", "CLAUDE.md hierarchy", "Settings files", "CLI flags", "Plan mode", "Slash commands", "Keyboard shortcuts", "Session management", "Prompting patterns", "Common workflows"],
    modality: { live: "60 min", lab: "60 min", selfPaced: "30 min pre-work" },
    steps: [
      // Hands-on only — self-guided content moved to pre-work handouts (M2c, M2d, M2e)
      { title: "Slash commands and keyboard shortcuts", contentType: "hands-on", desc: "Built-in slash commands you\u2019ll use daily:\n\n\u2022 /compact \u2014 Summarize the conversation to free context window space\n\u2022 /clear \u2014 Reset the entire context (start fresh)\n\u2022 /cost \u2014 Show token usage and cost for this session\n\u2022 /help \u2014 Show available commands\n\u2022 /doctor \u2014 Diagnose installation and configuration issues\n\u2022 /config \u2014 View or modify settings\n\nKey keyboard shortcuts:\n\n\u2022 Esc \u2014 Cancel the current generation\n\u2022 Tab \u2014 Accept a suggestion\n\u2022 Up arrow \u2014 Recall previous prompts", commands: ["/cost", "/compact"], tip: "Try running /cost now to see what your Day 1 session consumed. Then try /compact to see how it summarizes and frees space." },
      { title: "Session management", contentType: "hands-on", desc: "The most important habit for working effectively with Claude Code: one focused task per session.\n\nWhy: when you mix unrelated tasks in one session, the context window fills with irrelevant code from earlier tasks. Quality degrades after the third unrelated task.\n\nThe workflow:\n1. Start a session with a clear task\n2. Use /compact proactively every 15\u201320 minutes (don\u2019t wait for quality to degrade)\n3. When switching tasks, use /clear or start a new session\n4. For complex work: Plan Mode to scope it, then a fresh session to execute each piece", commands: ["/compact", "/clear"], keyPoint: "The \u2018one job, one session\u2019 rule is the habit that separates power users from frustrated users. Proactive /compact beats reactive /clear." },
      { title: "Write a CLAUDE.md", contentType: "hands-on", desc: "The before/after exercise \u2014 the most persuasive demo in the program:\n\n1. Open the sample repo from Day 1 (or clone a messy repo your facilitator provides)\n2. Without a CLAUDE.md, ask Claude to refactor a module:\n   \u2018Refactor src/utils/helpers.js \u2014 improve the code quality and add error handling.\u2019\n3. Note the output \u2014 did it follow consistent conventions? Probably not.\n4. Write a CLAUDE.md at the repo root capturing the conventions you want\n5. Exit and re-launch Claude Code (so it picks up the new CLAUDE.md)\n6. Run the exact same prompt. Compare the output.\n\nThe difference should be visible: consistent style, correct patterns, co-located tests.", materialRef: { id: "M2a", note: "Use the CLAUDE.md Builder worksheet to structure your file" }, tip: "Your first CLAUDE.md won\u2019t be perfect. After seeing Claude\u2019s output, ask: \u2018What conventions did you infer from the code that I should add to my CLAUDE.md?\u2019 Then refine and re-run. This iteration loop \u2014 write, observe, refine \u2014 is how teams get the most value." },
      { title: "Prompt pattern practice", contentType: "hands-on", desc: "Practice the three prompt patterns on real tasks. For each, try the vague version first, then the structured version, and compare output quality:", prompt: "Task 1 (WHAT+HOW): Add a POST /api/shipments endpoint that creates a shipment record. Follow the same patterns as the existing routes, including validation and error handling.\n\nTask 2 (Constraints): Refactor src/routes/index.js to use async/await instead of callbacks. Don\u2019t change the route paths or response formats. Keep all existing tests passing.\n\nTask 3 (Iterative): First ask \u2018What are the top 3 code quality issues in this project?\u2019 Then pick one and ask Claude to fix it.", tip: "Compare how Claude responds to \u2018add a shipments endpoint\u2019 vs. the structured version. The difference in output quality is the whole argument for prompt craft." },
      { type: "checkpoint", title: "Day 2 reflection", desc: "You\u2019ve written a CLAUDE.md and practiced prompt patterns. Before moving on:\n\n\u2022 What was the most noticeable difference in the before/after CLAUDE.md comparison?\n\u2022 Which prompt pattern (WHAT+HOW, constraints, iterative) felt most natural?\n\u2022 When would you reach for Plan Mode vs. just prompting directly?\n\u2022 How would you explain the value of CLAUDE.md to someone in one sentence?" },
    ],
    challenge: "Write a CLAUDE.md for a codebase, demonstrate a before/after comparison, and practice prompt patterns on real tasks.",
    output: "CLAUDE.md + before/after demo + prompt pattern practice results",
    color: C.blue,
    competencies: {
      "pe-pre": "Write a CLAUDE.md for a prospect's repo during a live evaluation, showing how context transforms output quality",
      "pe-post": "Pair-program with a customer engineering team to author CLAUDE.md files tailored to their codebase, conventions, and CI/CD pipeline",
      "sa": "Design a CLAUDE.md strategy for a multi-team engineering org — root-level standards, team-level overrides, and integration patterns with existing style guides",
      "ar": "Evaluate how CLAUDE.md content affects model reasoning quality, identify prompt patterns that improve code generation accuracy, and build evaluation harnesses to measure impact",
    },
  },
  {
    id: 3, number: "03", day: "Day 3",
    title: "Extend & customize",
    swbat: "Connect outside data sources, further customize for more advanced workflows",
    subtitle: "Hooks, MCP servers, sub-agents, custom slash commands, IDE integration, CI/CD automation, and the Agent SDK. Common core.",
    materials: [
      { id: "M3", label: "Integration Patterns architecture reference", when: "Architecture diagrams for hooks, MCP, and slash commands" },
    ],
    skills: ["Hooks", "MCP servers", "Sub-agents", "Custom slash commands", "Skills", "IDE integration", "CI/CD automation", "Headless mode", "GitHub Actions", "Agent SDK intro", "Building MCP servers"],
    modality: { live: "45 min", lab: "75 min", selfPaced: "45 min pre-work" },
    steps: [
      // Hands-on only — self-guided content moved to pre-work handouts (M3b, M3c, M3d)
      // IDE integration
      { title: "IDE integration: VS Code", contentType: "hands-on", desc: "The VS Code extension gives you Claude Code inside your editor with features the CLI doesn\u2019t have:\n\n\u2022 Inline diffs \u2014 See exactly what Claude wants to change, highlighted in the editor\n\u2022 Claude panel \u2014 A dedicated sidebar for the conversation (click the Claude icon or Cmd/Ctrl+Shift+P \u2192 \u2018Claude Code: Open\u2019)\n\u2022 Command palette \u2014 All Claude commands accessible via Cmd/Ctrl+Shift+P\n\u2022 File context \u2014 Claude automatically knows which file you have open\n\nWhen to use IDE vs. CLI:\n\u2022 IDE \u2014 When you want to see inline diffs, work with the visual file tree, or when the task involves files you\u2019re actively reading\n\u2022 CLI \u2014 When you want raw speed, are working across many files, or prefer a terminal-first workflow\n\nBoth surfaces use the same agentic engine underneath.", tip: "Try the same task from Day 1 in VS Code. Notice the inline diffs \u2014 you can see exactly what Claude is proposing before accepting." },
      { title: "IDE integration: JetBrains", contentType: "hands-on", desc: "The JetBrains plugin is available in the JetBrains Marketplace (search \u2018Claude Code\u2019). It works with IntelliJ IDEA, PyCharm, WebStorm, and other JetBrains IDEs.\n\nKey differences from VS Code:\n\u2022 Same core capabilities (inline diffs, dedicated panel, command palette)\n\u2022 Setup: install from Marketplace, then sign in via the plugin settings\n\u2022 JetBrains uses a tool window instead of a sidebar panel\n\nThe choice between VS Code and JetBrains is about your editor preference, not Claude Code capability \u2014 the agentic engine is the same." },
      // Hands-on exercises
      { title: "Build a hook", contentType: "hands-on", desc: "Create a hooks configuration that enforces quality gates. Follow these steps:\n\n1. Open (or create) .claude/settings.json in your project\n2. Add a PostToolUse hook that runs tests after any file edit\n3. Launch Claude and ask it to make a change\n4. Watch the hook fire automatically after the edit\n5. Deliberately introduce a bug and see the hook catch it", code: "{\n  \"hooks\": {\n    \"PostToolUse\": [\n      {\n        \"matcher\": \"Write|Edit\",\n        \"hooks\": [\n          {\n            \"type\": \"command\",\n            \"command\": \"npm test -- --bail\"\n          }\n        ]\n      }\n    ]\n  }\n}", codeTitle: ".claude/settings.json \u2014 add this hooks section", expected: "After Claude edits a file, the hook runs tests automatically. If tests fail, Claude sees the failure output and can self-correct." },
      { title: "Connect an MCP server", contentType: "hands-on", desc: "Set up an MCP server and verify Claude can use it:\n\n1. Add an MCP server configuration to your .claude/settings.json\n2. Start (or restart) Claude Code so it discovers the new server\n3. Ask Claude a question that requires the MCP server\u2019s tools\n4. Verify Claude queries the server and uses the results", code: "// Add to .claude/settings.json\n{\n  \"mcpServers\": {\n    \"filesystem\": {\n      \"command\": \"npx\",\n      \"args\": [\"-y\", \"@anthropic/mcp-server-filesystem\", \"/tmp/shared-docs\"]\n    }\n  }\n}", codeTitle: "MCP server configuration \u2014 filesystem example", tip: "The filesystem MCP server is the simplest one to start with. It gives Claude access to read files from a specified directory. For a more advanced exercise, try the GitHub or PostgreSQL MCP server." },
      { title: "Create a custom slash command", contentType: "hands-on", desc: "Build a slash command that packages a useful workflow:\n\n1. Create the directory: mkdir -p .claude/commands\n2. Create a markdown file with your command\u2019s instructions\n3. Launch Claude and run your command with /your-command-name\n4. Verify it executes the workflow correctly", code: "Analyze the current codebase and generate a brief status report:\n1. Count the total number of source files and test files\n2. Run the test suite and report pass/fail counts\n3. Check for any TODO or FIXME comments and list them\n4. Report the last 3 git commits\n5. Summarize the overall health of the project in 2-3 sentences", codeTitle: ".claude/commands/status-report.md", commands: ["mkdir -p .claude/commands", "/status-report"], expected: "Claude executes each step of your checklist and produces a structured report. Anyone who clones this repo now has access to this command." },
      { type: "checkpoint", title: "Day 3 reflection", desc: "You\u2019ve extended Claude Code with hooks, MCP, and custom commands. Before moving on:\n\n\u2022 Which extension point (hooks, MCP, slash commands) would be most valuable for your work?\n\u2022 What external tool or data source would you connect Claude to first?\n\u2022 When would you use a hook (enforced) vs. a slash command (opt-in)?\n\u2022 How do these extension points compose together?" },
    ],
    challenge: "Build a hook, connect an MCP server, and create a custom slash command. Demo the composed workflow end-to-end.",
    output: "Custom hook + MCP server connection + custom slash command",
    color: C.green,
    competencies: {
      "pe-pre": "Architect a Claude Code integration pattern for a customer evaluation — hooks for guardrails, MCP for their tools, slash commands for team workflows",
      "pe-post": "Build and deploy custom MCP servers, hooks, and slash commands in a customer's environment — debugging integration issues live",
      "sa": "Design a phased Claude Code adoption plan with integration patterns for the customer's existing toolchain (Jira, Datadog, CI/CD)",
      "ar": "Build custom tooling with the Agent SDK — automated code review pipelines, evaluation harnesses, and multi-agent workflows",
    },
  },
  {
    id: 4, number: "04", day: "Day 4",
    title: "Role-specific scenarios",
    swbat: "Connect Claude Code to their role and what their customers may need or use it for",
    subtitle: "Role breakouts — each path gets tailored scenarios covering security, deployment, competitive positioning, and customer conversations.",
    clientScenario: { company: "Vertex Dynamics", industry: "Enterprise SaaS", situation: "Vertex Dynamics is a 200-person engineering org evaluating Claude Code for company-wide adoption. Each role engages with a different aspect: Pre-Sales runs the technical evaluation, Post-Sales handles implementation, SA designs the adoption roadmap, and Applied Research scopes advanced capabilities. Same company, four perspectives." },
    materials: [
      { id: "M4a", label: "Claude Code vs. Competition battlecard", when: "Reference during competitive positioning discussions" },
      { id: "M4b", label: "Enterprise Deployment talk track", when: "Reference during deployment architecture work" },
      { id: "M4c", label: "Demo Planning worksheet", when: "Plan your role-specific demo" },
      { id: "F6a", label: "Security Objection Handler", when: "Your cheat sheet for security conversations" },
      { id: "F6b", label: "Security Architecture Diagram", when: "Visual reference for the defense-in-depth model" },
      { id: "F7a", label: "Deployment Path Finder", when: "Decision tree for deployment options" },
      { id: "F7b", label: "Cost & ROI Pocket Math", when: "Quick math reference for cost conversations" },
    ],
    skills: ["Security model", "Best practices", "Competitive positioning", "Deployment architecture", "Customer objection handling"],
    modality: { live: "90 min (breakouts)", lab: "30 min", selfPaced: "none" },
    steps: [
      // Role-specific content varying by path
      { title: "Role-specific scenarios", contentType: "self-guided", desc: "Content tailored to your selected role path. PE Pre-Sales focuses on technical evaluations and demos. PE Post-Sales on implementation and pair programming. SA on adoption roadmaps and architecture. Applied Research on advanced capabilities and the Agent SDK. Each role works on the same company (Vertex Dynamics) but from different angles." },
      { title: "Role-specific hands-on", contentType: "hands-on", desc: "Four scenario tracks for Vertex Dynamics — each role gets different aspects and instructions. The goal is to understand how your job connects to the other roles in the org." },
      // Security model, best practices
      { title: "Security model and best practices", contentType: "self-guided", desc: "The defense-in-depth security model — sandboxing, permissions, hooks, managed settings, and compliance. Weighted by role: deeper for SA and Pre-Sales, practical for Post-Sales, architectural for Applied Research.", materialRef: { id: "F6a", note: "Use the Security Objection Handler for quick reference" } },
      // Competitive positioning, deployment architecture, objection handling
      { title: "Competitive positioning", contentType: "self-guided", desc: "Claude Code vs. Copilot vs. Cursor vs. Devin — honest positioning, where we're stronger, where they're different, and how they coexist.", materialRef: { id: "M4a", note: "Reference the Competition battlecard" } },
      { title: "Deployment architecture", contentType: "self-guided", desc: "Enterprise deployment options — Bedrock, Vertex, direct API. Phased rollout patterns, cost modeling, and managed settings for admin control.", materialRef: { id: "F7a", note: "Use the Deployment Path Finder decision tree" } },
      { title: "Customer objection handling", contentType: "self-guided", desc: "The objections that come up in every customer conversation — security, cost, 'we already have Copilot,' developer dependency, and privacy concerns. How to handle each one honestly and effectively." },
      // Hands-on: 4 tailored scenarios
      { title: "Scenario exercise", contentType: "hands-on", desc: "Work through your role-specific scenario for Vertex Dynamics. Show how to do your job and how your work connects to the other roles in the org. Each scenario has different deliverables matched to your path.", materialRef: { id: "M4c", note: "Use the Demo Planning worksheet to structure your approach" } },
      { type: "checkpoint", title: "Day 4 reflection", desc: "Which customer objection was hardest to handle? How does your role connect to the other roles working with Vertex Dynamics? What do you need to practice more?" },
    ],
    challenge: "Complete your role-specific scenario for Vertex Dynamics. Demonstrate how your work connects to the other roles in the org.",
    output: "Role-specific deliverables for Vertex Dynamics + security/competitive/deployment reference materials",
    color: C.orange,
    competencies: {
      "pe-pre": "Run a full technical evaluation — build a reference architecture, handle objections on security and cost, position against competitors, and close with a next-steps demo plan",
      "pe-post": "Navigate a live customer implementation — diagnose issues, pair-program through the hard parts, and deliver a working system",
      "sa": "Assess a customer's engineering org, identify the highest-leverage insertion points, position honestly against competitors, and present a strategic adoption roadmap",
      "ar": "Advise on capabilities and limitations for advanced workflows — propose custom tooling, design evaluation pipelines, and scope what's possible vs. what requires model-level changes",
    },
  },
  {
    id: 5, number: "05", day: "Day 5",
    title: "Capstone — Ship it",
    swbat: "Break customer problem down, identify relevant Claude Code tools, and build custom solution to customer problem on the fly using Claude Code",
    subtitle: "Blind brief matched to your role. Build a working demo from scratch. Present to peers. Integrates all Days 1-4 skills.",
    materials: [
      { id: "M5", label: "Capstone Presentation Guide", when: "Structure your presentation with this framework" },
      { id: "M4c", label: "Demo Planning worksheet", when: "Use to plan your demo moments before building" },
    ],
    skills: ["Selling Claude", "End-to-end architecture", "Live demo", "Peer review", "Presentation"],
    modality: { live: "120 min session", lab: "integrated", selfPaced: "none" },
    steps: [
      // Selling Claude
      { title: "Selling Claude", contentType: "self-guided", desc: "How to position and sell Claude Code effectively — the value proposition, the demo moments that matter, handling live questions, and closing with clear next steps." },
      // Hands-on: Blind brief, build, present
      { title: "Receive your blind brief", contentType: "hands-on", desc: "A customer brief you've never seen, matched to your role. Read it carefully — identify the customer's industry, team size, current tools, key pain points, and what success looks like.", tip: "Don't jump to solutions immediately. Spend the first 5 minutes understanding the customer's world." },
      { title: "Architect and build", contentType: "hands-on", desc: "Use everything you've learned across Days 1-4: CLAUDE.md, hooks, MCP, slash commands, prompt patterns, and your role-specific knowledge. Build a working demo/implementation from scratch.", materialRef: { id: "M4c", note: "Use the Demo Planning worksheet to structure your approach" }, tip: "Build for reliability, not flash. A simple demo that works perfectly beats an ambitious one that breaks." },
      { title: "Present to peers", contentType: "hands-on", desc: "Deliver your presentation. Your cohort scores on: problem framing (25%), technical depth (25%), relevance to the brief (25%), and confidence under Q&A (25%).", materialRef: { id: "M5", note: "Use the Capstone Presentation Guide for structure" } },
      { title: "Peer feedback", contentType: "hands-on", desc: "Give and receive structured feedback. What was the most effective demo moment? What technique will you adopt? What's the one thing to practice before your first real engagement?" },
      { type: "checkpoint", title: "Capstone reflection", desc: "You've gone from a blind brief to a working demo under time pressure. What would you do differently? Which Days 1-4 skills were most valuable? What's your plan for continued practice?" },
    ],
    challenge: "From a blind customer brief: build a working demo/implementation from scratch using all Days 1-4 skills. Present to peers with feedback.",
    output: "Working demo + presentation + peer feedback",
    color: C.green,
    competencies: {
      "pe-pre": "Deliver a compelling, tailored Claude Code demo from a cold customer brief — including architecture, integration patterns, live demo, and a clear next-steps ask",
      "pe-post": "Scope, build, and deliver a working Claude Code implementation from a customer brief — pair-program through the hard parts and hand off a running system",
      "sa": "Present a complete Claude Code adoption strategy — architecture, phased rollout, integration patterns, ROI estimates, and honest risk assessment — from a blind brief",
      "ar": "Design and present a Claude Code-powered research workflow — custom Agent SDK tooling, evaluation metrics, and a working prototype",
    },
  },
];

// ─── DAY PREWORK (Foundation readings assigned per day) ───
const DAY_PREWORK = {
  1: {
    duration: "45 min",
    description: "Read these before the session so you arrive ready to install and start building.",
    foundations: [
      { sectionId: "day1-what-is-claude-code", label: "What is Claude Code, Installation, First Interaction", why: "Understand what agentic coding is, how it differs from autocomplete, and what to expect during installation." },
      { sectionId: "day1-agentic-loop", label: "Agentic Loop, Context Window, Tools, Permissions", why: "Learn how Claude Code works under the hood before experiencing it firsthand." },
    ],
    materials: [
      { id: "M1c", label: "What is Claude Code (printable)", why: "Printable quick reference for installation and first interaction." },
      { id: "M1b", label: "Command Glossary", why: "Desk reference — every command, shortcut, and flag in one place." },
    ],
  },
  2: {
    duration: "45 min",
    description: "Read these before the session so you arrive ready to write your first CLAUDE.md and practice prompt patterns.",
    foundations: [
      { sectionId: "day2-claude-md", label: "CLAUDE.md Files, Settings Files, CLI Flags", why: "Learn CLAUDE.md authoring, hierarchy, settings, and CLI flags before the hands-on exercises." },
      { sectionId: "day2-plan-mode", label: "Plan Mode, Slash Commands, Session Management", why: "Understand plan mode, session tools, and keyboard shortcuts before practicing them." },
      { sectionId: "day2-prompt-patterns", label: "Prompting Patterns, Common Workflows", why: "Study the prompt patterns you'll practice in the lab." },
    ],
    materials: [
      { id: "M2a", label: "CLAUDE.md Builder worksheet", why: "Familiarize yourself with the worksheet you'll fill out during the lab." },
    ],
  },
  3: {
    duration: "45 min",
    description: "Read these before the session so you arrive ready to build hooks, connect MCP servers, and create custom commands.",
    foundations: [
      { sectionId: "day3-core-extensions", label: "Hooks, MCP Servers, Sub-Agents, Custom Commands", why: "Learn how the core extension points work before building them." },
      { sectionId: "day3-ide-integration", label: "IDE Integration (VS Code, JetBrains)", why: "Understand VS Code and JetBrains integration before trying them." },
      { sectionId: "day3-cicd", label: "CI/CD Automation, Headless Mode, GitHub Actions", why: "Understand headless mode and GitHub Actions integration." },
      { sectionId: "day3-agent-sdk", label: "Agent SDK Intro, Building MCP Servers", why: "Introduction to the Agent SDK and building custom MCP servers." },
    ],
    materials: [
      { id: "M3", label: "Integration Patterns", why: "Architecture diagrams for how hooks, MCP, and slash commands connect." },
    ],
  },
  4: {
    duration: "45 min",
    description: "Study security, deployment, and competitive positioning before your role-specific breakout.",
    foundations: [
      { sectionId: "who-uses-it", label: "Who Uses Claude Code", why: "Know the buyer personas and use cases for your role-specific scenarios." },
      { sectionId: "security", label: "Security & Trust", why: "Fluency in the defense-in-depth model is essential for security conversations." },
      { sectionId: "enterprise", label: "Enterprise Deployment & Costs", why: "Understand deployment options and cost models for architecture discussions." },
    ],
    materials: [
      { id: "F6a", label: "Security Battlecard", why: "Quick reference for security objection handling." },
      { id: "F7a", label: "Deployment Path Finder", why: "Decision tree for Bedrock vs. Vertex vs. Foundry." },
      { id: "F7b", label: "Cost & ROI Pocket Math", why: "Quick math reference for cost conversations." },
    ],
  },
  5: null,
};

// ─── DAY PHASE CONFIG (which steps are live vs lab) ───
const DAY_PHASE_CONFIG = {
  1: {
    mode: "standard",
    live: {
      duration: "45 min",
      description: "Your facilitator reviews key concepts from the pre-work handouts and demos the install + first agentic task. Follow along and take notes.",
      stepIndices: [],
      useGuideSegments: true,
    },
    lab: {
      duration: "45 min",
      description: "Install Claude Code, authenticate, and complete your first agentic task independently.",
      stepIndices: [0, 1, 2, 3, 4],
    },
  },
  2: {
    mode: "standard",
    live: {
      duration: "60 min",
      description: "Your facilitator reviews key concepts from the pre-work handouts and demos CLAUDE.md authoring, session management, and prompt patterns.",
      stepIndices: [],
      useGuideSegments: true,
    },
    lab: {
      duration: "60 min",
      description: "Practice slash commands, write your own CLAUDE.md with the before/after demo, and practice prompt patterns on real tasks.",
      stepIndices: [0, 1, 2, 3, 4],
    },
  },
  3: {
    mode: "standard",
    live: {
      duration: "45 min",
      description: "Your facilitator reviews key concepts from the pre-work handouts and demos hooks, MCP servers, and custom commands.",
      stepIndices: [],
      useGuideSegments: true,
    },
    lab: {
      duration: "75 min",
      description: "Try IDE integration, build a hook, connect an MCP server, and create a custom slash command.",
      stepIndices: [0, 1, 2, 3, 4, 5],
    },
  },
  4: {
    mode: "standard",
    live: {
      duration: "90 min",
      description: "Role-specific breakouts — each path works through tailored scenarios for Vertex Dynamics.",
      stepIndices: [0, 1, 2, 3, 4, 5],
      useGuideSegments: true,
    },
    lab: {
      duration: "30 min",
      description: "Complete your role-specific scenario exercise and debrief.",
      stepIndices: [6, 7],
    },
  },
  5: {
    mode: "integrated",
    duration: "120 min",
    description: "Capstone: selling Claude, blind brief, build a working demo, and present to your cohort.",
    stepIndices: [0, 1, 2, 3, 4, 5],
  },
};

// ─── FACILITATOR GUIDES ───
const FACILITATOR_GUIDES = [
  {
    moduleId: 1, day: "Day 1", title: "First contact",
    duration: "90 min total (45 min live + 45 min lab)",
    slidesDeck: "slides/basecamp-deck.html",
    slidesNote: "Basecamp slide deck, Day 1 section — covers what Claude Code is, the agentic loop, context window, tools, and permissions.",
    setup: [
      "Ensure a sample repo is accessible and npm install completes cleanly",
      "Have a backup install plan for corporate proxy/VPN issues — pre-download the binary if needed",
      "Test both terminal and VS Code extension installs on the presentation machine",
    ],
    segments: [
      { time: "0–10 min", title: "What is Claude Code?", notes: "Start with the big picture: what Claude Code is, how it differs from autocomplete tools, and the surfaces available (CLI, IDE, desktop, mobile, web). Frame it as an agentic coding tool, not a chatbot." },
      { time: "10–20 min", title: "The agentic loop and context window", notes: "Walk through Read, Plan, Edit, Test, Iterate. Explain context window basics — what gets loaded, how it fills up, why it matters. This is the conceptual foundation for everything that follows." },
      { time: "20–30 min", title: "Tool overview and permissions", notes: "Show what tools Claude has access to — file read/write, terminal, search. Then cover the permission system: what requires approval, what runs automatically, how to configure trust levels." },
      { time: "30–40 min", title: "Live install and first interaction", notes: "Install Claude Code from scratch. Show it reading the directory structure before you type anything. Narrate what's happening: 'This is context gathering — the first step of the agentic loop.'" },
      { time: "40–45 min", title: "Bridge to the lab", notes: "'You've seen me do it. Now you're going to install, authenticate, and complete your first agentic task independently.'" },
    ],
    labNotes: "45 min. Students work through installation, authentication, and their first agentic task independently. Watch for proxy/firewall issues and students who finish early (give them additional tasks). Debrief: 'What surprised you? How would you describe the agentic loop in one sentence?'",
    keyMoments: [
      "The first time Claude reads the codebase before being asked — call this out, it's the 'aha' for most people",
      "When Claude runs tests after making changes — this is the 'verify' step and it surprises people",
      "If Claude makes a mistake and self-corrects — don't skip this, it's a powerful moment",
    ],
  },
  {
    moduleId: 2, day: "Day 2", title: "Prompt craft",
    duration: "120 min total (60 min live + 60 min lab)",
    slidesDeck: "slides/basecamp-deck.html",
    slidesNote: "Basecamp slide deck, Day 2 section — CLAUDE.md anatomy, before/after comparison, prompt patterns, session management, plan mode.",
    setup: [
      "Prepare a sample repo for CLAUDE.md authoring exercise",
      "Have a 'bad CLAUDE.md' example ready to show over-specification",
      "Test /compact, /clear, /cost, and plan mode so you can demo smoothly",
    ],
    segments: [
      { time: "0–10 min", title: "CLAUDE.md authoring", notes: "What CLAUDE.md is, how to write one, what goes in it. Show a before/after: Claude without CLAUDE.md (guesses at conventions) vs. with CLAUDE.md (follows them). This before/after is the most persuasive demo in the program." },
      { time: "10–20 min", title: "CLAUDE.md hierarchy and settings", notes: "Show the cascade: personal → project → subdirectory. Cover settings.json and CLI flags. The .eslintrc analogy works well for enterprise audiences." },
      { time: "20–35 min", title: "Plan mode and session management", notes: "Demo plan mode — analyze without editing. Then /compact, /clear, /cost. Show a real scenario: start a long task, notice context degradation, recover with /compact." },
      { time: "35–50 min", title: "Prompt patterns and workflows", notes: "Walk through the WHAT + HOW pattern, constraint specification, iterative refinement. Show common workflows: refactoring, adding features, writing tests, debugging." },
      { time: "50–60 min", title: "Bridge to the lab", notes: "'Now you'll write your own CLAUDE.md, run the before/after, and practice these prompt patterns on real tasks.'" },
    ],
    labNotes: "60 min. Students write their own CLAUDE.md, run the before/after comparison, and practice prompt patterns. Watch for CLAUDE.md files over 200 lines and students skipping the before/after. Debrief: share approaches, compare, and discuss what worked.",
    keyMoments: [
      "The before/after CLAUDE.md comparison — this single demo is the most persuasive in the program",
      "When Plan Mode reveals Claude's reasoning — builds trust",
      "When a student's CLAUDE.md is too prescriptive and output suffers — teaches restraint",
    ],
  },
  {
    moduleId: 3, day: "Day 3", title: "Extend & customize",
    duration: "120 min total (45 min live + 75 min lab)",
    slidesDeck: "slides/basecamp-deck.html",
    slidesNote: "Basecamp slide deck, Day 3 section — hooks, MCP, slash commands, IDE integration, CI/CD, Agent SDK.",
    setup: [
      "Prepare a sample MCP server and test it responds correctly",
      "Have working hook and slash command configs ready as fallbacks",
      "Test IDE extensions in both VS Code and JetBrains if possible",
    ],
    segments: [
      { time: "0–10 min", title: "Hooks and MCP servers", notes: "Cover hooks (enforced gates) and MCP (external data sources). Show the difference: hooks enforce, slash commands are opt-in. MCP connects Claude to the customer's world." },
      { time: "10–20 min", title: "Sub-agents and custom commands", notes: "Cover sub-agents (parallel execution, writer/reviewer pairs) and custom slash commands (team-shareable workflows via git)." },
      { time: "20–30 min", title: "IDE integration", notes: "Deep dive into VS Code and JetBrains extensions. When to use IDE vs. CLI. Inline diffs, Claude panel, command palette integration." },
      { time: "30–40 min", title: "CI/CD and headless mode", notes: "Running Claude in non-interactive mode. GitHub Actions integration. Automated code review workflows. This is more relevant for technical roles." },
      { time: "40–45 min", title: "Agent SDK intro", notes: "Brief intro to the Agent SDK and building MCP servers. What's possible, when to use it. Bridge to the lab." },
    ],
    labNotes: "75 min — the longest lab. Students build a hook, connect an MCP server, and create a custom slash command. Some will struggle with MCP setup — have fallbacks ready. Goal is getting all three working, not perfecting any one piece.",
    keyMoments: [
      "When the hook blocks a bad commit — this is the 'control' answer security teams need",
      "When Claude pulls external context via MCP — the platform 'aha' moment",
      "A working composed workflow — hook + MCP + slash command together",
    ],
  },
  {
    moduleId: 4, day: "Day 4", title: "Role-specific scenarios",
    duration: "120 min total (90 min breakouts + 30 min lab)",
    slidesDeck: null,
    slidesNote: "No slide deck — role-specific breakouts and scenario work.",
    setup: [
      "Group students by role path",
      "Prepare the Vertex Dynamics scenario with 4 role-specific briefs",
      "Have competitive positioning data ready: Claude Code vs. Copilot vs. Cursor vs. Devin",
      "Have security and deployment reference materials accessible",
    ],
    segments: [
      { time: "0–5 min", title: "Frame the day", notes: "'Today you connect everything you've learned to your specific role. Same company — Vertex Dynamics — but each role engages differently. Your job is to understand your piece and how it connects to the others.'" },
      { time: "5–30 min", title: "Role-specific content walkthrough", notes: "Each role group works through their tailored content. Pre-Sales focuses on technical evaluation, Post-Sales on implementation, SA on adoption strategy, Applied Research on advanced capabilities." },
      { time: "30–55 min", title: "Security, positioning, and deployment", notes: "Cover security model, competitive positioning, and deployment architecture — weighted by role relevance. All roles need baseline fluency; depth varies." },
      { time: "55–80 min", title: "Scenario exercise", notes: "Each role works through their Vertex Dynamics scenario. The goal is showing how your work connects to the other roles in the org." },
      { time: "80–90 min", title: "Cross-role debrief", notes: "Bring all roles together. Each group shares their perspective on Vertex Dynamics. 'How does your work connect to the other roles? What handoffs need to happen?'" },
    ],
    labNotes: "30 min. Students complete their role-specific deliverables and debrief. These are real reference materials they can use in the field.",
    keyMoments: [
      "When students realize how their role connects to others — the org-level 'aha'",
      "The first stumble on a security or competitive question — this is the learning moment",
      "A confident, role-specific deliverable — celebrate this, it's field-ready",
    ],
  },
  {
    moduleId: 5, day: "Day 5", title: "Capstone — Ship it",
    duration: "120 min (integrated session)",
    slidesDeck: null,
    slidesNote: "No slides — students are presenting. Have a visible timer and scoring rubric ready.",
    setup: [
      "Prepare blind customer briefs matched to each role path",
      "Set up a shared timer visible to everyone",
      "Distribute peer scoring rubrics: problem framing 25%, technical depth 25%, relevance 25%, confidence/Q&A 25%",
      "Ensure every student has a working Claude Code install",
    ],
    segments: [
      { time: "0–10 min", title: "Selling Claude + set the stage", notes: "Brief overview of how to sell Claude effectively. Then: 'This is the closest thing to your first real engagement. Brief you've never seen. Make it count.'" },
      { time: "10–25 min", title: "Brief distribution and analysis", notes: "Hand out role-matched briefs. 15 minutes for reading and planning. Resist helping — this is a transfer test." },
      { time: "25–70 min", title: "Build time", notes: "45 minutes to architect and build. Watch for: jumping to building without planning, demoing too many features, building something unrelated to the brief." },
      { time: "70–110 min", title: "Presentations + feedback", notes: "10 min each, strict timer. 2 min Q&A from cohort in character, then 1 min peer scoring. Keep the pace tight." },
      { time: "110–120 min", title: "Debrief and close", notes: "Read scores. Celebrate. 'What was the most effective demo moment? What will you steal? What's the one thing to practice before your first real engagement?' Close: 'You've earned this. You're ready.'" },
    ],
    labNotes: null,
    keyMoments: [
      "A presentation that nails problem framing — 'You mentioned your team spends 40% of time on...'",
      "A live demo that breaks and the presenter recovers gracefully — the real skill",
      "A curveball Q&A handled with confidence — this means transfer happened",
    ],
  },
];

const PATHS = [
  { id: "pe-pre", label: "Product Engineer, Pre-Sales", desc: "Demo Claude Code, design reference architectures, and build proof-of-concept workflows that close technical evaluations.", short: "PE Pre-Sales" },
  { id: "pe-post", label: "Product Engineer, Post-Sales", desc: "Pair-program with customer teams, debug integrations, and deliver working implementations they can maintain.", short: "PE Post-Sales" },
  { id: "sa", label: "Solutions Architect", desc: "Assess engineering orgs, design adoption roadmaps, and position Claude Code within existing toolchains.", short: "Solutions Architect" },
  { id: "ar", label: "Applied Research", desc: "Go deep on the Agent SDK, build evaluation pipelines, and scope what's possible vs. what requires model-level changes.", short: "Applied Research" },
];

// ─── PATH OUTCOMES (what each role can DO after Basecamp) ───
const PATH_OUTCOMES = {
  "pe-pre": {
    verb: "Close technical evaluations",
    summary: null,
    outcomes: [
      { action: "Deliver a live Claude Code demo to a prospect", measure: "— multi-file refactor from a single prompt, narrating the agentic loop as it happens" },
      { action: "Write a CLAUDE.md for an unfamiliar repo during a live session", measure: "and show the before/after difference in Claude's output" },
      { action: "Produce a one-page integration architecture for a prospect", measure: "mapping their tools and workflows to hooks, MCP, and custom commands" },
      { action: "Handle security, cost, and competitive objections cold", measure: "with the right mechanism for each concern and zero factual errors" },
      { action: "Build a working demo from a cold customer brief", measure: "— prototype, tailored CLAUDE.md, and a presentation with a clear next-steps ask" },
    ],
  },
  "pe-post": {
    verb: "Ship customer implementations",
    summary: null,
    outcomes: [
      { action: "Install and configure Claude Code across CLI and IDE", measure: "and get a developer through their first multi-file agentic task in one pairing session" },
      { action: "Author a CLAUDE.md by reading a customer's codebase", measure: "so Claude's output matches their conventions and passes their tests" },
      { action: "Build a working hook + MCP + slash command integration", measure: "and demo it end-to-end without errors" },
      { action: "Debug a broken Claude Code setup from symptoms alone", measure: "and resolve it while explaining each diagnostic step" },
      { action: "Deliver a complete Claude Code deployment from a customer brief", measure: "with a configured environment their team can use to onboard additional developers" },
    ],
  },
  "sa": {
    verb: "Design adoption strategies",
    summary: null,
    outcomes: [
      { action: "Map a customer's engineering pain points to Claude Code features", measure: "with specific insertion points and time-to-value estimates for a pilot" },
      { action: "Design a 3-phase adoption roadmap (pilot, team, org)", measure: "with success metrics that gate each transition and a timeline in weeks" },
      { action: "Spec an enterprise deployment on the customer's cloud provider", measure: "with cost estimates, provider selection, and managed settings for their security requirements" },
      { action: "Deliver a competitive comparison a customer can use internally", measure: "covering Claude Code vs. Copilot, Cursor, and Devin across the dimensions that matter" },
      { action: "Present a full adoption strategy from a blind customer brief", measure: "— architecture, phased rollout, cost projections, and a clear ask" },
    ],
  },
  "ar": {
    verb: "Build custom AI tooling",
    summary: null,
    outcomes: [
      { action: "Trace a Claude Code session's agentic loop end-to-end", measure: "and identify concrete capability gaps or optimization opportunities" },
      { action: "Build a working Agent SDK application", measure: "that chains multiple agents and produces structured output on a real codebase" },
      { action: "Design a controlled experiment measuring CLAUDE.md impact", measure: "with a script that runs both conditions and reports quantitative results" },
      { action: "Produce a technical feasibility assessment for a Claude Code extension", measure: "distinguishing what current APIs support from what would require model-level changes" },
      { action: "Deliver a working prototype from a research brief", measure: "with running code, an evaluation harness, and a written limitations section" },
    ],
  },
};

// ─── SKILL CREDENTIALS ───
const SKILL_CREDENTIALS = {
  1: [
    { name: "Installation", icon: ">_", desc: "Setup & authentication" },
    { name: "Agentic Loop", icon: "~>", desc: "Read, plan, edit, verify" },
  ],
  2: [
    { name: "CLAUDE.md Mastery", icon: "{}", desc: "Context & conventions" },
    { name: "Session Management", icon: "//", desc: "Prompt craft & workflow" },
  ],
  3: [
    { name: "Extensions & Hooks", icon: "&&", desc: "Guardrails & automation" },
    { name: "IDE Integration", icon: "::", desc: "VS Code & JetBrains" },
  ],
  4: [
    { name: "Role Fluency", icon: "<>", desc: "Role-specific mastery" },
    { name: "Customer Scenarios", icon: "||", desc: "Real-world application" },
  ],
  5: [
    { name: "Solution Architecture", icon: "=>", desc: "End-to-end design" },
    { name: "Live Demo Delivery", icon: "!!", desc: "Ship under pressure" },
  ],
};

// Flat list for lookups
const ALL_MODULE_BADGES = Object.entries(SKILL_CREDENTIALS).flatMap(
  ([modId, badges]) => badges.map(b => ({ ...b, moduleId: Number(modId) }))
);

// ─── KNOWLEDGE CHECKPOINTS ───
const KNOWLEDGE_CHECKPOINTS = {
  1: [
    { question: "You just completed your first agentic task. How would you describe the difference between Claude Code's approach and a traditional autocomplete tool to someone who's never seen either?", hint: "The key difference: autocomplete suggests the next line of code. Claude Code reads your codebase, plans multi-step changes, edits multiple files, and verifies its own work. It's the difference between a spell-checker and a co-author." },
    { question: "Claude Code asked for permission before running a terminal command. Why does the permission system exist, and when would you want to change the default settings?", hint: "The permission system gives you control over what Claude can do autonomously. By default, file edits need approval. You can adjust trust levels based on context — more permissive for trusted repos, more restrictive for production environments." },
  ],
  2: [
    { question: "You wrote a CLAUDE.md and saw the before/after difference. What's the single most important thing a CLAUDE.md should contain, and why?", hint: "Project conventions — how code is organized, what patterns to follow, what style choices matter. Without this, Claude guesses. With it, Claude follows your team's standards consistently. The CLAUDE.md forces teams to articulate conventions they've never written down." },
    { question: "You're in a long Claude Code session and notice the output quality degrading. What happened, and how do you recover?", hint: "The context window is full. Use /compact to summarize and free space — do this proactively every 15-20 minutes. If that's not enough, /clear and start fresh. The 'one job, one session' principle prevents this from happening." },
  ],
  3: [
    { question: "You built a hook, connected an MCP server, and created a slash command. When would you use each one — what's the decision framework?", hint: "Hooks are enforced gates that run automatically (compliance, quality). MCP connects Claude to external data (Jira, Datadog, internal APIs). Slash commands package repeatable workflows for the team. Hooks = enforcement, MCP = context, commands = convenience." },
    { question: "A team wants Claude Code to pull context from their internal tools during coding sessions. Which extension point would you use, and what's the setup look like?", hint: "MCP (Model Context Protocol). Set up an MCP server that connects to their internal API, configure it in .claude/settings.json, and Claude discovers the available tools dynamically. The key selling point: Claude stops being isolated and becomes part of their engineering workflow." },
  ],
  4: [
    { question: "From your role's perspective on the Vertex Dynamics scenario — what was the most important thing you delivered, and how does it connect to what the other roles produced?", hint: "Each role produces something different but complementary: Pre-Sales delivers the evaluation and demo, Post-Sales the implementation plan, SA the adoption roadmap, Applied Research the advanced capability assessment. Together they form a complete customer engagement." },
    { question: "A customer raises a concern that maps to your role. How would you handle it using what you learned today — and when would you hand off to another role?", hint: "Handle what's in your domain with confidence. Recognize when a question crosses into another role's territory and make the handoff explicit. The strength of the team is that each role has deep expertise in their area." },
  ],
  5: [
    { question: "You went from a blind brief to a working demo under time pressure. What would you do differently next time, and which Days 1-4 skills were most valuable?", hint: "Most people wish they'd spent more time planning and less building. The CLAUDE.md (Day 2) and prompt patterns (Day 2) are usually the most leveraged skills — they determine output quality. Hooks and MCP (Day 3) add polish but aren't essential for a time-boxed demo." },
    { question: "How would you sell Claude Code to a skeptical technical audience? What's the 30-second version and what's the 3-minute version?", hint: "30 seconds: 'Claude Code reads your codebase, plans changes, edits multiple files, and verifies its own work — from a single prompt. It's not autocomplete, it's an agentic coding tool.' 3 minutes: add the CLAUDE.md before/after, show a multi-file refactor, and demonstrate self-correction." },
  ],
};

// ─── DIAGNOSTIC QUIZ (WEEK-LONG) ───
const WEEK_DIAGNOSTIC = {
  title: "Basecamp Readiness Check",
  description: "Four quick questions to calibrate the content depth for your entire week. Your answers set whether you see simplified, standard, or technical explanations across all five days.",
  questions: [
    { id: "wq1", axis: "technical", text: "How comfortable are you using the command line (terminal)?", options: [
      { label: "I rarely use the terminal — I mostly use GUIs for everything", points: 0 },
      { label: "I can navigate directories, run scripts, and install packages from the command line", points: 1 },
      { label: "I regularly use the CLI for development workflows, write shell scripts, and debug PATH/environment issues", points: 2 },
    ]},
    { id: "wq2", axis: "technical", text: "How familiar are you with setting up development environments (Node.js, Git, IDE extensions)?", options: [
      { label: "I usually need help setting up dev tools and managing dependencies", points: 0 },
      { label: "I can clone repos, run npm install, and install VS Code extensions without much trouble", points: 1 },
      { label: "I regularly configure development environments, troubleshoot proxy/firewall issues, and manage multiple runtime versions", points: 2 },
    ]},
    { id: "wq3", axis: "ai", text: "Have you used any AI-powered coding tools (Copilot, Cursor, Claude Code, etc.)?", options: [
      { label: "I have not used AI coding tools or have only seen brief demos", points: 0 },
      { label: "I have used autocomplete-style tools like Copilot for writing code snippets", points: 1 },
      { label: "I have used agentic coding tools that read codebases, plan multi-step changes, and run commands autonomously", points: 2 },
    ]},
    { id: "wq4", axis: "ai", text: "How would you describe the difference between autocomplete-style AI coding and agentic coding?", options: [
      { label: "I'm not sure what the difference is", points: 0 },
      { label: "I understand that autocomplete suggests the next line while agentic tools can plan and execute multi-file changes, but I haven't experienced it firsthand", points: 1 },
      { label: "I can explain the agentic loop (read, plan, act, verify) and have seen or used tools that autonomously navigate codebases and run tests", points: 2 },
    ]},
  ],
};

// ─── PERSONA CHARACTER SVG ───
const BASE = import.meta.env.BASE_URL;
function PersonaCharacter({ id, size = 120 }) {
  return (
    <img src={`${BASE}personas/${id}.png`} alt="" width={size} height={size} style={{ display: "block", objectFit: "contain" }} />
  );
}


// ─── COPYABLE COMMAND COMPONENT ───
function CopyableCommand({ command, context }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, margin: "8px 0", borderRadius: 8, overflow: "hidden", border: "1px solid #2a2a2a" }}>
      <div style={{ flex: 1, padding: "10px 14px", background: "#1a1a1a", fontFamily: "var(--mono)", fontSize: 12.5, color: "#7ec699", whiteSpace: "pre-wrap", overflowX: "auto" }}>
        <span style={{ color: "#666", userSelect: "none" }}>$ </span>{command}
      </div>
      <button onClick={handleCopy} style={{ padding: "10px 14px", background: "#222", border: "none", borderLeft: "1px solid #2a2a2a", color: copied ? "#28c840" : "#888", fontFamily: "var(--mono)", fontSize: 11, cursor: "pointer", transition: "color 0.2s", whiteSpace: "nowrap", flexShrink: 0 }}
        onMouseEnter={e => { if (!copied) e.currentTarget.style.color = "#ccc"; }}
        onMouseLeave={e => { if (!copied) e.currentTarget.style.color = "#888"; }}
      >{copied ? "\u2713 Copied" : "Copy"}</button>
    </div>
  );
}

// ─── CONTEXT BADGE (Terminal, VS Code, Browser, Claude Code) ───
const CONTEXT_STYLES = {
  terminal: { icon: "\u2589", label: "Terminal", bg: "#1a1a1a", fg: "#7ec699", border: "#2a2a2a" },
  vscode: { icon: "\u2B21", label: "VS Code", bg: "#1e3a5f10", fg: "#4da6ff", border: "#4da6ff30" },
  ide: { icon: "\u2B21", label: "IDE", bg: "#1e3a5f10", fg: "#4da6ff", border: "#4da6ff30" },
  browser: { icon: "\u25CE", label: "Browser", bg: "#d9775710", fg: "#d97757", border: "#d9775730" },
  claude: { icon: "\u2726", label: "Claude Code", bg: "#788c5d10", fg: "#788c5d", border: "#788c5d30" },
  file: { icon: "\u25A1", label: "File", bg: "#6a9bcc10", fg: "#6a9bcc", border: "#6a9bcc30" },
};

function ContextBadge({ context }) {
  const s = CONTEXT_STYLES[context] || CONTEXT_STYLES.terminal;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", padding: "3px 10px", borderRadius: 4, background: s.bg, color: s.fg, border: `1px solid ${s.border}` }}>
      <span style={{ fontSize: 8 }}>{s.icon}</span> {s.label}
    </span>
  );
}

// ─── MATERIAL CALLOUT (inline link to handout) ───
function MaterialCallout({ material, color, onOpen }) {
  const FORMAT_ICONS = {
    "Cheat Sheet": "\u2630",
    "Worksheet": "\u270E",
    "Battlecard": "\u2694",
    "Quick Reference Card": "\u2B12",
    "Talk Track Script": "\u2399",
    "Architecture Reference": "\u2B1A",
    "Decision Tree": "\u2B95",
    "Pocket Guide": "\u2B1A",
  };
  const icon = FORMAT_ICONS[material.format] || "\u25A0";
  return (
    <div
      onClick={onOpen}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 16px", background: C.cream,
        border: `1px solid ${C.lightGray}`, borderRadius: 8,
        cursor: "pointer", transition: "all 0.2s",
        borderLeft: `3px solid ${color}`,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color + "60"; e.currentTarget.style.background = color + "06"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.lightGray; e.currentTarget.style.borderLeftColor = color; e.currentTarget.style.background = C.cream; }}
    >
      <span style={{ fontSize: 16, opacity: 0.6 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500, color: C.dark, lineHeight: 1.3 }}>{material.label}</div>
        <div style={{ fontFamily: "var(--sans)", fontSize: 11, color: C.faint, marginTop: 2 }}>{material.when}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: color, background: color + "10", padding: "2px 8px", borderRadius: 10 }}>{material.format || "View"}</span>
        <span style={{ color: color, fontSize: 14 }}>{"→"}</span>
      </div>
    </div>
  );
}

// ─── MATERIALS LIST DATA (for inline lookups) ───
const MATERIAL_META = {
  M1: { format: "Cheat Sheet" }, M2a: { format: "Worksheet" }, M2b: { format: "Cheat Sheet" },
  M3: { format: "Architecture Reference" }, M4a: { format: "Battlecard" },
  M4b: { format: "Talk Track Script" }, M4c: { format: "Worksheet" }, M5: { format: "Quick Reference Card" },
  F1: { format: "Pocket Guide" }, F2: { format: "Quick Reference Card" },
  F3a: { format: "Quick Reference Card" }, F3b: { format: "Talk Track Script" },
  F4: { format: "Quick Reference Card" }, F5: { format: "Cheat Sheet" },
  F6a: { format: "Battlecard" }, F6b: { format: "Architecture Reference" },
  F7a: { format: "Decision Tree" }, F7b: { format: "Quick Reference Card" },
  P1: { format: "Talk Track Script" }, P2: { format: "Cheat Sheet" },
  P3: { format: "Decision Tree" }, P4: { format: "Cheat Sheet" },
};

// ─── STEP-BY-STEP EXERCISE COMPONENT ───
function QuickCheck({ step, color }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const correct = step.options.findIndex(o => o.correct);
  const isCorrect = selected === correct;

  return (
    <div style={{ padding: "24px 20px", margin: "8px 0", background: C.blue + "04", borderRadius: 10, border: `1px solid ${C.blue}20`, borderLeft: `3px solid ${C.blue}` }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: C.blue, marginBottom: 8 }}>Quick check</div>
      <div style={{ fontFamily: "var(--serif)", fontSize: 15, color: C.dark, lineHeight: 1.5, marginBottom: 14 }}>{step.question}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {step.options.map((opt, oi) => {
          const isSelected = selected === oi;
          const showResult = revealed && isSelected;
          const isCorrectOption = oi === correct;
          return (
            <button key={oi} onClick={() => { if (!revealed) { setSelected(oi); setRevealed(true); } }}
              style={{
                textAlign: "left", width: "100%", padding: "10px 14px", borderRadius: 6, cursor: revealed ? "default" : "pointer",
                fontFamily: "var(--sans)", fontSize: 12.5, lineHeight: 1.5, transition: "all 0.2s",
                background: revealed && isCorrectOption ? C.green + "10" : showResult && !isCorrect ? C.orange + "08" : isSelected ? C.blue + "06" : C.bg,
                border: `1px solid ${revealed && isCorrectOption ? C.green + "40" : showResult && !isCorrect ? C.orange + "30" : isSelected ? C.blue + "30" : C.lightGray}`,
                color: C.dark,
              }}
            >
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: C.faint, marginRight: 8 }}>{String.fromCharCode(65 + oi)}.</span>
              {opt.text}
              {revealed && isCorrectOption && <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: C.green, marginLeft: 8 }}>{"\u2713"}</span>}
            </button>
          );
        })}
      </div>
      {revealed && step.explanation && (
        <div style={{ marginTop: 12, padding: "10px 14px", background: C.cream, borderRadius: 6, border: `1px solid ${C.lightGray}` }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: isCorrect ? C.green : C.orange, marginRight: 6 }}>{isCorrect ? "Correct!" : "Not quite."}</span>
          <span style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{step.explanation}</span>
        </div>
      )}
    </div>
  );
}

function ExerciseSteps({ steps, color, contentMode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {steps.map((step, i) => {
        if (step.type === "quick-check") return <QuickCheck key={i} step={step} color={color} />;
        const isCheckpoint = step.type === "checkpoint";
        return (
        <div key={i} style={{ display: "flex", gap: 16, padding: isCheckpoint ? "32px 16px" : "28px 0", borderBottom: i < steps.length - 1 ? `2px solid ${C.lightGray}` : "none", ...(isCheckpoint ? { background: color + "04", borderRadius: 10, borderLeft: `3px solid ${color}`, margin: "8px 0" } : {}) }}>
          <div style={{ flexShrink: 0, width: isCheckpoint ? 32 : 28, height: isCheckpoint ? 32 : 28, borderRadius: "50%", background: isCheckpoint ? color + "18" : C.cream, border: `${isCheckpoint ? 2 : 1}px solid ${isCheckpoint ? color + "50" : C.lightGray}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", fontSize: isCheckpoint ? 13 : 11, fontWeight: 600, color: isCheckpoint ? color : C.muted }}>
            {isCheckpoint ? "\u2713" : i + 1}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 500, color: C.dark }}>{step.title}</div>
              {step.context && <ContextBadge context={step.context} />}
              {step.contentType && <span style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 0.5, color: step.contentType === "hands-on" ? C.green : C.blue, background: (step.contentType === "hands-on" ? C.green : C.blue) + "10", padding: "2px 8px", borderRadius: 10 }}>{step.contentType}</span>}
            </div>
            {step.desc && <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.muted, lineHeight: 1.6, margin: "0 0 8px" }}>{step.desc}</p>}
            {step.commands && step.commands.map((cmd, j) => (
              <CopyableCommand key={j} command={cmd} context={step.context} />
            ))}
            {step.code && (
              <div style={{ margin: "8px 0", borderRadius: 8, overflow: "hidden", border: "1px solid #2a2a2a", background: "#1a1a1a" }}>
                {step.codeTitle && (
                  <div style={{ padding: "6px 14px", background: "#222", fontFamily: "var(--mono)", fontSize: 10, color: "#888", borderBottom: "1px solid #2a2a2a" }}>{step.codeTitle}</div>
                )}
                <div style={{ padding: "12px 14px", fontFamily: "var(--mono)", fontSize: 12, color: "#d4d4d4", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{step.code}</div>
              </div>
            )}
            {step.prompt && (
              <div style={{ margin: "8px 0", padding: "12px 16px", borderRadius: 8, background: color + "06", border: `1px solid ${color}15` }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: color, marginBottom: 4 }}>Type this prompt</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.dark, lineHeight: 1.6, fontStyle: "italic" }}>{step.prompt}</div>
              </div>
            )}
            {step.screenshot && (
              <div style={{ margin: "10px 0", borderRadius: 8, overflow: "hidden", border: `1px solid ${C.lightGray}`, background: C.cream }}>
                <img src={step.screenshot} alt={step.title} style={{ width: "100%", display: "block" }} onError={e => { e.currentTarget.parentElement.style.display = "none"; }} />
              </div>
            )}
            {step.tip && (
              <div style={{ margin: "8px 0 0", padding: "10px 14px", borderRadius: 6, background: C.cream, border: `1px solid ${C.lightGray}`, display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: color, flexShrink: 0, marginTop: 2 }}>TIP</span>
                <span style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{step.tip}</span>
              </div>
            )}
            {step.keyPoint && (
              <div style={{ margin: "8px 0 0", padding: "10px 14px", borderRadius: 6, background: C.green + "08", border: `1px solid ${C.green}20`, display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: C.green, flexShrink: 0, marginTop: 2 }}>KEY POINT</span>
                <span style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.dark, lineHeight: 1.5 }}>{step.keyPoint}</span>
              </div>
            )}
            {step.materialRef && (
              <div
                onClick={() => { if (typeof window.__openMaterial === "function") window.__openMaterial(step.materialRef.id); }}
                style={{ margin: "8px 0 0", padding: "10px 14px", borderRadius: 6, background: color + "04", border: `1px dashed ${color}30`, display: "flex", gap: 10, alignItems: "center", cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = color + "08"; e.currentTarget.style.borderColor = color + "50"; }}
                onMouseLeave={e => { e.currentTarget.style.background = color + "04"; e.currentTarget.style.borderColor = color + "30"; }}
              >
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: color, flexShrink: 0 }}>{"\u2193"}</span>
                <span style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{step.materialRef.note}</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: color, background: color + "10", padding: "2px 8px", borderRadius: 10, flexShrink: 0, marginLeft: "auto" }}>View</span>
              </div>
            )}
            {step.expected && (
              <div style={{ margin: "8px 0 0", padding: "10px 14px", borderRadius: 6, background: "#28c84008", border: "1px solid #28c84020", display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#28c840", flexShrink: 0, marginTop: 2 }}>{"✓"}</span>
                <span style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{step.expected}</span>
              </div>
            )}
          </div>
        </div>
        );
      })}
    </div>
  );
}

// ─── DAY PHASE COMPONENTS ───
function PhaseSegment({ label, duration, active, color, onClick, completed, icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 16px", borderRadius: 10,
        background: active ? color + "10" : completed ? C.green + "06" : C.cream,
        border: `1.5px solid ${active ? color + "50" : completed ? C.green + "30" : C.lightGray}`,
        cursor: "pointer", transition: "all 0.2s",
        fontFamily: "var(--sans)", fontSize: 12, fontWeight: active ? 600 : 400,
        color: active ? color : completed ? C.green : C.muted,
        whiteSpace: "nowrap", flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 14, opacity: 0.7 }}>{icon}</span>
      <span>{label}</span>
      <span style={{
        fontFamily: "var(--mono)", fontSize: 10,
        padding: "2px 8px", borderRadius: 10,
        background: active ? color + "12" : "transparent",
        color: active ? color : C.faint,
      }}>{duration}</span>
      {completed && <span style={{ color: C.green, fontSize: 12 }}>{"\u2713"}</span>}
    </button>
  );
}

function PhaseConnector() {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "0 6px", color: C.faint, fontSize: 14, flexShrink: 0 }}>
      {"\u2192"}
    </div>
  );
}

function DayTimeline({ mod, phaseConfig, prework, activePhaseTab, onPhaseSelect, preworkCompleted }) {
  if (!phaseConfig) return null;
  const isIntegrated = phaseConfig.mode === "integrated";
  const hasPrework = !!prework;
  const preworkDone = preworkCompleted?.includes(mod.id);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, margin: "20px 0 8px", overflowX: "auto", paddingBottom: 4 }}>
      {hasPrework && (
        <>
          <PhaseSegment
            label="Pre-work"
            duration={prework.duration}
            icon={"\uD83D\uDCD6"}
            active={activePhaseTab === "prework"}
            completed={preworkDone}
            color={mod.color}
            onClick={() => onPhaseSelect("prework")}
          />
          <PhaseConnector />
        </>
      )}
      {!isIntegrated ? (
        <>
          <PhaseSegment
            label="Live session"
            duration={phaseConfig.live.duration}
            icon={"\uD83D\uDCE1"}
            active={activePhaseTab === "live"}
            color={mod.color}
            onClick={() => onPhaseSelect("live")}
          />
          <PhaseConnector />
          <PhaseSegment
            label="Lab"
            duration={phaseConfig.lab.duration}
            icon={"\uD83D\uDCBB"}
            active={activePhaseTab === "lab"}
            color={mod.color}
            onClick={() => onPhaseSelect("lab")}
          />
        </>
      ) : (
        <PhaseSegment
          label="Capstone session"
          duration={phaseConfig.duration}
          icon={"\uD83D\uDE80"}
          active={activePhaseTab === "integrated"}
          color={mod.color}
          onClick={() => onPhaseSelect("integrated")}
        />
      )}
    </div>
  );
}

function PreworkView({ dayId, prework, mod, foundationSectionsViewed, onOpenFoundation, onOpenMaterial, preworkCompleted, onMarkPreworkDone, onContinue }) {
  if (!prework) return null;
  const isDone = preworkCompleted.includes(dayId);

  return (
    <div>
      <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: C.muted, lineHeight: 1.65, margin: "0 0 20px" }}>{prework.description}</p>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: mod.color, textTransform: "uppercase", marginBottom: 12 }}>Required reading</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {prework.foundations.map((f, i) => {
            const viewed = foundationSectionsViewed.includes(f.sectionId);
            return (
              <div key={i}
                onClick={() => onOpenFoundation(f.sectionId)}
                style={{
                  padding: "16px 20px", borderRadius: 10, cursor: "pointer", transition: "all 0.2s",
                  background: viewed ? C.green + "04" : C.cream,
                  border: `1px solid ${viewed ? C.green + "25" : C.lightGray}`,
                  borderLeft: `3px solid ${viewed ? C.green : mod.color}`,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = viewed ? C.green + "08" : mod.color + "06"; }}
                onMouseLeave={e => { e.currentTarget.style.background = viewed ? C.green + "04" : C.cream; }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 500, color: C.dark }}>{f.label}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {viewed && <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: C.green, background: C.green + "10", padding: "2px 10px", borderRadius: 10 }}>Read</span>}
                    <span style={{ color: mod.color, fontSize: 14 }}>{"\u2192"}</span>
                  </div>
                </div>
                <p style={{ fontFamily: "var(--sans)", fontSize: 12.5, color: C.muted, margin: 0, lineHeight: 1.5 }}>{f.why}</p>
              </div>
            );
          })}
        </div>
      </div>

      {prework.materials && prework.materials.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: mod.color, textTransform: "uppercase", marginBottom: 12 }}>Materials to review</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {prework.materials.map(mat => (
              <div key={mat.id}
                onClick={() => onOpenMaterial(mat.id)}
                style={{
                  padding: "14px 18px", borderRadius: 10, cursor: "pointer", transition: "all 0.2s",
                  background: C.cream, border: `1px solid ${C.lightGray}`, borderLeft: `3px solid ${mod.color}`,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = mod.color + "06"; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.cream; }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500, color: C.dark }}>{mat.label}</div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.muted, marginTop: 2 }}>{mat.why}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: mod.color, background: mod.color + "10", padding: "2px 8px", borderRadius: 10 }}>{MATERIAL_META[mat.id]?.format || "View"}</span>
                    <span style={{ color: mod.color, fontSize: 14 }}>{"\u2192"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isDone ? (
        <button onClick={onMarkPreworkDone} style={{
          padding: "10px 24px", borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
          background: mod.color, border: "none", color: "#fff",
          fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500,
        }}>
          Mark pre-work complete
        </button>
      ) : (
        <div>
          <div style={{ padding: "16px 18px", background: C.green + "06", borderRadius: 10, border: `1px solid ${C.green}20`, marginBottom: 16 }}>
            <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: C.green, fontWeight: 500 }}>{"\u2713"} Great job — you're ready for the live session.</span>
          </div>
          {onContinue && (
            <button onClick={onContinue} style={{
              padding: "10px 24px", borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
              background: mod.color, border: "none", color: "#fff",
              fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500,
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >Continue to Live Session →</button>
          )}
        </div>
      )}
    </div>
  );
}

function LiveSessionView({ mod, phaseConfig, guide, contentMode, onContinue }) {
  const { live } = phaseConfig;

  return (
    <div>
      <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: C.muted, lineHeight: 1.65, margin: "0 0 24px" }}>{live.description}</p>

      {guide?.keyMoments && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: C.orange, textTransform: "uppercase", marginBottom: 10 }}>Key moments to watch for</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {guide.keyMoments.map((moment, i) => (
              <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 10, padding: "10px 14px", background: C.orange + "06", borderRadius: 8, border: `1px solid ${C.orange}15` }}>
                <span style={{ color: C.orange, fontSize: 12, flexShrink: 0 }}>{"\u2605"}</span>
                <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.dark, lineHeight: 1.55 }}>{moment}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {live.useGuideSegments && guide && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: mod.color, textTransform: "uppercase", marginBottom: 12 }}>Session agenda</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {guide.segments.map((seg, i) => (
              <div key={i} style={{
                padding: "14px 18px", background: C.bg, borderRadius: 10,
                border: `1px solid ${C.lightGray}`, borderLeft: `3px solid ${mod.color}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: mod.color, fontWeight: 600, background: mod.color + "10", padding: "2px 10px", borderRadius: 8 }}>{seg.time}</span>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 500, color: C.dark }}>{seg.title}</span>
                </div>
                <p style={{ fontFamily: "var(--sans)", fontSize: 12.5, color: C.muted, lineHeight: 1.6, margin: 0 }}>{seg.notes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {live.stepIndices.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: mod.color, textTransform: "uppercase", marginBottom: 4 }}>Steps covered in this session</div>
          <p style={{ fontFamily: "var(--sans)", fontSize: 12.5, color: C.faint, margin: "0 0 12px", lineHeight: 1.5 }}>Your facilitator will walk through these. Follow along and ask questions.</p>
          <div style={{ border: `1px solid ${C.lightGray}`, borderRadius: 12, padding: "4px 20px", background: C.bg }}>
            <ExerciseSteps steps={live.stepIndices.map(idx => mod.steps[idx])} color={mod.color} contentMode={contentMode} />
          </div>
        </div>
      )}

      {onContinue && (
        <button onClick={onContinue} style={{
          padding: "10px 24px", borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
          background: mod.color, border: "none", color: "#fff",
          fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500,
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >Continue to Lab →</button>
      )}
    </div>
  );
}

function LabView({ mod, phaseConfig, contentMode, checkpointsCompleted, onCheckpointComplete, gaps }) {
  const { lab } = phaseConfig;
  const labSteps = lab.stepIndices.map(idx => mod.steps[idx]);

  return (
    <div>
      <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: C.muted, lineHeight: 1.65, margin: "0 0 24px" }}>{lab.description}</p>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: mod.color, textTransform: "uppercase", marginBottom: 4 }}>Step-by-step walkthrough</div>
        <p style={{ fontFamily: "var(--sans)", fontSize: 12.5, color: C.faint, margin: "0 0 12px", lineHeight: 1.5 }}>Work through these independently. Commands with a copy button can be pasted directly into your terminal.</p>
        <div style={{ border: `1px solid ${C.lightGray}`, borderRadius: 12, padding: "4px 20px", background: C.bg }}>
          <ExerciseSteps steps={labSteps} color={mod.color} contentMode={contentMode} />
        </div>
      </div>

      <div style={{ padding: "14px 18px", background: C.cream, borderRadius: 10, border: `1px solid ${C.lightGray}`, marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: mod.color, textTransform: "uppercase", marginBottom: 6 }}>You'll produce</div>
        <div style={{ fontFamily: "var(--serif)", fontSize: 15, color: C.dark, lineHeight: 1.5 }}>{mod.output}</div>
      </div>

      {gaps && gaps.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          {gaps.map((gap, gi) => (
            <div key={gi} style={{ margin: "0 0 12px", padding: "18px 22px", background: C.blue + "06", borderRadius: 10, border: `1px dashed ${C.blue}40` }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, color: C.blue, textTransform: "uppercase", marginBottom: 6 }}>Practice on your own</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 15, color: C.dark, marginBottom: 6 }}>{gap.title}</div>
              <p style={{ fontFamily: "var(--sans)", fontSize: 12.5, color: C.muted, lineHeight: 1.6, margin: 0 }}>{gap.why}</p>
              {gap.topics && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 10 }}>
                  {gap.topics.map((t, ti) => <span key={ti} style={{ fontFamily: "var(--mono)", fontSize: 9, padding: "2px 8px", borderRadius: 10, border: `1px solid ${C.blue}30`, color: C.blue, background: C.blue + "08" }}>{t}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <KnowledgeCheckpoint
        moduleId={mod.id}
        color={mod.color}
        isCompleted={checkpointsCompleted.includes(mod.id)}
        onComplete={onCheckpointComplete}
      />
    </div>
  );
}

function IntegratedSessionView({ mod, phaseConfig, contentMode, checkpointsCompleted, onCheckpointComplete, gaps }) {
  return (
    <div>
      <div style={{ padding: "16px 20px", background: mod.color + "06", borderRadius: 10, border: `1px solid ${mod.color}20`, marginBottom: 24 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1.5, color: mod.color, textTransform: "uppercase", marginBottom: 6 }}>Integrated session — {phaseConfig.duration}</div>
        <p style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: C.muted, margin: 0, lineHeight: 1.6 }}>{phaseConfig.description}</p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: mod.color, textTransform: "uppercase", marginBottom: 4 }}>Step-by-step walkthrough</div>
        <div style={{ border: `1px solid ${C.lightGray}`, borderRadius: 12, padding: "4px 20px", background: C.bg }}>
          <ExerciseSteps steps={phaseConfig.stepIndices.map(idx => mod.steps[idx])} color={mod.color} contentMode={contentMode} />
        </div>
      </div>

      {gaps && gaps.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          {gaps.map((gap, gi) => (
            <div key={gi} style={{ margin: "0 0 12px", padding: "18px 22px", background: C.blue + "06", borderRadius: 10, border: `1px dashed ${C.blue}40` }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, color: C.blue, textTransform: "uppercase", marginBottom: 6 }}>Practice on your own</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 15, color: C.dark, marginBottom: 6 }}>{gap.title}</div>
              <p style={{ fontFamily: "var(--sans)", fontSize: 12.5, color: C.muted, lineHeight: 1.6, margin: 0 }}>{gap.why}</p>
              {gap.topics && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 10 }}>
                  {gap.topics.map((t, ti) => <span key={ti} style={{ fontFamily: "var(--mono)", fontSize: 9, padding: "2px 8px", borderRadius: 10, border: `1px solid ${C.blue}30`, color: C.blue, background: C.blue + "08" }}>{t}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <KnowledgeCheckpoint
        moduleId={mod.id}
        color={mod.color}
        isCompleted={checkpointsCompleted.includes(mod.id)}
        onComplete={onCheckpointComplete}
      />
    </div>
  );
}


// ─── PERSONA MODAL ───
function PersonaModal({ persona, onClose }) {
  if (!persona) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,20,19,0.5)", backdropFilter: "blur(4px)", padding: 20 }} onClick={onClose}>
      <div style={{ background: C.bg, borderRadius: 16, border: `1px solid ${C.lightGray}`, maxWidth: 480, width: "100%", boxShadow: "0 16px 48px rgba(0,0,0,0.12)", animation: "fadeUp 0.3s ease forwards" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: "24px 28px 0", display: "flex", alignItems: "flex-start", gap: 20 }}>
          <div style={{ flexShrink: 0 }}>
            <PersonaCharacter id={persona.id} size={80} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 400, color: C.dark, marginBottom: 2 }}>{persona.title}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1.5, color: persona.color, textTransform: "uppercase" }}>{persona.subtitle}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, color: C.faint, cursor: "pointer", padding: "0 4px", marginTop: -4 }}>×</button>
        </div>
        <div style={{ padding: "16px 28px 24px" }}>
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, lineHeight: 1.7, color: C.muted, margin: "0 0 16px" }}>{persona.desc}</p>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1.5, color: C.faint, textTransform: "uppercase", marginBottom: 10 }}>What they ask Claude Code to do</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {persona.examples.map((ex, i) => (
              <a key={i} href={`https://claude.ai/new?q=${encodeURIComponent(ex.prompt)}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: persona.color + "06", borderRadius: 8, border: `1px solid ${persona.color}12`, textDecoration: "none", cursor: "pointer", transition: "background 0.15s ease" }} onMouseEnter={e => e.currentTarget.style.background = persona.color + "12"} onMouseLeave={e => e.currentTarget.style.background = persona.color + "06"}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: persona.color }}>↗</span>
                <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.muted }}>{ex.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PERSONA GRID BLOCK ───
function PersonaGrid({ items, delay }) {
  const [selected, setSelected] = useState(null);
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 16, margin: "16px 0 24px", ...st.fadeUp, animationDelay: delay }}>
        {items.map((p, i) => (
          <button key={p.id} onClick={() => setSelected(p)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: 0, transition: "transform 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            <div style={{ background: C.cream, borderRadius: 12, border: `1px solid ${C.lightGray}`, padding: 8, width: "100%", display: "flex", justifyContent: "center", transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = p.color}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.lightGray}
            >
              <PersonaCharacter id={p.id} size={100} />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 500, color: C.dark }}>{p.title}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: C.faint, letterSpacing: 0.5, marginTop: 2 }}>{p.subtitle}</div>
            </div>
          </button>
        ))}
      </div>
      {selected && <PersonaModal persona={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

// ─── CONTENT MODE SELECT ───
function ContentModeSelect({ contentMode, onChange, moduleId, onRetake }) {
  const modeColor = contentMode === "simplified" ? C.blue
    : contentMode === "engineer" ? C.orange : C.faint;
  const modeBg = contentMode === "standard" ? "transparent" : modeColor + "12";
  const modeBorder = contentMode === "standard" ? C.lightGray : modeColor + "40";
  return (
    <select
      value={contentMode}
      onChange={e => {
        if (e.target.value === "__retake") {
          onRetake && onRetake();
          return;
        }
        onChange(e.target.value);
      }}
      style={{
        background: modeBg, border: `1px solid ${modeBorder}`,
        borderRadius: 6, padding: "5px 12px", cursor: "pointer",
        fontFamily: "var(--sans)", fontSize: 11, color: modeColor,
        transition: "all 0.2s", outline: "none",
        flexShrink: 0,
      }}
    >
      <option value="simplified">Simplified</option>
      <option value="standard">Standard</option>
      <option value="engineer">Engineer</option>
      <option value="__retake">Retake diagnostic...</option>
    </select>
  );
}


// ─── CONTENT RENDERER ───
function ContentBlock({ block, idx, contentMode }) {
  const delay = `${0.08 + idx * 0.04}s`;
  const v = contentMode === "simplified" && block.simple ? block.simple : contentMode === "engineer" && block.engineer ? block.engineer : block.value;
  if (block.type === "text") return <p style={{ ...st.bodyText, ...st.fadeUp, animationDelay: delay }}>{v}</p>;
  if (block.type === "heading") return <h3 style={{ ...st.sectionHeading, ...st.fadeUp, animationDelay: delay }}>{v}</h3>;
  if (block.type === "personas") return <PersonaGrid items={block.items} delay={delay} />;
  if (block.type === "diagram") return <div style={{ ...st.fadeUp, animationDelay: delay }}><ClaudeCodeDiagram /></div>;
  if (block.type === "platform-diagram") return <div style={{ ...st.fadeUp, animationDelay: delay }}><PlatformDiagram /></div>;
  if (block.type === "config-hierarchy-diagram") return <div style={{ ...st.fadeUp, animationDelay: delay }}><ConfigHierarchyDiagram /></div>;
  if (block.type === "security-layers-diagram") return <div style={{ ...st.fadeUp, animationDelay: delay }}><SecurityLayersDiagram /></div>;
  if (block.type === "model-selection-diagram") return <div style={{ ...st.fadeUp, animationDelay: delay }}><ModelSelectionDiagram /></div>;
  if (block.type === "deployment-paths-diagram") return <div style={{ ...st.fadeUp, animationDelay: delay }}><DeploymentPathsDiagram /></div>;
  if (block.type === "cost-comparison-diagram") return <div style={{ ...st.fadeUp, animationDelay: delay }}><CostComparisonDiagram /></div>;

  if (block.type === "roi-card") return (
    <div style={{ margin: "20px 0", background: C.green + "06", borderRadius: 10, border: `1px solid ${C.green}25`, padding: "20px 24px", ...st.fadeUp, animationDelay: delay }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: C.green, marginBottom: 12 }}>ROI pocket math — use this with customers</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { left: "Team size", right: "50 developers", color: C.dark },
          { left: "Claude Code cost", right: "50 × $150/mo = $7,500/mo", color: C.orange },
          { left: "Time saved", right: "30 min/dev/day = 2.5 hrs/dev/week", color: C.dark },
          { left: "Hours recovered", right: "50 × 2.5 = 125 hrs/week", color: C.dark },
          { left: "Value at $175/hr fully loaded", right: "125 × $175 = $21,875/week", color: C.green },
          { left: "Monthly ROI", right: "$87,500 value vs. $7,500 cost = 11.7× return", color: C.green },
        ].map((row, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "6px 0", borderBottom: i < 5 ? `1px solid ${C.lightGray}` : "none" }}>
            <span style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.muted }}>{row.left}</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600, color: row.color }}>{row.right}</span>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "var(--sans)", fontSize: 11, color: C.faint, marginTop: 10, lineHeight: 1.5 }}>Adjust the numbers for your customer. The formula: (devs × hours saved × hourly rate) vs. (devs × Claude Code cost). Even conservative estimates show 5–15× return.</div>
    </div>
  );

  if (block.type === "overview") return (
    <div style={{ background: C.cream, border: `1px solid ${C.lightGray}`, borderRadius: 10, padding: "20px 24px", margin: "16px 0 24px", ...st.fadeUp, animationDelay: delay }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: C.faint, marginBottom: 14 }}>{block.heading || "In this section"}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {block.items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500, color: C.orange, whiteSpace: "nowrap", minWidth: 90 }}>{item.label}</span>
            <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{item.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (block.type === "outcomes") return (
    <div style={{ background: C.green + "06", border: `1px solid ${C.green}20`, borderRadius: 10, padding: "20px 24px", margin: "0 0 24px", ...st.fadeUp, animationDelay: delay }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: C.green, marginBottom: 12 }}>By the end of this section, you will be able to</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {block.items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ color: C.green, fontSize: 11, lineHeight: 1, flexShrink: 0 }}>&#10003;</span>
            <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.dark, lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (block.type === "terminal") return (
    <div style={{ ...st.fadeUp, animationDelay: delay }}>
      <TerminalBlock lines={block.lines} title={block.title} />
    </div>
  );

  if (block.type === "quote") return (
    <div style={{ ...st.quoteBlock, margin: "20px 0", ...st.fadeUp, animationDelay: delay }}>
      <p style={st.quoteText}>"{v}"</p>
      {block.attr && <p style={st.quoteAttr}>— {block.attr}</p>}
    </div>
  );

  if (block.type === "values") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "12px 0 20px", ...st.fadeUp, animationDelay: delay }}>
      {block.items.map((v, i) => (
        <div key={i} style={{ padding: "14px 18px", background: C.cream, borderRadius: 8, border: `1px solid ${C.lightGray}` }}>
          <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 500, color: C.dark, marginBottom: 3 }}>{v.title}</div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{contentMode === "simplified" && v.simpleDesc ? v.simpleDesc : contentMode === "engineer" && v.engineerDesc ? v.engineerDesc : v.desc}</div>
        </div>
      ))}
    </div>
  );

  if (block.type === "models") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "12px 0 20px", ...st.fadeUp, animationDelay: delay }}>
      {block.items.map((m, i) => (
        <div key={i} style={{ padding: "16px 20px", background: C.cream, borderRadius: 10, borderLeft: `3px solid ${m.color}`, border: `1px solid ${C.lightGray}`, borderLeftWidth: 3, borderLeftColor: m.color }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontFamily: "var(--serif)", fontSize: 18, color: m.color }}>{m.name}</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: m.color, background: m.color + "12", padding: "2px 8px", borderRadius: 10 }}>{m.tag}</span>
          </div>
          <p style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: C.muted, lineHeight: 1.6, margin: 0 }}>{contentMode === "simplified" && m.simpleDesc ? m.simpleDesc : contentMode === "engineer" && m.engineerDesc ? m.engineerDesc : m.desc}</p>
        </div>
      ))}
      {/* Comparison table for greatFor / notSuitedFor */}
      {block.items.some(m => m.greatFor || m.notSuitedFor) && (
        <div style={{ marginTop: 8, borderRadius: 10, overflow: "hidden", border: `1px solid ${C.lightGray}` }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--sans)", fontSize: 12 }}>
            <thead>
              <tr style={{ background: C.dark }}>
                <th style={{ padding: "10px 14px", fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: C.faint, textAlign: "left", fontWeight: 400 }}>Model</th>
                <th style={{ padding: "10px 14px", fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: C.green, textAlign: "left", fontWeight: 400 }}>Great for</th>
                <th style={{ padding: "10px 14px", fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: C.gray, textAlign: "left", fontWeight: 400 }}>Not well suited for</th>
              </tr>
            </thead>
            <tbody>
              {block.items.filter(m => m.greatFor || m.notSuitedFor).map((m, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${C.lightGray}`, background: i % 2 === 0 ? C.bg : C.cream }}>
                  <td style={{ padding: "14px", verticalAlign: "top", width: "15%", borderRight: `1px solid ${C.lightGray}` }}>
                    <span style={{ fontFamily: "var(--serif)", fontSize: 14, color: m.color, display: "block" }}>{m.name}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: m.color + "99" }}>{m.tag}</span>
                  </td>
                  <td style={{ padding: "14px", verticalAlign: "top", borderRight: `1px solid ${C.lightGray}` }}>
                    {m.greatFor?.map((item, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                        <span style={{ color: C.green, fontSize: 9, flexShrink: 0 }}>{"\u2713"}</span>
                        <span style={{ color: C.dark, lineHeight: 1.45 }}>{item}</span>
                      </div>
                    ))}
                  </td>
                  <td style={{ padding: "14px", verticalAlign: "top" }}>
                    {m.notSuitedFor?.map((item, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                        <span style={{ color: C.gray, fontSize: 9, flexShrink: 0 }}>{"\u2717"}</span>
                        <span style={{ color: C.muted, lineHeight: 1.45 }}>{item}</span>
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  if (block.type === "stats") return (
    <div style={{ ...st.fadeUp, animationDelay: delay }}>
      <h3 style={{ ...st.sectionHeading, marginBottom: 16 }}>{block.heading || "Fast Stats"}</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 12, margin: "0 0 20px" }}>
        {block.items.map((s, i) => (
          <div key={i} style={{ background: C.cream, border: `1px solid ${C.lightGray}`, borderRadius: 10, padding: "24px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", aspectRatio: "1 / 1" }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 400, color: C.orange, lineHeight: 1.2, marginBottom: 10 }}>{s.stat}</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{s.label}</div>
            {s.source && (s.sourceUrl ? <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", fontFamily: "var(--mono)", fontSize: 9, color: C.blue, background: C.blue + "08", border: `1px solid ${C.blue}20`, borderRadius: 10, padding: "2px 8px", marginTop: 8, textDecoration: "none", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.background = C.blue + "15"; }} onMouseLeave={e => { e.currentTarget.style.background = C.blue + "08"; }}>{s.source} ↗</a> : <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: C.faint, marginTop: 8, lineHeight: 1.4 }}>{s.source}</div>)}
          </div>
        ))}
      </div>
    </div>
  );

  if (block.type === "surfaces") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, margin: "16px 0 24px", ...st.fadeUp, animationDelay: delay }}>
      {block.items.map((surface, i) => (
        <div key={surface.id} style={{ background: C.cream, border: `1px solid ${C.lightGray}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: 20 }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 20, color: C.dark, marginBottom: 4 }}>{surface.title}</div>
            <img src={surface.img} alt={surface.title} style={{ width: "100%", borderRadius: 8, border: `1px solid ${C.lightGray}`, marginTop: 12, marginBottom: 16, display: "block" }} onError={e => { e.currentTarget.style.display = "none"; }} />
            <ul style={{ margin: 0, padding: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 8 }}>
              {surface.bullets.map((b, j) => (
                <li key={j} style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: C.muted, lineHeight: 1.6 }}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );

  if (block.type === "reflect") return (
    <div style={{ margin: "16px 0 20px", padding: "20px 24px", background: C.orange + "06", borderRadius: 10, border: `1px solid ${C.orange}20`, ...st.fadeUp, animationDelay: delay }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: C.orange, textTransform: "uppercase", marginBottom: 8 }}>Pause and think</div>
      <p style={{ fontFamily: "var(--serif)", fontSize: 15, fontStyle: "italic", color: C.muted, lineHeight: 1.6, margin: "0 0 12px" }}>{block.prompt}</p>
      <button onClick={() => openInClaude(`I'm going through Claude Code Basecamp onboarding. Here's what I'm reflecting on: "${block.prompt}" — Help me think through this. Ask me follow-up questions. Be a thoughtful colleague, not a lecturer.`)} style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.orange, background: "transparent", border: `1px solid ${C.orange}30`, borderRadius: 6, padding: "7px 16px", cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = C.orange + "10"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
        >Think through this with Claude →</button>
    </div>
  );

  if (block.type === "placeholder") return (
    <div style={{ margin: "20px 0", padding: "20px 24px", background: C.blue + "06", borderRadius: 10, border: `1px dashed ${C.blue}40`, ...st.fadeUp, animationDelay: delay }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: C.blue, textTransform: "uppercase", marginBottom: 8 }}>Practice on your own</div>
      <div style={{ fontFamily: "var(--serif)", fontSize: 16, color: C.dark, marginBottom: 8 }}>{block.title}</div>
      <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.muted, lineHeight: 1.6, margin: 0 }}>{block.why}</p>
      {block.topics && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
          {block.topics.map((t, i) => <span key={i} style={{ fontFamily: "var(--mono)", fontSize: 10, padding: "3px 10px", borderRadius: 12, border: `1px solid ${C.blue}30`, color: C.blue, background: C.blue + "08" }}>{t}</span>)}
        </div>
      )}
    </div>
  );

  if (block.type === "section-intro") return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", margin: "0 0 20px", background: C.cream, borderRadius: 8, border: `1px solid ${C.lightGray}`, ...st.fadeUp, animationDelay: delay }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: 20, fontWeight: 600, color: C.orange, opacity: 0.35, lineHeight: 1 }}>{block.step}</div>
      <div>
        <div style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 500, color: C.dark }}>{block.label}</div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: C.faint }}>{block.context}</div>
      </div>
    </div>
  );

  if (block.type === "divider") return (
    <div style={{ height: 1, background: C.lightGray, margin: "28px 0", opacity: 0.5, ...st.fadeUp, animationDelay: delay }} />
  );

  return null;
}

// ─── MODULE BADGE (collectible credential for daily sessions) ───
function ModuleBadge({ name, icon, desc, earned, color, size = "normal" }) {
  const isSmall = size === "small";
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      width: isSmall ? 80 : "auto", minHeight: isSmall ? 80 : 88,
      padding: isSmall ? "8px 4px" : "10px 8px",
      borderRadius: 12,
      background: earned ? color + "0a" : C.cream,
      border: `1.5px solid ${earned ? color : C.lightGray}`,
      transition: "all 0.4s ease",
      position: "relative",
      overflow: "hidden",
      ...(earned ? { animation: "scaleIn 0.35s ease" } : {}),
    }}>
      {/* Glyph */}
      <div style={{
        fontFamily: "var(--mono)", fontSize: isSmall ? 18 : 20, fontWeight: 600,
        color: earned ? color : C.gray,
        lineHeight: 1, marginBottom: isSmall ? 4 : 5,
        transition: "color 0.4s ease",
        letterSpacing: -1,
      }}>{icon}</div>
      {/* Name */}
      <div style={{
        fontFamily: "var(--mono)", fontSize: isSmall ? 8 : 9,
        letterSpacing: 0.3, textAlign: "center",
        color: earned ? C.dark : C.gray,
        lineHeight: 1.25, transition: "color 0.4s ease",
      }}>{name}</div>
      {/* Subtitle */}
      {!isSmall && (
        <div style={{
          fontFamily: "var(--sans)", fontSize: 8,
          color: earned ? C.muted : C.faint,
          marginTop: 2, textAlign: "center",
          transition: "color 0.4s ease",
        }}>{desc}</div>
      )}
      {/* Earned indicator */}
      {earned && (
        <div style={{
          position: "absolute", top: 5, right: 5,
          width: 6, height: 6, borderRadius: "50%",
          background: color,
        }} />
      )}
    </div>
  );
}

// ─── KNOWLEDGE CHECKPOINT ───
function KnowledgeCheckpoint({ moduleId, color, onComplete, isCompleted }) {
  const questions = KNOWLEDGE_CHECKPOINTS[moduleId] || [];
  const [expanded, setExpanded] = useState({});
  const [reflected, setReflected] = useState({});

  if (questions.length === 0) return null;

  const allReflected = questions.every((_, i) => reflected[i]);
  const reflectedCount = Object.values(reflected).filter(Boolean).length;

  return (
    <div style={{
      background: C.cream, borderRadius: 10, border: `1px solid ${C.lightGray}`,
      borderLeft: `3px solid ${color}`, padding: "20px 24px", marginBottom: 20,
      ...st.fadeUp, animationDelay: "0.36s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color, textTransform: "uppercase" }}>
          Knowledge checkpoint
        </div>
        {isCompleted && (
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: C.green, background: C.green + "12", padding: "2px 8px", borderRadius: 10 }}>Done</span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {questions.map((q, i) => (
          <div key={i} style={{ background: C.bg, borderRadius: 8, border: `1px solid ${C.lightGray}`, overflow: "hidden" }}>
            <button
              onClick={() => setExpanded(prev => ({ ...prev, [i]: !prev[i] }))}
              style={{
                width: "100%", textAlign: "left", background: "none", border: "none",
                padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 10,
              }}
            >
              <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.faint, flexShrink: 0, marginTop: 1 }}>
                {expanded[i] ? "−" : "+"}
              </span>
              <span style={{
                fontFamily: "var(--serif)", fontSize: 14, fontStyle: "italic", color: reflected[i] ? C.faint : C.dark, lineHeight: 1.5,
                textDecoration: reflected[i] ? "line-through" : "none", textDecorationColor: C.lightGray,
              }}>
                {q.question}
              </span>
            </button>
            {expanded[i] && (
              <div style={{ padding: "0 16px 14px 42px" }}>
                <button
                  onClick={() => setExpanded(prev => ({ ...prev, [`hint-${i}`]: !prev[`hint-${i}`] }))}
                  style={{
                    fontFamily: "var(--mono)", fontSize: 10, color, background: color + "08",
                    border: `1px solid ${color}20`, borderRadius: 4, padding: "3px 10px",
                    cursor: "pointer", marginBottom: expanded[`hint-${i}`] ? 8 : 0,
                  }}
                >{expanded[`hint-${i}`] ? "Hide hint" : "Show hint"}</button>
                {expanded[`hint-${i}`] && (
                  <p style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.faint, lineHeight: 1.6, margin: "0 0 10px" }}>
                    {q.hint}
                  </p>
                )}
                {!reflected[i] && (
                  <button
                    onClick={() => {
                      const next = { ...reflected, [i]: true };
                      setReflected(next);
                      if (questions.every((_, j) => next[j])) {
                        onComplete();
                      }
                    }}
                    style={{
                      fontFamily: "var(--sans)", fontSize: 12, color: C.muted,
                      background: "transparent", border: `1px solid ${C.lightGray}`,
                      borderRadius: 6, padding: "6px 14px", cursor: "pointer",
                      marginTop: 6, transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.lightGray; e.currentTarget.style.color = C.muted; }}
                  >I've reflected on this</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {!isCompleted && (
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: C.faint, marginTop: 12 }}>
          {reflectedCount}/{questions.length} reflected
        </div>
      )}
    </div>
  );
}

// ─── NAME INPUT MODAL ───
// ─── DIAGNOSTIC QUIZ ───
function DiagnosticQuiz({ color, onComplete, existingResult }) {
  const quiz = WEEK_DIAGNOSTIC;
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(
    existingResult ? [...existingResult.answers] : Array(quiz.questions.length).fill(null)
  );
  const [showResult, setShowResult] = useState(false);

  if (!quiz) return null;

  const allAnswered = answers.every(a => a !== null);
  const maxScore = quiz.questions.length * 2;
  const score = answers.reduce((sum, ansIdx, qIdx) => {
    if (ansIdx === null) return sum;
    return sum + quiz.questions[qIdx].options[ansIdx].points;
  }, 0);
  const technicalScore = answers.reduce((sum, ansIdx, qIdx) => {
    if (ansIdx === null || quiz.questions[qIdx].axis !== "technical") return sum;
    return sum + quiz.questions[qIdx].options[ansIdx].points;
  }, 0);
  const aiScore = answers.reduce((sum, ansIdx, qIdx) => {
    if (ansIdx === null || quiz.questions[qIdx].axis !== "ai") return sum;
    return sum + quiz.questions[qIdx].options[ansIdx].points;
  }, 0);
  const recommendation = score <= 3 ? "simplified" : score <= 5 ? "standard" : "engineer";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,20,19,0.5)", backdropFilter: "blur(4px)", padding: 20 }}>
      <div style={{ background: C.bg, borderRadius: 16, border: `1px solid ${C.lightGray}`, maxWidth: 520, width: "100%", padding: "32px 28px", boxShadow: "0 16px 48px rgba(0,0,0,0.12)", animation: "fadeUp 0.3s ease forwards", maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        {!showResult ? (
          <>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: color, textTransform: "uppercase", marginBottom: 4 }}>{quiz.title}</div>
            <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.muted, margin: "0 0 20px", lineHeight: 1.5 }}>{quiz.description}</p>

            {/* Progress dots */}
            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              {quiz.questions.map((_, i) => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i === currentQ ? color : answers[i] !== null ? color + "40" : C.lightGray, transition: "all 0.2s" }} />
              ))}
            </div>

            {/* Axis badge */}
            <span style={{
              fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", padding: "2px 8px", borderRadius: 10, display: "inline-block", marginBottom: 12,
              background: quiz.questions[currentQ].axis === "technical" ? C.blue + "10" : C.green + "10",
              color: quiz.questions[currentQ].axis === "technical" ? C.blue : C.green,
              border: `1px solid ${quiz.questions[currentQ].axis === "technical" ? C.blue + "20" : C.green + "20"}`,
            }}>
              {quiz.questions[currentQ].axis === "technical" ? "Technical background" : "Claude / AI experience"}
            </span>

            {/* Question text */}
            <p style={{ fontFamily: "var(--serif)", fontSize: 16, color: C.dark, lineHeight: 1.6, margin: "0 0 20px" }}>
              {quiz.questions[currentQ].text}
            </p>

            {/* Answer options */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {quiz.questions[currentQ].options.map((opt, optIdx) => (
                <button
                  key={optIdx}
                  onClick={() => { const next = [...answers]; next[currentQ] = optIdx; setAnswers(next); }}
                  style={{
                    textAlign: "left", padding: "12px 16px", borderRadius: 8, cursor: "pointer",
                    border: `1px solid ${answers[currentQ] === optIdx ? color : C.lightGray}`,
                    background: answers[currentQ] === optIdx ? color + "08" : C.bg,
                    fontFamily: "var(--sans)", fontSize: 13, color: C.dark, lineHeight: 1.5, transition: "all 0.15s",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
              <button
                onClick={() => setCurrentQ(q => q - 1)}
                disabled={currentQ === 0}
                style={{ fontFamily: "var(--sans)", fontSize: 13, color: currentQ > 0 ? C.muted : "transparent", background: "none", border: "none", cursor: currentQ > 0 ? "pointer" : "default", padding: "10px 0" }}
              >
                {"\u2190 Back"}
              </button>
              <button
                onClick={() => {
                  if (currentQ < quiz.questions.length - 1) setCurrentQ(q => q + 1);
                  else if (allAnswered) setShowResult(true);
                }}
                disabled={answers[currentQ] === null}
                style={{
                  fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500, color: "#fff",
                  background: color, border: "none", borderRadius: 8, padding: "10px 20px",
                  cursor: answers[currentQ] === null ? "default" : "pointer",
                  opacity: answers[currentQ] === null ? 0.4 : 1, transition: "opacity 0.2s",
                }}
              >
                {currentQ < quiz.questions.length - 1 ? "Next \u2192" : "See results"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: color, textTransform: "uppercase", marginBottom: 16 }}>Your readiness profile</div>

            {/* Score display */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <div style={{ background: C.cream, borderRadius: 10, padding: "16px 20px", border: `1px solid ${C.lightGray}`, flex: 1, textAlign: "center" }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: 28, color }}>{score}/{maxScore}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: C.faint, letterSpacing: 1, textTransform: "uppercase" }}>Overall</div>
              </div>
              <div style={{ background: C.cream, borderRadius: 10, padding: "16px 14px", border: `1px solid ${C.lightGray}`, flex: 1, textAlign: "center" }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: 20, color: C.blue }}>{technicalScore}/4</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: C.faint, letterSpacing: 1, textTransform: "uppercase" }}>Technical</div>
              </div>
              <div style={{ background: C.cream, borderRadius: 10, padding: "16px 14px", border: `1px solid ${C.lightGray}`, flex: 1, textAlign: "center" }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: 20, color: C.green }}>{aiScore}/4</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: C.faint, letterSpacing: 1, textTransform: "uppercase" }}>AI / Claude</div>
              </div>
            </div>

            {/* Recommendation */}
            {(() => {
              const modeColors = { simplified: C.blue, standard: C.green, engineer: C.orange };
              const modeLabels = { simplified: "Simplified", standard: "Standard", engineer: "Engineer" };
              const modeDescs = {
                simplified: "Focuses on core concepts with plain-language explanations and no assumed jargon.",
                standard: "Includes facilitator scripts, key discussion points, and balanced technical context.",
                engineer: "Implementation-focused — API details, code examples, and architecture. Assumes comfort with CLI, git, and APIs.",
              };
              const recColor = modeColors[recommendation];
              const modes = ["simplified", "standard", "engineer"];
              const otherModes = modes.filter(m => m !== recommendation);
              return (
                <>
                  <div style={{ padding: "16px 20px", borderRadius: 10, marginBottom: 20, background: recColor + "08", border: `1px solid ${recColor}20` }}>
                    <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500, color: recColor, marginBottom: 4 }}>Recommended: {modeLabels[recommendation]}</div>
                    <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: C.dark, lineHeight: 1.6, margin: 0 }}>{modeDescs[recommendation]}</p>
                  </div>
                  <button
                    onClick={() => onComplete(recommendation, answers, score)}
                    style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 500, color: "#fff", background: color, border: "none", borderRadius: 8, padding: "12px 20px", cursor: "pointer", width: "100%", marginBottom: 10 }}
                  >
                    Use {modeLabels[recommendation]} mode
                  </button>
                  <div style={{ display: "flex", gap: 8 }}>
                    {otherModes.map(mode => (
                      <button
                        key={mode}
                        onClick={() => onComplete(mode, answers, score)}
                        style={{ fontFamily: "var(--sans)", fontSize: 12, color: modeColors[mode], background: "none", border: `1px solid ${modeColors[mode]}30`, borderRadius: 8, padding: "10px 16px", cursor: "pointer", flex: 1 }}
                      >
                        Use {modeLabels[mode]}
                      </button>
                    ))}
                  </div>
                </>
              );
            })()}
            <p style={{ fontFamily: "var(--sans)", fontSize: 11, color: C.faint, marginTop: 12, textAlign: "center", lineHeight: 1.5 }}>
              You can change this anytime using the content mode selector in the header.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function NameInputModal({ onSubmit, onSkip }) {
  const [name, setName] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,20,19,0.5)", backdropFilter: "blur(4px)", padding: 20 }}>
      <div style={{ background: C.bg, borderRadius: 16, border: `1px solid ${C.lightGray}`, maxWidth: 360, width: "100%", padding: "32px 28px", boxShadow: "0 16px 48px rgba(0,0,0,0.12)", animation: "fadeUp 0.3s ease forwards" }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 400, color: C.dark, margin: "0 0 6px" }}>You did it.</h2>
        <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: C.muted, margin: "0 0 20px", lineHeight: 1.5 }}>Add your name to your completion certificate.</p>
        <input
          value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && name.trim() && onSubmit(name.trim())}
          placeholder="Your name"
          autoFocus
          style={{
            width: "100%", fontFamily: "var(--sans)", fontSize: 15, padding: "12px 14px",
            border: `1px solid ${C.lightGray}`, borderRadius: 8, background: C.bg,
            color: C.dark, outline: "none", marginBottom: 16,
          }}
        />
        <button
          onClick={() => name.trim() && onSubmit(name.trim())}
          disabled={!name.trim()}
          style={{
            ...st.primaryBtn, width: "100%", marginBottom: 10,
            opacity: name.trim() ? 1 : 0.5, cursor: name.trim() ? "pointer" : "default",
          }}
        >Continue</button>
        <button
          onClick={onSkip}
          style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.faint, background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "center", padding: 4 }}
        >Skip — use "Basecamp Graduate"</button>
      </div>
    </div>
  );
}

// ─── COMPLETION CERTIFICATE ───
function CompletionCertificate({ userName, path, earnedSkills, date, onClose }) {
  const pathLabel = PATHS.find(p => p.id === path)?.label || "Claude Code";
  const displayDate = new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  function handleDownloadPDF() {
    document.body.classList.add("printing-certificate");
    setTimeout(() => {
      window.print();
      document.body.classList.remove("printing-certificate");
    }, 100);
  }

  return (
    <div data-certificate-overlay="" style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,20,19,0.5)", backdropFilter: "blur(4px)", padding: 20 }} onClick={onClose}>
      <div data-certificate-card="" style={{
        background: C.bg, borderRadius: 16, border: `1px solid ${C.lightGray}`, maxWidth: 520, width: "100%",
        boxShadow: "0 16px 48px rgba(0,0,0,0.12)", animation: "fadeUp 0.3s ease forwards", overflow: "hidden",
      }} onClick={e => e.stopPropagation()}>
        {/* Top accent */}
        <div style={{ height: 2, background: C.orange }} />
        <div style={{ padding: "32px 32px 28px" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2.5, color: C.faint, textTransform: "uppercase", marginBottom: 8 }}>Certificate of completion</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 400, color: C.dark, margin: "0 0 2px" }}>Claude Code Basecamp</h2>
            <span style={{ fontFamily: "var(--serif)", fontSize: 18, color: C.orange }}>Completed</span>
          </div>

          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22, color: C.dark }}>{userName || "Basecamp Graduate"}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1.5, color: C.faint, textTransform: "uppercase", marginTop: 4 }}>{pathLabel}</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.muted, marginTop: 4 }}>{displayDate}</div>
          </div>

          <div style={{ borderTop: `1px solid ${C.lightGray}`, paddingTop: 16, marginBottom: 16 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1.5, color: C.faint, textTransform: "uppercase", marginBottom: 10 }}>Credentials earned</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
              {earnedSkills.map(sk => (
                <ModuleBadge key={sk.name} name={sk.name} icon={sk.icon} desc={sk.desc} earned={true} color={sk.color} size="small" />
              ))}
            </div>
          </div>

          <div className="no-print" style={{ textAlign: "center", marginTop: 20, display: "flex", gap: 10, justifyContent: "center" }}>
            <button onClick={handleDownloadPDF} style={{
              fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500, color: C.bg, background: C.orange,
              border: "none", borderRadius: 8, padding: "10px 24px",
              cursor: "pointer", transition: "opacity 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >Download as PDF</button>
            <button onClick={onClose} style={{
              fontFamily: "var(--sans)", fontSize: 13, color: C.muted, background: "transparent",
              border: `1px solid ${C.lightGray}`, borderRadius: 8, padding: "10px 24px",
              cursor: "pointer", transition: "all 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.gray}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.lightGray}
            >Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PATH SELECT PAGE ───
function PathSelectPage({ onSelect }) {
  return (
    <div style={st.container}>
      <div style={{ ...st.fadeUp, animationDelay: "0.1s" }}>
        <h1 style={{ ...st.heroTitle, fontSize: 36 }}>Select<br /><span style={{ color: C.orange }}>your role.</span></h1>
        <p style={st.heroBody}>Everyone builds the same technical foundation. Your role shapes the lens — what you practice, what you produce, and what you'll be ready to do in the field.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 36 }}>
        {PATHS.map((p, i) => {
          const outcomes = PATH_OUTCOMES[p.id];
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", background: C.bg, border: `1px solid ${C.lightGray}`,
                borderRadius: 12, cursor: "pointer", padding: "16px 20px", textAlign: "left",
                transition: "all 0.2s ease",
                ...st.fadeUp, animationDelay: `${0.3 + i * 0.08}s`,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange + "60"; e.currentTarget.style.background = C.cream; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.lightGray; e.currentTarget.style.background = C.bg; }}
            >
              <div style={{ flex: 1 }}>
                {p.id !== "pe-pre" && (
                  <div style={{ marginBottom: 4 }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 0.5, color: C.faint, background: C.lightGray + "60", padding: "2px 8px", borderRadius: 10 }}>Work in progress</span>
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 500, color: C.dark }}>{p.label}</span>
                  {outcomes && (
                    <span style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 0.5, color: C.orange, background: C.orange + "10", padding: "2px 8px", borderRadius: 10 }}>{outcomes.verb}</span>
                  )}
                </div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.faint, lineHeight: 1.5 }}>{p.desc}</div>
              </div>
              <span style={{ color: C.orange, fontSize: 14, flexShrink: 0, marginLeft: 12 }}>→</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── FEEDBACK RESPONSE DATA (Cohort 1 → Cohort 2 Analysis) ───
const FEEDBACK_RESPONSE = [
  {
    id: "diagnosis",
    number: "01",
    question: "Diagnosis: What are the 2-3 most important problems this feedback reveals? What's signal vs. noise?",
    items: [
      {
        problem: "1. Program needs to be longer",
        analysis: "The program needs more breathing room and more hands-on time to make sure people feel adequately prepared for the job. 31% rated \"Pacing\" as \"Too fast,\" and the qualitative feedback was direct: \"I felt there was too much content packed into the day. Less content at a more reasonable pace would allow for better learning and retention.\" Three days forces a choice between breadth and depth, and the feedback suggests Cohort 1 chose breadth at the expense of retention. When content moves too fast, participants see concepts without truly digesting them — they leave feeling like they covered the material, but without the hands-on repetition needed to actually be ready for a customer conversation or deployment.",
        implementation: {
          label: "Expanded from 3 days to 5, moved lectures to pre-work",
          detail: "The program runs 5 days now instead of 3 — about 40% less content per day. Conceptual material is moved to self-paced pre-work, leaving live time to focus on hands-on exercises.",
        },
      },
      {
        problem: "2. Break up based on role",
        analysis: "Start with common tool foundations relevant across all roles, then move into role-specific content. When content stays role-generic for too long, participants whose daily work doesn't map to the examples disengage. \"More splits between SA, Engineer, Research. Guidance as to what is more relevant for each group. More technical discovery / sales-focused sessions for SAs.\" A shared technical foundation matters — every role needs to understand how Claude Code works — but participants need to see their specific job reflected in the material earlier than the current design allows. An SA preparing for a technical account conversation and a Post-Sales PE preparing to pair-program with a customer team have fundamentally different needs by midweek, and a one-size-fits-all curriculum past the foundations means some content doesn't map to some people's actual work.",
        implementation: {
          label: "Four role tracks with different outcomes per module",
          detail: "PE Pre-Sales, PE Post-Sales, Solutions Architect, Applied Research. Each module shows a role-specific outcome — a PE sees 'Demo the install to a prospect,' an SA sees 'Explain the value prop to a technical audience.' Day 4 splits into role-specific breakouts. Skill badges give people a way to see their progress.",
        },
      },
      {
        problem: "3. Make it interactive and specific",
        analysis: "Hands-on sessions during self-guided work, hands-on labs during live trainings, working together with peers, presenting back to the group. The Evals sessions scored lowest on \"Session engagement avg\" (3.9 vs. 4.39 overall), and the feedback was precise about why: \"The Evals session spent too much time on abstract component taxonomy without enough concrete examples. The build-along afterward was far more effective for actually learning evals.\" The pattern is consistent across the qualitative data — participants praised the interactive HTML presentations, asked for more peer collaboration, and pushed back on passive lecture. \"Presenting back to the class is an essential skill. We need more of this and less of people talking at us.\" The \"Realistic work simulation\" score also dipped to 3.9 on Day 3, and the convergence of low engagement and low realism on the same day is telling: when a session feels abstract, it simultaneously feels disconnected from the job.",
        implementation: {
          label: "Every session starts with building now",
          detail: "Every day opens with a client scenario and hands-on work. Day 1: 'Meridian Health takes 2-3 days per endpoint — show them how to do it in minutes.' Day 3: 'Arcadia Financial needs compliance gates — build it.' Eval concepts moved to the Applied Research track where people build working harnesses instead of reading taxonomy charts.",
        },
      },
    ],
    signalVsNoise: "Signal: The flat trend in \"Self-rated confidence\" (~4.28 across all three days) is a negative signal — students should be getting more confident as the week progresses as they gain increased comfort and mastery of Claude Code. That said, maintaining high confidence could also mean that content was calibrated appropriately to the group, since student confidence is important for maintaining classroom engagement. Too much content in too few days — people not actually digesting material could be leading to artificially high \"Self-rated confidence\" and \"Apply independently\" scores because they couldn't actually absorb everything. Noise: NPS (35, n=17) didn't have high enough representation from the cohort (17 responses out of 54 surveys) — setting this aside entirely. \"Apply independently\" scores (4.2, 4.5, 4.3) are fairly high, which is a good sign on its face. However, it's easy to learn a concept and think you understand implementation when the gulf between the two is actually quite wide. Would be curious to know how this was assessed in the first round of Basecamp and whether high self-reported readiness translated to actual field performance.",
  },
  {
    id: "changes",
    number: "02",
    question: "Changes: What specific changes would you make to the program for the next cohort?",
    items: [
      {
        problem: "1. Extend the program from 3 days to 5 days",
        analysis: "The single highest-leverage change. Three days forces a choice between breadth and depth, and Cohort 1 feedback says we chose breadth at the expense of retention. A five-day structure allows each module to include both the conceptual introduction and the hands-on practice time participants are asking for, without rushing. Each day carries roughly 2-2.5 hours of content instead of cramming 4+ hours, leaving room for the repetition and application that drive retention.",
        implementation: {
          label: "Expanded from 3 days to 5, moved lectures to pre-work",
          detail: "The program runs 5 days now instead of 3 — about 40% less content per day. Conceptual material is moved to self-paced pre-work, leaving live time to focus on hands-on exercises.",
        },
      },
      {
        problem: "2. Role-specific tracks",
        analysis: "Rather than running fully parallel tracks (which fragments the cohort and doubles facilitator load), keep the first days shared but tag every exercise with role-specific framing. A Pre-Sales PE and a Post-Sales PE both write a CLAUDE.md, but the Pre-Sales PE writes one for a prospect evaluation while the Post-Sales PE writes one for a customer's production codebase. Later days diverge fully: SAs run adoption strategy scenarios, PEs run technical evaluation or implementation sessions, AR goes deep on custom tooling. This answers the 'more splits' feedback without losing the cross-role learning that shared sessions provide.",
        implementation: {
          label: "Four role tracks with different outcomes per module",
          detail: "PE Pre-Sales, PE Post-Sales, Solutions Architect, Applied Research. Each module shows a role-specific outcome — a PE sees 'Demo the install to a prospect,' an SA sees 'Explain the value prop to a technical audience.' Day 4 splits into role-specific breakouts.",
        },
      },
      {
        problem: "3. Move setup to self-guided pre-work with a push to ask Claude for help",
        analysis: "\"Ensure everyone has cloned and tested the GitHub repo before the first build-along — setup friction eats into the exercise time.\" CLI install, IDE setup, and repo clone all happen before Day 1 as self-guided pre-work. When participants hit issues, encourage them to use Claude to troubleshoot — this serves double duty: it solves their setup problem and gives them their first real experience using the tool before the program even starts. Zero lab time should be spent on environment setup.",
        implementation: {
          label: "Install happens as pre-work now",
          detail: "Pre-work checklist sent 48 hours before the program: install Claude Code, clone the training repo, run a verification script. Participants are encouraged to ask Claude for help with any setup issues they encounter — making the pre-work itself a learning moment.",
        },
      },
      {
        problem: "4. Daily office hours to provide help with relevant setup",
        analysis: "Offer a 1-hour optional office hours slot every day for participants who need help with setup relevant to that day's content. Day 0 (afternoon before the program) covers initial install and environment issues. Day 1 might cover IDE integration or repo cloning. Day 3 might cover MCP server configuration or hook setup. As the curriculum introduces new tools and integrations throughout the week, each day brings its own setup surface area — office hours ensure participants aren't spending live session time debugging environment issues at any point in the program, not just on Day 1.",
      },
      {
        problem: "5. Specific hands-on exercises and labs to bring concepts to life",
        analysis: "Every live session should be restructured around the 'I do, we do, you do' pattern. The facilitator demos first, then the group works through a guided exercise together, then individuals tackle an independent lab. Build in a peer teaching moment in every module — participants present back a concept or demo to their table. Labs should be framed through realistic client scenarios, not abstract exercises: Day 1 isn't 'install Claude Code,' it's 'you're onboarding Meridian Health's backend team and delivering their first win.' This is what participants asked for, and it's what the engagement data confirms works.",
        implementation: {
          label: "Every session starts with building now",
          detail: "Every day opens with a client scenario and hands-on work. The HTML interactive format that scored highest in Cohort 1 feedback becomes the standard for all sessions.",
        },
      },
    ],
    summary: "Risks: Expanding to 5 days increases scheduling friction — mitigated by keeping each day to 2-2.75 hours instead of full days. Moving content to pre-work creates a dependency on completion — mitigated by tracking completion, building facilitator fallback scripts, and daily office hours. Four role tracks may fragment small cohorts — mitigated by merging adjacent roles (PE Pre-Sales with SA, PE Post-Sales with AR) when any track falls below 3 participants. And shifting to build-first may overcorrect from the Evals session failure — mitigated by starting every lab with a short client scenario that provides context and motivation, so participants know what they're building and why before they start.",
  },
  {
    id: "measurement",
    number: "03",
    question: "Measurement: How would you know if your changes worked? What would you measure, and what does \"success\" look like for Cohort 2?",
    items: [
      {
        problem: "1. \"Self-rated confidence\" trend",
        analysis: "Measure daily on the same 1-5 scale. The number that matters isn't the absolute score — it's the slope. Cohort 1 was flat: 4.29, 4.28, 4.28. Target: a visible upward trend (e.g. Day 1: ~3.8 → Day 5: ~4.5). A rising trend — especially one that starts slightly lower — means the program is building genuine felt mastery, not coasting on surface familiarity. A flat or declining line means the program isn't working, regardless of what the content covers. If it stays flat after reducing content load and adding role segmentation, the issue may be the measurement scale itself rather than the curriculum.",
      },
      {
        problem: "2. \"Pacing\"",
        analysis: "Reduce \"Too fast\" responses from 31% to under 15%. This is the most direct measure of whether the 3→5 day expansion worked. If it doesn't move, the problem wasn't just duration — it was density or delivery, and the next iteration should focus on cutting content rather than spreading it over more days.",
      },
      {
        problem: "3. Content applicability",
        analysis: "Combine two measures. First, target \"Realistic work simulation\" score at 4.2+ every day with no Day 3-style dips (was 4.3, 4.4, 3.9). This tells you whether the hands-on, scenario-based restructure is making content feel connected to the actual job throughout the week. Second, add a new daily question: \"Today's content was relevant to my role\" (1-5), segmented by role. If SAs score lower than PEs on shared days, those days need more SA-relevant framing. This tells you whether the role-specific tracks are actually landing or just decorative.",
      },
      {
        problem: "4. \"Session engagement avg\" floor",
        analysis: "No session should score below 4.2 (Cohort 1's Evals sessions hit 3.9 against a 4.39 average). Measure engagement per session, not per day — a strong morning can mask a weak afternoon. This is the direct measure of whether the hands-on restructure worked. Any session below 4.0 is a structural problem with that session, not a fluke, and should trigger a redesign of that specific module.",
      },
      {
        problem: "5. 30-day field application rate",
        analysis: "The metric that matters most and the one Cohort 1 didn't track: are people actually using what they learned? Survey participants 30 days after the program. Ask: \"Have you used a Basecamp skill in a customer engagement? Which one? What was missing?\" A training program that scores well on day-of surveys but doesn't change behavior in the field hasn't worked. This is the only metric that closes the loop on whether self-reported confidence during training translated to actual readiness — the gap that Cohort 1's data can't answer.",
      },
      {
        problem: "6. Segment all survey responses by role",
        analysis: "Cohort 1's biggest analytical blind spot was that survey data wasn't segmented by role. The flat confidence curve may mask divergent role trajectories — PEs improving while SAs plateau, averaging to flat. The 31% who said \"Too fast\" may cluster in less technical roles, while AR may have found it too slow. Without role-segmented data, we're guessing. For Cohort 2, every metric above should be breakable by PE Pre-Sales, PE Post-Sales, SA, and AR. If confidence is climbing for three roles but flat for one, that's a targeted curriculum problem, not a structural one. If \"Too fast\" is concentrated in SAs, the fix is role-specific pacing, not slowing everything down. This is as important as any individual metric — it turns aggregate averages into actionable, role-specific insights.",
      },
    ],
    summary: "Cohort 2 works if confidence climbs each day, \"Too fast\" drops below 15%, no session scores below 4.2, content feels relevant across all roles — and most importantly, people are using Claude Code with customers within 30 days of finishing the program.",
  },
]
// ─── CURRICULUM PLAN CONTENT (Part 1 Questions) ───
function CurriculumPlanContent() {
  const sectionGap = { marginBottom: 56 };
  const accentLine = (color) => ({ height: 2, width: 48, background: color, margin: "12px 0 24px", borderRadius: 1 });
  const headingStyle = { fontFamily: "var(--serif)", fontSize: 28, fontWeight: 400, color: C.dark, margin: "0 0 8px", lineHeight: 1.25 };
  const bodyStyle = { fontFamily: "var(--sans)", fontSize: 13.5, color: C.muted, lineHeight: 1.72, margin: "0 0 14px" };
  const subheadStyle = { fontFamily: "var(--serif)", fontSize: 20, fontWeight: 400, color: C.dark, margin: "32px 0 12px", lineHeight: 1.3 };

  const dayArcData = [
    { day: "1", title: "First Contact", tag: "Common Core", focus: "What is Claude Code, installation, agentic loop, context window, tools, permissions", handson: "Install, authenticate, complete first agentic task (student-focused, not customer-facing)", artifact: "Working Claude Code installation + completed agentic task", milestone: "Independently install, configure, and complete a multi-step agentic task", prework: "30 min", live: "45 min", lab: "45 min", color: C.orange },
    { day: "2", title: "Prompt Craft", tag: "Common Core", focus: "CLAUDE.md files (authoring, hierarchy, best practices), settings, CLI flags, plan mode, slash commands, keyboard shortcuts, session management, prompt patterns", handson: "Write a CLAUDE.md, before/after demo, prompt pattern practice", artifact: "CLAUDE.md template + prompt pattern cheat sheet + before/after comparison", milestone: "Write effective CLAUDE.md files and use plan mode, slash commands, and prompt patterns to steer output", prework: "30 min", live: "60 min", lab: "60 min", color: C.blue },
    { day: "3", title: "Extend & Customize", tag: "Common Core", focus: "Hooks, MCP servers, sub-agents, custom slash commands/skills, IDE integration (VS Code, JetBrains), CI/CD automation, headless mode, GitHub Actions, Agent SDK intro, building MCP servers", handson: "Build a hook, connect an MCP server, create a custom slash command", artifact: "Custom hook + MCP integration + slash command + integration architecture", milestone: "Build a custom hook, connect an MCP server, and create a slash command that extends Claude Code for a specific workflow", prework: "45 min", live: "45 min", lab: "75 min", color: C.green },
    { day: "4", title: "Role-Specific Scenarios", tag: "Role Breakouts", focus: "Content varies by role (PE Pre-Sales, PE Post-Sales, Solutions Architect, Applied Research), security model & best practices, competitive positioning, deployment architecture, customer objection handling", handson: "4 scenarios for the same company, each with different role-specific aspects — shows how each role connects to others in the org", artifact: "Role-specific deliverables: battlecards, deployment templates, security FAQs, demo scripts", milestone: "Apply Claude Code to a role-specific customer scenario and articulate security, positioning, and architecture decisions", prework: "45 min", live: "90 min", lab: "30 min", color: C.orange },
    { day: "5", title: "Ship It (Capstone)", tag: "Role-Specific", focus: "Selling Claude, blind brief matched to role, build a working demo/implementation from scratch, present to peers with feedback — integrates all Days 1\u20134 skills", handson: "Blind brief matched to role: decompose, build, present", artifact: "Capstone presentation + working demo + peer feedback", milestone: "Receive a cold customer brief, decompose it, and build a working demo from scratch under time pressure", integrated: "120 min", color: C.green },
  ];

  const dependencyChain = [
    { from: "Foundations", to: "Day 1", text: "Product knowledge means Day 1 goes straight to building" },
    { from: "Day 1", to: "Day 2", text: "Agentic loop understanding enables prompt steering" },
    { from: "Day 2", to: "Day 3", text: "CLAUDE.md conventions are prerequisites for hooks and MCP" },
    { from: "Day 3", to: "Day 4", text: "Technical depth gives credibility for customer conversations" },
    { from: "Day 4", to: "Day 5", text: "Conversation practice enables the capstone presentation" },
    { from: "Day 5", to: "Field", text: "Blind brief under pressure proves readiness for real customer engagements" },
  ];

  const competencyData = [
    { role: "PE Pre-Sales", color: C.orange, outcomes: [
      { day: "Day 1", text: "Run a live install for a prospect and walk them through their first agentic task. Show why this isn't autocomplete." },
      { day: "Day 2", text: "Write a CLAUDE.md for an unfamiliar repo during a live eval. The before/after output difference is the demo." },
      { day: "Day 3", text: "Sketch out an integration plan on the spot: which hooks, which MCP servers, what slash commands make sense for this customer." },
      { day: "Day 4", text: "Handle the hard questions. CISO wants to know about sandboxing, VP wants cost math, engineer asks why not just use Copilot. Zero factual errors." },
      { day: "Day 5", text: "Cold brief, 2 hours, working demo, clear next steps. This is the job." },
    ]},
    { role: "PE Post-Sales", color: C.blue, outcomes: [
      { day: "Day 1", text: "Get Claude Code running in a customer's environment. When something breaks during setup, fix it without losing the room." },
      { day: "Day 2", text: "Sit with a customer's team and help them write CLAUDE.md files that actually match their codebase and conventions." },
      { day: "Day 3", text: "Build a working hook, MCP server, and slash command in a customer's environment. Debug the integration when it doesn't work the first time." },
      { day: "Day 4", text: "Something's broken and the customer is watching. Diagnose it, fix it, and turn the save into a trust-building moment." },
      { day: "Day 5", text: "Take a customer brief and deliver a running system: configured environment, CLAUDE.md, integrations, and a README the team can actually follow." },
    ]},
    { role: "Solutions Architect", color: C.green, outcomes: [
      { day: "Day 1", text: "Explain what agentic coding actually means to a technical audience and connect it to their specific pain points." },
      { day: "Day 2", text: "Plan a CLAUDE.md hierarchy for a multi-team org: what goes at the root, what each team overrides, how it fits with their existing style guides." },
      { day: "Day 3", text: "Map out a phased rollout: start with 5 devs, expand to the team, go org-wide. Know which integrations to wire up at each stage." },
      { day: "Day 4", text: "Read a customer's org, find where Claude Code will have the most impact, and present an honest adoption roadmap with real timelines." },
      { day: "Day 5", text: "Blind brief to full adoption strategy: architecture diagram, phased rollout, cost projections, and what could go wrong. Present it like you mean it." },
    ]},
    { role: "Applied Research", color: C.muted, outcomes: [
      { day: "Day 1", text: "Trace a Claude Code session end-to-end: what tools it called, how it planned, where it recovered from errors. Flag where the model could do better." },
      { day: "Day 2", text: "Run a controlled experiment: same task with and without CLAUDE.md. Measure what changes in output quality and figure out why." },
      { day: "Day 3", text: "Build something real with the Agent SDK: chain two agents together, feed in a repo, get structured output. Research meets engineering." },
      { day: "Day 4", text: "Be honest about what Claude Code can and can't do today. Distinguish what's buildable with current APIs from what needs model-level changes." },
      { day: "Day 5", text: "Working prototype, evaluation harness, quantitative results, and a clear-eyed limitations section. Ship research that someone else can build on." },
    ]},
  ];

  return (
    <>
      {/* \u2500\u2500\u2500 1. DESIGN PRINCIPLES \u2500\u2500\u2500 */}
      <div style={{ ...sectionGap, ...st.fadeUp, animationDelay: "0.05s" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 8 }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: 42, color: C.orange, lineHeight: 1, opacity: 0.25 }}>01</span>
          <h2 style={headingStyle}>Design Principles</h2>
        </div>
        <div style={accentLine(C.orange)} />
        <p style={bodyStyle}>Four principles shape the curriculum architecture. For the learner-facing overview of daily structure and time commitments, see <strong>How It Works</strong> on the main hub.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
          {[
            { label: "Scenario-first learning", color: C.orange, desc: "Every day opens with a client problem, not a feature walkthrough. Learners practice the cognitive work of a real customer engagement from minute one." },
            { label: "Client scenario threading", color: C.blue, desc: "Five fictional companies across five days \u2014 Meridian Health, Lumen Logistics, Arcadia Financial, three Day 4 role-plays, and a blind capstone brief." },
            { label: "Scaffolded dependency chain", color: C.green, desc: "Each day\u2019s skills are prerequisites for the next. You can\u2019t steer Claude with CLAUDE.md (Day 2) without understanding the agentic loop (Day 1)." },
            { label: "One curriculum, four lenses", color: C.muted, desc: "All roles share the same technical foundation. Differentiation happens through competency framing, Day 4 breakouts, and role-matched capstone briefs." },
          ].map((p, i) => (
            <div key={i} style={{ padding: "16px 18px", borderRadius: 10, background: p.color + "06", border: `1px solid ${p.color}20` }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, color: p.color, textTransform: "uppercase", marginBottom: 8 }}>{p.label}</div>
              <p style={{ fontFamily: "var(--sans)", fontSize: 12.5, color: C.muted, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* \u2500\u2500\u2500 2. LEARNING MODALITIES \u2500\u2500\u2500 */}
      <div style={{ ...sectionGap, ...st.fadeUp, animationDelay: "0.12s" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 8 }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: 42, color: C.blue, lineHeight: 1, opacity: 0.25 }}>02</span>
          <h2 style={headingStyle}>Learning Modalities</h2>
        </div>
        <div style={accentLine(C.blue)} />
        <p style={bodyStyle}>Each day follows a three-part structure that moves from self-paced preparation to live, hands-on experience to independent practice.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Self-paced pre-work", color: C.blue, desc: "Readings and reference materials completed before the live session so participants arrive ready to build. Covers the conceptual foundation for the day\u2019s hands-on work." },
            { label: "Live instruction + lab", color: C.orange, desc: "Facilitator-led sessions with hands on keyboard. The goal is to get everyone actually experiencing the tool live and learning from one another in the room \u2014 not lecture." },
            { label: "Leave-behind references", color: C.green, desc: "Informational quick-guides given at the end of each session that recap content. Designed as field references participants can return to after the program ends." },
          ].map((m, i) => (
            <div key={i} style={{ padding: "16px 18px", borderRadius: 10, background: m.color + "06", border: `1px solid ${m.color}20` }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, color: m.color, textTransform: "uppercase", marginBottom: 8 }}>{m.label}</div>
              <p style={{ fontFamily: "var(--sans)", fontSize: 12.5, color: C.muted, lineHeight: 1.6, margin: 0 }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* \u2500\u2500\u2500 3. THE FIVE-DAY ARC \u2500\u2500\u2500 */}
      <div style={{ ...sectionGap, ...st.fadeUp, animationDelay: "0.15s" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 8 }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: 42, color: C.blue, lineHeight: 1, opacity: 0.25 }}>03</span>
          <h2 style={headingStyle}>The Five-Day Arc</h2>
        </div>
        <div style={accentLine(C.blue)} />
        <p style={bodyStyle}>Each day produces a concrete artifact and follows a pre-work → live → lab rhythm. The curriculum builds progressively from individual tool proficiency (Days 1–3) to customer-facing skills (Day 4) to integrated performance under pressure (Day 5).</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {dayArcData.map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "20px 0", borderBottom: i < 4 ? `1px solid ${C.lightGray}` : "none" }}>
              <div style={{ minWidth: 48, textAlign: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--serif)", fontSize: 22, color: d.color, lineHeight: 1 }}>{d.day}</span>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: C.faint, letterSpacing: 1, marginTop: 2 }}>DAY</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 500, color: C.dark }}>{d.title}</span>
                  {d.tag && <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: d.color, background: d.color + "10", padding: "2px 8px", borderRadius: 10 }}>{d.tag}</span>}
                </div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 12.5, color: C.muted, lineHeight: 1.55, marginBottom: 4 }}>{d.focus}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: C.faint, marginBottom: 4 }}>
                  <span style={{ color: d.color }}>Hands-on:</span> {d.handson}
                </div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 11, color: C.faint, marginBottom: 4 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 0.5, textTransform: "uppercase", color: C.muted }}>Produces:</span> {d.artifact}
                </div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 11, color: C.muted, marginBottom: 8, fontStyle: "italic" }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 0.5, textTransform: "uppercase", color: d.color, fontStyle: "normal" }}>Milestone:</span> {d.milestone}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {d.integrated ? (
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, padding: "3px 10px", borderRadius: 12, background: d.color + "10", color: d.color }}>Integrated session · {d.integrated}</span>
                  ) : (
                    <>
                      {d.prework && <span style={{ fontFamily: "var(--mono)", fontSize: 10, padding: "3px 10px", borderRadius: 12, background: C.blue + "10", color: C.blue }}>Pre-work · {d.prework}</span>}
                      <span style={{ fontFamily: "var(--mono)", fontSize: 10, padding: "3px 10px", borderRadius: 12, background: C.orange + "10", color: C.orange }}>Live · {d.live}</span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 10, padding: "3px 10px", borderRadius: 12, background: C.green + "10", color: C.green }}>Lab · {d.lab}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dependency chain */}
        <h3 style={subheadStyle}>How each day builds on the last</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {dependencyChain.map((link, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 12, padding: "10px 0 10px 12px", borderLeft: `2px solid ${C.blue}30` }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: C.blue, flexShrink: 0, minWidth: 100 }}>{link.from} {"\u2192"} {link.to}</span>
              <span style={{ fontFamily: "var(--sans)", fontSize: 12.5, color: C.muted, lineHeight: 1.5 }}>{link.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* \u2500\u2500\u2500 4. ROLE DIFFERENTIATION & COMPETENCY OUTCOMES \u2500\u2500\u2500 */}
      <div style={{ ...sectionGap, ...st.fadeUp, animationDelay: "0.25s" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 8 }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: 42, color: C.green, lineHeight: 1, opacity: 0.25 }}>04</span>
          <h2 style={headingStyle}>Role Differentiation & Competency Outcomes</h2>
        </div>
        <div style={accentLine(C.green)} />
        <p style={bodyStyle}>Basecamp serves four roles through a three-layer model: common foundation → shared technical sessions (Days 1–3) → role-specific breakouts (Day 4) and capstone briefs (Day 5). Day 3 introduces topics like CI/CD, headless mode, and Agent SDK that split slightly based on technical depth — these are important concepts for everyone to know, but more technical roles go deeper in hands-on exercises.</p>

        {/* Role matrix table */}
        <div style={{ margin: "20px 0 32px", borderRadius: 12, border: `1px solid ${C.lightGray}`, overflow: "hidden", background: C.bg }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.blue }}>
                {["Role", "Pre-Work", "Days 1\u20133", "Day 4 Breakout", "Day 5 Capstone"].map((h, i) => (
                  <th key={h} style={{ padding: "10px 14px", fontFamily: "var(--sans)", fontSize: 11, fontWeight: 600, color: "#fff", textAlign: i === 0 ? "left" : "center", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.15)" : "none" }}>{h}</th>
                ))}
              </tr>
              <tr>
                <td />
                <td colSpan={2} style={{ textAlign: "center", padding: "6px 0 0", fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", color: C.faint, borderLeft: `1px solid ${C.lightGray}` }}>Shared across all roles</td>
                <td colSpan={2} style={{ textAlign: "center", padding: "6px 0 0", fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", color: C.blue, borderLeft: `1px solid ${C.lightGray}` }}>Role-specific</td>
              </tr>
            </thead>
            <tbody>
              {[
                { role: "PE Pre-Sales", color: "#d97757", day4: "Competitive positioning", day4d: "Honest differentiation pitch", day5: "Demo-focused brief", day5d: "Compelling narrative + next-steps ask" },
                { role: "PE Post-Sales", color: "#788c5d", day4: "Deployment architecture", day4d: "Scoping & estimation", day5: "Implementation brief", day5d: "Technical depth + timeline" },
                { role: "Solutions Architect", color: "#6a9bcc", day4: "All scenarios", day4d: "Full customer conversation spectrum", day5: "Architecture brief", day5d: "Multi-team strategy + tradeoffs" },
                { role: "Applied Research", color: "#9b8ec4", day4: "Capability assessment", day4d: "Honest technical boundaries", day5: "Research brief", day5d: "Evaluation design + feasibility" },
              ].map((r, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? C.bg : C.cream }}>
                  <td style={{ padding: "12px 14px", fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600, color: C.dark, borderTop: `1px solid ${C.lightGray}`, verticalAlign: "middle", whiteSpace: "nowrap" }}>
                    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: r.color, marginRight: 8, verticalAlign: "middle" }} />
                    {r.role}
                  </td>
                  {i === 0 && (
                    <>
                      <td rowSpan={4} style={{ padding: "16px 14px", fontFamily: "var(--sans)", fontSize: 11, color: C.muted, lineHeight: 1.55, textAlign: "center", verticalAlign: "middle", borderTop: `1px solid ${C.lightGray}`, borderLeft: `1px solid ${C.lightGray}`, background: C.blue + "05" }}>
                        <div style={{ fontWeight: 600, color: C.dark, fontSize: 12, marginBottom: 6 }}>Common Foundation</div>
                        Mission &amp; values &middot; Product suite &middot; Claude Code architecture &middot; Security &amp; enterprise
                      </td>
                      <td rowSpan={4} style={{ padding: "16px 14px", fontFamily: "var(--sans)", fontSize: 11, color: C.muted, lineHeight: 1.55, textAlign: "center", verticalAlign: "middle", borderTop: `1px solid ${C.lightGray}`, borderLeft: `1px solid ${C.lightGray}`, background: C.blue + "05" }}>
                        <div style={{ fontWeight: 600, color: C.dark, fontSize: 12, marginBottom: 6 }}>Shared Technical Labs</div>
                        Install &middot; CLAUDE.md &middot; Prompt patterns &middot; Hooks &middot; MCP &middot; Composed workflows
                      </td>
                    </>
                  )}
                  <td style={{ padding: "10px 14px", fontFamily: "var(--sans)", fontSize: 11, color: C.muted, lineHeight: 1.45, borderTop: `1px solid ${C.lightGray}`, borderLeft: `1px solid ${C.lightGray}`, verticalAlign: "top" }}>
                    <div style={{ display: "inline-block", fontSize: 9, fontFamily: "var(--mono)", padding: "2px 7px", borderRadius: 4, background: r.color + "14", color: r.color, marginBottom: 4, fontWeight: 600 }}>{r.day4}</div>
                    <div>{r.day4d}</div>
                  </td>
                  <td style={{ padding: "10px 14px", fontFamily: "var(--sans)", fontSize: 11, color: C.muted, lineHeight: 1.45, borderTop: `1px solid ${C.lightGray}`, borderLeft: `1px solid ${C.lightGray}`, verticalAlign: "top" }}>
                    <div style={{ display: "inline-block", fontSize: 9, fontFamily: "var(--mono)", padding: "2px 7px", borderRadius: 4, background: r.color + "14", color: r.color, marginBottom: 4, fontWeight: 600 }}>{r.day5}</div>
                    <div>{r.day5d}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Competency outcomes */}
        <h3 style={subheadStyle}>Competency Outcomes by Role</h3>
        <p style={bodyStyle}>What each role should be able to do by the end of the program. Each outcome is tied to a specific day’s module.</p>

        {competencyData.map((group, gi) => (
          <div key={gi} style={{ marginBottom: 20, borderLeft: `3px solid ${group.color}`, borderRadius: 8, background: group.color + "04", padding: "16px 20px" }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 12 }}>
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: group.color, marginRight: 8, verticalAlign: "middle" }} />
              {group.role}
            </div>
            {group.outcomes.map((o, oi) => (
              <div key={oi} style={{ display: "flex", gap: 10, marginBottom: 8, paddingLeft: 4 }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: group.color, flexShrink: 0, minWidth: 38, paddingTop: 2 }}>{o.day}</span>
                <span style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.muted, lineHeight: 1.55 }}>{o.text}</span>
              </div>
            ))}
          </div>
        ))}

        {/* Handling skill variance */}
        <h3 style={subheadStyle}>Handling Varying Skill Levels</h3>
        <p style={bodyStyle}>If you think about the four roles as bell curves with slightly different midpoints based on technical fluency, different parts of the course spike with different groups at different times. The content can be consumed by everyone, but these mechanisms ensure no one is left behind or held back:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "\u201cGo deeper\u201d exercises", color: C.green, desc: "Every hands-on lab includes stretch prompts that let more experienced participants push further while others solidify fundamentals. The core exercise is accessible to all; the go-deeper path adds real complexity." },
            { label: "Strategic pairing", color: C.blue, desc: "Participants pair up with someone on the opposite end of the skill spectrum to teach and learn from each other, or pair with someone at the same level to explore together. Both configurations are valuable at different points in the week." },
            { label: "Three content depth levels", color: C.orange, desc: "Every content page has Simplified, Standard, and Engineer modes so participants of any background can access content at their comfort level. Facilitator guides include pacing notes for mixed-depth rooms." },
          ].map((item, i) => (
            <div key={i} style={{ padding: "14px 18px", background: C.cream, borderRadius: 10, border: `1px solid ${C.lightGray}` }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: item.color, marginBottom: 6 }}>{item.label}</div>
              <p style={{ fontFamily: "var(--sans)", fontSize: 12.5, color: C.muted, lineHeight: 1.55, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* \u2500\u2500\u2500 5. RATIONALE & TRADE-OFFS \u2500\u2500\u2500 */}
      <div style={{ ...sectionGap, ...st.fadeUp, animationDelay: "0.35s" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 8 }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: 42, color: C.blue, lineHeight: 1, opacity: 0.25 }}>05</span>
          <h2 style={headingStyle}>Rationale & Trade-offs</h2>
        </div>
        <div style={accentLine(C.blue)} />

        <h3 style={subheadStyle}>Why This Sequence</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Ground in Anthropic first", color: C.orange, text: "Participants are new to the company. Start by grounding everyone in Anthropic\u2019s mission, values, and the full product suite so they understand where Claude Code fits in the bigger picture before touching the tool." },
            { label: "Experience magic before selling it", color: C.blue, text: "We want people to experience the magic of Claude Code before it becomes their job to sell it. This creates product evangelists \u2014 missionaries \u2014 rather than metric-motivated mercenaries. Days 1\u20133 are pure building; customer-facing skills don\u2019t appear until Day 4." },
            { label: "Basics \u2192 applied, with natural skill spikes", color: C.green, text: "The four roles are bell curves with slightly different midpoints based on technical fluency. This means different parts of the course spike with different groups at different times. The content is accessible to everyone, but the \u201cgo deeper\u201d prompts are more or less relevant depending on who you are and where you are in the course." },
            { label: "Role-separated but cross-visible", color: C.orange, text: "Content is separated by role for Days 4\u20135, but the shared Days 1\u20133 deliberately expose everyone to concepts that may not be directly applicable to their day-to-day (e.g. CI/CD for non-technical roles). It\u2019s important to have awareness of what\u2019s out there rather than staying siloed." },
          ].map((r, i) => (
            <div key={i} style={{ padding: "14px 18px", background: C.cream, borderRadius: 10, border: `1px solid ${C.lightGray}` }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: r.color, marginBottom: 6 }}>{r.label}</div>
              <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.muted, lineHeight: 1.65, margin: 0 }}>{r.text}</p>
            </div>
          ))}
        </div>

        <h3 style={subheadStyle}>Key Trade-offs</h3>

        <div style={{ background: C.cream, borderRadius: 12, border: `1px solid ${C.lightGray}`, padding: "20px 24px", marginBottom: 16 }}>
          <h4 style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: C.dark, margin: "0 0 8px" }}>Shared Days 1\u20133 vs. earlier role divergence</h4>
          <p style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: C.muted, lineHeight: 1.72, margin: 0 }}>Shared sessions for the first three days despite different technical depths. The alternative \u2014 splitting into technical and non-technical tracks on Day 1 \u2014 would mean Pre-Sales PEs never build the hands-on depth needed to handle technical customer conversations. The three-tier content mode, \u201cgo deeper\u201d exercises, and strategic pairing mitigate the mixed-depth challenge without sacrificing depth for anyone.</p>
        </div>
        <div style={{ background: C.cream, borderRadius: 12, border: `1px solid ${C.lightGray}`, padding: "20px 24px", marginBottom: 16 }}>
          <h4 style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: C.dark, margin: "0 0 8px" }}>Student-focused Day 1 vs. customer scenarios from the start</h4>
          <p style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: C.muted, lineHeight: 1.72, margin: 0 }}>Day 1 hands-on tasks are about the student, not a customer scenario. This lets people experience Claude Code as a user first \u2014 feeling the product\u2019s value personally before they need to articulate it to someone else. Customer-facing scenarios begin on Day 4 once the technical foundation is solid.</p>
        </div>
        <div style={{ background: C.cream, borderRadius: 12, border: `1px solid ${C.lightGray}`, padding: "20px 24px", marginBottom: 16 }}>
          <h4 style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: C.dark, margin: "0 0 8px" }}>One company for Day 4 vs. separate scenarios per role</h4>
          <p style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: C.muted, lineHeight: 1.72, margin: 0 }}>All four Day 4 role breakouts use the same fictional company but with different role-specific aspects and instructions. This shows how each role connects to the others in a real org \u2014 a PE Pre-Sales pitch, a PE Post-Sales implementation plan, an SA architecture review, and an AR feasibility study all for the same customer.</p>
        </div>

        <h3 style={subheadStyle}>What I\u2019d Do Differently with More Time</h3>
        {[
          { label: "Video walkthroughs", text: "Pre-recorded facilitator demos for each module, so learners can watch the \u201cideal\u201d run before attempting it themselves." },
          { label: "Quantitative confidence measurement", text: "Add a 1\u20135 confidence self-rating before and after each module. Currently the knowledge checkpoints are qualitative." },
          { label: "Real MCP server for Day 3", text: "The current lab uses a mock Jira server. With more time, I\u2019d provision a real sandbox Jira instance." },
          { label: "Alumni community and feedback loop", text: "A Slack channel or Notion database where Basecamp graduates share field reports \u2014 what worked, what didn\u2019t, which customer scenarios came up that we didn\u2019t cover." },
          { label: "Adaptive difficulty", text: "Use the credential system to unlock advanced paths. Learners who complete all Day 1\u20133 badges with strong checkpoint scores could get an accelerated Day 4 with harder customer scenarios." },
          { label: "Async delivery", text: "The current design assumes a facilitated, synchronous cohort. For global teams, I\u2019d build an async-first version with video content, auto-graded exercises, and optional live office hours." },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, paddingLeft: 4 }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: C.blue, flexShrink: 0, paddingTop: 3 }}>{"\u2022"}</span>
            <p style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: C.muted, lineHeight: 1.72, margin: 0 }}><strong>{item.label}:</strong> {item.text}</p>
          </div>
        ))}
      </div>
    </>
  );
}
// ─── COHORT 1 FEEDBACK CONTENT (extracted from FeedbackResponsePage) ───
function CohortFeedbackContent() {
  return (
    <>
      {/* Q&A Sections */}
      {FEEDBACK_RESPONSE.map((section, si) => (
        <div key={section.id} style={{ marginBottom: 56, ...st.fadeUp, animationDelay: `${0.15 + si * 0.08}s` }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 20 }}>
            <span style={{ fontFamily: "var(--serif)", fontSize: 42, color: C.green, lineHeight: 1, opacity: 0.25, flexShrink: 0 }}>{section.number}</span>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 400, color: C.dark, margin: 0, lineHeight: 1.35 }}>{section.question}</h2>
          </div>
          <div style={{ marginBottom: 28, padding: "24px 24px", background: C.cream, borderRadius: 12, border: `1px solid ${C.lightGray}` }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: C.green, marginBottom: 16 }}>Analysis based on course best practices & data</div>
            {section.answer ? section.answer.map((block, bi) => {
              if (block.type === "heading") {
                return <h3 key={bi} style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: C.dark, margin: bi === 0 ? "0 0 8px" : "20px 0 8px", lineHeight: 1.4 }}>{block.text}</h3>;
              }
              return <p key={bi} style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: C.muted, lineHeight: 1.7, margin: "0 0 12px" }}>{block.text}</p>;
            }) : section.items && section.items.map((item, ii) => (
              <div key={ii} style={{ marginBottom: 16 }}>
                <h3 style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: C.dark, margin: "0 0 6px", lineHeight: 1.4 }}>{item.problem}</h3>
                <p style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: C.muted, lineHeight: 1.7, margin: 0 }}>{item.analysis}</p>
              </div>
            ))}
          </div>
          {section.addressed && section.addressed.length > 0 && <div style={{ marginBottom: 8 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: C.orange, marginBottom: 14 }}>How this has been addressed in the current program</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {section.addressed.map((item, ai) => (
                <div key={ai} style={{ background: C.bg, borderRadius: 10, border: `1px solid ${C.lightGray}`, borderLeft: `3px solid ${C.orange}`, overflow: "hidden" }}>
                  <div style={{ padding: "16px 20px" }}>
                    <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 500, color: C.dark, marginBottom: 6 }}>{item.label}</div>
                    <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.muted, lineHeight: 1.6, margin: "0 0 12px" }}>{item.detail}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {item.refs.map((ref, ri) => (
                        <div key={ri} style={{ display: "flex", gap: 10, padding: "8px 12px", background: C.cream, borderRadius: 6 }}>
                          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: C.orange, flexShrink: 0, minWidth: 8, marginTop: 2 }}>→</span>
                          <div>
                            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: C.dark, marginBottom: 2 }}>{ref.loc}</div>
                            <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.faint, lineHeight: 1.5 }}>{ref.what}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>}
        </div>
      ))}

    </>
  );
}

// ─── FEEDBACK RESPONSE PAGE COMPONENT ───
function FeedbackResponsePage({ onBack }) {
  return (
    <div style={st.container}>
      <button onClick={onBack} style={st.navBtn}>{"←"} Back</button>
      <div style={{ ...st.fadeUp, marginTop: 16 }}>
        <div style={st.eyebrow}>Interview questions</div>
        <div style={{ height: 2, width: 48, background: C.green, margin: "16px 0 32px", borderRadius: 1 }} />
        <h1 style={{ ...st.heroTitle, fontSize: 36 }}>Interview<br /><span style={{ color: C.green }}>questions.</span></h1>
        <p style={st.heroBody}>
          Analysis of Cohort 1 program feedback (NPS: 35, n=17). Each section pairs a diagnosed problem with the data behind it and the specific program change that addresses it.
        </p>
      </div>


      {/* Sections */}
      {FEEDBACK_RESPONSE.map((section, si) => (
        <div key={section.id} style={{ marginBottom: 56, ...st.fadeUp, animationDelay: `${0.15 + si * 0.08}s` }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 24 }}>
            <span style={{ fontFamily: "var(--serif)", fontSize: 42, color: C.green, lineHeight: 1, opacity: 0.25, flexShrink: 0 }}>{section.number}</span>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 400, color: C.dark, margin: 0, lineHeight: 1.35 }}>{section.question}</h2>
          </div>

          {/* Problem → Analysis → Implementation blocks */}
          {section.items.map((item, ii) => (
            <div key={ii} style={{ marginBottom: 28 }}>
              {/* Problem heading */}
              <h3 style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 600, color: C.dark, margin: "0 0 10px" }}>{item.problem}</h3>

              {/* Analysis */}
              <div style={{ padding: "16px 20px", background: C.cream, borderRadius: 10, border: `1px solid ${C.lightGray}`, marginBottom: 12 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: C.green, marginBottom: 8 }}>What the data says</div>
                <p style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: C.muted, lineHeight: 1.7, margin: 0 }}>{item.analysis}</p>
              </div>

              {/* Implementation */}
              {item.implementation && (
              <div style={{ padding: "16px 20px", background: C.bg, borderRadius: 10, border: `1px solid ${C.lightGray}`, borderLeft: `3px solid ${C.orange}` }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: C.orange, marginBottom: 8 }}>What we changed</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 500, color: C.dark, marginBottom: 4 }}>{item.implementation.label}</div>
                <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.muted, lineHeight: 1.6, margin: 0 }}>{item.implementation.detail}</p>
              </div>
              )}
            </div>
          ))}

          {/* Signal vs noise (section 1 only) */}
          {section.signalVsNoise && (
            <div style={{ padding: "16px 20px", background: C.green + "06", borderRadius: 10, border: `1px solid ${C.green}20`, marginTop: 8 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: C.green, marginBottom: 8 }}>Signal vs. noise</div>
              <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.muted, lineHeight: 1.6, margin: 0 }}>{section.signalVsNoise}</p>
            </div>
          )}

          {/* Summary (section 3 only) */}
          {section.summary && (
            <div style={{ padding: "16px 20px", background: C.green + "06", borderRadius: 10, border: `1px solid ${C.green}20`, marginTop: 8 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: C.green, marginBottom: 8 }}>Success in one sentence</div>
              <p style={{ fontFamily: "var(--serif)", fontSize: 15, color: C.dark, lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>{section.summary}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── MAIN APP ───
export default function App() {
  const [phase, setPhase] = useState("loading");
  const [foundationStep, setFoundationStep] = useState(0);
  const [path, setPath] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [completed, setCompleted] = useState(new Set());
  const [foundationsDone, setFoundationsDone] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);
  const [contentMode, setContentMode] = useState("standard");
  const [diagnosticResults, setDiagnosticResults] = useState({});
  const [showDiagnosticQuiz, setShowDiagnosticQuiz] = useState(null);
  const [facilitatorModule, setFacilitatorModule] = useState(null);
  const [subPage, setSubPage] = useState(-1); // -1 = main content, 0+ = pages index
  const [initialMaterialId, setInitialMaterialId] = useState(null); // for deep-linking into materials
  const [materialsReturnTo, setMaterialsReturnTo] = useState(null); // { phase, moduleId } for back navigation
  const [deliverableTab, setDeliverableTab] = useState("part1"); // "part1" or "cohort1"
  const [menuOpen, setMenuOpen] = useState(false);
  const [showOutcomesModal, setShowOutcomesModal] = useState(false);
  const [foundationsViewContext, setFoundationsViewContext] = useState("orientation"); // "orientation" | "contextual"
  const contentRef = useRef(null);

  // Gamification state
  const [userName, setUserName] = useState(null);
  const [foundationSectionsViewed, setFoundationSectionsViewed] = useState([]);
  const [moduleSubProgress, setModuleSubProgress] = useState({});
  const [checkpointsCompleted, setCheckpointsCompleted] = useState([]);
  const [certificateEarnedDate, setCertificateEarnedDate] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [activePhaseTab, setActivePhaseTab] = useState(null);
  const [preworkCompleted, setPreworkCompleted] = useState([]);

  useEffect(() => {
    const data = loadProgress();
    const orientationDone = data.foundationsDone || isOrientationComplete(data.foundationSectionsViewed || []);
    if (orientationDone) setFoundationsDone(true);
    if (data.path) setPath(data.path);
    if (data.completed?.length) setCompleted(new Set(data.completed));
    if (data.userName) setUserName(data.userName);
    if (data.foundationSectionsViewed?.length) setFoundationSectionsViewed(data.foundationSectionsViewed);
    if (data.moduleSubProgress) setModuleSubProgress(data.moduleSubProgress);
    if (data.checkpointsCompleted?.length) setCheckpointsCompleted(data.checkpointsCompleted);
    if (data.certificateEarnedDate) setCertificateEarnedDate(data.certificateEarnedDate);
    if (data.preworkCompleted?.length) setPreworkCompleted(data.preworkCompleted);
    if (data.diagnosticResults) setDiagnosticResults(data.diagnosticResults);
    // Check for hash-based deep link
    const hash = window.location.hash.replace("#", "");
    const hashPhases = ["facilitator", "materials", "deliverables", "feedback-response"];
    if (hash && hashPhases.includes(hash)) {
      setPhase(hash);
    } else if (orientationDone && data.path) setPhase("hub");
    else if (orientationDone) setPhase("path-select");
    else setPhase("welcome");
  }, []);

  useEffect(() => {
    if (phase === "loading") return;
    saveProgress({
      foundationsDone, path, completed: [...completed],
      userName, foundationSectionsViewed, moduleSubProgress,
      checkpointsCompleted, certificateEarnedDate, preworkCompleted, diagnosticResults,
    });
  }, [foundationsDone, path, completed, phase, userName, foundationSectionsViewed, moduleSubProgress, checkpointsCompleted, certificateEarnedDate, preworkCompleted, diagnosticResults]);

  const activeFoundations = foundationsViewContext === "orientation" ? ORIENTATION_FOUNDATIONS : FOUNDATIONS;

  const sidebarNav = useMemo(() => {
    if (foundationsViewContext !== "orientation") return [];
    const items = [];
    const welcomeIdx = activeFoundations.findIndex(f => f.id === "welcome");
    if (welcomeIdx >= 0) items.push({ id: "welcome", label: "Welcome", group: "Anthropic", foundationStep: welcomeIdx, subPage: -1 });
    const prodIdx = activeFoundations.findIndex(f => f.id === "products");
    if (prodIdx >= 0) {
      const platformIds = ["claude-ai", "cowork", "claude-code", "model-family", "extensions"];
      const deepIds = ["how-to-use", "who-uses-it", "what-it-costs", "how-it-thinks"];
      activeFoundations[prodIdx].pages?.forEach((p, pi) => {
        if (platformIds.includes(p.id)) items.push({ id: p.id, label: p.label, group: "Platform", foundationStep: prodIdx, subPage: pi });
      });
      activeFoundations[prodIdx].pages?.forEach((p, pi) => {
        if (deepIds.includes(p.id)) items.push({ id: p.id, label: p.label, group: "Claude Code", foundationStep: prodIdx, subPage: pi });
      });
    }
    return items;
  }, [activeFoundations, foundationsViewContext]);

  // Track foundation section views (including sub-pages)
  useEffect(() => {
    if (phase === "foundations" && !showMethodology) {
      const foundation = activeFoundations[foundationStep];
      const sectionId = foundation?.id;
      if (sectionId && !foundationSectionsViewed.includes(sectionId)) {
        setFoundationSectionsViewed(prev => [...prev, sectionId]);
      }
      if (subPage >= 0 && foundation?.pages?.[subPage]) {
        const subId = foundation.pages[subPage].id;
        if (subId && !foundationSectionsViewed.includes(subId)) {
          setFoundationSectionsViewed(prev => [...prev, subId]);
        }
      }
    }
  }, [phase, foundationStep, showMethodology, subPage, activeFoundations]);

  // Track module sub-progress when opening a module
  useEffect(() => {
    if (phase === "module" && activeModule && !moduleSubProgress[activeModule] && !completed.has(activeModule)) {
      setModuleSubProgress(prev => ({ ...prev, [activeModule]: "started" }));
    }
  }, [phase, activeModule]);

  // Show week-long diagnostic quiz on Day 1, restore mode on any day
  useEffect(() => {
    if (phase === "module" && activeModule) {
      if (diagnosticResults.week) {
        setContentMode(diagnosticResults.week.chosenMode || "standard");
      } else if (activeModule === 1) {
        setShowDiagnosticQuiz("week");
      }
    }
  }, [phase, activeModule]);

  const handleDiagnosticComplete = useCallback((chosenMode, answers, score) => {
    const recommendation = score <= 3 ? "simplified" : score <= 5 ? "standard" : "engineer";
    setDiagnosticResults(prev => ({
      ...prev,
      week: {
        score,
        maxScore: 8,
        recommendation,
        chosenMode,
        answers,
        completedAt: new Date().toISOString(),
      },
    }));
    setContentMode(chosenMode);
    setShowDiagnosticQuiz(null);
  }, []);

  // Auto-set the default phase tab when opening a module
  useEffect(() => {
    if (phase === "module" && activeModule) {
      const config = DAY_PHASE_CONFIG[activeModule];
      const prework = DAY_PREWORK[activeModule];
      if (config?.mode === "integrated") {
        setActivePhaseTab("integrated");
      } else if (prework && !preworkCompleted.includes(activeModule)) {
        setActivePhaseTab("prework");
      } else if (prework) {
        setActivePhaseTab("live");
      } else {
        setActivePhaseTab("live");
      }
    }
  }, [phase, activeModule]);

  // Derived skills computation
  const earnedSkills = useMemo(() => {
    const skills = [];
    completed.forEach(modId => {
      const mod = MODULES.find(m => m.id === modId);
      (SKILL_CREDENTIALS[modId] || []).forEach(badge =>
        skills.push({ name: badge.name, icon: badge.icon, desc: badge.desc, color: mod?.color || C.orange, source: "module" })
      );
    });
    return skills;
  }, [completed]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [foundationStep, phase, activeModule, showMethodology, subPage, facilitatorModule]);

  // Sync URL hash with phase for shareable links
  useEffect(() => {
    if (phase === "loading") return;
    const hashPhases = ["facilitator", "materials", "deliverables", "feedback-response"];
    if (hashPhases.includes(phase)) {
      window.history.replaceState(null, "", "#" + phase);
    } else {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, [phase]);

  // Bridge for inline material references in steps
  if (typeof window !== "undefined") {
    window.__openMaterial = (materialId) => {
      setMaterialsReturnTo({ phase, moduleId: activeModule });
      setInitialMaterialId(materialId);
      setPhase("materials");
    };
  }

  if (phase === "loading") return <div style={{ minHeight: "100vh", background: C.bg }} />;

  const progress = Math.round((completed.size / MODULES.length) * 100);
  const currentFoundation = activeFoundations[foundationStep];

  const navigateTo = (target, opts = {}) => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
    if (opts.deliverableTab) setDeliverableTab(opts.deliverableTab);
    setPhase(target);
  };

  return (
    <div style={st.page} ref={contentRef}>
      {/* ═══ MENU BUTTON ═══ */}
      <button
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
        style={{
          position: "fixed", top: 16, left: 16, zIndex: 9999,
          width: 36, height: 36, borderRadius: 8,
          background: C.cream, border: `1px solid ${C.lightGray}`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
          cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        {[0, 1, 2].map(i => <div key={i} style={{ width: 16, height: 1.5, background: C.muted, borderRadius: 1 }} />)}
      </button>

      {/* ═══ SIDEBAR OVERLAY ═══ */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 10000 }}>
          {/* Backdrop */}
          <div onClick={() => setMenuOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(20,20,19,0.35)", transition: "opacity 0.2s" }} />
          {/* Sidebar */}
          <nav style={{
            position: "absolute", top: 0, left: 0, bottom: 0, width: 280,
            background: C.bg, borderRight: `1px solid ${C.lightGray}`,
            display: "flex", flexDirection: "column", padding: "24px 0",
            boxShadow: "4px 0 24px rgba(0,0,0,0.08)",
            animation: "slideIn 0.2s ease",
          }}>
            {/* Header */}
            <div style={{ padding: "0 24px 20px", borderBottom: `1px solid ${C.lightGray}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: C.faint }}>Basecamp</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu" style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: C.muted, fontSize: 18, lineHeight: 1 }}>&times;</button>
            </div>

            {/* Nav items */}
            <div style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
              {[
                { label: "Home", phase: "welcome", color: C.orange, active: phase === "welcome" },
                { label: "Course Structure", phase: "how-it-works", color: C.blue, active: phase === "how-it-works" },
                { label: "Foundations", phase: "foundations", color: C.green, active: phase === "foundations", onNav: () => { setFoundationsViewContext("orientation"); navigateTo("foundations"); } },
                { label: "Role-Based Training", phase: "path-select", color: C.orange, active: phase === "hub" || phase === "module" || phase === "path-select" },
              ].map((item, idx) => (
                <button
                  key={item.phase}
                  onClick={() => item.onNav ? item.onNav() : navigateTo(item.phase)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "12px 24px", background: item.active ? item.color + "08" : "transparent",
                    border: "none", borderLeft: item.active ? `3px solid ${item.color}` : "3px solid transparent",
                    cursor: "pointer", textAlign: "left",
                  }}
                >
                  <span style={{ fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600, color: item.color, flexShrink: 0, width: 16 }}>{idx + 1}.</span>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: item.active ? 600 : 400, color: item.active ? C.dark : C.muted }}>{item.label}</span>
                </button>
              ))}
              <div style={{ borderBottom: `1px solid ${C.lightGray}`, margin: "8px 0" }} />
              {[
                { label: "Resource Library", phase: "materials", color: C.green, active: phase === "materials" },
                // { label: "Facilitator Guide", phase: "facilitator", color: C.gray, active: phase === "facilitator" },
              ].map(item => (
                <button
                  key={item.phase}
                  onClick={() => item.onNav ? item.onNav() : navigateTo(item.phase)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "12px 24px", background: item.active ? item.color + "08" : "transparent",
                    border: "none", borderLeft: item.active ? `3px solid ${item.color}` : "3px solid transparent",
                    cursor: "pointer", textAlign: "left",
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: item.active ? 600 : 400, color: item.active ? C.dark : C.muted }}>{item.label}</span>
                </button>
              ))}

              {/* Take Home Questions — expandable */}
              <div style={{ marginTop: 4 }}>
                <button
                  onClick={() => navigateTo("deliverables", { deliverableTab: "part1" })}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "12px 24px", background: phase === "deliverables" ? C.orange + "08" : "transparent",
                    border: "none", borderLeft: phase === "deliverables" ? `3px solid ${C.orange}` : "3px solid transparent",
                    cursor: "pointer", textAlign: "left",
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.orange, flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: phase === "deliverables" ? 600 : 400, color: phase === "deliverables" ? C.dark : C.muted }}>Take Home Questions</span>
                </button>
                {/* Sub-items */}
                {[
                  { label: "Curriculum Overview", tab: "part1" },
                  { label: "Cohort 1 Feedback Analysis", tab: "cohort1" },
                ].map(sub => (
                  <button
                    key={sub.tab}
                    onClick={() => navigateTo("deliverables", { deliverableTab: sub.tab })}
                    style={{
                      display: "block", width: "100%", padding: "8px 24px 8px 52px",
                      background: phase === "deliverables" && deliverableTab === sub.tab ? C.cream : "transparent",
                      border: "none", cursor: "pointer", textAlign: "left",
                      fontFamily: "var(--sans)", fontSize: 12, color: phase === "deliverables" && deliverableTab === sub.tab ? C.dark : C.faint,
                      fontWeight: phase === "deliverables" && deliverableTab === sub.tab ? 500 : 400,
                    }}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              {/* Methodology — hidden
              <button
                onClick={() => { setMenuOpen(false); setShowMethodology(true); setPhase("foundations"); window.scrollTo({ top: 0, behavior: "instant" }); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "12px 24px", background: showMethodology && phase === "foundations" ? C.gray + "10" : "transparent",
                  border: "none", borderLeft: showMethodology && phase === "foundations" ? `3px solid ${C.gray}` : "3px solid transparent",
                  cursor: "pointer", textAlign: "left", marginTop: 4,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.gray, flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: showMethodology && phase === "foundations" ? 600 : 400, color: showMethodology && phase === "foundations" ? C.dark : C.muted }}>Methodology</span>
              </button>
              */}
            </div>
          </nav>
        </div>
      )}

      {/* ═══ NAME INPUT MODAL ═══ */}
      {showNameInput && (
        <NameInputModal
          onSubmit={(name) => {
            setUserName(name);
            setShowNameInput(false);
            const date = certificateEarnedDate || new Date().toISOString();
            setCertificateEarnedDate(date);
            setShowCertificate(true);
          }}
          onSkip={() => {
            setShowNameInput(false);
            const date = certificateEarnedDate || new Date().toISOString();
            setCertificateEarnedDate(date);
            setShowCertificate(true);
          }}
        />
      )}

      {/* ═══ COMPLETION CERTIFICATE ═══ */}
      {showCertificate && certificateEarnedDate && (
        <CompletionCertificate
          userName={userName}
          path={path}
          earnedSkills={earnedSkills}
          date={certificateEarnedDate}
          onClose={() => setShowCertificate(false)}
        />
      )}

      {/* ═══ WELCOME ═══ */}
      {phase === "welcome" && (
        <div style={st.container}>
          <div style={{ ...st.fadeUp, animationDelay: "0s" }}>
            <div style={st.eyebrow}>Anthropic · Basecamp</div>
            <div style={{ height: 2, width: 48, background: C.orange, margin: "16px 0 36px", borderRadius: 1 }} />
          </div>
          <div style={{ ...st.fadeUp, animationDelay: "0.2s" }}>
            <h1 style={st.heroTitle}>Claude Code<br /><span style={{ color: C.orange }}>basecamp.</span></h1>
            <p style={st.heroBody}>After this week, you'll be able to demo Claude Code to a customer, handle their toughest objections, and build working integrations on the spot. Five days of hands-on modules — you'll build real things at every step, from your first agentic task to a capstone presentation under time pressure.</p>
          </div>
          <div style={{ margin: "36px 0 40px", display: "flex", gap: 10, flexWrap: "wrap", ...st.fadeUp, animationDelay: "0.3s" }}>
            {["PE Pre-Sales", "PE Post-Sales", "Solutions Architects", "Applied Research"].map((role, i) => (
              <span key={i} style={{ fontFamily: "var(--mono)", fontSize: 10, padding: "5px 12px", borderRadius: 16, border: `1px solid ${C.lightGray}`, color: C.muted }}>{role}</span>
            ))}
          </div>
          {/* 5-day arc */}
          <div style={{ margin: "0 0 36px", ...st.fadeUp, animationDelay: "0.33s" }}>
            <svg width="100%" viewBox="0 0 500 50" style={{ display: "block", maxWidth: 480 }}>
              {[{ label: "Install", x: 30 }, { label: "Prompt", x: 145 }, { label: "Extend", x: 260 }, { label: "Position", x: 375 }, { label: "Ship", x: 480 }].map((d, i) => (
                <g key={i}>
                  <circle cx={d.x} cy="14" r="5" fill={C.orange + "30"} stroke={C.orange} strokeWidth="1" />
                  <text x={d.x} y="38" textAnchor="middle" fill={C.muted} fontSize="10" fontFamily="IBM Plex Sans, sans-serif">{d.label}</text>
                  <text x={d.x} y="17" textAnchor="middle" dominantBaseline="central" fill={C.orange} fontSize="7" fontFamily="IBM Plex Mono, monospace">{i + 1}</text>
                  {i < 4 && <line x1={d.x + 8} y1="14" x2={[145, 260, 375, 480][i] - 8} y2="14" stroke={C.lightGray} strokeWidth="1" />}
                </g>
              ))}
            </svg>
          </div>

          <div style={{ ...st.quoteBlock, margin: "0 0 44px", ...st.fadeUp, animationDelay: "0.38s" }}>
            <p style={st.quoteText}>"The most powerful thing about Claude Code isn't what it can do alone — it's how it transforms the way engineering teams think about what's possible."</p>
          </div>
          <div style={{ ...st.fadeUp, animationDelay: "0.5s" }}>
            <button onClick={() => setPhase("how-it-works")} style={st.primaryBtn}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >How this course works →</button>
            <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: C.faint, marginTop: 12 }}>~20 min orientation · then 5 days of hands-on modules</p>
          </div>
        </div>
      )}

      {/* ═══ HOW IT WORKS ═══ */}
      {phase === "how-it-works" && (
        <div style={st.container}>
          <div style={{ ...st.fadeUp, animationDelay: "0s" }}>
            <button onClick={() => setPhase("welcome")} style={st.navBtn}>← Back</button>
          </div>
          <div style={{ ...st.fadeUp, animationDelay: "0.05s", marginTop: 20 }}>
            <div style={st.eyebrow}>Program structure</div>
            <div style={{ height: 2, width: 48, background: C.orange, margin: "16px 0 28px", borderRadius: 1 }} />
            <h1 style={{ ...st.heroTitle, fontSize: 36 }}>How this<br /><span style={{ color: C.orange }}>course works.</span></h1>
            <p style={st.heroBody}>A week-long program in three layers: a shared orientation, a role you choose, and five days of building real things.</p>
          </div>

          {/* ── THREE-LAYER OVERVIEW ── */}
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 0, ...st.fadeUp, animationDelay: "0.15s" }}>
            {[
              { num: "1", label: "Orientation", color: C.orange, desc: "Everyone starts with the same base. Self-paced readings on Anthropic, the product stack, and how Claude Code works. Configuration, security, and enterprise topics are covered as prework for the days that use them.", time: "~20 min self-paced" },
              { num: "2", label: "Choose your role", color: C.blue, desc: "Select the lens that matches your job: PE Pre-Sales, PE Post-Sales, Solutions Architect, or Applied Research. Same technical content, different practice scenarios and deliverables.", time: "4 roles available" },
              { num: "3", label: "Five-day learning path", color: C.green, desc: "One module per day, each building on the last. Every day has three parts: self-directed pre-work, a facilitator-led live session, and a hands-on lab. You finish the week with a capstone presentation under time pressure.", time: "5 days" },
            ].map((layer, i) => (
              <div key={i} style={{
                display: "flex", gap: 16, padding: "20px 0",
                borderBottom: i < 2 ? `1px solid ${C.lightGray}` : "none",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  background: layer.color + "12", border: `1.5px solid ${layer.color}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--mono)", fontSize: 13, fontWeight: 600, color: layer.color,
                }}>
                  {layer.num}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 500, color: C.dark }}>{layer.label}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: layer.color }}>{layer.time}</span>
                  </div>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: C.muted, lineHeight: 1.6, margin: 0 }}>{layer.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── DAILY RHYTHM ── */}
          <div style={{ ...st.fadeUp, animationDelay: "0.25s" }}>
            <h2 style={st.sectionHeading}>The daily rhythm</h2>
            <p style={{ ...st.bodyText, marginBottom: 20 }}>Each day follows the same three-part structure. You read before, practice together, then build on your own.</p>

            <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
              {[
                { label: "Pre-work", icon: "01", color: C.blue, desc: "Self-paced readings from the foundations and reference materials. Done before the live session so you arrive ready to build." },
                { label: "Live session", icon: "02", color: C.orange, desc: "Facilitator-led demo with hands on keyboard. The goal is to get everyone actually experiencing the tool live and learning from one another in the room." },
                { label: "Lab", icon: "03", color: C.green, desc: "Hands-on practice on the same sample repos. \"Go deeper\" prompts let more experienced participants push further. Informational quick-guides recap each session as leave-behind reference materials." },
              ].map((part, i) => (
                <div key={i} style={{
                  flex: 1, padding: "16px 14px", borderRadius: 10,
                  background: part.color + "06", border: `1px solid ${part.color}20`,
                }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, color: part.color, textTransform: "uppercase", marginBottom: 8 }}>{part.label}</div>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.muted, lineHeight: 1.55, margin: 0 }}>{part.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── WEEK AT A GLANCE ── */}
          <div style={{ ...st.fadeUp, animationDelay: "0.35s" }}>
            <h2 style={st.sectionHeading}>Your week at a glance</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { day: "Day 1", title: "First contact", focus: "What is Claude Code, installation, agentic loop, context window, tools, permissions", swbat: "Set up Claude Code, begin to create with it", milestone: "Independently install, configure, and complete a multi-step agentic task", tag: "Common Core", prework: "30 min", live: "45 min", lab: "45 min", color: C.orange },
                { day: "Day 2", title: "Prompt craft", focus: "CLAUDE.md files, settings, CLI flags, plan mode, slash commands, keyboard shortcuts, session management, prompt patterns", swbat: "Customize Claude Code and work more effectively with it", milestone: "Write effective CLAUDE.md files and use plan mode, slash commands, and prompt patterns to steer output", tag: "Common Core", prework: "30 min", live: "60 min", lab: "60 min", color: C.blue },
                { day: "Day 3", title: "Extend & customize", focus: "Hooks, MCP servers, sub-agents, custom slash commands, IDE integration, CI/CD automation, headless mode, Agent SDK", swbat: "Connect outside data sources, further customize for more advanced workflows", milestone: "Build a custom hook, connect an MCP server, and create a slash command that extends Claude Code for a specific workflow", tag: "Common Core", prework: "45 min", live: "45 min", lab: "75 min", color: C.green },
                { day: "Day 4", title: "Role-specific scenarios", focus: "Role breakouts, security model, competitive positioning, deployment architecture, customer objection handling", swbat: "Connect Claude Code to their role and what their customers may need or use it for", milestone: "Apply Claude Code to a role-specific customer scenario and articulate security, positioning, and architecture decisions", tag: "Role Breakouts", prework: "45 min", live: "90 min", lab: "30 min", color: C.orange },
                { day: "Day 5", title: "Capstone — Ship it", focus: "Selling Claude, blind brief matched to role, build working demo, present to peers with feedback", swbat: "Break customer problem down, identify relevant Claude Code tools, and build custom solution on the fly", milestone: "Receive a cold customer brief, decompose it, and build a working demo from scratch under time pressure", tag: "Role-Specific", prework: null, live: null, lab: null, integrated: "120 min", color: C.green },
              ].map((d, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 16, padding: "16px 0",
                  borderBottom: i < 4 ? `1px solid ${C.lightGray}` : "none",
                }}>
                  <div style={{ minWidth: 48, textAlign: "center" }}>
                    <span style={{ fontFamily: "var(--serif)", fontSize: 22, color: d.color, lineHeight: 1 }}>{d.day.split(" ")[1]}</span>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: C.faint, letterSpacing: 1, marginTop: 2 }}>{d.day.split(" ")[0].toUpperCase()}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 500, color: C.dark, marginBottom: 2 }}>{d.title}</div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: 12.5, color: C.muted, lineHeight: 1.5, marginBottom: 4 }}>{d.focus}</div>
                    {d.swbat && <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: d.color, marginBottom: 4, letterSpacing: 0.3 }}>{d.swbat}</div>}
                    {d.milestone && <div style={{ fontFamily: "var(--sans)", fontSize: 11, color: C.muted, marginBottom: 6, lineHeight: 1.4, fontStyle: "italic" }}>Milestone: {d.milestone}</div>}
                    {d.tag && <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: d.color, background: d.color + "10", padding: "2px 8px", borderRadius: 10, marginBottom: 8, display: "inline-block" }}>{d.tag}</span>}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {d.integrated ? (
                        <span style={{ fontFamily: "var(--mono)", fontSize: 10, padding: "3px 10px", borderRadius: 12, background: d.color + "10", color: d.color }}>Integrated session · {d.integrated}</span>
                      ) : (
                        <>
                          {d.prework && <span style={{ fontFamily: "var(--mono)", fontSize: 10, padding: "3px 10px", borderRadius: 12, background: C.blue + "10", color: C.blue }}>Pre-work · {d.prework}</span>}
                          {d.live && <span style={{ fontFamily: "var(--mono)", fontSize: 10, padding: "3px 10px", borderRadius: 12, background: C.orange + "10", color: C.orange }}>Live · {d.live}</span>}
                          {d.lab && <span style={{ fontFamily: "var(--mono)", fontSize: 10, padding: "3px 10px", borderRadius: 12, background: C.green + "10", color: C.green }}>Lab · {d.lab}</span>}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── AUDIENCE DIFFERENTIATION ── */}
          <div style={{ ...st.fadeUp, animationDelay: "0.45s" }}>
            <h2 style={st.sectionHeading}>Audience differentiation</h2>

            {/* Divergence diagram */}
            <div style={{ display: "flex", gap: 0, marginBottom: 16 }}>
              {[
                { days: "Days 1\u20132", label: "Common Core", color: C.blue, desc: "Shared by all roles" },
                { days: "Day 3", label: "Common Core +", color: C.green, desc: "Shared, with technical depth options" },
                { days: "Days 4\u20135", label: "Role-Specific", color: C.orange, desc: "Breakouts by role" },
              ].map((seg, i) => (
                <div key={i} style={{
                  flex: i === 1 ? 0.8 : 1, padding: "12px 14px", textAlign: "center",
                  background: seg.color + "08", borderTop: `3px solid ${seg.color}`,
                  borderRight: i < 2 ? `1px solid ${C.lightGray}` : "none",
                }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 600, color: seg.color, marginBottom: 4 }}>{seg.days}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 500, color: C.dark, marginBottom: 2 }}>{seg.label}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 11, color: C.muted }}>{seg.desc}</div>
                </div>
              ))}
            </div>

            <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.muted, lineHeight: 1.6, margin: "0 0 16px" }}>
              Everyone goes through the same five modules. Your role determines the practice scenarios, deliverables, and competencies. Day 3 introduces topics like CI/CD and Agent SDK that are important for everyone to know, but more technical roles go deeper in hands-on exercises. Days 4\u20135 fully diverge with role-specific scenarios.
            </p>

            <div style={{ padding: "14px 18px", background: C.cream, borderRadius: 10, border: `1px solid ${C.lightGray}` }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: C.green, marginBottom: 8 }}>Handling varying skill levels</div>
              <p style={{ fontFamily: "var(--sans)", fontSize: 12.5, color: C.muted, lineHeight: 1.55, margin: "0 0 8px" }}>
                <strong style={{ color: C.dark }}>"Go deeper" exercises</strong> — Every hands-on lab includes stretch prompts that let more experienced participants push further while others solidify fundamentals.
              </p>
              <p style={{ fontFamily: "var(--sans)", fontSize: 12.5, color: C.muted, lineHeight: 1.55, margin: 0 }}>
                <strong style={{ color: C.dark }}>Strategic pairing</strong> — Participants pair up across the skill spectrum to teach and learn from each other, or pair with someone at the same level to explore together.
              </p>
            </div>
          </div>

          {/* ── WHAT YOU'LL PRODUCE ── */}
          <div style={{ ...st.fadeUp, animationDelay: "0.5s" }}>
            <h2 style={st.sectionHeading}>What you'll walk away with</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                "A working Claude Code installation you've used to build real things",
                "A CLAUDE.md template library and prompt pattern cheat sheet",
                "Custom hooks, MCP integrations, and slash commands you built yourself",
                "A competitive battlecard and security FAQ for customer conversations",
                "Quick-guide reference materials for every session — designed for the field",
                "A capstone presentation — a working demo built from a blind customer brief",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 10, padding: "8px 0" }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: C.orange, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: C.muted, lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA ── */}
          <div style={{ marginTop: 44, ...st.fadeUp, animationDelay: "0.6s" }}>
            <button onClick={() => { setFoundationsViewContext("orientation"); setPhase("foundations"); }} style={st.primaryBtn}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >Start orientation →</button>
            <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: C.faint, marginTop: 12 }}>Begin with the shared knowledge base everyone needs</p>
          </div>
        </div>
      )}

      {/* ═══ FOUNDATIONS ═══ */}
      {phase === "foundations" && (
        <>
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, background: C.bg, zIndex: 10, borderBottom: `1px solid ${C.lightGray}`, paddingTop: 3 }}>
            <div style={{ maxWidth: 920, margin: "0 auto", padding: "10px 28px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: C.faint, textTransform: "uppercase" }}>Foundations</div>
            </div>
          </div>
          {showMethodology ? (
            <div style={{ ...st.container, paddingTop: 64 }} key="methodology">
              <h2 style={{ ...st.foundationTitle, ...st.fadeUp }}>The science behind this program</h2>
              <p style={{ ...st.bodyText, ...st.fadeUp, animationDelay: "0.04s" }}>Basecamp isn't structured the way it is because it felt right. Every design choice — from the sequencing of modules to the format of individual exercises — is grounded in learning science research. This page documents the pedagogical frameworks we drew on and the evidence behind them.</p>

              <div style={{ background: C.cream, borderRadius: 10, border: `1px solid ${C.lightGray}`, padding: "20px 24px", marginBottom: 32, ...st.fadeUp, animationDelay: "0.06s" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: C.green, marginBottom: 12 }}>The short version</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    "You learn by building real things, not watching slides.",
                    "Concepts come back in new contexts across the week — that's deliberate, not repetitive.",
                    "Live sessions are for practice and coaching. Reading happens on your own time.",
                    "Every module shows you what success looks like for your specific role.",
                    "Day 5 simulates your first real customer engagement — time pressure, live audience, peer scoring.",
                  ].map((line, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                      <span style={{ color: C.green, fontSize: 11, flexShrink: 0 }}>&#10003;</span>
                      <span style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: C.dark, lineHeight: 1.5 }}>{line}</span>
                    </div>
                  ))}
                </div>
              </div>

              {[
                {
                  method: "Experiential learning (learning by doing)",
                  color: C.green,
                  desc: "Every module centers on a hands-on challenge that produces a real artifact — a working install, a CLAUDE.md template, a custom hook. Learners build things rather than read about them.",
                  research: [
                    "Kolb's experiential learning cycle (1984) shows that knowledge is constructed through a cycle of concrete experience, reflective observation, abstract conceptualization, and active experimentation. Passive instruction alone skips the stages that produce durable understanding.",
                    "A meta-analysis by Freeman et al. (2014) in PNAS found that active learning reduces failure rates by 55% and increases exam scores by 6% compared to traditional lecturing across 225 STEM studies. The effect was strongest in smaller class sizes — exactly our cohort model.",
                    "For technical product training specifically, Bransford et al. (How People Learn, 2000) found that experts develop fluency through situated practice — learning in contexts that mirror how the knowledge will actually be used. Building a real hook matters more than reading about hook syntax.",
                  ],
                  application: "Every Basecamp module requires building something real. Day 1 doesn't end with 'you understand installation' — it ends with a working install and a recorded agentic task. Day 3 doesn't end with 'you know about hooks' — it ends with a hook, an MCP server, and a Skill you built yourself.",
                },
                {
                  method: "Retrieval practice",
                  color: C.orange,
                  desc: "Reflection prompts at the end of each foundation section ask learners to recall and apply concepts in a customer scenario before moving on.",
                  research: [
                    "Roediger & Butler (2011) demonstrated that retrieval practice — actively pulling information from memory rather than re-reading it — produces 50–100% better long-term retention than restudying the same material. The 'testing effect' is one of the most robust findings in cognitive psychology.",
                    "Karpicke & Blunt (2011) in Science showed that retrieval practice outperforms elaborative concept mapping for producing meaningful learning, even when learners predicted the opposite. People systematically underestimate how much active recall helps.",
                    "For GTM professionals, retrieval practice is especially critical because the knowledge must be recalled under pressure — in live customer conversations, not at a desk with notes. Practicing retrieval in training builds the neural pathways needed for spontaneous recall in the field.",
                  ],
                  application: "Every foundations section ends with a reflection prompt that simulates a customer interaction: 'A CISO asks about security — walk through your answer.' These aren't comprehension checks — they're rehearsals for real conversations. The optional Claude chat turns each prompt into an interactive Socratic dialogue.",
                },
                {
                  method: "Spaced repetition and interleaving",
                  color: C.blue,
                  desc: "Core concepts (CLAUDE.md, permissions, MCP, security) appear in foundations, reappear in module challenges, and surface again in the capstone — each time in a new context at increasing complexity.",
                  research: [
                    "Cepeda et al. (2006) analyzed 254 studies and found that distributing practice over time produces significantly better retention than massed practice. The optimal spacing gap depends on the retention interval — for week-long training, revisiting concepts on days 2, 3, and 5 is near-optimal.",
                    "Rohrer & Taylor (2007) showed that interleaving — mixing related topics rather than blocking them — improves discriminative ability by 43%. When learners encounter CLAUDE.md in the context of prompting (Day 2), then security (Day 4), then a customer brief (Day 5), they develop flexible understanding rather than rigid associations.",
                    "Bjork's 'desirable difficulties' framework (1994) explains why this feels harder in the moment but produces better outcomes. The effort of recalling CLAUDE.md concepts when you're focused on security objections is precisely what strengthens the memory trace.",
                  ],
                  application: "CLAUDE.md is introduced in foundations, practiced in Day 2's lab, referenced in Day 3's integration work, used as a security answer in Day 4, and required in the capstone. By Day 5, you've worked with it in five distinct contexts — not because we're repetitive, but because the research says this is how durable expertise forms.",
                },
                {
                  method: "Cognitive apprenticeship",
                  color: C.green,
                  desc: "Live instruction sessions use expert modeling, scaffolding, and coached practice — the facilitator demos a workflow, then gradually transfers control to learners.",
                  research: [
                    "Collins, Brown & Newman (1989) formalized the cognitive apprenticeship model: modeling (expert demonstrates), coaching (expert supports learner's attempts), scaffolding (temporary support structures), and fading (support removed as competence grows). This mirrors how craft skills have been transmitted for centuries, adapted for cognitive work.",
                    "Ericsson's research on deliberate practice (2006) found that expert performance develops through focused practice with immediate feedback, not through experience alone. Simply using Claude Code for a year doesn't build the fluency that one week of structured, coached practice does.",
                    "For technical sales specifically, Rackham's SPIN Selling research showed that top performers develop skill through observed practice with coaching feedback, not through product training alone. The customer role-plays on Day 4 mirror this model directly.",
                  ],
                  application: "Each live session follows the apprenticeship arc: the facilitator demos a complete workflow (modeling), learners attempt it with guidance (coaching), then work independently in the lab (fading). Day 4's role-plays add explicit peer coaching — your cohort tells you what worked and what didn't.",
                },
                {
                  method: "Constructive alignment",
                  color: C.orange,
                  desc: "Every module explicitly connects learning activities to role-specific competency outcomes. What you practice is what you'll be assessed on, which is what you'll do in the field.",
                  research: [
                    "Biggs (1996) introduced constructive alignment — the principle that intended learning outcomes, teaching activities, and assessment tasks must be deliberately aligned for effective learning. When they diverge, learners optimize for the wrong things.",
                    "Wiggins & McTighe's Understanding by Design (2005) formalized backward design: start from what the learner should be able to do, then design the assessment, then design the instruction. Basecamp was designed in this order — we defined field-ready competencies first, then built backward to the curriculum.",
                    "The role-specific framing draws on situated cognition research (Lave & Wenger, 1991) — the same technical knowledge means different things to a PE running a demo versus an SA designing an architecture. Making this explicit helps learners encode knowledge in the context they'll actually use it.",
                  ],
                  application: "Each module shows your role-specific outcome before the challenge begins. A PE Pre-Sales sees 'Demo Claude Code's install and first-run experience to a prospect' — not just 'learn installation.' The capstone on Day 5 is the ultimate alignment check: can you do what we said you'd be able to do?",
                },
                {
                  method: "Flipped classroom",
                  color: C.blue,
                  desc: "Conceptual content is delivered as self-paced pre-work (these foundations). Live sessions are reserved for application, practice, and discussion.",
                  research: [
                    "A meta-analysis by Strelan et al. (2020) across 173 studies found that flipped classrooms produce a weighted mean effect size of 0.53 — a moderate to large positive effect on learning outcomes compared to traditional lecture formats. The effect was consistent across disciplines and particularly strong for applied skills.",
                    "Lage, Platt & Treglia (2000) pioneered the model in economics, finding that students preferred the flipped format because they could control the pace of initial exposure and spend group time on harder application tasks. For a cohort with mixed technical backgrounds, this is critical — some will need 10 minutes on the model family, others will need 30.",
                    "Bishop & Verleger (2013) found that the flipped model's primary advantage is moving the most cognitively demanding work — application and synthesis — to the time when expert support is available. Reading about MCP is straightforward; architecting an MCP deployment for a customer is where you need help.",
                  ],
                  application: "You're reading these foundations right now because live time is too valuable for material you can absorb at your own pace. When you show up for Day 1, you already know what Claude Code is, how the model family works, and what CLAUDE.md does. That lets the facilitator go straight to building instead of spending 45 minutes on definitions.",
                },
                {
                  method: "Performance-based assessment",
                  color: C.green,
                  desc: "The Day 5 capstone is a blind customer brief under time pressure with peer evaluation — not a multiple-choice test.",
                  research: [
                    "Wiggins (1990) argued that authentic assessment — tasks that mirror real-world performance conditions — is the only reliable way to measure transfer. A quiz can test whether you remember what sandboxing is; only a live demo reveals whether you can explain it to a skeptical CISO under pressure.",
                    "Peer assessment research by Topping (2009) found that calibrated peer evaluation produces outcomes within 0.2 standard deviations of expert ratings, while also improving the assessor's own understanding. The act of evaluating someone else's demo builds your own judgment about what 'good' looks like.",
                    "Research on transfer-appropriate processing (Morris et al., 1977) shows that memory is best when the conditions at retrieval match the conditions at encoding. Practicing under time pressure, with unfamiliar requirements and a live audience, builds memories that are accessible under those same conditions in the field.",
                  ],
                  application: "Day 5 gives you a customer brief you haven't seen before, a time limit, and a cohort audience. This isn't a test of whether you completed the week — it's a simulation of your first real customer engagement. Your cohort scores you on the criteria your customers will judge you by: clarity, technical depth, and confidence.",
                },
              ].map((m, i) => (
                <div key={i} style={{ marginBottom: 36, ...st.fadeUp, animationDelay: `${0.08 + i * 0.04}s` }}>
                  <h3 style={{ fontFamily: "var(--serif)", fontSize: 19, fontWeight: 400, color: C.dark, margin: "0 0 8px" }}>{m.method}</h3>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: C.muted, lineHeight: 1.65, margin: "0 0 14px" }}>{m.desc}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                    {m.research.map((r, j) => (
                      <div key={j} style={{ padding: "12px 16px", background: C.cream, borderRadius: 8, borderLeft: `3px solid ${m.color}`, border: `1px solid ${C.lightGray}`, borderLeftWidth: 3, borderLeftColor: m.color }}>
                        <p style={{ fontFamily: "var(--sans)", fontSize: 12.5, color: C.muted, lineHeight: 1.6, margin: 0 }}>{r}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: "12px 16px", background: m.color + "06", borderRadius: 8 }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: m.color, marginBottom: 6 }}>How this shows up in Basecamp</div>
                    <p style={{ fontFamily: "var(--sans)", fontSize: 12.5, color: C.dark, lineHeight: 1.6, margin: 0 }}>{m.application}</p>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 28, paddingTop: 20, borderTop: `1px solid ${C.lightGray}` }}>
                <button onClick={() => setShowMethodology(false)} style={st.navBtn}>← Back to foundations</button>
              </div>
            </div>
          ) : foundationsViewContext === "orientation" && sidebarNav.length > 0 ? (
          <div style={{ maxWidth: 920, margin: "0 auto", paddingTop: 56, display: "flex", gap: 0, minHeight: "100vh" }}>
            {/* ── SIDEBAR ── */}
            <nav style={{ width: 220, flexShrink: 0, padding: "24px 0 24px 28px", position: "sticky", top: 56, alignSelf: "flex-start", maxHeight: "calc(100vh - 56px)", overflowY: "auto" }}>
              {(() => {
                let lastGroup = "";
                return sidebarNav.map((item, i) => {
                  const isActive = item.foundationStep === foundationStep && item.subPage === subPage;
                  const showGroup = item.group !== lastGroup;
                  lastGroup = item.group;
                  return (
                    <div key={item.id}>
                      {showGroup && (
                        <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: C.faint, padding: i === 0 ? "0 12px 8px" : "16px 12px 8px" }}>{item.group}</div>
                      )}
                      <button
                        onClick={() => { setFoundationStep(item.foundationStep); setSubPage(item.subPage); setShowMethodology(false); window.scrollTo({ top: 0, behavior: "instant" }); }}
                        style={{
                          display: "block", width: "100%", textAlign: "left", cursor: "pointer",
                          padding: "7px 12px", background: isActive ? C.orange + "08" : "transparent",
                          border: "none", borderLeft: isActive ? `3px solid ${C.orange}` : "3px solid transparent",
                          fontFamily: "var(--sans)", fontSize: 12.5, fontWeight: isActive ? 600 : 400,
                          color: isActive ? C.orange : C.muted, transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = C.dark; }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = C.muted; }}
                      >{item.label}</button>
                    </div>
                  );
                });
              })()}
            </nav>
            {/* ── CONTENT ── */}
            <div style={{ flex: 1, maxWidth: 640, padding: "24px 28px 60px" }} key={currentFoundation.id + (subPage >= 0 ? '-' + subPage : '')}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", ...st.fadeUp }}>
                <h2 style={{ ...st.foundationTitle, margin: 0 }}>{subPage >= 0 && currentFoundation.pages ? currentFoundation.pages[subPage].title : currentFoundation.title}</h2>
                <ContentModeSelect contentMode={contentMode} onChange={setContentMode} />
              </div>
              <div style={{ height: 24 }} />
              {(subPage >= 0 && currentFoundation.pages ? currentFoundation.pages[subPage].content : currentFoundation.content).map((block, idx) => <ContentBlock key={idx} block={block} idx={idx} contentMode={contentMode} />)}
              {(() => {
                const currentNavIdx = sidebarNav.findIndex(item => item.foundationStep === foundationStep && item.subPage === subPage);
                const isFirst = currentNavIdx <= 0;
                const isLast = currentNavIdx === sidebarNav.length - 1;
                return (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 36, paddingTop: 20, borderTop: `1px solid ${C.lightGray}` }}>
                    {!isFirst ? (
                      <button onClick={() => {
                        const prev = sidebarNav[currentNavIdx - 1];
                        setFoundationStep(prev.foundationStep); setSubPage(prev.subPage);
                        window.scrollTo({ top: 0, behavior: "instant" });
                      }} style={st.navBtn}>← Previous</button>
                    ) : <div />}
                    {isLast ? (
                      <button onClick={() => { setFoundationsDone(true); setPhase("path-select"); }} style={st.primaryBtn}
                        onMouseEnter={e => e.currentTarget.style.opacity = "0.88"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                      >Choose your role →</button>
                    ) : (
                      <button onClick={() => {
                        const next = sidebarNav[currentNavIdx + 1];
                        setFoundationStep(next.foundationStep); setSubPage(next.subPage);
                        window.scrollTo({ top: 0, behavior: "instant" });
                      }} style={st.primaryBtn}
                        onMouseEnter={e => e.currentTarget.style.opacity = "0.88"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                      >Continue →</button>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
          ) : (
          /* Contextual mode — full width, no sidebar */
          <div style={{ ...st.container, paddingTop: 64 }} key={currentFoundation.id + (subPage >= 0 ? '-' + subPage : '')}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", ...st.fadeUp }}>
              <h2 style={{ ...st.foundationTitle, margin: 0 }}>{subPage >= 0 && currentFoundation.pages ? currentFoundation.pages[subPage].title : currentFoundation.title}</h2>
              <ContentModeSelect contentMode={contentMode} onChange={setContentMode} />
            </div>
            <div style={{ height: 24 }} />
            {(subPage >= 0 && currentFoundation.pages ? currentFoundation.pages[subPage].content : currentFoundation.content).map((block, idx) => <ContentBlock key={idx} block={block} idx={idx} contentMode={contentMode} />)}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 36, paddingTop: 20, borderTop: `1px solid ${C.lightGray}` }}>
              <div />
              <button onClick={() => { setPhase("module"); setFoundationsViewContext("orientation"); }} style={st.navBtn}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >← Back to module</button>
            </div>
          </div>
          )}
        </>
      )}

      {/* ═══ PATH SELECT ═══ */}
      {phase === "path-select" && (
        <PathSelectPage onSelect={(id) => { setPath(id); setShowOutcomesModal(true); setTimeout(() => setPhase("hub"), 300); }} />
      )}

      {/* ═══ FACILITATOR GUIDE ═══ */}
      {phase === "facilitator" && !facilitatorModule && (
        <div style={st.container}>
          <button onClick={() => setPhase("welcome")} style={st.navBtn}>← Back to home</button>
          <div style={{ ...st.fadeUp, marginTop: 16 }}>
            <div style={st.eyebrow}>Instructor resources</div>
            <div style={{ height: 2, width: 48, background: C.blue, margin: "16px 0 32px", borderRadius: 1 }} />
            <h1 style={{ ...st.heroTitle, fontSize: 36 }}>Facilitator<br /><span style={{ color: C.blue }}>guide.</span></h1>
            <p style={st.heroBody}>Session plans, timing, talking points, and key moments for each module. These pages are for the instructor — trainees follow the main flow.</p>
          </div>
          <div style={{ margin: "28px 0 0", padding: "16px 20px", background: C.blue + "06", borderRadius: 10, border: `1px solid ${C.blue}20`, ...st.fadeUp, animationDelay: "0.12s" }}>
            <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.muted, lineHeight: 1.6, margin: 0 }}>This is the area of the program I would have liked to spend more time on. The facilitator guides have the structural bones — session plans, segment timing, setup checklists, and key moments — but with more time I'd develop richer coaching notes, branching paths for different cohort dynamics, and more detailed recovery playbooks for when sessions go off-script.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 36 }}>
            {FACILITATOR_GUIDES.map((g, i) => {
              const mod = MODULES.find(m => m.id === g.moduleId);
              return (
                <button key={g.moduleId} onClick={() => setFacilitatorModule(g.moduleId)}
                  style={{ ...st.pathCard, ...st.fadeUp, animationDelay: `${0.2 + i * 0.06}s` }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.background = C.blue + "04"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.lightGray; e.currentTarget.style.background = C.bg; }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: C.blue }}>{g.day}</span>
                      <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 500, color: C.dark }}>{g.title}</span>
                      {g.moduleId === 2 && <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: C.blue, background: C.blue + "10", padding: "2px 8px", borderRadius: 10 }}>Deep dive</span>}
                    </div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: C.faint }}>{g.duration}</div>
                  </div>
                  <span style={{ color: C.blue, fontSize: 18, fontWeight: 300 }}>→</span>
                </button>
              );
            })}
          </div>
          {/* Slide deck link */}
          <div style={{ marginTop: 36, padding: "18px 22px", background: C.cream, borderRadius: 10, border: `1px solid ${C.lightGray}`, ...st.fadeUp, animationDelay: "0.6s" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: C.faint, marginBottom: 8 }}>Accompaniment slide deck</div>
            <div style={{ padding: "12px 16px", background: C.blue + "06", borderRadius: 8, border: `1px solid ${C.blue}20`, marginBottom: 12 }}>
              <p style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.muted, lineHeight: 1.5, margin: 0 }}>The slide deck is another area I would have liked to invest more time. The current deck covers the core content across all 5 days with speaker notes, but with more time I'd build per-session interactive decks with embedded live examples, animated diagrams, and "try it yourself" pause points — the format that scored highest in Cohort 1 feedback.</p>
            </div>
            <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.muted, lineHeight: 1.5, margin: "0 0 12px" }}>44-slide interactive deck covering all 5 days: agentic fundamentals, CLAUDE.md and prompt craft, hooks/MCP/integrations, customer scenarios, and the capstone format. Each slide includes facilitator speaker notes (press 'S' to open speaker view).</p>
            <a href={import.meta.env.BASE_URL + "slides/basecamp-deck.html"} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.blue, textDecoration: "none", border: `1px solid ${C.blue}30`, borderRadius: 6, padding: "6px 14px", display: "inline-block" }}>Open slide deck →</a>
          </div>
        </div>
      )}

      {phase === "facilitator" && facilitatorModule && (() => {
        const guide = FACILITATOR_GUIDES.find(g => g.moduleId === facilitatorModule);
        if (!guide) return null;
        const mod = MODULES.find(m => m.id === guide.moduleId);
        return (
          <div style={st.container}>
            <button onClick={() => setFacilitatorModule(null)} style={st.navBtn}>← All modules</button>
            <div style={{ ...st.fadeUp, marginTop: 16 }}>
              <div style={st.eyebrow}>{guide.day} · Facilitator guide</div>
              <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 400, color: C.dark, margin: "8px 0" }}>{guide.title}</h1>
              <p style={{ fontFamily: "var(--mono)", fontSize: 12, color: C.blue }}>{guide.duration}</p>
            </div>

            {/* Slide deck */}
            {guide.slidesDeck ? (
              <div style={{ marginTop: 24, padding: "14px 18px", background: C.blue + "06", borderRadius: 8, border: `1px solid ${C.blue}20`, ...st.fadeUp, animationDelay: "0.08s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: C.blue, marginBottom: 4 }}>Slides</div>
                    <p style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.5 }}>{guide.slidesNote}</p>
                  </div>
                  <a href={import.meta.env.BASE_URL + guide.slidesDeck} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--sans)", fontSize: 11, color: C.blue, textDecoration: "none", border: `1px solid ${C.blue}30`, borderRadius: 6, padding: "6px 14px", whiteSpace: "nowrap", flexShrink: 0 }}>Open deck →</a>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: 24, padding: "14px 18px", background: C.cream, borderRadius: 8, border: `1px solid ${C.lightGray}`, ...st.fadeUp, animationDelay: "0.08s" }}>
                <p style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.faint, margin: 0 }}>{guide.slidesNote}</p>
              </div>
            )}

            {/* Setup checklist */}
            <div style={{ marginTop: 24, ...st.fadeUp, animationDelay: "0.12s" }}>
              <h3 style={st.sectionHeading}>Setup checklist</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {guide.setup.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 10, padding: "8px 12px", background: C.cream, borderRadius: 6 }}>
                    <span style={{ color: C.faint, fontSize: 11, flexShrink: 0 }}>&#9744;</span>
                    <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live session segments */}
            <div style={{ marginTop: 28, ...st.fadeUp, animationDelay: "0.16s" }}>
              <h3 style={st.sectionHeading}>Live session plan</h3>
              <p style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.faint, margin: "-4px 0 12px", lineHeight: 1.5, fontStyle: "italic" }}>Timings are guidelines — adjust based on your cohort's pace. If a segment runs long, compress the next one rather than rushing.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {guide.segments.map((seg, i) => (
                  <div key={i} style={{ padding: "16px 20px", background: C.bg, borderRadius: 10, border: `1px solid ${C.lightGray}`, borderLeft: `3px solid ${C.blue}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: C.blue, fontWeight: 500 }}>{seg.time}</span>
                      <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 500, color: C.dark }}>{seg.title}</span>
                    </div>
                    <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.muted, lineHeight: 1.65, margin: 0 }}>{seg.notes}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lab notes */}
            {guide.labNotes && (
              <div style={{ marginTop: 28, ...st.fadeUp, animationDelay: "0.2s" }}>
                <h3 style={st.sectionHeading}>Lab session notes</h3>
                <div style={{ padding: "16px 20px", background: C.green + "06", borderRadius: 10, border: `1px solid ${C.green}20` }}>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.muted, lineHeight: 1.65, margin: 0 }}>{guide.labNotes}</p>
                </div>
              </div>
            )}

            {/* Key moments */}
            <div style={{ marginTop: 28, ...st.fadeUp, animationDelay: "0.24s" }}>
              <h3 style={st.sectionHeading}>Key moments to watch for</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {guide.keyMoments.map((moment, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 10, padding: "10px 14px", background: C.orange + "06", borderRadius: 8, border: `1px solid ${C.orange}15` }}>
                    <span style={{ color: C.orange, fontSize: 12, flexShrink: 0 }}>&#9733;</span>
                    <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.dark, lineHeight: 1.55 }}>{moment}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Client scenario reference */}
            {mod?.clientScenario && (
              <div style={{ marginTop: 28, ...st.fadeUp, animationDelay: "0.28s" }}>
                <h3 style={st.sectionHeading}>Client scenario reference</h3>
                <div style={{ background: C.dark, borderRadius: 10, padding: "18px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontFamily: "var(--serif)", fontSize: 16, color: C.bg }}>{mod.clientScenario.company}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: C.gray, background: C.gray + "20", padding: "2px 8px", borderRadius: 10 }}>{mod.clientScenario.industry}</span>
                  </div>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 12.5, color: C.gray, lineHeight: 1.6, margin: 0 }}>{mod.clientScenario.situation}</p>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ═══ MODULE DETAIL ═══ */}
      {phase === "module" && activeModule && (() => {
        const mod = MODULES.find(m => m.id === activeModule);
        const isComplete = completed.has(mod.id);
        const selectedPath = PATHS.find(p => p.id === path);
        const competency = mod.competencies?.[path] || "";
        const phaseConfig = DAY_PHASE_CONFIG[mod.id];
        const dayPrework = DAY_PREWORK[mod.id];
        const guide = FACILITATOR_GUIDES.find(g => g.moduleId === mod.id);
        return (
          <>
          {showDiagnosticQuiz === "week" && (
            <DiagnosticQuiz
              color={mod.color}
              existingResult={diagnosticResults.week || null}
              onComplete={handleDiagnosticComplete}
            />
          )}
          <div style={st.container}>
            <button onClick={() => { setActiveModule(null); setPhase("hub"); }} style={st.navBtn}>← All modules</button>
            <div style={{ ...st.fadeUp, marginTop: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 8 }}>
                <span style={{ fontFamily: "var(--serif)", fontSize: 52, color: mod.color, lineHeight: 1, opacity: 0.25 }}>{mod.number}</span>
                <div>
                  <div style={st.eyebrow}>{mod.day} · Module {mod.id} of 5</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h1 style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 400, color: C.dark, margin: "0 0 8px" }}>{mod.title}</h1>
                <ContentModeSelect contentMode={contentMode} onChange={setContentMode} moduleId={mod.id} onRetake={() => setShowDiagnosticQuiz("week")} />
              </div>
              <p style={{ ...st.bodyText, maxWidth: 540, fontSize: 16, marginBottom: mod.swbat ? 10 : (mod.customerFraming ? 10 : 28) }}>{mod.subtitle}</p>
              {mod.swbat && <p style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 0.5, color: mod.color, margin: "0 0 28px", maxWidth: 540 }}>{mod.swbat}</p>}
              {mod.customerFraming && <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: mod.color, fontStyle: "italic", margin: "0 0 28px", maxWidth: 540, lineHeight: 1.5 }}>{mod.customerFraming}</p>}
            </div>

            {/* Day snapshot */}
            <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${C.lightGray}`, marginBottom: 24, ...st.fadeUp, animationDelay: "0.12s" }}>
              {/* Header bar */}
              <div style={{ background: C.dark, padding: "18px 24px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: mod.color, textTransform: "uppercase", marginBottom: 8 }}>Today's snapshot</div>
                {mod.clientScenario && (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontFamily: "var(--serif)", fontSize: 17, color: C.bg, fontWeight: 400 }}>{mod.clientScenario.company}</span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: C.gray, background: C.gray + "20", padding: "2px 8px", borderRadius: 10 }}>{mod.clientScenario.industry}</span>
                    </div>
                    <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.gray, lineHeight: 1.6, margin: 0 }}>{mod.clientScenario.situation}</p>
                  </div>
                )}
              </div>
              {/* Body */}
              <div style={{ padding: "20px 24px", background: C.bg }}>
                {/* Challenge */}
                <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${C.lightGray}` }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, color: mod.color, textTransform: "uppercase", marginBottom: 6 }}>The challenge</div>
                  <p style={{ fontFamily: "var(--serif)", fontSize: 15, lineHeight: 1.6, color: C.dark, margin: 0 }}>{mod.challenge}</p>
                </div>
                {/* Outcome */}
                {competency && (
                  <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${C.lightGray}` }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, color: mod.color, textTransform: "uppercase", marginBottom: 6 }}>Your outcome{selectedPath ? ` · ${selectedPath.short}` : ""}</div>
                    <p style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: C.dark, lineHeight: 1.6, margin: 0 }}>{competency}</p>
                  </div>
                )}
                {/* Skills */}
                <div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, color: mod.color, textTransform: "uppercase", marginBottom: 8 }}>Skills you'll build</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {mod.skills.map(sk => <span key={sk} style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 14, border: `1px solid ${mod.color}30`, color: mod.color, background: mod.color + "06" }}>{sk}</span>)}
                  </div>
                </div>
              </div>
            </div>

            {/* Handouts & reference materials — up front for easy download */}
            {mod.materials && mod.materials.length > 0 && (
              <div style={{ marginBottom: 20, ...st.fadeUp, animationDelay: "0.2s" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: mod.color, textTransform: "uppercase", marginBottom: 8 }}>Handouts & reference materials</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {mod.materials.map(mat => (
                    <MaterialCallout
                      key={mat.id}
                      material={{ ...mat, format: MATERIAL_META[mat.id]?.format }}
                      color={mod.color}
                      onOpen={() => { setMaterialsReturnTo({ phase: "module", moduleId: mod.id }); setInitialMaterialId(mat.id); setPhase("materials"); }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Day phase timeline */}
            <DayTimeline
              mod={mod}
              phaseConfig={phaseConfig}
              prework={dayPrework}
              activePhaseTab={activePhaseTab}
              onPhaseSelect={setActivePhaseTab}
              preworkCompleted={preworkCompleted}
            />

            {/* Phase content */}
            {activePhaseTab === "prework" && dayPrework && (
              <div style={{ ...st.fadeUp, animationDelay: "0.22s" }}>
                <PreworkView
                  dayId={mod.id}
                  prework={dayPrework}
                  mod={mod}
                  foundationSectionsViewed={foundationSectionsViewed}
                  onOpenFoundation={(sectionId) => {
                    // Determine if this is an orientation or contextual foundation
                    const isOrientation = ORIENTATION_SECTIONS.includes(sectionId);
                    const ctx = isOrientation ? "orientation" : "contextual";
                    const lookupArray = isOrientation ? ORIENTATION_FOUNDATIONS : FOUNDATIONS;
                    setFoundationsViewContext(ctx);
                    const topIdx = lookupArray.findIndex(f => f.id === sectionId);
                    if (topIdx >= 0) {
                      setFoundationStep(topIdx);
                      setSubPage(-1);
                      setPhase("foundations");
                    } else {
                      for (let fi = 0; fi < lookupArray.length; fi++) {
                        const pages = lookupArray[fi].pages || [];
                        const pi = pages.findIndex(p => p.id === sectionId);
                        if (pi >= 0) {
                          setFoundationStep(fi);
                          setSubPage(pi);
                          setPhase("foundations");
                          break;
                        }
                      }
                    }
                  }}
                  onOpenMaterial={(matId) => { setMaterialsReturnTo({ phase: "module", moduleId: mod.id }); setInitialMaterialId(matId); setPhase("materials"); }}
                  preworkCompleted={preworkCompleted}
                  onMarkPreworkDone={() => {
                    if (!preworkCompleted.includes(mod.id)) {
                      setPreworkCompleted(prev => [...prev, mod.id]);
                    }
                  }}
                  onContinue={() => { setActivePhaseTab("live"); window.scrollTo({ top: 0, behavior: "instant" }); }}
                />
              </div>
            )}

            {activePhaseTab === "live" && phaseConfig?.mode === "standard" && (
              <div style={{ ...st.fadeUp, animationDelay: "0.22s" }}>
                <LiveSessionView mod={mod} phaseConfig={phaseConfig} guide={guide} contentMode={contentMode} onContinue={() => { setActivePhaseTab("lab"); window.scrollTo({ top: 0, behavior: "instant" }); }} />
              </div>
            )}

            {activePhaseTab === "lab" && phaseConfig?.mode === "standard" && (
              <div style={{ ...st.fadeUp, animationDelay: "0.22s" }}>
                <LabView
                  mod={mod}
                  phaseConfig={phaseConfig}
                  contentMode={contentMode}
                  checkpointsCompleted={checkpointsCompleted}
                  onCheckpointComplete={() => {
                    if (!checkpointsCompleted.includes(mod.id)) {
                      setCheckpointsCompleted(prev => [...prev, mod.id]);
                      setModuleSubProgress(prev => ({ ...prev, [mod.id]: "checkpoint-done" }));
                    }
                  }}
                  gaps={mod.gaps}
                />
              </div>
            )}

            {activePhaseTab === "integrated" && phaseConfig?.mode === "integrated" && (
              <div style={{ ...st.fadeUp, animationDelay: "0.22s" }}>
                <IntegratedSessionView
                  mod={mod}
                  phaseConfig={phaseConfig}
                  contentMode={contentMode}
                  checkpointsCompleted={checkpointsCompleted}
                  onCheckpointComplete={() => {
                    if (!checkpointsCompleted.includes(mod.id)) {
                      setCheckpointsCompleted(prev => [...prev, mod.id]);
                      setModuleSubProgress(prev => ({ ...prev, [mod.id]: "checkpoint-done" }));
                    }
                  }}
                  gaps={mod.gaps}
                />
              </div>
            )}

            <div style={{ display: "flex", gap: 12, ...st.fadeUp, animationDelay: "0.4s" }}>
              {!isComplete && (activePhaseTab === "lab" || activePhaseTab === "integrated") && (
                <button onClick={() => {
                  setCompleted(prev => new Set([...prev, mod.id]));
                  setModuleSubProgress(prev => ({ ...prev, [mod.id]: "complete" }));
                  // Check if all modules now complete — trigger certificate
                  const newCompleted = new Set([...completed, mod.id]);
                  if (newCompleted.size === MODULES.length) {
                    if (!userName) {
                      setShowNameInput(true);
                    } else {
                      const date = new Date().toISOString();
                      setCertificateEarnedDate(date);
                      setShowCertificate(true);
                    }
                  }
                }} style={st.secondaryBtn}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.gray} onMouseLeave={e => e.currentTarget.style.borderColor = C.lightGray}
                >Mark complete</button>
              )}
            </div>

            {/* Next: back to hub to see badges */}
            {isComplete && (() => {
              const nextMod = MODULES.find(m => m.id === mod.id + 1);
              const teasers = {
                2: "Tomorrow: the CLAUDE.md before/after demo that changes how customers see Claude Code.",
                3: "Tomorrow: hooks, MCP servers, and slash commands — turn Claude Code into a platform.",
                4: "Tomorrow: role-play a CISO, a skeptical VP, and a Copilot user. Practice under pressure.",
                5: "Tomorrow: a blind customer brief, 45 minutes to build, and a live presentation. The transfer test.",
              };
              const teaser = nextMod ? teasers[nextMod.id] : null;
              return (
                <div style={{ marginTop: 24, padding: "20px 24px", background: C.cream, borderRadius: 12, border: `1px solid ${C.lightGray}`, display: "flex", justifyContent: "space-between", alignItems: "center", ...st.fadeUp, animationDelay: "0.46s" }}>
                  <div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1.5, color: C.green, textTransform: "uppercase", marginBottom: 4 }}>
                      {nextMod ? "Up next" : "All days complete"}
                    </div>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 17, color: C.dark }}>
                      {nextMod ? `${nextMod.day}: ${nextMod.title}` : "Head back to see your progress and badges"}
                    </div>
                    {teaser && <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.muted, marginTop: 4, lineHeight: 1.5 }}>{teaser}</div>}
                  </div>
                  <button onClick={() => { setActiveModule(null); setPhase("hub"); window.scrollTo({ top: 0, behavior: "instant" }); }} style={{ ...st.primaryBtnCustom, background: nextMod ? nextMod.color : C.green, flexShrink: 0 }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.88"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >{nextMod ? "Continue →" : "View progress →"}</button>
                </div>
              );
            })()}

            {/* Gentle checkpoint nudge */}
            {!isComplete && !checkpointsCompleted.includes(mod.id) && KNOWLEDGE_CHECKPOINTS[mod.id] && (
              <p style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.faint, marginTop: 10, ...st.fadeUp, animationDelay: "0.44s" }}>
                There's a knowledge checkpoint above — want to take a minute?
              </p>
            )}

            {/* Talk to Claude */}
            {(() => {
              const roleLabel = PATHS.find(p => p.id === path)?.short || "";
              const competency = mod.competencies?.[path] || "";
              const skillsList = mod.skills?.join(", ") || "";
              const prompt = encodeURIComponent(
                `I'm a ${roleLabel} going through Claude Code Basecamp training. I just completed ${mod.day}: "${mod.title}" — ${mod.subtitle}\n\n` +
                `The client scenario for this module: ${mod.clientScenario?.company} (${mod.clientScenario?.industry}) — ${mod.clientScenario?.situation}\n\n` +
                `Skills covered: ${skillsList}\n` +
                (competency ? `My role-specific goal: ${competency}\n\n` : "\n") +
                `Help me deepen my understanding of this material. I might ask you to:\n` +
                `- Explain concepts I'm unsure about\n` +
                `- Quiz me on what I learned\n` +
                `- Help me practice explaining these topics to customers\n` +
                `- Walk through scenarios I might encounter in the field\n\n` +
                `Start by asking me what I'd like to focus on.`
              );
              return (
                <div style={{ marginTop: 28, padding: "20px 24px", background: C.cream, borderRadius: 12, border: `1px solid ${C.lightGray}`, ...st.fadeUp, animationDelay: "0.5s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: C.blue, marginBottom: 4 }}>Deepen your understanding</div>
                      <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.muted, lineHeight: 1.5 }}>Open a conversation with Claude pre-loaded with context from this lesson. Ask questions, practice customer scenarios, or test your knowledge.</div>
                    </div>
                    <a
                      href={`https://claude.ai/new?q=${prompt}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "10px 20px", borderRadius: 8, cursor: "pointer",
                        background: C.blue, border: "none", color: "#fff",
                        fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500,
                        textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
                        transition: "opacity 0.2s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                    >Talk to Claude →</a>
                  </div>
                </div>
              );
            })()}
          </div>
          </>
        );
      })()}

      {/* ═══ OUTCOMES MODAL ═══ */}
      {showOutcomesModal && path && PATH_OUTCOMES[path] && (() => {
        const outcomes = PATH_OUTCOMES[path];
        const pathInfo = PATHS.find(p => p.id === path);
        return (
          <div style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div onClick={() => setShowOutcomesModal(false)} style={{ position: "absolute", inset: 0, background: "rgba(20,20,19,0.4)" }} />
            <div style={{
              position: "relative", background: C.bg, borderRadius: 14, border: `1px solid ${C.lightGray}`,
              maxWidth: 560, width: "100%", maxHeight: "85vh", overflowY: "auto",
              boxShadow: "0 8px 40px rgba(0,0,0,0.12)", animation: "fadeUp 0.25s ease forwards",
            }}>
              <div style={{ padding: "28px 28px 0" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: C.orange, marginBottom: 8 }}>{pathInfo?.short} track</div>
                <h2 style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 400, color: C.dark, margin: "0 0 6px" }}>After this week, you'll be able to</h2>
              </div>
              <div style={{ padding: "16px 28px 28px", display: "flex", flexDirection: "column", gap: 10 }}>
                {outcomes.outcomes.map((o, j) => (
                  <div key={j} style={{
                    display: "flex", gap: 10, padding: "10px 14px",
                    background: C.cream, borderRadius: 8, border: `1px solid ${C.lightGray}`,
                  }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: C.orange, marginTop: 3, flexShrink: 0 }}>{String(j + 1).padStart(2, "0")}</span>
                    <div>
                      <span style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500, color: C.dark }}>{o.action}</span>
                      <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.muted }}> {o.measure}</span>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setShowOutcomesModal(false)}
                  style={{ ...st.primaryBtn, marginTop: 8 }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >Let's go →</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ═══ HUB ═══ */}
      {phase === "hub" && (
        <div style={st.container}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 44, ...st.fadeUp }}>
            <div>
              <div style={st.eyebrow}>{PATHS.find(p => p.id === path)?.short} track</div>
              <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 400, margin: "4px 0 0", color: C.dark }}>Your week</h1>
              <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: C.muted, marginTop: 4, maxWidth: 380 }}>Five modules, five days. Each one builds on the last and produces an artifact you'll use in the field.</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: 34, color: C.orange, lineHeight: 1 }}>{progress}%</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.faint, marginTop: 4 }}>{completed.size}/{MODULES.length}</div>
            </div>
          </div>

          {/* Week timeline */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 0, marginBottom: 32, ...st.fadeUp, animationDelay: "0.1s" }}>
            {MODULES.map((mod, i) => {
              const done = completed.has(mod.id);
              const isNext = !done && (i === 0 || completed.has(MODULES[i - 1]?.id));
              return (
                <div key={mod.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                  {i > 0 && <div style={{ position: "absolute", top: 12, left: 0, right: "50%", height: 2, background: completed.has(MODULES[i - 1]?.id) ? C.green : C.lightGray, transition: "background 0.5s" }} />}
                  {i < MODULES.length - 1 && <div style={{ position: "absolute", top: 12, left: "50%", right: 0, height: 2, background: done ? mod.color : C.lightGray, transition: "background 0.5s" }} />}
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: done ? mod.color : isNext ? C.orange + "18" : C.bg, border: `2px solid ${done ? mod.color : isNext ? C.orange : C.lightGray}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, transition: "all 0.4s" }}>
                    {done ? <span style={{ color: "#fff", fontSize: 11, lineHeight: 1 }}>&#10003;</span> : <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: isNext ? C.orange : C.faint }}>{mod.number}</span>}
                  </div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: done ? mod.color : C.faint, marginTop: 6, textAlign: "center", lineHeight: 1.3 }}>{mod.day}</div>
                </div>
              );
            })}
          </div>

          {/* WIP banner for non-primary tracks */}
          {path !== "pe-pre" && (
            <div style={{ margin: "0 0 28px", padding: "14px 18px", background: "#fff3e0", border: `1.5px solid ${C.orange}`, borderRadius: 8, ...st.fadeUp, animationDelay: "0.12s" }}>
              <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.dark, lineHeight: 1.6, margin: 0 }}>
                <span style={{ fontWeight: 700, color: C.orange }}>Work in progress.</span> This track is an outline — module details, practice scenarios, and deliverables are still being built out. The <span style={{ fontWeight: 600 }}>PE Pre-Sales</span> track is fully developed; start there for the complete experience.
              </p>
            </div>
          )}

          {/* Credentials */}
          <div style={{ marginBottom: 36, ...st.fadeUp, animationDelay: "0.15s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
              <div style={st.eyebrow}>Credentials</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: C.faint }}>{earnedSkills.length} / {ALL_MODULE_BADGES.length}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
              {ALL_MODULE_BADGES.map(badge => {
                const mod = MODULES.find(m => m.id === badge.moduleId);
                const earned = earnedSkills.find(s => s.name === badge.name);
                return (
                  <ModuleBadge
                    key={badge.name}
                    name={badge.name}
                    icon={badge.icon}
                    desc={badge.desc}
                    earned={!!earned}
                    color={mod?.color || C.faint}
                  />
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {MODULES.map((mod, i) => {
              const done = completed.has(mod.id);
              const subProg = moduleSubProgress[mod.id];
              return (
                <button key={mod.id} onClick={() => { setActiveModule(mod.id); setPhase("module"); }}
                  style={{ ...st.chapterRow, borderLeft: `3px solid ${done ? mod.color : C.lightGray}`, background: done ? mod.color + "03" : "transparent", ...st.fadeUp, animationDelay: `${0.2 + i * 0.06}s` }}
                  onMouseEnter={e => { e.currentTarget.style.background = mod.color + "06"; e.currentTarget.querySelector("[data-arrow]").style.opacity = "1"; e.currentTarget.querySelector("[data-arrow]").style.transform = "translateX(4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = done ? mod.color + "03" : "transparent"; e.currentTarget.querySelector("[data-arrow]").style.opacity = "0.3"; e.currentTarget.querySelector("[data-arrow]").style.transform = "translateX(0)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 20, flex: 1 }}>
                    <div style={{ textAlign: "center", minWidth: 42 }}>
                      <span style={{ fontFamily: "var(--serif)", fontSize: 26, color: done ? mod.color : C.lightGray, lineHeight: 1, display: "block", transition: "color 0.3s" }}>{mod.number}</span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: C.faint, letterSpacing: 1 }}>{mod.day.toUpperCase()}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "var(--serif)", fontSize: 18, color: C.dark }}>{mod.title}</span>
                        {done && <span style={{ fontSize: 10, fontFamily: "var(--sans)", fontWeight: 500, color: mod.color, background: mod.color + "12", padding: "2px 8px", borderRadius: 10 }}>Complete</span>}
                        {!done && subProg === "checkpoint-done" && <span style={{ fontSize: 10, fontFamily: "var(--sans)", fontWeight: 500, color: mod.color, background: mod.color + "10", padding: "2px 8px", borderRadius: 10 }}>Checkpoint done</span>}
                        {!done && subProg === "started" && <span style={{ fontSize: 10, fontFamily: "var(--sans)", fontWeight: 400, color: C.faint, background: C.lightGray + "60", padding: "2px 8px", borderRadius: 10 }}>In progress</span>}
                        {mod.id === 2 && path === "pe-pre" && <span style={{ fontSize: 10, fontFamily: "var(--sans)", fontWeight: 500, color: C.blue, background: C.blue + "12", padding: "2px 8px", borderRadius: 10 }}>Deep Dive</span>}
                      </div>
                      <div style={{ fontFamily: "var(--sans)", fontSize: 11.5, color: C.muted, marginTop: 3, lineHeight: 1.4, maxWidth: 400 }}>{mod.subtitle.split(". ")[0]}.</div>
                      {mod.swbat && <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: mod.color, marginTop: 4, letterSpacing: 0.5 }}>{mod.swbat}</div>}
                      {mod.customerFraming && <div style={{ fontFamily: "var(--sans)", fontSize: 11, color: mod.color, marginTop: 4, lineHeight: 1.4, maxWidth: 400, fontStyle: "italic" }}>{mod.customerFraming}</div>}
                    </div>
                  </div>
                  <span data-arrow="" style={{ color: C.orange, fontSize: 18, opacity: 0.3, transition: "all 0.25s ease" }}>→</span>
                </button>
              );
            })}
          </div>

          {/* Curriculum design note */}
          <div style={{ marginTop: 40, padding: "20px 24px", background: C.cream, borderRadius: 12, border: `1px solid ${C.lightGray}`, ...st.fadeUp, animationDelay: "0.6s" }}>
            <div style={st.eyebrow}>Curriculum design</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 14 }}>
              <div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500, color: C.dark, marginBottom: 4 }}>Shared sessions</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.muted, lineHeight: 1.5 }}>Days 1–3 are shared across all roles. Everyone builds the same technical foundation on Claude Code.</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500, color: C.dark, marginBottom: 4 }}>Role breakouts</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.muted, lineHeight: 1.5 }}>Day 4 splits into role-specific scenarios. Day 5's capstone is tailored to your role's customer touchpoint.</div>
              </div>
            </div>
          </div>

          {/* View certificate button */}
          {completed.size === MODULES.length && (
            <div style={{ marginTop: 28, textAlign: "center", ...st.fadeUp, animationDelay: "0.7s" }}>
              <button onClick={() => {
                if (!userName && !certificateEarnedDate) {
                  setShowNameInput(true);
                } else {
                  if (!certificateEarnedDate) setCertificateEarnedDate(new Date().toISOString());
                  setShowCertificate(true);
                }
              }} style={{
                ...st.primaryBtn, background: C.orange,
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >View your certificate →</button>
            </div>
          )}

          {/* First week in the field */}
          {completed.size === MODULES.length && (
            <div style={{ marginTop: 28, padding: "20px 24px", background: C.cream, borderRadius: 12, border: `1px solid ${C.lightGray}`, ...st.fadeUp, animationDelay: "0.78s" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: C.orange, marginBottom: 10 }}>Your first week in the field</div>
              <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.muted, lineHeight: 1.6, margin: "0 0 12px" }}>Print these and keep them at your desk. They cover 90% of what you'll need in your first customer conversations.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { id: "M2b", label: "Prompt Patterns cheat sheet", why: "Your daily reference for steering Claude Code" },
                  { id: "F6a", label: "Security Objection Handler", why: "The battlecard for every CISO conversation" },
                  { id: "M4a", label: "Competitive Battlecard", why: "Claude Code vs. Copilot vs. Cursor positioning" },
                  { id: "F7b", label: "Cost & ROI Pocket Math", why: "Close the cost conversation in 60 seconds" },
                ].map(mat => (
                  <button key={mat.id} onClick={() => { setMaterialsReturnTo({ phase: "hub" }); setInitialMaterialId(mat.id); setPhase("materials"); }}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", textAlign: "left", padding: "10px 14px", background: C.bg, border: `1px solid ${C.lightGray}`, borderRadius: 6, cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange + "60"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.lightGray; }}
                  >
                    <div>
                      <div style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 500, color: C.dark }}>{mat.label}</div>
                      <div style={{ fontFamily: "var(--sans)", fontSize: 11, color: C.faint, marginTop: 1 }}>{mat.why}</div>
                    </div>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: C.orange, flexShrink: 0, marginLeft: 12 }}>View →</span>
                  </button>
                ))}
              </div>
            </div>
          )}


          {/* Reset */}
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <button onClick={() => {
              setPhase("welcome"); setFoundationsDone(false); setPath(null);
              setCompleted(new Set()); setFoundationStep(0); setActiveModule(null);
              setUserName(null); setFoundationSectionsViewed([]);
              setModuleSubProgress({}); setCheckpointsCompleted([]);
              setCertificateEarnedDate(null); setShowCertificate(false);
              try { localStorage.removeItem("basecamp-progress"); } catch {}
            }} style={{ fontFamily: "var(--mono)", fontSize: 11, color: C.faint, background: "none", border: "none", cursor: "pointer", opacity: 0.5, textDecoration: "underline" }}>Reset all progress</button>
          </div>
        </div>
      )}

      {/* ═══ DELIVERABLES (Two-tab: Part 1 Questions + Cohort 1 Feedback) ═══ */}
      {phase === "deliverables" && (
        <>
          <div style={st.topBar}>
            <div style={st.topBarInner}>
              <button onClick={() => { setPhase("welcome"); }} style={st.navBtn}>← Home</button>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: C.faint, textTransform: "uppercase" }}>Deliverables</div>
              <div style={{ width: 48 }} />
            </div>
            <div style={st.tabRow}>
              <button onClick={() => { setDeliverableTab("part1"); window.scrollTo({ top: 0, behavior: "instant" }); }} style={{ ...st.tab, color: deliverableTab === "part1" ? C.orange : C.faint, borderBottomColor: deliverableTab === "part1" ? C.orange : "transparent", fontWeight: deliverableTab === "part1" ? 500 : 400 }}>Part 1: Curriculum Plan</button>
              <button onClick={() => { setDeliverableTab("cohort1"); window.scrollTo({ top: 0, behavior: "instant" }); }} style={{ ...st.tab, color: deliverableTab === "cohort1" ? C.green : C.faint, borderBottomColor: deliverableTab === "cohort1" ? C.green : "transparent", fontWeight: deliverableTab === "cohort1" ? 500 : 400 }}>Part 2: Cohort 1 Feedback</button>
            </div>
          </div>
          <div style={{ ...st.container, paddingTop: 100 }}>
            {deliverableTab === "part1" && (
              <div key="part1">
                <div style={{ ...st.fadeUp, marginBottom: 40 }}>
                  <div style={st.eyebrow}>Part 1 · Written curriculum plan</div>
                  <div style={{ height: 2, width: 48, background: C.orange, margin: "16px 0 32px", borderRadius: 1 }} />
                  <h1 style={{ ...st.heroTitle, fontSize: 36 }}>Curriculum<br /><span style={{ color: C.orange }}>plan.</span></h1>
                  <p style={st.heroBody}>A five-day structured onboarding track for GTM teams — PE Pre-Sales, PE Post-Sales, Solutions Architects, and Applied Research — building from first install to job-ready customer engagements.</p>
                </div>
                <CurriculumPlanContent />
              </div>
            )}
            {deliverableTab === "cohort1" && (
              <div key="cohort1">
                <div style={{ ...st.fadeUp, marginBottom: 40 }}>
                  <div style={st.eyebrow}>Part 2 · Cohort 1 feedback analysis</div>
                  <div style={{ height: 2, width: 48, background: C.green, margin: "16px 0 32px", borderRadius: 1 }} />
                  <h1 style={{ ...st.heroTitle, fontSize: 36 }}>Feedback<br /><span style={{ color: C.green }}>response.</span></h1>
                  <p style={st.heroBody}>
                  </p>
                </div>
                <CohortFeedbackContent />
              </div>
            )}
          </div>
        </>
      )}

      {/* ═══ FEEDBACK RESPONSE ═══ */}
      {phase === "feedback-response" && (
        <FeedbackResponsePage onBack={() => setPhase("facilitator")} />
      )}

      {/* ═══ MATERIALS ═══ */}
      {phase === "materials" && (
        <MaterialsView onBack={() => {
          if (materialsReturnTo) {
            setPhase(materialsReturnTo.phase);
            if (materialsReturnTo.moduleId) setActiveModule(materialsReturnTo.moduleId);
          } else {
            setPhase("hub");
          }
          setInitialMaterialId(null);
          setMaterialsReturnTo(null);
        }} initialMaterialId={initialMaterialId} />
      )}
    </div>
  );
}

// ─── STYLES ───
const st = {
  page: { minHeight: "100vh", background: C.bg, color: C.dark, fontFamily: "var(--sans)" },
  container: { maxWidth: 640, margin: "0 auto", padding: "56px 28px 80px" },
  fadeUp: { opacity: 0, animation: "fadeUp 0.7s ease forwards" },
  eyebrow: { fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 2.5, color: C.faint, textTransform: "uppercase" },
  heroTitle: { fontFamily: "var(--serif)", fontSize: 42, fontWeight: 400, lineHeight: 1.12, margin: "0 0 20px", color: C.dark, letterSpacing: -0.5 },
  heroBody: { fontFamily: "var(--sans)", fontSize: 16, lineHeight: 1.7, color: C.muted, maxWidth: 500, margin: 0 },
  bodyText: { fontFamily: "var(--sans)", fontSize: 14.5, lineHeight: 1.72, color: C.muted, margin: "0 0 20px" },
  sectionHeading: { fontFamily: "var(--serif)", fontSize: 20, fontWeight: 400, color: C.dark, margin: "36px 0 14px" },
  quoteBlock: { borderLeft: `2px solid ${C.lightGray}`, paddingLeft: 20 },
  quoteText: { fontFamily: "var(--serif)", fontSize: 15.5, fontStyle: "italic", lineHeight: 1.65, color: C.muted, margin: 0 },
  quoteAttr: { fontFamily: "var(--sans)", fontSize: 12, color: C.faint, marginTop: 8 },
  topBar: { position: "fixed", top: 0, left: 0, right: 0, background: C.bg, zIndex: 10, borderBottom: `1px solid ${C.lightGray}`, paddingTop: 3 },
  topBarInner: { maxWidth: 640, margin: "0 auto", padding: "10px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  tabRow: { maxWidth: 640, margin: "0 auto", padding: "0 28px", display: "flex" },
  tab: { fontFamily: "var(--sans)", fontSize: 12, background: "none", border: "none", borderBottom: "2px solid transparent", padding: "8px 14px", cursor: "pointer", transition: "all 0.2s", color: C.faint },
  foundationTitle: { fontFamily: "var(--serif)", fontSize: 32, fontWeight: 400, color: C.dark, margin: "0 0 24px" },
  primaryBtn: { fontFamily: "var(--sans)", fontSize: 14, fontWeight: 500, color: C.bg, background: C.orange, border: "none", borderRadius: 8, padding: "14px 28px", cursor: "pointer", transition: "opacity 0.2s", letterSpacing: 0.3 },
  primaryBtnCustom: { flex: 1, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 500, color: C.bg, border: "none", borderRadius: 8, padding: "14px 24px", cursor: "pointer", transition: "opacity 0.2s" },
  secondaryBtn: { background: "transparent", color: C.muted, border: `1px solid ${C.lightGray}`, borderRadius: 8, padding: "14px 20px", fontSize: 13, cursor: "pointer", fontFamily: "var(--sans)", transition: "all 0.2s" },
  navBtn: { background: "none", border: "none", color: C.faint, cursor: "pointer", fontSize: 13, fontFamily: "var(--sans)", padding: 0 },
  pathCard: { display: "flex", alignItems: "center", justifyContent: "space-between", background: C.bg, border: `1px solid ${C.lightGray}`, borderRadius: 10, padding: "16px 20px", cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.25s" },
  chapterRow: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "transparent", border: "none", borderBottom: "1px solid #f0ede6", padding: "18px 8px", cursor: "pointer", textAlign: "left", width: "100%", transition: "background 0.25s", fontFamily: "var(--sans)" },
  statCard: { background: C.cream, borderRadius: 10, padding: "14px 18px", border: `1px solid ${C.lightGray}` },
  statLabel: { fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: C.faint, textTransform: "uppercase" },
  statValue: { fontFamily: "var(--sans)", fontSize: 13.5, color: C.dark, marginTop: 6, lineHeight: 1.5 },
  modalityTag: { fontFamily: "var(--mono)", fontSize: 10, padding: "5px 12px", borderRadius: 16, border: "1px solid", letterSpacing: 0.5 },
};

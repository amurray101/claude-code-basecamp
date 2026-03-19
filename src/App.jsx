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
};

function loadProgress() {
  try {
    const raw = localStorage.getItem("basecamp-progress");
    if (!raw) return { ...PROGRESS_DEFAULTS };
    const data = { ...PROGRESS_DEFAULTS, ...JSON.parse(raw) };
    // Migration: if foundationsDone but no sections tracked, backfill all
    if (data.foundationsDone && data.foundationSectionsViewed.length === 0) {
      data.foundationSectionsViewed = ["welcome", "products", "claude-code", "how-it-thinks", "configuration", "security", "enterprise"];
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
            { x: 30, label: "Claude.ai", sub: "Chat · Projects · Skills", color: C.faint, highlight: false },
            { x: 240, label: "Claude Code", sub: "Agentic CLI · Agent SDK", color: C.orange, highlight: true },
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
            { x: 30, label: "MCP", sub: "Tool discovery" },
            { x: 195, label: "Skills", sub: "Packaged expertise" },
            { x: 360, label: "Projects", sub: "Persistent context" },
            { x: 525, label: "Agent SDK", sub: "Custom agents" },
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

// ─── FOUNDATIONS CONTENT ───
const FOUNDATIONS = [
  {
    id: "welcome", label: "Anthropic", title: "Welcome to Anthropic",
    content: [
      { type: "text", value: "You've joined a company that believes AI will be the most transformative technology in human history — and that getting it right matters more than getting there first.", simple: "Welcome to Anthropic. We build AI systems, and we think AI is going to change the world more than any technology before it. Our big bet is that building AI safely and carefully matters more than being the fastest company to ship it." },
      { type: "quote", value: "AI has the potential to pose unprecedented risks to humanity if things go badly. It also has the potential to create unprecedented benefits for humanity if things go well.", attr: "Anthropic's founding premise", simple: "Anthropic believes AI will be incredibly powerful. Rather than slow it down, they want to be the ones building it — so they can make it safe. That's the founding bet." },
      { type: "outcomes", items: [
        "Explain Anthropic's mission and why it's structured as a Public Benefit Corporation",
        "Describe the company's core working principles when talking to customers or colleagues",
        "Articulate how your role connects to Anthropic's broader safety mission",
      ]},
      { type: "text", value: "Anthropic was founded in 2021 by Dario and Daniela Amodei, along with a team of researchers who believed safety couldn't be an afterthought — it had to be the organizing principle. We're a Public Benefit Corporation, which means our charter legally requires us to weigh our mission alongside business outcomes.", simple: "Dario and Daniela Amodei started Anthropic in 2021 with a group of AI researchers. Their core belief was that making AI safe had to be the main goal from day one, not something you tack on later. The company is set up as a Public Benefit Corporation. That is a special legal structure. Unlike a typical company that only has to maximize profit for shareholders, Anthropic is legally required to consider its broader mission to society alongside making money. It is baked into the company's foundation." },
      { type: "heading", value: "How we work", simple: "The way we collaborate day to day" },
      { type: "values", items: [
        { title: "High-trust, low-ego", desc: "We communicate kindly and directly, assuming good intentions even in disagreement.", simpleDesc: "Be straightforward but kind. When you disagree with someone, start by assuming they have good reasons for their view. Think of it like giving a friend honest feedback. You say what you really think, but you are respectful about it." },
        { title: "Empirical first", desc: "We care about the size of our impact, not the sophistication of our methods.", simpleDesc: "What matters is whether something actually works and makes a real difference, not how clever the approach looks on paper. Pick the method that gets results, even if it is not the most impressive-sounding one." },
        { title: "Simplest solution", desc: "We don't invent a spaceship if all we need is a bicycle.", simpleDesc: "Always pick the simplest approach that works. Don't over-engineer." },
        { title: "Safety as science", desc: "We treat AI safety as a systematic science, not a set of rules.", simpleDesc: "Anthropic treats AI safety like a research problem, not a PR exercise. They publish findings, build measurement tools, and test whether safety techniques actually work." },
      ]},
      { type: "text", value: "Every role here contributes to this mission. Whether you're advising customers on architecture, building implementations, or pushing the frontier of what Claude can do — the quality of your work directly shapes whether organizations trust AI to do important things.", simple: "No matter what your job title is, your work feeds into Anthropic's bigger mission. If you help customers design systems, write code, or improve what Claude can do, the quality of that work directly affects whether people out in the world feel confident using AI for things that really matter. Everyone here plays a part." },
    ],
  },
  {
    id: "products", label: "Products", title: "The Anthropic platform",
    content: [
      { type: "text", value: "Before we dive into Claude Code, you need to see the full board. Anthropic's products are a composable stack. Claude Code is one surface in this system, and understanding where it fits influences how you talk about it with customers.", simple: "Before we get into Claude Code specifically, let's look at the big picture. Anthropic makes several products that work like building blocks -- each one is useful on its own, but they're designed to snap together. Claude Code is one of those blocks, and knowing how the pieces fit helps you explain it to customers." },
      { type: "overview", heading: "What we'll cover", items: [
        { label: "Product surfaces", desc: "Claude.ai, the API, and Claude Code — and how they connect" },
        { label: "Cowork", desc: "Claude.ai's agentic execution mode — AI that acts, not just answers" },
        { label: "Model family", desc: "Opus, Sonnet, and Haiku — when to use each" },
        { label: "Extension layers", desc: "MCP, Skills, and Projects — the customization toolkit" },
      ]},
      { type: "outcomes", items: [
        "Map the full Anthropic product stack and explain how each surface connects to the API",
        "Differentiate Cowork from chat and from Claude Code — and know when to recommend each to a customer",
        "Recommend the right Claude model (Opus, Sonnet, Haiku) for a given customer use case",
        "Identify which extension layers (MCP, Skills, Projects) solve a customer's specific workflow needs",
      ]},
      { type: "platform-diagram" },
      { type: "text", value: "Every surface talks to the same API. Claude.ai gives non-technical users chat, Projects, Skills, and Cowork — an agentic execution mode where Claude works autonomously on multi-step tasks. The API lets developers build custom applications. And Claude Code — the focus of this track — gives developers an agentic coding partner directly in their terminal, desktop app, mobile app, or through the browser.", simple: "All of Anthropic's products connect to the same core engine through an API (Application Programming Interface -- think of it as a shared back door that lets different apps talk to Claude's brain). Claude.ai is the web app for everyday users who want to chat, organize work into Projects, use pre-built Skills, and use Cowork to hand off tasks that Claude completes on its own. The API is for developers who want to build their own apps on top of Claude. And Claude Code -- the main topic of this course -- is a coding assistant that works right inside a developer's terminal (command line), desktop app, phone, or browser." },
      { type: "heading", value: "Cowork: agentic execution in Claude.ai", simple: "Claude.ai's mode for handing off tasks to Claude" },
      { type: "text", value: "Chat is for thinking together. Cowork is for delegating. When a user starts a Cowork task, Claude doesn't just respond — it plans, executes multi-step workflows, connects to external tools through connectors, and delivers finished work. It's the same agentic reasoning loop that powers Claude Code, but for non-coding knowledge work: research, analysis, content creation, data processing, and cross-tool workflows.", simple: "Regular chat is a back-and-forth conversation — you ask, Claude answers, you ask again. Cowork is different: you hand off a whole task, and Claude works on it independently. It makes a plan, takes multiple steps, connects to your other tools (like email, calendar, or documents), and comes back with finished work. Think of chat as brainstorming with a colleague, and Cowork as giving an assignment to a capable assistant." },
      { type: "models", items: [
        { name: "Connectors", color: C.green, desc: "Cowork connects to the tools your team already uses — Gmail, Google Calendar, Google Drive, Slack, Notion, and more. Claude can read emails, check calendars, search documents, and post messages as part of a multi-step workflow. No API keys or developer setup required.", tag: "External integrations", simpleDesc: "Connectors let Claude plug into everyday work tools like Gmail, Google Calendar, Google Drive, Slack, and Notion. Claude can read your emails, check your schedule, search your documents, and send messages -- all as part of completing a task you've handed off. No coding or technical setup required." },
        { name: "Autonomous reasoning", color: C.orange, desc: "Cowork uses the same plan-execute-evaluate loop as Claude Code. It breaks complex tasks into steps, calls connectors to gather information, evaluates intermediate results, adjusts its approach, and delivers a complete output — not a suggestion, but finished work.", tag: "Think → Act → Deliver", simpleDesc: "When you give Cowork a task, Claude doesn't just answer in one shot. It breaks the task into steps, gathers information from your connected tools, checks its own work, adjusts if something's off, and delivers a finished result. It's doing real work, not just suggesting what you could do." },
        { name: "Permission modes", color: C.blue, desc: "Three levels of autonomy let users control how much independence Claude has. 'Ask Me First' confirms each action. 'Informed Autonomy' acts but reports back. 'Full Autonomy' lets Claude work independently and deliver results. Teams typically start cautious and expand as trust builds.", tag: "Trust at your pace", simpleDesc: "You control how much freedom Claude gets. 'Ask Me First' means Claude checks with you before every step. 'Informed Autonomy' means Claude goes ahead but tells you what it did. 'Full Autonomy' means Claude handles everything and just gives you the result. Most people start cautious and give Claude more independence as they get comfortable." },
      ]},
      { type: "text", value: "Cowork matters for your customer conversations because it expands the buyer beyond engineering. When a marketing lead, operations manager, or analyst sees Claude autonomously research a topic, pull data from their existing tools, and produce a formatted deliverable — that's a different conversation than 'we have a chatbot.' Cowork turns Claude from a tool individuals use into a platform teams depend on.", simple: "Cowork is important to understand because it helps you talk to people outside of engineering. When a marketing manager sees Claude independently research a topic, pull data from their email and documents, and produce a polished report — that's very different from showing them a chatbot. Cowork makes Claude relevant to entire organizations, not just developers." },
      { type: "heading", value: "Cowork vs. Claude Code", simple: "When to recommend Cowork vs. Claude Code" },
      { type: "text", value: "In enterprise deployments, both typically coexist — engineering teams use Claude Code while the rest of the organization uses Cowork through Claude.ai. Knowing which to recommend for which persona is key.", simple: "In large companies, developers use Claude Code while everyone else uses Cowork. Knowing which to suggest to which person is an important skill." },
      { type: "heading", value: "The model family", simple: "The different versions of Claude" },
      { type: "models", items: [
        { name: "Claude Opus", color: C.orange, desc: "Maximum intelligence. Complex reasoning, nuanced analysis, research synthesis. High-stakes decisions where depth matters more than speed.", tag: "Deepest reasoning", simpleDesc: "The most powerful version of Claude. Think of it as the senior expert you bring in for the hardest problems -- it takes more time and costs more, but it catches things the others might miss. Best for complicated decisions where getting it right matters more than getting it fast." },
        { name: "Claude Sonnet", color: C.blue, desc: "The workhorse — and the model powering Claude Code. Fast, intelligent, and versatile. Ideal for agentic coding, daily workflows, and most customer deployments.", tag: "Best all-around", simpleDesc: "The everyday model that balances speed, smarts, and cost. This is what powers Claude Code by default. It handles most tasks well -- writing code, answering questions, working through multi-step problems. For the majority of customers, this is the right starting point." },
        { name: "Claude Haiku", color: C.green, desc: "Speed and efficiency. Real-time applications, high-volume classification, routing layers. Makes multi-model architectures economical.", tag: "Fastest + cheapest", simpleDesc: "The lightest and fastest version of Claude. It is great for simple, repetitive tasks where you need quick answers at low cost -- like sorting emails into categories or powering a chatbot that handles routine questions. Teams often use Haiku for the easy stuff and save the bigger models for harder work." },
      ]},
      { type: "heading", value: "Extension layers", simple: "Add-ons that give Claude new abilities" },
      { type: "text", value: "Three capabilities extend what Claude can do across all surfaces. These compose — a customer might use MCP to pull Salesforce data, a Skill to format it, inside a Project loaded with their brand guidelines.", simple: "There are three add-ons that expand what Claude can do, and they work across all the products mentioned above. They can also be combined. For example, a customer could connect Claude to their Salesforce account (using MCP), apply a formatting template (using a Skill), all within a workspace that already knows their brand rules (using a Project)." },
      { type: "models", items: [
        { name: "MCP", color: C.green, desc: "Model Context Protocol connects Claude to external services — Slack, GitHub, Jira, databases, internal APIs. It's a standardized way for Claude to discover and use tools dynamically, without hardcoded integrations.", tag: "External tools + data", simpleDesc: "MCP (Model Context Protocol) is like a universal adapter that lets Claude plug into other software -- Slack, GitHub, Jira, databases, and company-internal tools. Instead of building a custom connection for each service, MCP gives Claude a standard way to find and use outside tools on the fly." },
        { name: "Skills", color: C.orange, desc: "Packaged procedural expertise that Claude loads on demand. Pre-built skills handle common tasks. Custom skills let teams encode their own workflows — report formats, code review checklists, analysis frameworks.", tag: "Packaged expertise", simpleDesc: "Skills are like recipe cards that teach Claude how to do specific tasks. Some come ready-made for common jobs. Teams can also write their own -- for example, a skill that formats reports in a specific way, or one that runs through a code review checklist. Claude loads the right skill when it is needed." },
        { name: "Projects", color: C.blue, desc: "Persistent context scoped to a use case. Custom instructions tell Claude how to behave. Reference documents give it knowledge. Think of it as a workspace where Claude already knows your team's conventions.", tag: "Persistent context", simpleDesc: "Projects are saved workspaces that give Claude background knowledge about a specific job. You can add instructions (like 'always use formal language') and reference documents (like style guides or product specs). It is like setting up a desk for a new team member with everything they need to know before they start." },
      ]},
      { type: "text", value: "These three extensions will make up the bulk of the customization work you do with customers. Coming to a sales call with a strong understanding of what's available — whether a customer's existing tools already have off-the-shelf MCP servers, whether there are pre-built Skills that match their use case, or how Projects can accelerate their onboarding — is the difference between a generic demo and a conversation that closes.", simple: "These three add-ons are where most of the customer-specific setup happens. When you go into a sales conversation, knowing these well makes a big difference. Can their existing tools (like Slack or Jira) already connect through a ready-made MCP server? Is there a pre-built Skill that matches what they need? Could a Project help their team get started faster? Having these answers ready turns a generic product demo into a tailored conversation that shows real value." },
      { type: "reflect", prompt: "Think of a customer you've worked with (or imagine one). Which Anthropic surface would they start with? Which would they grow into? What would that journey look like?" },
    ],
  },
  {
    id: "claude-code", label: "Claude Code", title: "What is Claude Code?",
    content: [
      { type: "text", value: "You've seen where Claude Code fits in the Anthropic stack. Now let's go deeper on how it actually works — the agentic loop, the interaction model, and what makes it different from every other coding tool.", simple: "You already know what Claude Code is. Now let's understand how it works under the hood — how it reads code, plans changes, and verifies its own work." },
      { type: "overview", heading: "What we'll cover", items: [
        { label: "Interaction model", desc: "How agentic coding differs from autocomplete tools" },
        { label: "Architecture", desc: "The agentic loop — how Claude reads, plans, acts, and verifies" },
        { label: "Access surfaces", desc: "CLI, desktop, mobile, and web — four ways to use Claude Code" },
        { label: "Who uses it", desc: "Engineers, data scientists, DevOps, leaders, and beyond" },
        { label: "GTM positioning", desc: "Why this changes the sales motion and what customers care about" },
      ]},
      { type: "outcomes", items: [
        "Explain in 60 seconds how agentic coding differs from autocomplete tools like Copilot",
        "Walk through the agentic loop — read, plan, act, verify — using a concrete example",
        "Identify which Claude Code surface (CLI, VS Code, desktop, web) fits a given user's workflow",
        "Position Claude Code's value to different buyer personas: engineering leaders, data scientists, DevOps teams",
      ]},
      { type: "heading", value: "A different interaction model", simple: "How Claude Code works differently from other coding tools" },
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
        { stat: "200K", label: "Token context window — Claude reads entire codebases, not just open files", source: "Anthropic API documentation, docs.anthropic.com" },
        { stat: "~$6/day", label: "Average cost per developer — 90% of users spend less than $12/day", source: "Anthropic Claude Code costs documentation, docs.anthropic.com/en/docs/claude-code/costs" },
        { stat: "3", label: "Cloud deployment options — AWS Bedrock, Google Vertex AI, Microsoft Foundry", source: "Anthropic enterprise deployment docs, docs.anthropic.com/en/docs/claude-code/bedrock-vertex" },
        { stat: "24", label: "Hook events available for custom automation — from pre-commit to post-edit to CI/CD", source: "Anthropic hooks documentation, docs.anthropic.com/en/docs/claude-code/hooks" },
        { stat: "4", label: "Permission modes — default, plan, auto-accept, and headless for CI/CD pipelines", source: "Anthropic permissions documentation, docs.anthropic.com/en/docs/claude-code/security" },
      ]},
      { type: "heading", value: "Four ways to use Claude Code", simple: "The four places you can run Claude Code" },
      { type: "text", value: "Claude Code isn't locked to one environment. It meets developers where they already work — terminal, desktop, phone, or browser. Each surface has a distinct strength, and knowing when to reach for which one is part of what makes your demos and customer conversations land.", simple: "You can use Claude Code in four different places: the command line (terminal), a desktop app, your phone, or a web browser. Each one is better for different situations. Knowing which to recommend helps you match the tool to how someone actually works." },
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
      { type: "heading", value: "Who uses Claude Code — and why", simple: "The different roles and teams that benefit from Claude Code" },
      { type: "text", value: "Claude Code started as a developer tool, but the people using it daily go far beyond software engineers. Anyone whose work involves files, data, or structured thinking can get value from an agentic partner in the terminal.", simple: "Claude Code was built for programmers, but it turns out many other people find it useful too. Data analysts, operations teams, managers, and designers all use it. If your work involves working with files or thinking through structured problems, Claude Code can help." },
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
      ]},
      { type: "text", value: "This breadth matters for GTM. The buyer might be a VP of Engineering, but the value spreads across the org. When you position Claude Code, you're not pitching a code autocomplete tool to a dev team — you're showing a technical leader how agentic AI can raise the floor for everyone who touches their codebase, their data, or their infrastructure.", simple: "This wide range of users matters when you are selling the product. GTM (go-to-market) means the strategy for reaching customers. The person signing the contract might be an engineering leader, but the value reaches designers, data teams, and ops staff too. You are not selling a tool that finishes lines of code. You are showing how AI that takes action can make everyone in the organization more effective." },
      { type: "text", value: "Expect resistance. Some prospects — and their teams — will worry that agentic coding tools threaten jobs. This is natural, and dismissing it kills trust. Instead, reframe: Claude Code doesn't replace engineers, it removes the parts of their job they like least. Boilerplate, migration grunt work, chasing down test failures across fifty files — that's what gets automated. What's left is the creative, high-judgment work: architecture decisions, product thinking, novel problem-solving. The teams already using Claude Code consistently report feeling more agency, not less. They prototype ideas in an afternoon that used to take a sprint. They say yes to refactors they would have deferred for quarters. The best framing for skeptical buyers: this tool doesn't shrink your team — it unlocks the work your team never had time to start.", simple: "Some people will worry that a tool like this could replace developers. Take that concern seriously -- brushing it off breaks trust. The better framing: Claude Code handles the tedious parts of the job that nobody enjoys, like copy-paste refactoring, updating dozens of files, or tracking down test failures. The interesting, creative work -- designing systems, making product decisions, solving new problems -- stays with the humans. Teams already using it say they feel more productive, not more replaceable. They build things in hours that used to take weeks. The message for nervous buyers: this tool does not shrink your team, it frees your team to tackle the backlog they never had time for." },
      { type: "reflect", prompt: "Think about the difference between a developer using GitHub Copilot (line-level autocomplete) versus Claude Code (agentic, multi-step). How would you explain this difference to a VP of Engineering in 60 seconds?" },
    ],
    pages: [
  {
    id: "how-it-thinks", label: "How it thinks", title: "Under the hood",
    content: [
      { type: "text", value: "Before you can demo Claude Code convincingly or field technical questions from a VP of Engineering, you need to understand what's actually happening when Claude writes code. This section covers the intelligence layer — the reasoning, memory, model selection, and economics that power every interaction.", simple: "Before you can show Claude Code to customers or answer their technical questions, you need to understand what is happening under the hood. This section explains how the AI reasons through problems, how it keeps track of large codebases, how to pick the right model for the job, and how much it all costs." },
      { type: "overview", heading: "What we'll cover", items: [
        { label: "Extended thinking", desc: "How Claude reasons step-by-step on complex problems before acting" },
        { label: "Context window", desc: "Why Claude can read entire codebases — not just the open file" },
        { label: "Model selection", desc: "Haiku, Sonnet, and Opus — when to use which, and why it matters" },
        { label: "Cost model", desc: "Token economics, pricing tiers, and how to talk about cost with buyers" },
      ]},
      { type: "outcomes", items: [
        "Explain extended thinking and why it produces better code than instant generation",
        "Describe the context window's role and why it matters for enterprise codebases",
        "Recommend the right model and effort level for a given customer scenario",
        "Discuss token economics and cost ranges confidently with a buyer",
      ]},
      { type: "heading", value: "Extended thinking", simple: "How Claude stops to think before it acts" },
      { type: "text", value: "When Claude Code encounters a complex task — a multi-file refactor, a subtle bug, an architecture decision — it doesn't just generate code immediately. It thinks first. Extended thinking gives Claude a dedicated reasoning step where it analyzes the problem, considers approaches, anticipates edge cases, and plans its actions before writing a single line.", simple: "When Claude Code gets a hard task -- like changing code across many files or tracking down a tricky bug -- it does not just start typing code right away. It pauses to think first. This \"extended thinking\" step is like a developer sketching a plan on a whiteboard before writing any code. Claude looks at the problem, considers different approaches, thinks about what could go wrong, and maps out the steps before it changes anything." },
      { type: "text", value: "This is a critical differentiator in demos. When a prospect sees Claude pause to think through a problem, break it into steps, and then execute a coherent plan — that's the moment they stop comparing it to autocomplete. You can see the thinking process in real time in the CLI, which makes it a powerful demo moment.", simple: "This thinking step is one of the best things to show in a demo. When a potential customer watches Claude stop, reason through a problem, break it into steps, and then carry out a clear plan -- that is when they realize this is not just fancier autocomplete. You can watch the thinking happen in real time on screen, which makes it a very convincing moment." },
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
      { type: "heading", value: "Context window and codebase understanding", simple: "How much code Claude can read at once, and why that matters" },
      { type: "text", value: "Most AI coding tools see one file at a time — at best, a few open tabs. Claude Code operates with a context window of 200K tokens (Sonnet) to 1M+ tokens (with prompt caching), which means it can read and reason across your entire codebase simultaneously. It understands how your auth middleware connects to your route handlers, how your database schema maps to your API types, and where a change in one module will ripple.", simple: "Most AI coding tools can only see one file at a time. Claude Code has a much larger \"context window\" -- think of it as how much text the AI can hold in its head at once. With 200K tokens (roughly 500+ files worth of code), it can read and understand large portions of a project simultaneously. It sees how different parts of your code connect, so changes it makes fit the whole system." },
      { type: "text", value: "This is the foundation of the 'project-level' framing. When a customer asks \"Can Claude understand my whole repo?\" the answer is usually yes — and when the codebase is large enough to exceed the window, Claude Code automatically identifies the most relevant files to read first. It's not reading line-by-line. It's building a mental model of the system.", simple: "This is why we say Claude Code works at the \"project level.\" When a customer asks whether Claude can understand their whole codebase, the answer is usually yes. If the codebase is too big to fit in one pass, Claude automatically picks the most important files to read first. It is not reading one line at a time -- it is building an understanding of how the whole system fits together." },
      { type: "values", items: [
        { title: "200K tokens (Sonnet 4)", desc: "Roughly equivalent to 500+ files of typical source code. Enough for most microservices, full-stack apps, and medium-sized monorepos.", simpleDesc: "A token is roughly one word of text. 200,000 tokens means Claude can hold about 500 or more source code files in its working memory at once. That is enough to cover most small-to-medium projects entirely, so Claude sees the full picture rather than just one file at a time." },
        { title: "Prompt caching", desc: "Frequently-read files (like CLAUDE.md) are cached, reducing cost and latency. Cached tokens cost 90% less and load 85% faster.", simpleDesc: "When Claude reads the same file more than once (like your project instructions), it stores a copy so it does not have to reprocess it from scratch. This caching makes repeat reads 90% cheaper and 85% faster -- similar to how a web browser caches images so pages load quicker on return visits." },
        { title: "Smart file selection", desc: "For repos that exceed the window, Claude Code reads imports, directory structure, and type definitions to prioritize the most relevant files for the current task.", simpleDesc: "If a project is too large for Claude to hold everything at once, it gets strategic. It looks at how files reference each other, scans the folder layout, and reads type definitions to figure out which files matter most right now. Like a new team member who skims the table of contents before diving into the code that matters." },
      ]},
      { type: "heading", value: "Model selection — Haiku, Sonnet, and Opus", simple: "Choosing the right AI model -- small, medium, or large -- for each task" },
      { type: "text", value: "Claude Code defaults to Sonnet 4, but users can switch models mid-conversation. This matters because different tasks have different needs — and understanding the tradeoffs is essential for advising customers on their deployment.", simple: "Claude Code comes with a default AI model (Sonnet 4), but you can swap to a different one anytime during a conversation. Think of models like car engines -- some are built for speed and fuel economy, others for raw power. Picking the right one for the job helps balance performance and cost." },
      { type: "models", items: [
        { name: "Haiku", tag: "speed", color: C.blue, desc: "The fastest model. Best for simple, high-volume tasks: renaming variables, formatting files, generating boilerplate, running quick checks. 10–20× cheaper than Opus. Ideal for CI/CD automation where latency and cost matter more than reasoning depth.", simpleDesc: "The lightweight, fast option. Great for quick, repetitive tasks like renaming a variable across files or generating standard code templates. It is 10 to 20 times cheaper than the top model, making it ideal for automated pipelines (CI/CD -- systems that automatically build and test code) where speed and low cost matter most." },
        { name: "Sonnet", tag: "default", color: C.orange, desc: "The balanced model and Claude Code's default. Excellent at multi-file refactors, test generation, debugging, and architecture analysis. The best tradeoff of intelligence, speed, and cost for daily coding work.", simpleDesc: "The all-rounder and the one most people use day to day. It handles tasks that span multiple files, writes tests, fixes bugs, and analyzes how code fits together. It strikes the best balance between being smart, being fast, and keeping costs reasonable." },
        { name: "Opus", tag: "depth", color: C.green, desc: "The most intelligent model. Best for novel architecture decisions, complex debugging across systems, and tasks requiring deep reasoning about tradeoffs. Slower and more expensive, but produces solutions that Sonnet might miss.", simpleDesc: "The most powerful brain in the lineup. Use it for genuinely hard problems -- designing a new system from scratch, debugging a tricky issue that crosses multiple services, or making architecture decisions with lots of tradeoffs. It takes longer and costs more, but it can solve things the other models cannot." },
      ]},
      { type: "text", value: "In sales conversations, model selection is often the answer to \"How do we control costs?\" Teams can default to Sonnet for daily work, drop to Haiku for automated CI tasks, and escalate to Opus only when they hit a genuinely hard problem. This tiered approach typically reduces cost by 40–60% versus running everything on the strongest model.", simple: "When a customer asks about controlling costs, model selection is the key answer. Teams can use Sonnet for everyday work, switch to the cheaper Haiku for automated tasks (like running checks in a build pipeline), and only bring in the expensive Opus when they hit a truly difficult problem. This mix-and-match approach typically cuts costs by 40 to 60 percent compared to always using the most powerful model." },
      { type: "heading", value: "Cost model and token economics", simple: "How pricing works -- and why it is different from traditional software" },
      { type: "text", value: "Claude Code is priced by token usage, not by seat. This is a fundamental shift from most developer tools and it changes the sales conversation. There's no per-user license to negotiate — customers pay for what they use, which means the conversation shifts from 'How many seats?' to 'How much value per dollar?'", simple: "Instead of charging a flat fee per person (like most software subscriptions), Claude Code charges based on how much you actually use it. Think of it like a utility bill -- you pay for the electricity you consume, not a fixed rate regardless of usage. This means small teams pay less, and heavy users pay more, but only in proportion to the value they are getting." },
      { type: "values", items: [
        { title: "Input tokens", desc: "What Claude reads — your codebase files, CLAUDE.md, conversation history. Cached input tokens (repeated reads of the same files) cost 90% less.", simpleDesc: "Tokens are small chunks of text -- roughly one token per word. Input tokens cover everything Claude reads: your code files, your instructions, and the conversation so far. If Claude re-reads the same file, those tokens are 'cached' (stored for reuse), which cuts costs by 90%." },
        { title: "Output tokens", desc: "What Claude writes — code, explanations, plans, terminal commands. This is the larger cost driver for most coding tasks.", simpleDesc: "Output tokens are the text Claude produces -- the code it writes, its explanations, and any commands it runs. Writing new content costs more than reading existing content, so the amount Claude generates is usually the biggest factor in the bill." },
        { title: "Thinking tokens", desc: "When extended thinking is active, Claude's reasoning steps are billed as output tokens. More complex problems = more thinking = higher cost, but also higher quality.", simpleDesc: "When Claude pauses to reason before acting (its 'thinking step'), that internal reasoning counts as output and is billed accordingly. Harder problems require more thinking, so they cost more -- but they also produce better results, much like spending extra time planning a project upfront saves rework later." },
      ]},
      { type: "text", value: "A typical engineering team running Claude Code for daily development work sees costs between $50–200 per developer per month. Heavy users running large refactors or using Opus might see $300+. This is almost always cheaper than an additional engineering hire, which is the right comparison to draw in sales conversations — not the cost of a Copilot seat.", simple: "Most developers end up spending roughly $50 to $200 a month using Claude Code. Power users who tackle big tasks or use the strongest model might hit $300+. For perspective, hiring another engineer costs thousands per month in salary alone. That is the fair comparison -- not the price of other code-assistant subscriptions." },
      { type: "reflect", prompt: "A prospect says: 'We're worried about runaway costs if developers use this all day.' How would you structure a response using model selection, prompt caching, and the per-token pricing model? What's the right comparison point?" },
    ],
  },
  {
    id: "configuration", label: "Configuration", title: "Customizing Claude Code",
    content: [
      { type: "text", value: "Understanding how Claude Code thinks is step one. Step two is understanding how it's configured — because this is where the tool transforms from a generic coding assistant into a deployment tailored to a specific customer's codebase, workflow, and security requirements. Every concept in this section maps directly to a customer conversation you'll have.", simple: "Knowing how Claude Code thinks is the first step. The second step is learning how to customize it. Configuration is what turns a general-purpose coding assistant into one that knows your team's rules, your project structure, and your security requirements. Everything in this section will come up in real customer conversations." },
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
      { type: "text", value: "CLAUDE.md is a markdown file at the root of a project that gives Claude Code persistent instructions. Think of it as a system prompt for your codebase. It can include coding standards, architecture decisions, testing conventions, or anything you'd tell a new teammate on day one. It's the single most important configuration surface — every customer deployment should start here.", simple: "CLAUDE.md is a plain text file you put at the top of your project folder. It contains instructions that Claude reads every time it starts working on your code -- like a welcome document for a new hire. You can list your coding style rules, explain how the project is organized, and note anything important. It is the most important setup step for any team adopting Claude Code." },
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
      { type: "text", value: "CLAUDE.md files are hierarchical. A root CLAUDE.md sets project-wide rules, while CLAUDE.md files in subdirectories can add or override rules for specific packages. In a monorepo, the frontend team's CLAUDE.md might specify React patterns, while the backend team's specifies API conventions — all inheriting from a shared root.", simple: "You can layer CLAUDE.md files. A top-level one sets rules for the whole project, and additional CLAUDE.md files in subfolders can add or change rules for specific parts. In a large project with multiple teams (a \"monorepo\"), the frontend team can have their own rules while the backend team has different ones, and both inherit the shared basics from the top-level file." },
      { type: "placeholder", title: "Advanced CLAUDE.md patterns for enterprise teams", why: "When a team scales beyond a handful of developers, a single CLAUDE.md file isn't enough. Here's how enterprise teams structure their configuration. The .claude/rules/ directory lets you split rules into modular files — one per topic (e.g., testing-conventions.md, api-patterns.md, security-requirements.md). Each rule file can include YAML frontmatter with a 'paths' field that scopes it to specific directories using glob patterns, so your React component rules only activate when Claude is working in src/components/. The @import syntax (@path/to/shared-rules.md) lets you pull instructions from other files — even across repos via symlinks — so an org-wide style guide lives in one place and every repo inherits it. For monorepos, claudeMdExcludes lets you skip packages that shouldn't load CLAUDE.md files (e.g., third-party vendored code or legacy modules you don't want Claude touching). As a practical example: Meridian Health's monorepo has a root CLAUDE.md with org-wide standards (TypeScript strict, no any types, HIPAA logging requirements), a packages/api/CLAUDE.md with backend conventions (Express patterns, Prisma ORM usage), a packages/web/CLAUDE.md with frontend conventions (React hooks, Tailwind classes), and .claude/rules/hipaa-compliance.md with path-scoped rules that only activate for files handling patient data. The total across all files stays under 200 lines per scope. We'll go into this in more detail in the role-specific tracks coming up.", topics: [".claude/rules/", "@import syntax", "Path-specific rules", "claudeMdExcludes", "Monorepo strategies", "Size management"] },
      { type: "heading", value: "Slash commands and custom commands", simple: "Shortcuts that trigger common workflows with a single command" },
      { type: "text", value: "Slash commands are shortcuts that trigger predefined workflows. Claude Code ships with built-in commands like /review (code review), /test (run tests), and /commit (stage and commit changes). But the real power is custom commands — teams can create their own.", simple: "Slash commands are one-word shortcuts you type to kick off a task. Claude Code comes with built-in ones like /review (review code for issues), /test (run tests), and /commit (save your changes). The real value is that teams can create their own custom commands for workflows they repeat often." },
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
      { type: "text", value: "Custom commands are stored as markdown files in .claude/commands/ and are shared via git — which means a tech lead can define workflows once and the entire team inherits them. This is a powerful selling point for engineering managers: standardized quality checks that don't require anyone to remember a process.", simple: "Custom commands are saved as simple text files in a .claude/commands/ folder inside the project. Because they live in git, a team leader can write them once and every developer automatically gets them. This standardizes quality checks without relying on people to remember checklists." },
      { type: "heading", value: "Memory and project settings", simple: "How Claude remembers your preferences between sessions" },
      { type: "text", value: "Claude Code remembers context across sessions through two mechanisms. Project-level memory lives in CLAUDE.md (version-controlled, shared). User-level memory lives in ~/.claude/settings.json (personal preferences, global defaults). When Claude learns that you prefer functional components over class components, or that you always want tests written in Vitest instead of Jest — it remembers.", simple: "Claude Code does not forget everything when you close it. It stores project-level memory in CLAUDE.md (shared with the team through git) and personal memory in a settings file on your computer. If you tell Claude you prefer a certain coding style, it remembers next time." },
      { type: "values", items: [
        { title: "Project memory (CLAUDE.md)", desc: "Shared across the team via git. Architecture decisions, coding standards, tool preferences. The 'team brain' for the codebase.", simpleDesc: "The shared team knowledge stored in CLAUDE.md and checked into git so every team member has the same instructions -- like a shared document that says \"here is how we do things on this project.\"" },
        { title: "User memory (~/.claude/)", desc: "Personal preferences that follow you across projects. Output format preferences, default model choice, frequently used tools.", simpleDesc: "Your personal preferences stored on your own computer. These follow you from project to project -- things like your preferred output format or favorite model." },
        { title: "Session context", desc: "Within a single session, Claude remembers everything discussed. Useful for iterative work — 'Now do the same thing for the user module.'", simpleDesc: "While you are in a single conversation, Claude remembers everything you discussed. You can say \"now do the same thing for the other module\" and it knows what you mean. This memory resets when you start a new session." },
      ]},
      { type: "heading", value: "Hooks — control and guardrails", simple: "Automatic checks that run before or after Claude takes an action" },
      { type: "text", value: "Hooks let you run custom scripts before or after Claude Code takes actions. A 'pre-commit hook' runs automatically before Claude commits code to version control — for example, enforcing linting (automated style and error checking) or type checking (verifying that the code's data types are correct). A 'post-edit hook' runs after Claude modifies a file — for example, running the relevant test suite to catch regressions immediately. Hooks are deterministic guardrails, not suggestions: if a hook fails, the action is blocked. This is the answer to every security-conscious customer who asks, \"How do I control what Claude does?\"", simple: "Hooks are automatic checkpoints that run before or after Claude does something. A 'pre-commit hook' runs just before Claude saves code — for example, it can check for style errors ('linting' means running a tool that flags formatting problems and common mistakes) or verify data types are correct ('type checking'). A 'post-edit hook' runs right after Claude changes a file — for example, it can automatically run the relevant tests to make sure nothing broke. The key point: hooks are hard stops, not suggestions. If a hook fails, the action is blocked entirely. This is the answer when a security-focused customer asks how they keep Claude in check." },
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
      { type: "heading", value: "Permission modes — how much Claude asks", simple: "How you control how much supervision Claude gets in real time" },
      { type: "text", value: "Permission modes control how much autonomy Claude has during a session — how often it pauses to ask before acting. You set the mode when you start working, and can switch between them. These are user-facing controls that determine the interaction feel.", simple: "Permission modes are like a dial that controls how independent Claude is while you work. You choose the setting, and you can change it anytime. This is about the real-time experience — how much Claude checks in with you as it works." },
      { type: "values", items: [
        { title: "Default mode", desc: "Claude asks permission before writing files, running commands, or making network requests. The user approves each action. Best for learning, exploring unfamiliar codebases, or sensitive work where you want to review every step.", simpleDesc: "Claude pauses and asks before making changes, running commands, or accessing the network. You approve each step. Best when you're learning the tool, working in a new codebase, or doing anything sensitive." },
        { title: "Plan mode", desc: "Claude only thinks and plans — it reads files and proposes an approach but takes no actions. Useful for reviewing strategy before committing to changes, and for building trust in customer demos where the audience wants to see Claude's reasoning before it acts.", simpleDesc: "Claude reads your code and thinks through a plan, but doesn't change anything. It shows you what it would do and why. Great for checking Claude's approach before letting it act, and powerful in demos where you want the audience to see the reasoning." },
        { title: "Auto-accept mode", desc: "Claude executes without asking, within configured boundaries. Good for experienced users who trust their CLAUDE.md and hook setup. Also called 'Accept Edits' — Claude writes code and runs commands freely, but hooks and permission rules still apply.", simpleDesc: "Claude works on its own without pausing for approval. It writes code, runs commands, and makes changes freely. But it's not unconstrained — hooks and permission rules (covered below) still apply. Like giving a trusted colleague the go-ahead within clear guardrails." },
        { title: "Headless mode", desc: "No human in the loop — Claude runs autonomously in CI/CD pipelines. Permissions are entirely configured via settings files and managed policies. This is the enterprise deployment pattern for GitHub Actions, automated code review, and scheduled tasks.", simpleDesc: "No human watches in real time. Claude runs inside automated pipelines (CI/CD — systems that automatically test and deploy code). All permissions are set in advance through config files. This is how large companies run Claude Code at scale in GitHub Actions and automated workflows." },
      ]},
      { type: "heading", value: "Permission rules — what Claude is allowed to do", simple: "The underlying rules that control what actions Claude can take, regardless of mode" },
      { type: "text", value: "Separate from modes, Claude Code has a permission rules system that determines which actions are structurally allowed, regardless of which mode is active. These rules persist across sessions and can be enforced by administrators. Even in auto-accept mode, a deny rule will block the action.", simple: "No matter which mode you're using, there's a separate layer of rules underneath that controls what Claude is actually allowed to do. These rules live in settings files and stay the same across sessions. Even if you're in auto-accept mode (where Claude doesn't ask), a deny rule will still block the action. Think of modes as 'how often Claude checks in' and rules as 'what Claude is allowed to do at all.'" },
      { type: "values", items: [
        { title: "Allow rules", desc: "Actions Claude can take without asking — even in default mode. Example: allow running npm test without prompting every time. Reduces permission fatigue for safe, repeated commands.", simpleDesc: "A list of things Claude can do without asking, even in the most cautious mode. For example, you might allow 'npm test' so Claude doesn't ask every time it wants to run tests. This prevents 'permission fatigue' — getting asked so often that you start blindly approving." },
        { title: "Deny rules", desc: "Actions Claude is never allowed to take, regardless of mode. Example: deny running rm -rf or curl to prevent destructive commands and data exfiltration. Deny rules override everything — they can't be bypassed by any mode.", simpleDesc: "A list of things Claude can never do, no matter what. For example, you can block destructive commands like 'rm -rf' (delete everything) or 'curl' (send data over the network). Deny rules are absolute — no mode, no setting, no prompt can override them." },
        { title: "Managed policies", desc: "Organization-wide rules set by administrators that take highest precedence and can't be overridden by individual users. A security team can enforce deny rules, restrict MCP servers, and require specific configurations across every developer's install.", simpleDesc: "Rules set by an IT or security team that apply to every developer in the company. Individual users can't change them. This is how a company ensures every Claude Code install follows the same security standards — like a company-wide IT policy, but for AI." },
      ]},
      { type: "heading", value: "MCP in Claude Code", simple: "Connecting Claude to your company's other tools and systems" },
      { type: "text", value: "Claude Code can connect to MCP (Model Context Protocol) servers, just like Claude.ai. But in a coding context, this means connecting Claude to your customer's internal tools — Jira for ticket context, Datadog for error logs, Confluence for documentation, Figma for design specs. It's the bridge between 'AI coding assistant' and 'AI that understands our whole engineering workflow.'", simple: "MCP (Model Context Protocol) is a way for Claude to talk to other software tools. For example, Claude could pull ticket details from Jira (a project tracker), read error logs from Datadog (a monitoring tool), or look at design files in Figma. It turns Claude from just a coding helper into something that understands your entire engineering workflow." },
      { type: "text", value: "MCP also expands who can get value from Claude Code. When non-developer users — product managers, data analysts, technical writers — can pull context from internal APIs, monitoring dashboards, or documentation systems through MCP connectors, Claude Code becomes accessible well beyond the engineering team. Enterprise sales won't hinge on MCP alone, but the data connections it provides turn Claude Code from a developer-only tool into something useful across technical roles. The MCP ecosystem has 1000+ pre-built connectors, and custom servers can be built in an afternoon.", simple: "MCP also expands who can benefit from Claude Code beyond just developers. When product managers, data analysts, or technical writers can pull context from internal systems through MCP connectors -- project trackers, dashboards, documentation -- Claude Code becomes useful across many technical roles, not just engineering. Enterprise deals won't depend on MCP alone, but it makes the tool accessible to a much wider set of users. There are over 1,000 ready-made connectors, and building a custom one takes an afternoon." },
      { type: "placeholder", title: "Monitoring, observability, and usage tracking", why: "Enterprise customers will ask: 'How do I see what Claude Code is doing across my org?' Claude Code has a full observability stack. OpenTelemetry integration (opt-in via CLAUDE_CODE_ENABLE_TELEMETRY=1) exports session counts, token usage, cost per model, lines of code changed, and tool permission decisions — all as standard OTel metrics you can pipe into Prometheus, Grafana, or any existing monitoring setup. ConfigChange hooks fire when settings are modified and can block unauthorized changes, giving security teams an audit trail. The Anthropic Console provides workspace-level spend limits and usage reporting. In-session, /cost shows token usage for API users and /stats shows usage patterns for subscribers. This matters for security teams (who touched what?), finance teams (what's it costing us?), and engineering leadership (is it actually being adopted?) — the three stakeholders who gate every enterprise rollout.", topics: ["OpenTelemetry metrics and events", "Anthropic Console spend limits", "ConfigChange hooks for audit", "/cost and /stats commands", "Prometheus / Grafana integration"] },
      { type: "reflect", prompt: "A CISO at a Fortune 500 company asks: 'How do I know Claude Code won't push untested code to production?' Walk through how you'd answer using CLAUDE.md, hooks, and the permissions model." },
    ],
  },
  {
    id: "security", label: "Security", title: "Security & trust",
    content: [
      { type: "text", value: "Security is the first conversation in every enterprise deal, and often the last obstacle before a 'yes.' Claude Code was built with a defense-in-depth model — multiple independent layers that each reduce risk. Understanding these layers fluently is the difference between a customer feeling reassured and feeling dismissed.", simple: "Security is usually the biggest concern for companies considering Claude Code. Claude Code uses a 'defense-in-depth' approach -- think of it like a bank vault with multiple locks: a guard, a keycard, a combination, and a time delay. Each layer works on its own, so even if one is bypassed, the others still protect you. If you can explain these layers clearly, customers feel safe. If you stumble, the deal stalls." },
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
      { type: "heading", value: "Sandboxing — filesystem and network isolation", simple: "Sandboxing -- keeping Claude in a restricted space. 'Sandboxing' means putting software inside a walled-off area where it can only access certain files and network connections. Think of it like a playground fence: Claude can play inside, but it cannot wander into the rest of your system." },
      { type: "text", value: "Claude Code runs bash commands in a sandbox that restricts both filesystem access and network activity. Write access is limited to the working directory and its children. Network requests require explicit approval. This isn't just a setting you can toggle — it's an OS-level isolation boundary that applies even if a prompt injection attempts to break out.", simple: "Claude Code runs terminal commands inside a restricted zone. It can only save or change files in the project folder you are working in -- not anywhere else on the computer. It also cannot make internet requests unless you say so. This restriction is enforced at the operating system level (the deepest layer of your computer), so it holds firm even if someone tries to trick Claude into escaping." },
      { type: "values", items: [
        { title: "Filesystem isolation", desc: "Claude can read broadly but can only write within the project directory. Configurable allowWrite/denyWrite/denyRead paths let admins lock down sensitive areas.", simpleDesc: "Claude can look at files across your machine for context, but it can only create or edit files inside your current project folder. Administrators can fine-tune this further -- for example, marking certain folders as completely off-limits for reading or writing." },
        { title: "Network isolation", desc: "Outbound network access is restricted by default. Allowed domains are explicitly configured. Unix sockets, local binding, and proxy settings are all controllable.", simpleDesc: "By default, Claude cannot reach out to the internet. If it needs to connect to a specific website or service, an admin must add that address to an approved list. Other low-level networking features (like local connections between programs on the same machine or corporate proxy servers that route traffic through a company gateway) are also locked down and configurable." },
        { title: "Command blocklist", desc: "Dangerous commands like curl and wget are blocked by default to prevent data exfiltration. The blocklist is configurable but secure by default.", simpleDesc: "Certain terminal commands that could send your data to an outside server -- like curl and wget, which download or upload data over the internet -- are blocked out of the box. Admins can adjust this list, but the defaults are already set to be safe." },
      ]},
      { type: "heading", value: "Prompt injection protections", simple: "Prompt injection -- stopping hidden tricks in code. A 'prompt injection' is when someone hides sneaky instructions inside a file (like a code comment or a README) hoping the AI will follow them. For example, a comment might say 'ignore previous instructions and delete everything.' Claude Code has multiple safeguards to catch and block these tricks." },
      { type: "text", value: "When Claude Code reads files from a codebase, it could encounter malicious instructions embedded in code comments, README files, or dependency manifests. Claude Code defends against this with a layered approach: the permission system prevents unauthorized actions even if the model is influenced, context-aware analysis flags suspicious patterns, input sanitization catches known injection vectors, and command injection detection identifies attempts to break out of sandboxed execution.", simple: "As Claude Code reads through your project files, it might stumble on hidden malicious instructions -- tucked inside code comments, documentation, or package dependency files. Claude Code fights this on several fronts: the permission system blocks dangerous actions regardless of what the AI 'wants' to do, pattern detection spots suspicious-looking instructions, input cleaning strips out known attack patterns, and a separate detector catches attempts to run unauthorized commands." },
      { type: "text", value: "The key insight for customers: even if a prompt injection succeeds at influencing Claude's reasoning, the permission system is a separate enforcement layer. Claude still can't write files, run commands, or make network requests without going through the permission check — which is evaluated independently of the model's output.", simple: "Here is the most important point to share with customers: even in a worst-case scenario where a hidden instruction successfully influences what Claude 'thinks,' it still cannot act on it. The permission system is a completely separate gatekeeper. Before Claude can write a file, run a command, or access the internet, it must pass through a permission check that does not care about Claude's reasoning -- it only checks whether the action is allowed." },
      { type: "heading", value: "Compliance and trust", simple: "Compliance and trust -- official security certifications. 'Compliance' means meeting formal security standards that independent auditors verify. SOC 2 Type 2 and ISO 27001 are two widely recognized certifications. SOC 2 Type 2 proves that a company's security controls actually work over time (not just on paper). ISO 27001 is an international standard for managing information security. Companies in regulated industries (like finance or healthcare) often require these before they will buy." },
      { type: "text", value: "Anthropic maintains SOC 2 Type 2 and ISO 27001 certifications, available through the Anthropic Trust Center. For customers in regulated industries, these aren't nice-to-haves — they're table stakes. Know where to point customers: the Trust Center has the audit reports, the data processing agreements, and the security whitepapers.", simple: "Anthropic has passed SOC 2 Type 2 and ISO 27001 audits -- these are official security certifications that independent auditors verify. You can find the proof on the Anthropic Trust Center website. For customers in industries with strict rules (banking, healthcare, government), these certifications are mandatory requirements, not bonus features. The Trust Center also has data processing agreements (legal contracts about how data is handled) and detailed security documents." },
      { type: "values", items: [
        { title: "Data retention", desc: "Limited retention of session data. Customers control whether their data is used for model training — and can opt out completely.", simpleDesc: "Anthropic only keeps session data (what you and Claude discussed, what code was shared) for a limited time. Customers decide whether their data can be used to improve future AI models. If they do not want their data used for training at all, they can opt out completely -- no questions asked." },
        { title: "Access controls", desc: "Session data access is restricted within Anthropic. Enterprise customers get additional controls through Bedrock/Vertex deployments.", simpleDesc: "Inside Anthropic, only authorized people can see session data -- it is not open to everyone at the company. Enterprise customers who deploy through AWS Bedrock or Google Vertex AI get even more control, because their data stays entirely within their own cloud account." },
        { title: "Credential handling", desc: "API keys and credentials are stored securely and never included in model context. Claude Code uses the operating system's secure credential storage.", simpleDesc: "Your passwords and API keys (the secret codes that let software connect to services) are stored in your operating system's built-in secure vault -- the same place your computer keeps Wi-Fi passwords and login credentials. These secrets are never shown to the AI model itself, so Claude never 'sees' your passwords." },
      ]},
      { type: "heading", value: "Managed settings for teams", simple: "Managed settings -- centralized admin controls for teams. 'Managed settings' are configuration rules that a company's IT or security team sets up once, and those rules then apply to every developer's Claude Code installation automatically. Individual developers cannot override them. Think of it like a school's Wi-Fi policy: the IT department sets the rules, and no student can change them on their own laptop." },
      { type: "text", value: "For enterprise deployments, administrators can enforce security policies across every developer's Claude Code install. Managed settings take highest precedence and can't be overridden by individual users. This means a security team can enforce permission rules, restrict MCP servers to an approved list, disable dangerous bypass modes, and require specific hook configurations — all centrally.", simple: "When a company rolls out Claude Code to many developers, administrators can set security rules that apply to everyone. These 'managed settings' are the highest priority -- a developer cannot turn them off or change them. For example, the security team can: control what actions Claude is allowed to take, limit which external tool servers (called MCP servers) Claude can connect to, turn off any modes that skip safety checks, and require specific automated checks (called hooks) to run before or after Claude takes actions. All of this is controlled from one central place." },
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
      { type: "text", value: "Most enterprise customers won't run Claude Code through Anthropic's consumer API. They'll deploy through their cloud provider — AWS Bedrock, Google Vertex AI, or Microsoft Foundry — because their procurement, compliance, and billing already live there. Understanding the deployment landscape and cost model is essential for every customer-facing role.", simple: "Most large companies won't connect Claude Code directly to Anthropic's servers. Instead, they'll run it through their own cloud provider — like ordering through a distributor rather than buying direct from the manufacturer. The three big distributors are AWS Bedrock (Amazon's AI platform), Google Vertex AI (Google's AI platform), and Microsoft Foundry (Microsoft's AI platform). Companies prefer this because their security, billing, and legal agreements are already set up with these providers. If you talk to customers, you need to understand how this works and what it costs." },
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
      { type: "text", value: "Claude Code supports three major cloud providers, each with its own authentication model. The key message for customers: your data stays in your cloud, billed through your existing agreement, with no additional Anthropic account required.", simple: "Claude Code works with three major cloud platforms. Each one has its own way of verifying who you are (authentication). The important thing to tell customers: their code and data never leave their own cloud account. It shows up on their existing cloud bill. They don't need to create a separate Anthropic account." },
      { type: "values", items: [
        { title: "AWS Bedrock", desc: "Uses IAM roles and OIDC authentication. Data stays in the customer's AWS account. Integrates with CloudTrail for audit logging. Most common in enterprises already on AWS.", simpleDesc: "Amazon's AI platform. IAM roles are Amazon's system for controlling who can access what (like keycards for different rooms). OIDC is a way to verify identity without sharing passwords. CloudTrail is Amazon's activity log — it records everything that happens, which auditors love. If a company already uses AWS, this is almost always their first choice." },
        { title: "Google Vertex AI", desc: "Uses Workload Identity Federation and service accounts. Integrates with Google Cloud's security and billing. Common in GCP-native organizations.", simpleDesc: "Google's AI platform. Workload Identity Federation is Google's way of letting services prove who they are without storing passwords — think of it like a trusted badge system. Service accounts are special accounts for software (not people) to use. If a company already runs on Google Cloud, this is the natural fit." },
        { title: "Microsoft Foundry", desc: "Uses Azure-managed credentials. Integrates with Azure Active Directory. Newer option — growing fast in Microsoft-heavy enterprises.", simpleDesc: "Microsoft's AI platform. Azure-managed credentials means Microsoft handles the login details automatically, so no one has to manage passwords by hand. Azure Active Directory is Microsoft's system for managing who has access to what across the company — most big enterprises already use it for email and internal apps. This is the newest option of the three but growing quickly with companies that are already Microsoft shops." },
      ]},
      { type: "text", value: "For all three providers, the setup is environment variables plus cloud-native auth. No API keys stored locally, no Anthropic account needed. Customers can also route through LLM gateways or corporate proxies — Claude Code supports HTTPS_PROXY, custom base URLs, and gateway configurations out of the box.", simple: "Setting it up is straightforward for all three clouds. You configure a few environment variables (settings that tell Claude Code where to connect) and use the cloud's built-in login system. No one needs to save secret API keys on their laptop, and no one needs an Anthropic account. If the company uses a proxy or gateway (a middleman server that monitors or filters traffic), Claude Code supports that too — just point it at the right address." },
      { type: "heading", value: "GitHub Actions and CI/CD", simple: "Automating Claude Code in your development pipeline" },
      { type: "text", value: "Claude Code runs in CI/CD pipelines as a headless agent. The most common pattern is GitHub Actions: developers @mention Claude in PRs and issues, and Claude responds with code changes, reviews, or implementations. This is the 'always-on teammate' story that excites engineering leaders.", simple: "CI/CD (Continuous Integration / Continuous Deployment) is the automated pipeline that tests and ships code. GitHub Actions is GitHub's built-in automation system — it runs tasks automatically when certain things happen. Claude Code can plug into this pipeline and run without a human at the keyboard (\"headless\"). The most popular setup: a developer tags @claude in a pull request or issue on GitHub, and Claude automatically responds with code changes, a review, or a full implementation. Think of it as a teammate who is always online and ready to help. Engineering leaders love this pitch." },
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
      { type: "text", value: "Use cases that land well: automated code review on every PR, implementing small changes directly from issue comments, running security audits before merge, and generating test coverage for untested code. The setup takes minutes — install the GitHub app, add an API key secret, and drop in the workflow file.", simple: "Here are the use cases that get customers excited: Claude automatically reviews every pull request (proposed code change), makes small code fixes when someone asks in a comment, checks for security issues before code gets merged, and writes tests for code that does not have any yet. Getting started is fast — add the GitHub app, store an API key as a secret, and add a small config file. It takes minutes, not days." },
      { type: "heading", value: "What it costs", simple: "Pricing and how to talk about it" },
      { type: "text", value: "Cost is always part of the conversation. Here are the numbers you need:", simple: "Customers will always ask about price. Here are the key figures to have ready:" },
      { type: "values", items: [
        { title: "~$6/developer/day average", desc: "This is the real-world average across all Claude Code usage. 90% of developers spend less than $12/day. Monthly, expect ~$100–200/developer with Sonnet.", simpleDesc: "On average, each developer costs about $6 per day in Claude Code usage. Most developers (9 out of 10) spend less than $12 a day. Over a month, that works out to roughly $100 to $200 per developer when using the Sonnet model (one of Claude's model tiers, optimized for speed and cost)." },
        { title: "Pay-as-you-go", desc: "API and cloud provider deployments (Bedrock, Vertex, Foundry) are usage-based. No per-seat commitment — customers pay for what they use.", simpleDesc: "PAYG (pay-as-you-go) means you only pay for what you actually use — like a utility bill, not a fixed subscription. When running through a cloud provider like Bedrock, Vertex, or Foundry, there is no upfront commitment or per-person fee. Use more, pay more. Use less, pay less." },
        { title: "Per-seat plans", desc: "Claude for Teams at $150/seat/month (Premium). Enterprise pricing is custom. Both include Claude Code access alongside Claude.ai.", simpleDesc: "A \"seat\" means one person's license. Claude for Teams costs $150 per person per month on the Premium tier. Enterprise pricing is negotiated case by case. Both plans include access to Claude Code (the coding tool) and Claude.ai (the chat interface) together." },
        { title: "Spend controls", desc: "Workspace-level spend limits in the Anthropic Console. Bedrock/Vertex have their own budget controls. Rate limits are configurable per-user.", simpleDesc: "Companies can set spending caps so costs never surprise them. The Anthropic Console (an admin dashboard) lets you set limits at the workspace level. If running through Bedrock or Vertex, those platforms have their own budget tools too. You can also limit how much any individual user can use per hour or per day." },
      ]},
      { type: "text", value: "The ROI framing that works: if Claude Code saves a developer even 30 minutes a day, that's 10+ hours a month. At a fully-loaded engineering cost of $150–250/hour, that's $1,500–2,500 in recovered time against $100–200 in Claude Code costs. Most teams report saving significantly more than 30 minutes.", simple: "ROI (Return on Investment) is how you show the tool pays for itself. Here is the math: if Claude Code saves a developer just 30 minutes a day, that adds up to over 10 hours per month. A developer's \"fully loaded\" cost (salary plus benefits, office space, equipment) is typically $150 to $250 per hour. So 10 saved hours equals $1,500 to $2,500 in recovered value — and Claude Code only costs $100 to $200 per month. That is a 10x return at minimum. Most teams report saving well over 30 minutes a day." },
      { type: "heading", value: "Team rollout patterns", simple: "How to grow from one developer to the whole company" },
      { type: "text", value: "Enterprise adoption follows a consistent pattern. Customers rarely go from zero to org-wide in one step. Help them plan the journey:", simple: "Big companies almost never flip a switch and roll out a tool to everyone at once. They start small and expand. This is a good thing — it lets them build confidence and prove value at each stage. Here is the typical path:" },
      { type: "values", items: [
        { title: "Phase 1: Pilot (1–5 developers)", desc: "Install Claude Code, write a CLAUDE.md, use it for daily coding. Goal: prove individual value and build internal champions.", simpleDesc: "Start with a handful of enthusiastic developers. They install Claude Code, create a CLAUDE.md file (a configuration file that tells Claude about the project's conventions and rules), and use it for everyday work. The goal is simple: prove it works and get a few people excited enough to tell their teammates. These early fans become your internal champions who sell the tool from the inside." },
        { title: "Phase 2: Team (5–25 developers)", desc: "Standardize CLAUDE.md across repos, add hooks for quality gates, connect MCP to internal tools. Goal: show team-level productivity gains.", simpleDesc: "Expand to a full team. Standardize the CLAUDE.md file across all code repositories so everyone gets consistent behavior. Add hooks (automated checks that run before or after Claude takes an action, like requiring tests to pass). Connect MCP servers (plugins that let Claude talk to internal tools like Jira or Datadog). The goal: show measurable productivity improvements across the team, not just individual success stories." },
        { title: "Phase 3: Organization (25+ developers)", desc: "Deploy via Bedrock/Vertex, enforce managed settings, add GitHub Actions automation, roll out training. Goal: make Claude Code part of the engineering platform.", simpleDesc: "Go company-wide. Deploy through the cloud provider (Bedrock or Vertex) so IT can manage it centrally. Lock down settings with managed configuration so the security team is comfortable. Turn on GitHub Actions automation so Claude helps on every pull request. Run training sessions so everyone knows how to use it well. The goal: Claude Code becomes a standard part of how the company builds software, like version control or CI/CD." },
      ]},
      { type: "placeholder", title: "Migration patterns from competing tools", why: "Most enterprise prospects aren't starting from zero — they already use Copilot, Cursor, or Cody. The good news: Claude Code doesn't require replacing anything. Here's the coexistence playbook. Copilot and Claude Code serve different layers: Copilot handles line-level autocomplete inside the editor (fast, low-effort suggestions while typing), while Claude Code handles project-level agentic tasks (multi-file refactors, test generation, debugging across modules). Many teams run both — Copilot for the small stuff, Claude Code for the big stuff. Don't position it as a replacement; position it as a new capability they didn't have. For teams coming from Cursor: Cursor is an AI-native editor that replaces VS Code. Claude Code is editor-agnostic — it works in their existing VS Code, JetBrains, terminal, or browser. The migration path is additive: keep your editor, add Claude Code alongside it. For the first 30 days, follow this playbook: Week 1, install Claude Code and use it for codebase Q&A and small fixes only (low risk, immediate value). Week 2, write a CLAUDE.md and use it for a real task — a refactor or feature the team has been deferring. Week 3, add hooks and connect one MCP server (Jira or Slack — whichever the team uses most). Week 4, run a retrospective: what worked, what didn't, what to expand. A side-by-side evaluation works well: give three developers the same task, have one use Copilot only, one use Claude Code only, and one use both. Compare time to completion, code quality, and test coverage. The results speak for themselves. Example: Prism Analytics ran this evaluation on a database migration task. The Copilot-only developer finished in 6 hours with 70% test coverage. The Claude Code developer finished in 2 hours with 95% test coverage. The developer using both finished in 90 minutes — Copilot for quick edits while Claude Code handled the multi-file migration logic.", topics: ["Copilot coexistence", "Cursor migration", "First 30 days playbook", "Side-by-side evaluation framework", "Developer change management"] },
      { type: "placeholder", title: "Customer case studies and voice of the customer", why: "Nothing closes a deal like another customer's story. Build a library of 3-5 case studies covering different industries, team sizes, and adoption stages. Each should follow a consistent structure: the team before Claude Code (size, stack, pain points), what they deployed (which features, what configuration, how long setup took), what changed in 90 days (measurable outcomes like hours saved, PR cycle time reduction, or onboarding acceleration), and what surprised them (unexpected use cases, initial resistance, what almost went wrong). When choosing which stories to bring into a sales call, match on two dimensions: industry similarity (a fintech prospect trusts a fintech story) and problem similarity (a team struggling with test coverage trusts a story about test coverage, even from a different industry). The second dimension is often more powerful — a healthcare company that cut migration time by 70% resonates with any prospect facing migration pain, regardless of industry. Trainees should internalize 2-3 stories deeply enough to tell them without notes: the company, the problem, the number, and the quote. A sentence like 'a 40-person fintech team reduced their PR cycle time by 60% in the first quarter' changes a room.", topics: ["Fintech case study", "Healthcare / regulated", "Large enterprise (500+ devs)", "Startup / fast-moving team", "Migration from competitor"] },
      { type: "reflect", prompt: "A VP of Engineering asks: 'We have 200 developers on AWS. What does a Claude Code rollout look like and what will it cost us?' Sketch out the deployment architecture, phasing plan, and back-of-napkin cost estimate." },
    ],
  },
    ],
  },
];

// ─── MODULES (the 5-day curriculum) ───
const MODULES = [
  {
    id: 1, number: "01", day: "Day 1",
    title: "First contact",
    subtitle: "Install Claude Code in the terminal and VS Code, navigate both interfaces, and complete your first agentic task. Everyone starts here.",
    clientScenario: { company: "Meridian Health", industry: "Healthcare SaaS", situation: "Meridian Health's 8-person backend team needs 2–3 days to add new API endpoints due to boilerplate and testing overhead. Your job: install Claude Code and deliver their first real productivity win — a new endpoint built in minutes, not days." },
    materials: [
      { id: "M1", label: "Install & First Run cheat sheet", when: "Print before starting — follow alongside steps 1-4" },
      { id: "F3a", label: "Claude Code at a Glance", when: "Reference card to keep at your desk" },
    ],
    skills: ["Terminal install", "VS Code / JetBrains setup", "Basic prompting", "Navigation", "First agentic task"],
    modality: { live: "45 min", lab: "45 min", selfPaced: "30 min pre-work" },
steps: [
      { title: "Install and authenticate", context: "terminal", desc: "Install Claude Code globally, authenticate with your Anthropic account, and verify the installation.", commands: ["npm install -g @anthropic-ai/claude-code", "claude auth", "claude --version"], expected: "You should see a success message with the installed version number, a browser window to log in, and the version number confirming everything works.", materialRef: { id: "M1", note: "Follow along with the Install & First Run cheat sheet for troubleshooting tips" }, tip: "If you're on a company network that blocks the browser redirect, ask your facilitator for the manual token flow." },
      { title: "Set up your IDE and clone the repo", context: "vscode", desc: "Open VS Code (or JetBrains) and install the Claude Code extension. Search for 'Claude Code' in the Extensions marketplace and click Install. Then open the Command Palette and run 'Claude Code: Sign In' to authenticate. Once your IDE is ready, clone the sample Express API we'll use as our playground.", commands: ["git clone https://github.com/anthropics/claude-code-sample-api.git", "cd claude-code-sample-api", "npm install"], tip: "In JetBrains, the plugin is available in the JetBrains Marketplace under the same name. The setup flow is similar." },
      { title: "Launch Claude Code", context: "terminal", desc: "Start an interactive Claude Code session. Watch how it reads the directory structure and key files automatically — this is the agentic difference.", commands: ["claude"], tip: "Notice how Claude reads your package.json, directory structure, and any CLAUDE.md file before you even type a prompt. This is context gathering — the first step of the agentic loop." },
      { title: "Your first agentic task", context: "claude", desc: "Give Claude a real task that requires reading existing code, planning changes, and modifying multiple files. Type this prompt into the Claude Code session:", prompt: "Add a GET /health endpoint that returns { status: 'ok', timestamp: Date.now(), uptime: process.uptime() }. Put it in the existing routes file. Then write a test for it using the same testing patterns as the existing tests.", expected: "Claude should: 1) Read the existing route files and test files, 2) Plan the changes, 3) Add the endpoint, 4) Write a matching test, 5) Optionally run the test to verify." },
      { title: "Verify and compare surfaces", context: "terminal", desc: "Run the tests to verify Claude's work, then open the same repo in VS Code to compare the IDE experience. Notice how the terminal gives you raw speed while the IDE gives you inline diffs and a visual file tree.", commands: ["npm test"], expected: "All tests should pass, including the new health endpoint test.", tip: "Open the Claude Code panel in VS Code (click the Claude icon in the sidebar or use Cmd/Ctrl+Shift+P → 'Claude Code: Open') and try a similar prompt like 'Add a GET /version endpoint that returns the package version from package.json. Write a test for it.' Compare the experience: both surfaces use the same agentic engine underneath." },
      { type: "checkpoint", title: "Reflect and compare", desc: "You've now used Claude Code in both the terminal and your IDE. Before moving on, think about: What felt different between the two surfaces? When would you reach for the CLI vs. the IDE? How would you describe the agentic loop to a customer who's used to autocomplete tools like Copilot?" },
    ],
        challenge: "Install Claude Code in both the terminal and VS Code on Meridian's sample API repo. Use it to add a /health endpoint with tests. Explain to the team lead how the agentic approach changes their velocity.",
    output: "Working install (CLI + IDE) + first agentic task recording + client talking points",
    gaps: [
      { title: "Troubleshooting installation in customer environments", why: "The happy path install takes 5 minutes, but PEs encounter corporate proxies, PATH conflicts, WSL2 sandbox issues, and Docker edge cases regularly. A hands-on troubleshooting exercise using the /doctor diagnostic command would prepare trainees for real-world install failures.", topics: ["Corporate proxy / VPN", "TLS/SSL certificate errors", "PATH conflicts", "WSL2 sandbox setup", "Docker installs", "/doctor command"] },
      { title: "Narrating the agentic loop during a live demo", why: "Using Claude Code and demoing it are different skills. Trainees need practice narrating each phase of the agentic loop (read, plan, act, verify) in real time — especially recovering gracefully when Claude makes a mistake mid-demo.", topics: ["Live narration technique", "Recovering from mistakes", "Pacing and pausing", "What to highlight vs. skip", "Handling audience questions mid-demo"] },
    ],
    color: C.orange,
    competencies: {
      "pe-pre": "Demo Claude Code's install and first-run experience to a prospect — narrate the agentic loop as it happens and explain why it matters vs. autocomplete",
      "pe-post": "Set up Claude Code in a customer's dev environment, troubleshoot common installation issues, and guide a developer through their first agentic task",
      "sa": "Articulate the agentic coding value proposition to a technical audience and map it to common customer pain points (manual refactors, slow onboarding, test coverage gaps)",
      "ar": "Analyze Claude Code's agentic loop behavior — tool calls, planning steps, error recovery — and identify areas where model capabilities could be extended",
    },
  },
  {
    id: 2, number: "02", day: "Day 2",
    title: "Prompt craft for agentic coding",
    subtitle: "CLAUDE.md, context and session management, and the art of steering multi-step workflows. The module that separates surface-level users from power users.",
    clientScenario: { company: "Lumen Logistics", industry: "Supply chain / logistics", situation: "Lumen Logistics has 40 developers, a sprawling Node.js monorepo, and zero documentation. New hires take 3 weeks to become productive because conventions are unwritten. Your job: write the CLAUDE.md that makes Claude an effective team member, then prove it by refactoring a messy module to match." },
    materials: [
      { id: "M2a", label: "CLAUDE.md Builder worksheet", when: "Use during step 4 to structure your CLAUDE.md" },
      { id: "M2b", label: "Prompt Patterns cheat sheet", when: "Reference while practicing prompt craft in steps 6-8" },
      { id: "F5", label: "Configuration & Customization cheat sheet", when: "Companion reference for slash commands, memory, and settings" },
    ],
    skills: ["CLAUDE.md authoring", "Context management", "Session hygiene", "Multi-step workflows", "Prompt patterns"],
    modality: { live: "60 min", lab: "60 min", selfPaced: "30 min pre-work" },
steps: [
      { title: "Set the scene: Lumen\'s problem", desc: "Before touching any code, internalize the customer scenario. Lumen Logistics has 40 developers, zero documentation, and a 3-week ramp time for new hires. The CTO wants Claude Code to fix this. Your job today: prove that a single file \u2014 CLAUDE.md \u2014 can transform how Claude understands and works within their codebase.", narration: "Open with: 'Imagine you\'re walking into Lumen Logistics. Their CTO tells you: our new hires take three weeks to get productive because nothing is written down. Can Claude Code fix that?' Pause. Let that land. The answer is yes \u2014 and the key is CLAUDE.md.", timing: "2 min" },
      { title: "Fork and clone the messy repo", context: "terminal", desc: "We\'ve prepared a repo with no documentation, inconsistent patterns, and no CLAUDE.md. Fork it to your account and clone locally.", commands: ["git clone https://github.com/anthropics/basecamp-messy-repo.git", "cd basecamp-messy-repo", "npm install"], narration: "As you clone: 'This repo is designed to be messy on purpose. Mixed coding styles, no docs, no tests in some modules. It\'s what a real customer codebase looks like on day one.'", timing: "3 min" },
      { title: "Explore the codebase without Claude", context: "terminal", desc: "Before writing a CLAUDE.md, understand what you\'re working with. Browse the directory structure and notice the inconsistencies.", commands: ["ls -la src/", "cat package.json"], keyPoint: "You have to understand the conventions before you can teach them to Claude. This exploration step is what you\'d do in a real customer engagement \u2014 and it\'s what you\'d coach the customer\'s tech lead to do.", timing: "3 min" },
      { title: "The 'before' \u2014 Claude without CLAUDE.md", context: "claude", desc: "Launch Claude Code in the messy repo. Without a CLAUDE.md, Claude infers conventions from the code itself \u2014 sometimes right, sometimes wrong. Ask it to refactor a module and watch where it guesses.", prompt: "Refactor src/utils/helpers.js \u2014 improve the code quality, add error handling, and write tests.", narration: "After Claude finishes: 'Look at the output. Did it use async/await or Promises? Did it add JSDoc or just inline comments? Did it put the test file in the right place? It made choices \u2014 but they were guesses. In a customer codebase with strong conventions, guesses create inconsistency.'", keyPoint: "This is the most important demo moment in the entire program. The 'before' output isn\'t bad \u2014 it\'s just inconsistent. That\'s the problem CLAUDE.md solves.", timing: "8 min" },
      { title: "Write your CLAUDE.md", context: "file", materialRef: { id: "M2a", note: "Use the CLAUDE.md Builder worksheet to structure your file" }, desc: "CLAUDE.md has four key sections: Architecture (where things live), Conventions (how to write code), Testing (what 'tested' means), and Before Committing (the checklist). Create one now.", code: "# Project: Basecamp Sample App\n\n## Architecture\n- Express.js backend with route handlers in /src/routes/\n- Utility modules in /src/utils/\n- Tests live next to source files: foo.ts \u2192 foo.test.ts\n\n## Conventions\n- Use async/await, never raw Promises\n- All functions need JSDoc comments\n- Error handling: always use try/catch with specific error types\n- Imports: group by external, internal, types\n\n## Testing\n- Framework: Jest with supertest for API tests\n- Every route needs at least one happy path and one error test\n- Run `npm test` before committing\n\n## Before committing\n- Run `npm run lint && npm test`\n- Never commit .env or node_modules", codeTitle: "CLAUDE.md", tip: "In a customer engagement, writing the first CLAUDE.md together is a powerful onboarding moment. It forces the team to articulate conventions they\'ve never written down \u2014 which is itself valuable even without Claude Code.", timing: "8 min" },
      { title: "The 'after' \u2014 Claude with CLAUDE.md", context: "claude", desc: "Exit and re-launch Claude Code so it picks up your CLAUDE.md. Ask the exact same refactoring question. The difference should be visible \u2014 async/await instead of callbacks, JSDoc instead of inline comments, co-located tests.", prompt: "Refactor src/utils/helpers.js to follow our project conventions. Add proper error handling, documentation, and tests.", narration: "As Claude works: 'Same task, same repo, different output. Watch \u2014 async/await instead of callbacks. JSDoc instead of inline comments. Tests co-located with the source file. It\'s following the CLAUDE.md like a new team member who actually read the onboarding doc.'", keyPoint: "This before/after comparison is the single most persuasive demo in the entire Basecamp program. When you show this to a customer, you\'re not talking about AI in the abstract \u2014 you\'re showing their conventions being followed automatically.", timing: "8 min" },
      { title: "The CLAUDE.md iteration loop", context: "claude", desc: "Your first CLAUDE.md is never perfect. Look at Claude\'s output from step 9 \u2014 what did it get right? What would you add? Try refining your CLAUDE.md based on what you observed.", prompt: "What conventions did you infer from the existing code that I should add to my CLAUDE.md?", narration: "'Ask Claude itself what you should add. This is a powerful move in customer engagements \u2014 Claude can help you write the CLAUDE.md by analyzing the codebase. The loop is: write CLAUDE.md, observe output, ask Claude what\'s missing, refine. Each iteration makes the output better.'", tip: "This iteration loop \u2014 write, observe, refine \u2014 is how teams get the most value from CLAUDE.md. In a customer engagement, plan to iterate 2-3 times during the first session.", timing: "5 min" },
      { title: "Session management: /compact", context: "claude", desc: "In long coding sessions, Claude\'s context window fills up. The /compact command summarizes the conversation to free space while preserving important context.", commands: ["/compact"], narration: "'After 15-20 minutes of work, you\'ll notice Claude starting to forget earlier context. That\'s the context window filling up. /compact is your pressure release valve \u2014 it summarizes what happened and frees up space. Watch what it preserves and what it drops.'", keyPoint: "Teach customers to use /compact proactively, not reactively. If you wait until Claude starts forgetting, you\'ve already lost context. Compact every 15-20 minutes in long sessions.", timing: "3 min" },
      { title: "Session management: /clear and /cost", context: "claude", desc: "Two more essential commands for session hygiene:", commands: ["/cost", "/clear"], narration: "'/cost shows you exactly what this session has consumed \u2014 tokens in, tokens out, total spend. Essential for customers tracking costs. /clear resets the entire context. Use it when you\'re switching tasks or when /compact isn\'t enough.'", tip: "/cost is your friend in customer conversations about pricing. Run it after a real task: 'That refactoring task \u2014 reading the codebase, planning changes, writing code, running tests \u2014 cost $0.08. Your developer would have spent 45 minutes.'", timing: "3 min" },
      { title: "Plan Mode: think before acting", context: "claude", desc: "Plan Mode is Claude Code\'s most powerful trust-building feature. The 'plan:' prefix tells Claude to analyze and plan without making any changes.", prompt: "plan: Analyze this codebase and propose a strategy for adding TypeScript. Identify the riskiest files to migrate first, suggest a tsconfig.json, and outline the migration order.", narration: "'Plan Mode is your secret weapon in customer demos. Skeptical engineers don\'t trust AI that immediately starts editing their code. Plan Mode lets them see Claude\'s reasoning first \u2014 what it would change and why. They can review the plan, give feedback, then green-light execution. It\'s the difference between trust and anxiety.'", expected: "Claude should produce a detailed analysis and migration plan WITHOUT making any file changes. The output is a plan you can review, modify, and then execute.", keyPoint: "In customer demos, always start complex tasks in Plan Mode. It shows the reasoning, builds trust, and lets the customer feel in control. Then switch to execution: 'That plan look right? Let\'s build it.'", timing: "5 min" },
      { title: "Prompt patterns that work", context: "claude", materialRef: { id: "M2b", note: "Reference the Prompt Patterns cheat sheet for the full pattern library" }, desc: "The difference between a good prompt and a great prompt comes down to specificity and structure. Compare these patterns:", prompt: "Using the patterns from our CLAUDE.md, add a new POST /api/shipments endpoint that creates a shipment record. Follow the same patterns as the existing routes. Include input validation, error handling, and tests.", narration: "'Notice the prompt structure: what to build, which patterns to follow, and what quality means. Vague prompts like \'add a shipments endpoint\' force Claude to guess. Specific prompts like this one get consistent, convention-matching output on the first try.'", tip: "The three-part prompt pattern: WHAT (the task) + HOW (the conventions/patterns) + VERIFY (tests, validation). This pattern works for any coding task and is the foundation of effective agentic prompting.", timing: "5 min" },
      { title: "Anti-pattern: the kitchen-sink session", context: "claude", desc: "One of the most common mistakes is cramming too many unrelated tasks into a single session. Claude\'s context fills up, quality degrades, and you end up fighting the tool instead of using it.", narration: "'Let me show you what NOT to do. If you ask Claude to refactor a module, then add a new feature, then fix a bug in a different file, then update the README \u2014 all in one session \u2014 quality drops after the third task. The context is full of unrelated code. The fix: one session per task, or /compact between tasks.'", keyPoint: "Teach customers the 'one job, one session' rule. For complex work: Plan Mode to scope it, then a fresh session to execute each piece. This is the habit that separates power users from frustrated users.", timing: "3 min" },
      { title: "CLAUDE.md hierarchy: team-wide conventions", context: "file", desc: "In enterprise deployments, CLAUDE.md works at multiple levels. A root-level file sets org-wide standards. Team-level files add team-specific conventions. Project-level files override where needed.", code: "# Hierarchy (top to bottom, each layer overrides):\n\n~/.claude/CLAUDE.md           # Personal preferences\nrepo-root/CLAUDE.md            # Project conventions\nrepo-root/src/CLAUDE.md        # Subdirectory overrides\n\n# Example: org-level CLAUDE.md (repo root)\n# Sets company-wide rules:\n# - Always use TypeScript\n# - All PRs need tests\n# - Follow the company style guide\n\n# Example: team-level CLAUDE.md (subdirectory)\n# Adds team-specific rules:\n# - This service uses PostgreSQL\n# - API routes follow REST conventions\n# - Integration tests use the staging DB", codeTitle: "CLAUDE.md hierarchy", narration: "'When a customer asks: how does this scale to 200 developers? \u2014 this is the answer. The engineering director writes the root CLAUDE.md with company-wide standards. Each team adds their own file with team-specific conventions. It\'s the same pattern as .eslintrc \u2014 cascading configuration. Developers don\'t need to know it exists; it just works.'", keyPoint: "The hierarchy question always comes up in enterprise conversations. Having this answer ready \u2014 with the .eslintrc analogy \u2014 closes the 'but how does it scale?' objection.", timing: "4 min" },
      { type: "checkpoint", title: "The pitch to Lumen\'s CTO", desc: "You\'ve now seen the full arc: messy codebase without CLAUDE.md (inconsistent output) vs. with CLAUDE.md (convention-matching output). You know session management, Plan Mode, and prompt patterns. Now practice the pitch: How would you explain to Lumen\'s CTO what you just did? What\'s the one-sentence version? What\'s the three-minute version? What would you show them?", narration: "'The one-sentence pitch: CLAUDE.md turns your team\'s unwritten conventions into explicit instructions that Claude follows automatically \u2014 so every developer, including Claude, writes code that looks like your best engineer wrote it. The three-minute version: show the before/after. The ten-minute version: do it live on their repo.'" },
    ],
        challenge: "Lumen's CTO says: 'Our new hires take three weeks to get productive. Can Claude Code fix that?' Write a CLAUDE.md that captures their conventions, then use Claude to refactor their messiest utility module with tests and docs that match. Show a before/after that makes the case.",
    output: "CLAUDE.md template library + prompt pattern cheat sheet + client before/after comparison",
    gaps: [
      { title: "Common failure patterns and how to recover", why: "Five anti-patterns trip up even experienced users: kitchen-sink sessions that exhaust context, correction spirals that degrade output, over-specified CLAUDE.md files that conflict, skipping review in auto-accept mode, and open-ended exploration that burns tokens. A pattern-recognition exercise would build the diagnostic instinct trainees need in the field.", topics: ["Kitchen sink sessions", "Over-specified CLAUDE.md", "Correction spirals", "Trust-then-verify gap", "Context exhaustion", "When to start fresh"] },
    ],
    color: C.blue,
    deepDive: true,
    competencies: {
      "pe-pre": "Write a CLAUDE.md for a prospect's repo during a live evaluation, showing how context transforms output quality — a best practice you can teach in every technical evaluation",
      "pe-post": "Pair-program with a customer engineering team to author CLAUDE.md files tailored to their codebase, conventions, and CI/CD pipeline",
      "sa": "Design a CLAUDE.md strategy for a multi-team engineering org — root-level standards, team-level overrides, and integration patterns with existing style guides",
      "ar": "Evaluate how CLAUDE.md content affects model reasoning quality, identify prompt patterns that improve code generation accuracy, and build evaluation harnesses to measure impact",
    },
  },
  {
    id: 3, number: "03", day: "Day 3",
    title: "Extend and customize",
    subtitle: "Hooks, MCP servers, Skills, Plugins, subagents, and the Agent SDK. Turn Claude Code into your customer's engineering platform.",
    clientScenario: { company: "Arcadia Financial", industry: "Fintech / regulated", situation: "Arcadia Financial has 60 engineers and hard compliance requirements: nothing ships without lint, type checks, and tests. Their PM team lives in Jira and developers constantly context-switch. Can Claude Code enforce quality gates and pull Jira context automatically?" },
    materials: [
      { id: "M3", label: "Integration Patterns architecture reference", when: "Architecture diagrams for hooks, MCP, and slash commands" },
      { id: "F5", label: "Configuration & Customization cheat sheet", when: "Quick reference for hooks syntax and permission tiers" },
    ],
    skills: ["Hooks", "MCP integration", "Skills & Plugins", "Subagents & Agent Teams", "Agent SDK"],
    modality: { live: "45 min", lab: "75 min", selfPaced: "45 min pre-work" },
steps: [
      { title: "Create a pre-commit hook", context: "file", desc: "Hooks are the answer to 'How do I control what Claude does?' Create a hooks configuration that enforces quality gates before any commit.", code: "// .claude/hooks.json\n{\n  \"pre-commit\": [\n    \"npm run lint\",\n    \"npm run type-check\",\n    \"npm test -- --bail\"\n  ],\n  \"post-edit\": [\n    \"npm test -- --related --bail\"\n  ]\n}", codeTitle: ".claude/hooks.json", tip: "The post-edit hook runs tests only on files related to what Claude just changed. The --bail flag stops on the first failure, saving time. This is the pattern enterprise customers love." },
      { title: "Test your hooks", context: "claude", desc: "Launch Claude and make a change that should trigger your hooks. Watch how the hooks enforce quality automatically.", prompt: "Introduce a deliberate bug in one of the route handlers — change a status code from 200 to 500. Then try to commit.", expected: "The pre-commit hook should catch the failing test and prevent the commit. Claude should then fix the bug and retry." },
      { title: "Set up an MCP server", context: "terminal", desc: "MCP connects Claude to external tools. We'll set up a mock Jira server that Claude can query for ticket context.", commands: ["mkdir -p .claude/mcp-servers", "npm init -y --prefix .claude/mcp-servers/mock-jira"], tip: "In real deployments, MCP servers connect to Jira, Slack, Datadog, Confluence, and internal APIs. The setup pattern is the same — Claude discovers available tools from the MCP server dynamically." },
      { title: "Configure Claude to use your MCP server", context: "file", desc: "Add the MCP server to your Claude Code configuration so it's available in every session.", code: "// .claude/settings.json\n{\n  \"mcpServers\": {\n    \"mock-jira\": {\n      \"command\": \"node\",\n      \"args\": [\".claude/mcp-servers/mock-jira/server.js\"]\n    }\n  }\n}", codeTitle: ".claude/settings.json" },
      { title: "Create a custom slash command", context: "file", desc: "Slash commands package workflows your team can share. Create a deploy-check command that runs a pre-deployment checklist.", code: "Run the following pre-deployment checklist:\n1. Run the full test suite and report results\n2. Check for any TODO or FIXME comments in changed files\n3. Verify all environment variables are documented in .env.example\n4. Check for console.log statements in production code\n5. Validate that API endpoints have error handling\n6. Generate a summary of changes since last deploy tag", codeTitle: ".claude/commands/deploy-check.md", tip: "Custom commands are shared via git — a tech lead defines them once and the entire team inherits them. This is a powerful selling point for engineering managers." },
      { title: "Test your custom command", context: "claude", desc: "Launch Claude and run your new slash command to see it in action.", commands: ["/deploy-check"], expected: "Claude should execute each step of your checklist and report results. This is how teams standardize quality checks." },
      { title: "Compose the full workflow", context: "claude", desc: "Now bring hooks, MCP, and commands together. Ask Claude to use the full toolchain.", prompt: "Pull the details for ticket JIRA-1234 from our mock Jira server, implement the feature it describes, then run /deploy-check to verify everything is ready.", tip: "This composed workflow — external context via MCP, implementation via Claude, quality gates via hooks and commands — is the enterprise pitch. Demonstrate this in customer conversations." },
      { type: "checkpoint", title: "Architecture your integration", desc: "For Arcadia Financial specifically: what additional hooks would their compliance team want beyond lint/type-check/tests? Which MCP servers would you add next — Datadog for error context, Confluence for documentation, or their internal deployment API? What slash command would their team lead use most often? Sketch the full integration architecture you'd present to Arcadia's Head of Engineering." },
    ],
        challenge: "Build Arcadia's proof-of-concept: a pre-commit hook enforcing lint/type-check/tests, a mock Jira MCP server for ticket context, and a deploy-check slash command. Demo the full loop: Claude reads a Jira ticket, implements the feature, passes quality gates, and runs the deploy checklist.",
    output: "Custom hook + MCP server + Skill + client integration architecture guide",
    gaps: [
      { title: "Agent teams and multi-agent orchestration", why: "Claude Code can run multiple agents in parallel — writer/reviewer pairs or fan-out across files. The tradeoff is cost (~7x tokens). Trainees should understand when to use agent teams vs. single agents and how to configure them via .claude/agents/.", topics: ["Writer/reviewer pattern", "Fan-out across files", "Teammate mode", "Cost management (7x multiplier)", "When to use vs. single agent", "Agent SDK configuration"] },
      { title: "Plugins and code intelligence", why: "Code intelligence plugins give Claude IDE-level navigation (go to definition, find references) instead of text search. This dramatically improves accuracy in large codebases and is the answer when a prospect asks 'can Claude handle our 2M-line repo?'", topics: ["Code intelligence plugins", "Symbol navigation vs. text search", "Plugin marketplace", "Installing and managing plugins", "Impact on large codebases"] },
    ],
    color: C.green,
    competencies: {
      "pe-pre": "Architect a Claude Code integration pattern for a customer evaluation — hooks for guardrails, MCP for their internal tools, slash commands for team workflows — and present it as a reference architecture",
      "pe-post": "Build and deploy custom MCP servers, hooks, and slash commands in a customer's environment — debugging integration issues live and leaving behind working implementations",
      "sa": "Design a phased Claude Code adoption plan — from individual developer pilot to team-wide deployment — with integration patterns for the customer's existing toolchain (Jira, Datadog, CI/CD)",
      "ar": "Build custom tooling with the Agent SDK — automated code review pipelines, evaluation harnesses, and workflows that connect Claude Code to model training infrastructure",
    },
  },
  {
    id: 4, number: "04", day: "Day 4",
    title: "Customer scenarios",
    subtitle: "Role-specific breakouts. Handle security reviews, architect enterprise deployments, navigate cost conversations, and present to real skeptics.",
    clientScenario: { company: "Three different clients", industry: "Cross-industry", situation: "Three client conversations back-to-back. Nova Insurance's CISO grills you on security. Atlas Manufacturing's VP wants a deployment plan for 200 developers on AWS. Prism Analytics' engineering manager already uses Copilot and doesn't see why they need another tool." },
    materials: [
      { id: "M4a", label: "Claude Code vs. Competition battlecard", when: "Have open during the Copilot skeptic role-play (step 3)" },
      { id: "M4b", label: "Enterprise Deployment talk track", when: "Reference during the VP of Engineering role-play (step 2)" },
      { id: "M4c", label: "Demo Planning worksheet", when: "Fill out after role-plays to plan your first real demo" },
      { id: "F6a", label: "Security Objection Handler", when: "Your cheat sheet for the CISO role-play (step 1)" },
      { id: "F7b", label: "Cost & ROI Pocket Math", when: "Quick math reference for cost conversations" },
      { id: "F7a", label: "Deployment Path Finder", when: "Decision tree for Bedrock vs. Vertex vs. Foundry" },
    ],
    skills: ["Security objection handling", "Enterprise deployment architecture", "Cost & ROI conversations", "Competitive positioning", "Live demo skills"],
    modality: { live: "90 min (breakouts)", lab: "30 min", selfPaced: "none" },
steps: [
      { title: "Prepare for the security role-play", context: "browser", materialRef: { id: "F6a", note: "Print the Security Objection Handler battlecard — you\'ll need it" }, desc: "Review the security foundations you covered earlier (Security tab under Claude Code). You'll need fluent recall of sandboxing, permissions, hooks, and managed settings. Open the Anthropic Trust Center to have it ready.", tip: "The order matters: start with sandboxing (OS-level), then permissions (tool-level), then hooks (team-level), then managed settings (admin-level). Layer by layer builds confidence." },
      { title: "Role-play 1: The CISO", context: "claude", desc: "Your partner plays a CISO who asks tough security questions. Use Claude Code to pull up real documentation and demonstrate security features live.", prompt: "I'm preparing for a meeting with a CISO who will ask about: sandboxing and filesystem isolation, data retention and training opt-out, prompt injection protections, and SOC 2 compliance. Help me rehearse — play the CISO and challenge my answers.", tip: "Practice answering without reading from notes. The CISO will trust you more if you can explain the security model from memory, then show them the documentation for specifics." },
      { title: "Role-play 2: The VP of Engineering", context: "claude", desc: "Now your partner is a VP who wants a deployment plan for 200 developers on AWS. This is a cost and architecture conversation.", prompt: "I need to present a Claude Code deployment plan for a 200-developer team on AWS. Help me build: a Bedrock deployment architecture, a phased rollout from pilot to org-wide, a cost estimate using ~$6/dev/day average, and an ROI comparison against the cost of additional engineering hires.", tip: "Lead with the ROI framing: $6/day × 200 devs = ~$1,200/day. If each dev saves 1 hour, that's 200 hours × $150/hour fully-loaded = $30,000/day in recovered time. 25× return." },
      { title: "Role-play 3: The Copilot skeptic", context: "claude", desc: "Your partner is an engineering manager who loves Copilot and doesn't see why they need Claude Code. Handle the objection.", prompt: "Help me prepare for an objection handling conversation where the prospect says 'We already use GitHub Copilot and our developers love it. Why would we switch to Claude Code?' Give me the honest positioning — where we're better, where they're different, and how they can coexist.", tip: "Don't trash Copilot — it loses trust. Instead: Copilot is excellent at line-level autocomplete. Claude Code operates at the project level. Many teams use both. The question isn't 'replace' — it's 'what can your team do now that they couldn't before?'" },
      { title: "Build your competitive battlecard", context: "claude", materialRef: { id: "M4a", note: "Compare your work against the Claude Code vs. Competition battlecard" }, desc: "Use Claude to help you create a reference document you'll use in the field.", prompt: "Create a competitive battlecard comparing Claude Code vs GitHub Copilot vs Cursor vs Devin. For each competitor, include: what they do well, where Claude Code is stronger, honest gaps, and the recommended positioning angle. Format it as a clean reference I can pull up during sales calls." },
      { type: "checkpoint", title: "Debrief with your cohort", desc: "Share what worked and what didn't in each role-play. Which objections were hardest to handle? Where did you feel most confident? What do you need to practice more before your first real customer conversation?" },
    ],
        challenge: "Three role-plays: (1) Walk Nova's CISO through sandboxing, permissions, managed settings, and compliance. (2) Build Atlas a Bedrock deployment architecture with phasing and cost projections. (3) Position Claude Code honestly against Copilot for Prism — where it's different, where it's better, and how they coexist.",
    output: "Security FAQ for Nova + Atlas deployment template + Prism competitive battlecard + demo scripts",
    color: C.orange,
    competencies: {
      "pe-pre": "Run a full technical evaluation against a real customer use case — build a reference architecture, handle objections on security and cost, position against Copilot/Cursor/Devin, and close with a next-steps demo plan",
      "pe-post": "Navigate a live customer debugging session using Claude Code — diagnose a failing integration, fix it with the customer watching, and turn the save into a relationship-building moment",
      "sa": "Assess a customer's engineering org, identify the highest-leverage Claude Code insertion points, position honestly against competitors, and present a strategic adoption roadmap with timeline and milestones",
      "ar": "Advise on Claude Code's capabilities and limitations for ML/training workflows — propose custom tooling workarounds, design evaluation pipelines, and scope what's possible vs. what requires model-level changes",
    },
  },
  {
    id: 5, number: "05", day: "Day 5",
    title: "Ship it",
    subtitle: "Blind customer brief. Working demo. Peer review. Make it count.",
    clientScenario: { company: "Unknown — blind brief", industry: "Varies", situation: "A customer brief you've never seen — a real company with a real problem. You have 2 hours to understand their world, architect a solution, build a working demo, and present to your cohort as if they were the customer's leadership team." },
    materials: [
      { id: "M5", label: "Capstone Presentation Guide", when: "Structure your 10-minute presentation with this framework" },
      { id: "M4c", label: "Demo Planning worksheet", when: "Use to plan your demo moments before building" },
    ],
    skills: ["End-to-end architecture", "Live demo", "Peer review", "Presentation"],
    modality: { live: "120 min session", lab: "integrated", selfPaced: "none" },
steps: [
      { title: "Receive your blind customer brief", desc: "Your facilitator will hand you a customer brief you haven't seen before. Read it carefully — you have 15 minutes to analyze before you start building. Identify: the customer's industry, team size, current tools, key pain points, and what success looks like for them.", tip: "Don't jump to solutions immediately. Spend the first 5 minutes understanding the customer's world. The best demos are tailored to what the customer cares about, not what you're most comfortable showing." },
      { title: "Architect your solution", context: "claude", materialRef: { id: "M4c", note: "Use the Demo Planning worksheet to structure your approach" }, desc: "Use Claude Code to help you plan your approach. Think about which Claude Code features map to their pain points.", prompt: "I've received this customer brief: [paste brief]. Help me architect a Claude Code solution for them. I need: which features to demo (pick 3-4 max), a CLAUDE.md tailored to their codebase, which MCP integrations would be most valuable, and a phased rollout plan.", tip: "Limit yourself to 3-4 demo moments. Too many features overwhelms the audience. Pick the ones that map directly to their stated pain points." },
      { title: "Build your working demo", context: "claude", desc: "You have 45 minutes to build a working demo that addresses the customer brief. Use everything you've learned — CLAUDE.md, hooks, MCP, slash commands.", tip: "Build for reliability, not flash. A simple demo that works perfectly is better than an ambitious one that breaks. Test your demo at least twice before presenting." },
      { title: "Prepare your 10-minute presentation", desc: "Structure your presentation: 2 minutes on understanding their problem, 6 minutes on the live demo, 2 minutes on next steps and rollout plan. Practice the transitions between sections.", tip: "Start with their problem, not your solution. 'You mentioned your team spends 40% of their time on migration work — let me show you how that changes.' Then demo. Then close with a concrete next step." },
      { title: "Present to your cohort", desc: "Deliver your presentation. Your cohort will score you on: clarity of problem framing, technical depth of the demo, relevance to the customer brief, and confidence in handling questions. This simulates your first real customer engagement." },
      { type: "checkpoint", title: "Peer feedback and reflection", desc: "After all presentations: What was the most effective demo you saw today? What technique will you steal for your own customer conversations? What's the one thing you want to practice more before your first real engagement?" },
    ],
        challenge: "From a blind customer brief: identify the 3–4 Claude Code features that map to their pain points, build a tailored working demo, and deliver a 10-minute presentation. Your cohort scores on: problem framing (25%), technical depth (25%), relevance to the brief (25%), and confidence under Q&A (25%).",
    output: "Client-tailored capstone presentation + working demo + peer feedback",
    color: C.green,
    competencies: {
      "pe-pre": "Deliver a compelling, tailored Claude Code demo from a cold customer brief in under 2 hours — including architecture proposal, integration patterns, live demo, and a clear next-steps ask",
      "pe-post": "Scope, build, and deliver a working Claude Code implementation from a customer brief — pair-program through the hard parts, leave behind documentation, and hand off a running system",
      "sa": "Present a complete Claude Code adoption strategy — architecture diagrams, phased rollout, integration patterns, ROI estimates, and honest risk assessment — from a blind customer brief",
      "ar": "Design and present a Claude Code-powered research workflow — custom Agent SDK tooling, evaluation metrics, integration with training pipelines — with a working prototype",
    },
  },
];

// ─── FACILITATOR GUIDES ───
const FACILITATOR_GUIDES = [
  {
    moduleId: 1, day: "Day 1", title: "First contact",
    duration: "90 min total (45 min live + 45 min lab)",
    slidesDeck: "slides/basecamp-deck.html",
    slidesNote: "Basecamp slide deck, Day 1 section — covers the agentic difference, the agentic loop diagram, terminal vs. IDE comparison, and the live install demo script.",
    setup: [
      "Ensure the sample repo (claude-code-sample-api) is accessible and npm install completes cleanly",
      "Have a backup install plan for corporate proxy/VPN issues — pre-download the binary if needed",
      "Test both terminal and VS Code extension installs on the presentation machine",
      "Pre-load the Meridian Health client scenario so you can reference it naturally",
    ],
    segments: [
      { time: "0–5 min", title: "Open with the client scenario", notes: "Don't start with 'today we'll learn to install Claude Code.' Start with: 'Meridian Health has an 8-person backend team. New endpoints take them 2–3 days. By the end of this session, you'll be able to show them how to do it in minutes.' Frame the entire session through the client lens." },
      { time: "5–15 min", title: "Live install walkthrough", notes: "Install Claude Code from scratch on a clean terminal. Narrate every step — what's happening, what could go wrong, what you'd tell the customer. Then install the VS Code extension. Call out the differences explicitly: 'Terminal gives you raw speed. IDE gives you inline diffs. Same engine underneath.'" },
      { time: "15–30 min", title: "First agentic task — live demo", notes: "Open the sample API repo. Show Claude reading the directory, package.json, and existing code before you've typed anything. Then prompt: 'Add a /health endpoint with tests.' Narrate the agentic loop as it happens: 'See — it's reading the existing routes to match the pattern. Now it's planning. Now it's writing. Now it's running the tests.'" },
      { time: "30–40 min", title: "VS Code comparison", notes: "Do the same task from VS Code. Highlight inline diffs, the file tree, checkpoints. Ask the group: 'When would you reach for the terminal vs. the IDE in a customer demo?'" },
      { time: "40–45 min", title: "Bridge to the lab", notes: "'You've seen me do it. Now you're going to do it as if you're onboarding Meridian's team. Your job isn't just to install Claude Code — it's to deliver their first win.'" },
    ],
    labNotes: "45 min. Trainees work through the steps independently. Watch for proxy/firewall issues, confusion about terminal vs. IDE, and trainees who finish early (give them the troubleshooting exercise). Debrief: 'What would you say to Meridian's team lead? How do you explain the agentic loop in one sentence?'",
    keyMoments: [
      "The first time Claude reads the codebase before being asked — call this out, it's the 'aha' for most people",
      "When Claude runs tests after making changes — this is the 'verify' step and it surprises people",
      "If Claude makes a mistake and self-corrects — don't skip this, it's a powerful demo moment",
    ],
  },
  {
    moduleId: 2, day: "Day 2", title: "Prompt craft for agentic coding",
    duration: "120 min total (60 min live + 60 min lab)",
    slidesDeck: "slides/basecamp-deck.html",
    slidesNote: "Basecamp slide deck, Day 2 section — CLAUDE.md anatomy, before/after comparison, prompt patterns, session management commands, and common anti-patterns.",
    setup: [
      "Fork and prepare the messy repo — ensure it has intentional inconsistencies",
      "Have a 'bad CLAUDE.md' example ready to show over-specification",
      "Pre-load the Lumen Logistics client scenario",
      "Test /compact and /clear so you can demo session management smoothly",
    ],
    segments: [
      { time: "0–5 min", title: "Open with Lumen's problem", notes: "'Lumen Logistics has 40 developers and zero documentation. New hires take three weeks to become productive. Their CTO asked us: can Claude Code fix that?' CLAUDE.md isn't a config file — it's the answer to a real customer pain point." },
      { time: "5–20 min", title: "Live CLAUDE.md authoring", notes: "Open the messy repo without a CLAUDE.md. Show how Claude guesses at conventions — sometimes wrong. Then create a CLAUDE.md live. Restart Claude and show the difference: faster startup, targeted reads, correct conventions. This before/after is the most persuasive demo in the entire program." },
      { time: "20–35 min", title: "Multi-step refactoring workflow", notes: "Refactor the messiest module using your CLAUDE.md. Pause: 'What would you add to the CLAUDE.md based on what you just saw?' This teaches the iteration loop." },
      { time: "35–50 min", title: "Session management deep dive", notes: "Demo /compact, /clear, /cost, and Plan Mode. Show a real scenario: start a long task, notice context degradation, recover with /compact. This separates 'tried it once' from 'uses it daily.'" },
      { time: "50–60 min", title: "Failure patterns", notes: "Intentionally trigger failures: over-specified CLAUDE.md, kitchen-sink session. Demonstrate recovery. 'In a customer engagement, you'll see this. Here's how you diagnose it.'" },
    ],
    labNotes: "60 min. Trainees write their own CLAUDE.md, refactor a module, and practice session management. Watch for CLAUDE.md files over 200 lines and trainees skipping the before/after comparison. Debrief: show CLAUDE.md approaches, compare, and coach the CTO pitch.",
    keyMoments: [
      "The before/after CLAUDE.md comparison — this single demo wins more customer conversations than anything else",
      "When Plan Mode reveals Claude's reasoning — builds trust with skeptical technical audiences",
      "When a trainee's CLAUDE.md is too prescriptive and output suffers — teaches restraint",
    ],
  },
  {
    moduleId: 3, day: "Day 3", title: "Extend and customize",
    duration: "120 min total (45 min live + 75 min lab)",
    slidesDeck: "slides/basecamp-deck.html",
    slidesNote: "Basecamp slide deck, Day 3 section — integration architecture diagram, hooks as guardrails, MCP connection model, slash commands for team workflows, composed workflow demo.",
    setup: [
      "Prepare the mock Jira MCP server and test it responds correctly",
      "Have working hook and Skill configs ready as fallbacks",
      "Pre-load the Arcadia Financial client scenario",
      "Test the full composed workflow end to end",
    ],
    segments: [
      { time: "0–5 min", title: "Open with Arcadia's requirements", notes: "'Arcadia Financial has 60 engineers building a payment platform. Compliance requires: nothing ships without lint, type checks, and tests. Developers waste hours context-switching to Jira. Can Claude Code enforce quality gates and pull context automatically?' Today you build that." },
      { time: "5–15 min", title: "Hooks — the compliance answer", notes: "Build a pre-commit hook live. Show it catching a deliberate bug. 'When a CISO asks how you control what Claude does, this is the answer. These hooks are enforced gates, not suggestions.'" },
      { time: "15–25 min", title: "MCP — connecting to the customer's world", notes: "Set up the mock Jira server. Show Claude querying it. 'This is where Claude Code stops being a coding assistant and starts being a platform.'" },
      { time: "25–35 min", title: "Skills and the composed workflow", notes: "Create a deploy-check Skill. Run the full loop: Jira context → implementation → hooks → deploy-check. 'One prompt. Full context. Automatic quality gates. Ready to ship.'" },
      { time: "35–45 min", title: "Architecture discussion", notes: "Sketch the integration architecture for Arcadia. 'What other MCP servers would they need? What hooks would compliance want? How would you phase this?'" },
    ],
    labNotes: "75 min — the longest lab. Trainees build hook, MCP server, Skill, and composed workflow. Some will struggle with MCP setup — have fallbacks ready. Goal is the composed demo, not perfecting each piece. Debrief: demo the workflow to a partner playing Arcadia's Head of Engineering.",
    keyMoments: [
      "When the hook blocks a bad commit — this is the 'control' answer security teams need",
      "When Claude pulls Jira context unprompted — the MCP 'aha' moment",
      "The composed workflow demo — single prompt to shipped feature. This is the enterprise pitch in 60 seconds.",
    ],
  },
  {
    moduleId: 4, day: "Day 4", title: "Customer scenarios",
    duration: "120 min total (90 min breakouts + 30 min lab)",
    slidesDeck: null,
    slidesNote: "No slide deck — entirely role-play and discussion. Have the Anthropic Trust Center open for the security role-play.",
    setup: [
      "Pair trainees — mix experience levels",
      "Share the three client briefs: Nova Insurance, Atlas Manufacturing, Prism Analytics",
      "Have competitive positioning data ready: Claude Code vs. Copilot vs. Cursor vs. Devin",
      "Prepare the ROI calculator: $6/dev/day × team size vs. hourly cost × hours saved",
    ],
    segments: [
      { time: "0–5 min", title: "Frame the day", notes: "'No new features today. Today is about the conversations that make or break your first engagements. Three client scenarios, three different playbooks.'" },
      { time: "5–35 min", title: "Role-play 1: Nova Insurance CISO", notes: "One trainee plays you, one plays the CISO asking about data exfiltration, prompt injection, training data, and compliance. Debrief: coach the defense-in-depth narrative (sandbox → permissions → hooks → managed settings → compliance)." },
      { time: "35–60 min", title: "Role-play 2: Atlas Manufacturing VP", notes: "200 developers on AWS. Architect the solution live — Bedrock deployment, phasing, cost estimate. Debrief: was the cost math convincing? Did you address 'what if it doesn't work?'" },
      { time: "60–80 min", title: "Role-play 3: Prism Analytics Copilot skeptic", notes: "Handle the objection. Debrief: did you trash Copilot? (Bad.) Did you position honestly? (Good.) Coach: 'line-level autocomplete vs. project-level agentic work. Many teams use both.'" },
      { time: "80–90 min", title: "Group debrief", notes: "Which was hardest? What phrases landed? Collect the best one-liners — these become shared team assets." },
    ],
    labNotes: "30 min. Trainees use Claude Code to build their reference materials: security FAQ, deployment template, competitive battlecard. These are real leave-behinds for the field.",
    keyMoments: [
      "The first stumble on a security question — this is the learning moment",
      "When someone accidentally trashes a competitor and the room feels it — coach honest positioning",
      "A confident ROI calculation delivered on the spot — celebrate this, it's field-ready",
    ],
  },
  {
    moduleId: 5, day: "Day 5", title: "Ship it — capstone",
    duration: "120 min (integrated session)",
    slidesDeck: null,
    slidesNote: "No slides — trainees are presenting. Have a visible timer and scoring rubric ready.",
    setup: [
      "Prepare 3–5 blind customer briefs (vary by industry, team size, pain point)",
      "Set up a shared timer visible to everyone",
      "Distribute peer scoring rubrics: problem framing 25%, technical depth 25%, relevance 25%, confidence/Q&A 25%",
      "Ensure every trainee has a working Claude Code install",
    ],
    segments: [
      { time: "0–5 min", title: "Set the stage", notes: "'This is the closest thing to your first real engagement. Brief you've never seen, company you don't know. 90 minutes to understand, architect, build, and present. Make it count.'" },
      { time: "5–20 min", title: "Brief distribution and analysis", notes: "Hand out briefs. 15 minutes for reading and planning. Resist helping — this is a transfer test. Answer questions in character as the customer." },
      { time: "20–65 min", title: "Build time", notes: "45 minutes to architect and build. Watch for: jumping to building without planning, demoing too many features, building something unrelated to the brief." },
      { time: "65–110 min", title: "Presentations", notes: "10 min each, strict timer. 2 min Q&A from cohort in character, then 1 min peer scoring. Keep the pace tight." },
      { time: "110–120 min", title: "Debrief and close", notes: "Read scores. Celebrate the top presentation. 'What was the most effective demo moment? What will you steal? What's the one thing to practice before your first real engagement?' Close: 'You've earned this. You're ready.'" },
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
  { id: "pe-pre", label: "Product Engineer, Pre-Sales", desc: "Architecture, integration patterns, and best practices for guiding technical evaluations pre-deal. You'll learn to demo Claude Code's capabilities, design reference architectures, and build compelling proof-of-concept workflows that close.", short: "PE Pre-Sales" },
  { id: "pe-post", label: "Product Engineer, Post-Sales", desc: "Hands-on fluency for pair-programming with customer teams, debugging integrations, and delivering working implementations. You'll build muscle memory for live coding sessions and learn to unblock customers in real time.", short: "PE Post-Sales" },
  { id: "sa", label: "Solutions Architect", desc: "Technical depth combined with strategic judgment on where Claude Code fits customer workflows. You'll learn to assess engineering orgs, design adoption roadmaps, and position Claude Code within existing toolchains.", short: "Solutions Architect" },
  { id: "ar", label: "Applied Research", desc: "Advanced capabilities, interaction with model training workflows, and custom tooling. You'll go deep on the Agent SDK, build evaluation pipelines, and learn how Claude Code connects to research and ML infrastructure.", short: "Applied Research" },
];

// ─── PATH OUTCOMES (what each role can DO after Basecamp) ───
const PATH_OUTCOMES = {
  "pe-pre": {
    verb: "Close technical evaluations",
    summary: "You'll leave Basecamp able to run a complete technical evaluation — from first demo to architecture proposal to competitive handling — and close with a concrete next step.",
    outcomes: [
      { action: "Deliver a live Claude Code demo to a prospect", measure: "completing a multi-file refactor from a single prompt, narrating the agentic loop as it happens, and ending with a scheduled technical evaluation — all within a 60-minute meeting" },
      { action: "Write a CLAUDE.md for an unfamiliar repo during a live session", measure: "where Claude's output visibly improves (follows project conventions, passes existing tests) compared to its output before the CLAUDE.md was added" },
      { action: "Produce a one-page integration architecture for a prospect", measure: "specifying which hooks enforce their quality gates, which MCP servers connect to their existing tools (by name), and which custom commands encode their workflows — detailed enough for their team to implement" },
      { action: "Respond to security, cost, and competitive objections in a role-play", measure: "with zero factual errors, citing the correct mechanism for each concern (e.g., sandbox + managed settings for 'uncontrolled AI writes,' model tiering + prompt caching for 'runaway costs,' agentic loop + codebase context for 'just another Copilot')" },
      { action: "Build a working Claude Code demo from a cold customer brief", measure: "producing a functional prototype, a tailored CLAUDE.md, and a presentation with architecture diagram and next-steps ask — scored by peers on relevance, technical depth, and clarity" },
    ],
  },
  "pe-post": {
    verb: "Ship customer implementations",
    summary: "You'll leave Basecamp able to set up Claude Code in any customer environment, pair-program through the hard parts, and hand off a working system their team can maintain.",
    outcomes: [
      { action: "Install and configure Claude Code across CLI, VS Code, and JetBrains", measure: "resolving common setup issues (auth, proxy, permissions) and guiding a developer through their first agentic task that edits multiple files and passes tests — in a single pairing session" },
      { action: "Author a CLAUDE.md for a customer's codebase by reading their code", measure: "producing a file that covers architecture, conventions, testing, and commit rules — verified by running Claude against their repo and confirming output matches their style guide" },
      { action: "Build a working hook + MCP + slash command integration", measure: "where the hook blocks a bad commit, the MCP server returns live data from an external tool, and the slash command runs a multi-step workflow — all demoed end-to-end without errors" },
      { action: "Debug a broken Claude Code setup from symptoms alone", measure: "identifying the root cause (misconfigured permissions, missing MCP server, conflicting hooks) and resolving it within 15 minutes while explaining each diagnostic step" },
      { action: "Deliver a complete Claude Code deployment from a customer brief", measure: "handing off a configured environment with CLAUDE.md, hooks, at least one MCP integration, and a README the customer's team can use to onboard additional developers" },
    ],
  },
  "sa": {
    verb: "Design adoption strategies",
    summary: "You'll leave Basecamp able to assess an engineering org, design a phased rollout, and present an honest, numbers-backed case for Claude Code to technical leadership.",
    outcomes: [
      { action: "Map a customer's engineering pain points to specific Claude Code features", measure: "producing a written assessment that identifies 3 insertion points, names the feature for each (e.g., 'CLAUDE.md for onboarding, hooks for CI quality gates, MCP for Jira context'), and estimates time-to-value for a 5-person pilot" },
      { action: "Design a 3-phase adoption roadmap (pilot, team, org)", measure: "with named integration points per phase, a specific success metric that gates each transition (e.g., '80% of pilot developers using Claude Code daily by week 3'), and a timeline in weeks" },
      { action: "Spec an enterprise deployment on the customer's cloud provider", measure: "selecting the correct provider option (Bedrock/Vertex/Foundry), calculating monthly cost estimates at their developer count using published token pricing, and defining managed settings that satisfy their security requirements" },
      { action: "Deliver a competitive comparison a customer can use internally", measure: "with a side-by-side table covering interaction model, context window, extensibility, pricing model, and deployment options for Claude Code vs. Copilot, Cursor, and Devin — with no inaccuracies" },
      { action: "Present a full adoption strategy from a blind customer brief", measure: "including architecture diagram, phased rollout with timelines and gate criteria, cost projections, risk register with mitigations, and a clear ask — scored by peers on completeness and credibility" },
    ],
  },
  "ar": {
    verb: "Build custom AI tooling",
    summary: "You'll leave Basecamp able to extend Claude Code with custom tooling, design rigorous evaluations, and scope what's possible vs. what requires model-level changes.",
    outcomes: [
      { action: "Trace a Claude Code session's agentic loop end-to-end", measure: "producing a written analysis that identifies each tool call, planning step, and error recovery decision — and flags at least one concrete capability gap or optimization opportunity" },
      { action: "Build a working Agent SDK application", measure: "that chains at least two agents (e.g., code review + test generation), accepts a repo as input, and produces structured output — running without errors on a sample codebase" },
      { action: "Design a controlled experiment measuring CLAUDE.md impact on output quality", measure: "with defined independent variable (CLAUDE.md content), dependent variable (e.g., test pass rate, lint errors, convention adherence score), sample size, and a script that runs both conditions and reports results" },
      { action: "Produce a technical feasibility assessment for a Claude Code extension", measure: "distinguishing what can be built with current APIs (Agent SDK, MCP, hooks) from what would require model-level changes — with architecture sketches for the feasible parts and specific capability requests for the rest" },
      { action: "Deliver a working prototype from a research brief", measure: "with running code, an evaluation harness that produces quantitative results, a written limitations section, and recommended next steps — presented to peers and scored on rigor and clarity" },
    ],
  },
};

// ─── SKILL CREDENTIALS ───
const SKILL_CREDENTIALS = {
  1: [
    { name: "CLI Navigation", icon: ">_", desc: "Terminal fluency" },
    { name: "Agentic Tasking", icon: "~>", desc: "Multi-step execution" },
  ],
  2: [
    { name: "Prompt Architecture", icon: "{}", desc: "Structured context" },
    { name: "Context Management", icon: "//", desc: "Session mastery" },
  ],
  3: [
    { name: "MCP Integration", icon: "::", desc: "External tools" },
    { name: "Hooks & Extensions", icon: "&&", desc: "Guardrails & automation" },
  ],
  4: [
    { name: "Objection Handling", icon: "<>", desc: "Counter & reframe" },
    { name: "Competitive Positioning", icon: "||", desc: "Differentiation" },
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
    { question: "You're demoing Claude Code to a prospect who uses Copilot. Claude reads their codebase before you've typed a prompt — their Copilot never did this. How do you turn that moment into a compelling differentiator without trashing Copilot?", hint: "Frame it as complementary, not competitive. 'Copilot helps your developers write the next line faster. Claude Code understands your entire project — it reads the codebase, plans multi-step changes, and verifies its own work. Many teams use both.' The codebase-reading moment is the 'aha' — narrate it." },
    { question: "A customer's install fails behind a corporate proxy — they get a TLS/SSL error. You have 5 minutes before the demo loses momentum. What do you do?", hint: "Run 'claude /doctor' to diagnose. Most likely fix: set NODE_EXTRA_CA_CERTS to point to their corporate CA bundle, or export HTTPS_PROXY. Have the backup plan ready: pre-downloaded binary install. The key is confidence — if you've seen this before and fix it quickly, it builds trust rather than destroying it." },
  ],
  2: [
    { question: "A customer's 40-person team has no written conventions. Claude Code produces inconsistent output across different developers. The CTO asks: 'How do we fix this without slowing everyone down?' Walk through your answer.", hint: "CLAUDE.md is the answer — a single file at the repo root that encodes team conventions. Root-level for org-wide standards, team-level overrides in subdirectories. The pitch: 'Writing this file forces your team to articulate conventions they've never written down — that's valuable even without Claude Code. With it, every developer and Claude write code that matches your best engineer's style.'" },
    { question: "You're in a long Claude Code session and notice the output quality degrading — Claude is repeating itself and forgetting earlier context. What happened, and how do you recover without losing your work?", hint: "The context window is full. Use /compact to summarize the conversation and free space — do this proactively every 15-20 minutes, not reactively. If /compact isn't enough, use /clear and restart with a focused prompt. The 'one task per session' rule prevents this: combine only tightly related tasks." },
  ],
  3: [
    { question: "Arcadia Financial's compliance team says: 'We need a guarantee that no code ships without passing lint, type checks, and tests.' How do you configure Claude Code to enforce this — and what's the difference between a hook and a slash command for this use case?", hint: "Pre-commit hooks are enforced gates — they block the action if checks fail. Slash commands are opt-in workflows the developer chooses to run. For compliance requirements, hooks are the answer because they can't be bypassed. Commands are for convenience (like /deploy-check), not enforcement." },
    { question: "A prospect's engineering team already uses Jira, Datadog, and Confluence. Name the three MCP servers you'd set up first and explain why each one changes their workflow.", hint: "Jira: developers stop tab-switching to look up ticket details — Claude pulls context directly. Datadog: when debugging, Claude reads error logs and metrics without leaving the terminal. Confluence: Claude references team documentation when making architectural decisions. The pitch: 'Claude Code stops being a coding tool and becomes a platform that understands your engineering workflow.'" },
  ],
  4: [
    { question: "A VP says: 'I'm worried AI will make our developers dependent — they'll forget how to code.' You have 60 seconds. Go.", hint: "Reframe: Claude Code removes what developers like least — boilerplate, migration grunt work, chasing test failures. What's left is creative, high-judgment work. Teams report taking on refactors they'd deferred for quarters. The analogy: 'Calculators didn't make mathematicians worse — they freed them to work on harder problems.'" },
    { question: "A prospect asks for your honest opinion: 'When should we NOT use Claude Code?' What do you say?", hint: "Be direct: if their users aren't developers (recommend Claude.ai/Cowork instead), if they only want line-level autocomplete (Copilot is simpler), or if their security review process can't accommodate the evaluation timeline. Honesty builds trust — and it positions you as an advisor, not a salesperson." },
  ],
  5: [
    { question: "You have 10 minutes to demo Claude Code to a CTO you've never met. What are your 3 demo moments, and what do you narrate at each one?", hint: "1) Multi-file refactor from one prompt — narrate the agentic loop as it happens ('reading, planning, editing, testing'). 2) CLAUDE.md before/after — show how conventions are followed automatically. 3) The moment Claude self-corrects after a test failure — this builds trust more than perfection does. Keep it to 3 moments max; more overwhelms." },
    { question: "It's week 2 post-Basecamp, your first real customer engagement. They ask: 'How long until our team is productive with Claude Code?' What's your answer, and what data supports it?", hint: "Most developers are productive within 1-2 days for basic tasks, 1-2 weeks for advanced workflows (hooks, MCP, custom commands). The CLAUDE.md is the unlock — teams with a good CLAUDE.md see faster ramp. Back it up: 'Our median time to first agentic task is 7 minutes from install. The real ramp is learning to write good prompts and configure context — that's what the first two weeks build.'" },
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
function ExerciseSteps({ steps, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: "flex", gap: 16, padding: "20px 0", borderBottom: i < steps.length - 1 ? `1px solid ${C.lightGray}` : "none" }}>
          <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: "50%", background: step.type === "checkpoint" ? color + "15" : C.cream, border: `1px solid ${step.type === "checkpoint" ? color + "40" : C.lightGray}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, color: step.type === "checkpoint" ? color : C.muted }}>
            {step.type === "checkpoint" ? "\u2713" : i + 1}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 500, color: C.dark }}>{step.title}</div>
              {step.context && <ContextBadge context={step.context} />}
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
            {step.narration && (
              <div style={{ margin: "10px 0 0", padding: "12px 16px", background: "#f0eee8", borderRadius: 8, borderLeft: `3px solid ${C.orange}` }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, color: C.orange, textTransform: "uppercase", marginBottom: 6 }}>Facilitator script</div>
                <p style={{ fontFamily: "var(--serif)", fontSize: 13.5, color: C.dark, lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>{step.narration}</p>
              </div>
            )}
            {step.keyPoint && (
              <div style={{ margin: "8px 0 0", padding: "10px 14px", borderRadius: 6, background: C.green + "08", border: `1px solid ${C.green}20`, display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: C.green, flexShrink: 0, marginTop: 2 }}>KEY POINT</span>
                <span style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.dark, lineHeight: 1.5 }}>{step.keyPoint}</span>
              </div>
            )}
            {step.timing && (
              <div style={{ display: "inline-block", margin: "6px 0 0", padding: "3px 10px", background: C.faint + "15", borderRadius: 12 }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: C.faint }}>{"\u23F1"} {step.timing}</span>
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
      ))}
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

// ─── CONTENT RENDERER ───
function ContentBlock({ block, idx, simplified }) {
  const delay = `${0.08 + idx * 0.04}s`;
  const v = (simplified && block.simple) ? block.simple : block.value;
  if (block.type === "text") return <p style={{ ...st.bodyText, ...st.fadeUp, animationDelay: delay }}>{v}</p>;
  if (block.type === "heading") return <h3 style={{ ...st.sectionHeading, ...st.fadeUp, animationDelay: delay }}>{v}</h3>;
  if (block.type === "personas") return <PersonaGrid items={block.items} delay={delay} />;
  if (block.type === "diagram") return <div style={{ ...st.fadeUp, animationDelay: delay }}><ClaudeCodeDiagram /></div>;
  if (block.type === "platform-diagram") return <div style={{ ...st.fadeUp, animationDelay: delay }}><PlatformDiagram /></div>;

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
          <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{(simplified && v.simpleDesc) ? v.simpleDesc : v.desc}</div>
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
          <p style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: C.muted, lineHeight: 1.6, margin: 0 }}>{(simplified && m.simpleDesc) ? m.simpleDesc : m.desc}</p>
        </div>
      ))}
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
            {s.source && <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: C.faint, marginTop: 8, lineHeight: 1.4 }}>{s.source}</div>}
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
      <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: C.blue, textTransform: "uppercase", marginBottom: 8 }}>Go deeper</div>
      <div style={{ fontFamily: "var(--serif)", fontSize: 16, color: C.dark, marginBottom: 8 }}>{block.title}</div>
      <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.muted, lineHeight: 1.6, margin: 0 }}>{block.why}</p>
      {block.topics && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
          {block.topics.map((t, i) => <span key={i} style={{ fontFamily: "var(--mono)", fontSize: 10, padding: "3px 10px", borderRadius: 12, border: `1px solid ${C.blue}30`, color: C.blue, background: C.blue + "08" }}>{t}</span>)}
        </div>
      )}
    </div>
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
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,20,19,0.5)", backdropFilter: "blur(4px)", padding: 20 }} onClick={onClose}>
      <div style={{
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

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <p style={{ fontFamily: "var(--mono)", fontSize: 10, color: C.faint, margin: "0 0 16px" }}>Take a screenshot to save your certificate</p>
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
  const [expandedPath, setExpandedPath] = useState(null);

  return (
    <div style={st.container}>
      <div style={{ ...st.fadeUp }}>
        <div style={st.eyebrow}>Foundations complete</div>
        <div style={{ height: 2, width: 48, background: C.green, margin: "16px 0 32px", borderRadius: 1 }} />
        <h1 style={{ ...st.heroTitle, fontSize: 36 }}>Select<br /><span style={{ color: C.orange }}>your role.</span></h1>
        <p style={st.heroBody}>Everyone builds the same technical foundation. Your role shapes the lens — what you practice, what you produce, and what you'll be ready to do in the field. Expand a role to see specific outcomes.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 36 }}>
        {PATHS.map((p, i) => {
          const outcomes = PATH_OUTCOMES[p.id];
          const isExpanded = expandedPath === p.id;
          return (
            <div key={p.id} style={{
              background: isExpanded ? C.cream : C.bg,
              border: `1px solid ${isExpanded ? C.orange + "40" : C.lightGray}`,
              borderRadius: 12, overflow: "hidden", transition: "all 0.3s ease",
              ...st.fadeUp, animationDelay: `${0.3 + i * 0.08}s`,
            }}>
              {/* Card header — click to expand/collapse */}
              <button
                onClick={() => setExpandedPath(isExpanded ? null : p.id)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", background: "none", border: "none", cursor: "pointer",
                  padding: "16px 20px", textAlign: "left",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
                    <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 500, color: C.dark }}>{p.label}</span>
                    {outcomes && (
                      <span style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 0.5, color: C.orange, background: C.orange + "10", padding: "2px 8px", borderRadius: 10 }}>{outcomes.verb}</span>
                    )}
                  </div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.faint, lineHeight: 1.5 }}>{p.desc}</div>
                </div>
                <span style={{
                  color: C.orange, fontSize: 14, flexShrink: 0, marginLeft: 12,
                  transition: "transform 0.2s", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                }}>→</span>
              </button>

              {/* Expanded outcomes */}
              {isExpanded && outcomes && (
                <div style={{ padding: "0 20px 20px", animation: "fadeUp 0.3s ease forwards" }}>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: C.muted, lineHeight: 1.6, margin: "0 0 16px" }}>{outcomes.summary}</p>

                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1.5, color: C.faint, textTransform: "uppercase", marginBottom: 10 }}>After this week, you'll be able to</div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                    {outcomes.outcomes.map((o, j) => (
                      <div key={j} style={{
                        display: "flex", gap: 10, padding: "10px 14px",
                        background: C.bg, borderRadius: 8, border: `1px solid ${C.lightGray}`,
                      }}>
                        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: C.orange, marginTop: 3, flexShrink: 0 }}>{String(j + 1).padStart(2, "0")}</span>
                        <div>
                          <span style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500, color: C.dark }}>{o.action}</span>
                          <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.muted }}> {o.measure}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); onSelect(p.id); }}
                    style={st.primaryBtn}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >Select {p.short} →</button>
                </div>
              )}
            </div>
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
    question: "What are the biggest problems in this feedback?",
    items: [
      {
        problem: "We crammed too much into each day",
        analysis: "31% said pacing was 'too fast.' On its own, maybe that's just the less technical folks struggling. But then you look at confidence scores — dead flat across all three days (4.29, 4.28, 4.28). People aren't getting more confident as the week goes on. They wrote things like 'too much content packed into the day' and 'less content at a more reasonable pace.' When confidence doesn't budge despite three days of training, people are drowning in new material before the last batch has sunk in. The 67% who said pacing was fine? They came in with stronger technical backgrounds. The 31% are the people we're losing.",
        implementation: {
          label: "Spread it across 5 days, move lectures to pre-work",
          detail: "We went from 3 days to 5. That's ~40% less content per day. All the conceptual stuff — what is Claude Code, how does the model work, what's MCP — moved to self-paced reading people do before showing up. Live time is now 100% hands-on.",
        },
      },
      {
        problem: "Lecturing first, building second — backwards",
        analysis: "The Evals session scored 3.9 — half a point below average — and got the sharpest feedback in the whole dataset: 'too much time on abstract component taxonomy without enough concrete examples.' Same person said 'the build-along afterward was far more effective.' The interactive HTML presentation got the opposite reaction — people loved it because they could touch the tool and build while learning. The pattern is clear: when we talk at people, engagement tanks. When they build, it clicks.",
        implementation: {
          label: "Every session now starts with building, not talking",
          detail: "We killed the Evals session. Every day opens with a client problem and hands-on work. Day 1: 'Meridian Health's team takes 2-3 days per endpoint — show them how to do it in minutes.' Day 3: 'Arcadia Financial needs compliance gates — build it.' Eval concepts now live in the Applied Research track where people build working harnesses instead of reading taxonomy charts.",
        },
      },
      {
        problem: "People aren't feeling growth, and the content isn't role-specific",
        analysis: "Confidence flat. 'Apply independently' went up then back down (4.2, 4.5, 4.3). Day 3's 'realistic work simulation' score dropped to 3.9 — the most technical day felt the least connected to real work. People asked for 'more splits between SA, Engineer, Research' and 'guidance as to what is more relevant for each group.' When everyone sits through the same material regardless of their job, some of it just doesn't land.",
        implementation: {
          label: "Four role tracks with different outcomes per module",
          detail: "PE Pre-Sales, PE Post-Sales, SA, Applied Research — four tracks. Each module shows you a different outcome based on your role. A PE sees 'Demo the install to a prospect.' An SA sees 'Explain the value prop to a technical audience.' Day 4 splits into dedicated role breakouts. Skill badges give people a visible sense of progress.",
        },
      },
      {
        problem: "Install issues ate into Day 1",
        analysis: "Several people spent live session time fighting with their setup — npm issues, proxy problems, wrong versions. Every minute on that is a minute not spent on the actual training. Fixable.",
        implementation: {
          label: "Install happens before Day 1 now",
          detail: "Participants install the CLI, set up their IDE, and clone the repo as pre-work. Facilitator checklists have backup plans for proxy issues, PATH problems, and WSL quirks. Goal: zero install debugging during live time.",
        },
      },
    ],
    signalVsNoise: "Strong signal: pacing/overload (31% + qualitative + flat confidence), Evals bombing (3.9 + specific feedback), role differentiation gap (people asked for it), setup friction (specific, fixable). Weaker signal: Day 3 realism dip (3.9, one day), async preference (one person, but a real gap worth watching). The async request is legit but isn't a systemic problem when 67% said pacing was fine. Worth a light accommodation, not a redesign.",
  },
  {
    id: "changes",
    number: "02",
    question: "What would you change for the next cohort?",
    items: [
      {
        problem: "Sessions run wall-to-wall with no gaps",
        analysis: "Day 1 goes 0-5, 5-15, 15-30, 30-40, 40-45 — no room to breathe. Put a 15-minute open block after the midpoint. Questions, troubleshooting, ad-hoc demos — whatever the room needs. Not a break. A 45-minute session becomes 60 with no new content added. Call them 'consolidation blocks' in the facilitator guide so nobody fills them with more slides.",
        implementation: {
          label: "Facilitator guides flag timing and pacing risks",
          detail: "Every segment is timed to the minute with pacing notes. Named consolidation blocks aren't in the guide yet — that's the next iteration. Adding 15 minutes of open space after the midpoint is straightforward.",
        },
      },
      {
        problem: "No way to verify setup before Day 1",
        analysis: "Everyone should pass a checklist before showing up: CLI installs, VS Code extension works, repo clones, one Claude Code command runs. If something fails, there's a 30-minute troubleshooting session the night before. Don't let Day 1 become an install debugging workshop.",
        implementation: {
          label: "Pre-work steps are in place; a hard gate is next",
          detail: "Module 1 walks through install, verify, IDE setup, and repo clone as pre-work. Facilitator checklists cover proxy and VPN fallbacks. An automated script that blocks attendance until setup passes would close the last gap.",
        },
      },
      {
        problem: "One deck for everything",
        analysis: "The best-rated element was 'the HTML presentation with live examples.' Right now one deck covers all sessions. Each day should have its own interactive deck — embedded examples people can run, 'try it' pauses, animated diagrams.",
        implementation: {
          label: "We built a Basecamp deck; per-day decks are next",
          detail: "There's a 44-slide deck covering all 5 days with speaker notes on every slide. The shared design system makes it easy to spin up per-day decks. Days 4-5 don't use slides (role-play and capstone).",
        },
      },
      {
        problem: "Day 3 ends with talking instead of building",
        analysis: "Day 3 had the lowest 'realistic work simulation' score (3.9). The last 10 minutes are an architecture discussion. Replace it: 'Arcadia's compliance team just added a rule — no API calls without an audit trail. Extend your hooks.' Keep people building right through the end when energy is lowest.",
        implementation: {
          label: "Day 3 is now the heaviest lab day, framed around a real client",
          detail: "45 min live + 75 min lab — the longest hands-on block. Framed around Arcadia Financial, a fintech with 60 engineers and hard compliance requirements.",
        },
      },
      {
        problem: "No way to measure confidence growth within a day",
        analysis: "Two-minute check at the start: 'Rate your confidence on today's skill, 1-5.' Same check at the end. Show the delta. Cross-day averages hide within-day growth.",
        implementation: {
          label: "Checkpoints and badges show qualitative growth",
          detail: "Reflection checkpoints and skill badges track progress. Adding a 1-5 rating at each checkpoint would give us the numbers.",
        },
      },
      {
        problem: "Days 1-3 don't feel relevant to every role",
        analysis: "Drop in role-specific moments at transitions: 'Pre-Sales — notice how you'd walk a prospect through this. SA — think about how this scales to 200 developers.' The content for this exists in the per-module competencies. The fix is making it a live habit for the facilitator.",
        implementation: {
          label: "Role competencies exist in the app; live callouts are next",
          detail: "Each module already has four different outcome statements by role. The app shows a personalized 'Your outcome' block. Turning these into facilitator talking points during live sessions is the remaining step.",
        },
      },
      {
        problem: "No option for people who learn better solo",
        analysis: "One person asked for an async track. Don't build a whole parallel program for that — but do two things: record every session (available within 2 hours) and offer a 30-minute daily drop-in for people who want to work through it on their own.",
        implementation: {
          label: "Pre-work and Claude Chat cover part of this",
          detail: "30-45 min of self-paced pre-work per module. A Simplify toggle for different reading speeds. Claude Chat as always-on office hours. Recordings and structured drop-ins would finish the job.",
        },
      },
    ],
  },
  {
    id: "measurement",
    number: "03",
    question: "How do you know if the changes worked?",
    items: [
      {
        problem: "Pacing — get 'Too fast' under 15% (was 31%)",
        analysis: "Ask the pacing question every day, not once at the end. 'Just right' should hit 75%+ on each day. If Day 3 still runs hot, stretch the buffer blocks on that day.",
        implementation: {
          label: "5-day format cuts daily density by ~40%",
          detail: "3 days became 5. Lectures moved to pre-work. Facilitator guides flag pacing risks segment by segment.",
        },
      },
      {
        problem: "Confidence — should climb at least +0.5 over the week",
        analysis: "4.29, 4.28, 4.28 — that flat line was the loudest signal in the data. Measure it daily, same 1-5 scale. Day 1 should be the low point, each day higher. If it plateaus after Day 3, the customer scenario and capstone days aren't building enough real confidence.",
        implementation: {
          label: "Checkpoints and badges track growth",
          detail: "Reflection checkpoints and earnable badges show progress. A before/after confidence rating at each checkpoint would give us the slope.",
        },
      },
      {
        problem: "Engagement — no session below 4.2 (Evals hit 3.9)",
        analysis: "3.9 was a clear miss. With build-first design across every session, nothing should drop that low. Measure per session, not per day. Anything under 4.0 gets the same treatment: cut the abstract framing, start with building.",
        implementation: {
          label: "No lecture-first sessions left in the program",
          detail: "Every session opens with a client problem and hands-on work. Interactive presentations replace slide decks.",
        },
      },
      {
        problem: "'Apply independently' — should end at 4.5+ (was 4.3)",
        analysis: "It went 4.2, 4.5, 4.3 — up then down. Over five days it should keep climbing. The Day 5 capstone is the real test: blind brief, no help, build and present. If that score is below 4.3, the middle days need to let go of the scaffolding sooner.",
        implementation: {
          label: "Day 5 capstone tests real independence",
          detail: "Blind customer brief, time limit, peer scoring. If someone can go from a cold brief to a working demo under pressure, they're ready.",
        },
      },
      {
        problem: "NPS — target 50+ (was 35)",
        analysis: "35 with 18% detractors means some people were unhappy. Target: 50+ with detractors under 10% and promoters over 60%. Under 45 means the core problems aren't fixed. Over 55 means we nailed it.",
        implementation: {
          label: "NPS tells us if everything else worked",
          detail: "It's the final scorecard. Fix the structural issues, NPS follows.",
        },
      },
      {
        problem: "Setup — zero live minutes on install problems",
        analysis: "Two things to track: how many people need install help during the live session (target: zero) and what percentage completed the pre-work checkpoint (target: 100%). If someone shows up without a working setup, the checkpoint process broke.",
        implementation: {
          label: "Install is pre-work now",
          detail: "CLI, IDE, and repo clone all happen before Day 1. Facilitator checklists cover the common failure modes.",
        },
      },
      {
        problem: "Role relevance — new metric, target 4.3+",
        analysis: "Add a daily question: 'Today's content was relevant to my role' (1-5). Cut by role. If SAs score lower than PEs on Days 1-3, those days need more SA-flavored moments.",
        implementation: {
          label: "Four role paths with per-module outcomes",
          detail: "Each module shows role-specific outcomes. The survey question tells us whether people feel it.",
        },
      },
    ],
    summary: "Cohort 2 works if everyone shows up Day 1 with a working install, grows more confident each day, never sits through a session below 4.2, feels the content is relevant to their job (4.3+), and walks out Day 5 telling a colleague to sign up (NPS 50+).",
  },
]

// ─── CURRICULUM PLAN CONTENT (Part 1 Questions) ───
function CurriculumPlanContent() {
  const sectionStyle = { marginBottom: 56 };
  const h1Style = { fontFamily: "var(--serif)", fontSize: 28, fontWeight: 400, color: C.dark, margin: "0 0 8px", lineHeight: 1.25 };
  const h2Style = { fontFamily: "var(--serif)", fontSize: 20, fontWeight: 400, color: C.dark, margin: "32px 0 12px", lineHeight: 1.3 };
  const h3Style = { fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: C.muted, margin: "24px 0 8px" };
  const pStyle = { fontFamily: "var(--sans)", fontSize: 13.5, color: C.muted, lineHeight: 1.72, margin: "0 0 14px" };
  const bulletStyle = { fontFamily: "var(--sans)", fontSize: 13.5, color: C.muted, lineHeight: 1.72, margin: "0 0 8px", paddingLeft: 20, position: "relative" };
  const dot = { position: "absolute", left: 0, color: C.orange };
  const accentLine = (color) => ({ height: 2, width: 48, background: color, margin: "12px 0 24px", borderRadius: 1 });

  const tableHeader = { fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600, color: "#fff", padding: "10px 14px", textAlign: "left" };
  const tableCell = { fontFamily: "var(--sans)", fontSize: 12, color: C.muted, padding: "10px 14px", borderBottom: `1px solid ${C.lightGray}`, lineHeight: 1.5, verticalAlign: "top" };

  const dayData = [
    { day: "Day 1", mod: "First Contact", focus: "Install, navigate, complete a first agentic task in terminal and IDE", artifact: "Working install + first agentic task recording + client talking points" },
    { day: "Day 2", mod: "Prompt Craft", focus: "CLAUDE.md authoring, session management, Plan Mode, prompt patterns", artifact: "CLAUDE.md template library + prompt pattern cheat sheet + before/after comparison" },
    { day: "Day 3", mod: "Extend & Customize", focus: "Hooks, MCP servers, slash commands, Agent SDK, composed workflows", artifact: "Custom hook + MCP server + slash command + integration architecture" },
    { day: "Day 4", mod: "Customer Scenarios", focus: "Security objections, deployment architecture, cost/ROI, competitive positioning", artifact: "Security FAQ + deployment template + competitive battlecard + demo scripts" },
    { day: "Day 5", mod: "Ship It (Capstone)", focus: "Blind brief \u2192 working demo \u2192 peer-reviewed presentation", artifact: "Client-tailored capstone presentation + working demo + peer feedback" },
  ];

  const modalityData = [
    { mod: "Day 1: First Contact", live: "45 min", lab: "45 min", self: "30 min pre-work", total: "~2 hrs" },
    { mod: "Day 2: Prompt Craft", live: "60 min", lab: "60 min", self: "30 min pre-work", total: "~2.5 hrs" },
    { mod: "Day 3: Extend", live: "45 min", lab: "75 min", self: "45 min pre-work", total: "~2.75 hrs" },
    { mod: "Day 4: Scenarios", live: "90 min", lab: "30 min", self: "None", total: "~2 hrs" },
    { mod: "Day 5: Capstone", live: "120 min", lab: "Integrated", self: "None", total: "~2 hrs" },
  ];

  return (
    <>
      {/* ─── 1. CURRICULUM ARC ─── */}
      <div style={sectionStyle}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 8 }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: 42, color: C.orange, lineHeight: 1, opacity: 0.25 }}>01</span>
          <h2 style={h1Style}>Curriculum Arc</h2>
        </div>
        <div style={accentLine(C.orange)} />
        <p style={pStyle}>Basecamp is a five-day, progressive curriculum where each day builds on the one before it. The program follows a deliberate arc: from individual tool proficiency (Days 1–3) to customer-facing skills (Day 4) to integrated performance under pressure (Day 5). Every session produces a concrete artifact the learner uses in the field.</p>

        <h3 style={h2Style}>Sequence and Progression</h3>
        <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${C.lightGray}`, margin: "16px 0 24px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.orange }}>
                <th style={tableHeader}>Day</th>
                <th style={tableHeader}>Module</th>
                <th style={tableHeader}>Core Focus</th>
                <th style={tableHeader}>Artifact Produced</th>
              </tr>
            </thead>
            <tbody>
              {dayData.map((d, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? C.bg : C.cream }}>
                  <td style={{ ...tableCell, fontWeight: 600, color: C.dark, whiteSpace: "nowrap" }}>{d.day}</td>
                  <td style={{ ...tableCell, color: C.dark }}>{d.mod}</td>
                  <td style={tableCell}>{d.focus}</td>
                  <td style={tableCell}>{d.artifact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 style={h2Style}>How Each Session Builds on the Last</h3>
        <p style={pStyle}>The curriculum uses a scaffolded dependency chain. Each day's skills are prerequisites for the next:</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Day 1 → Day 2:</strong> You must have Claude Code installed and understand the agentic loop before you can learn to steer it with CLAUDE.md and prompt patterns.</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Day 2 → Day 3:</strong> CLAUDE.md conventions and prompt craft are prerequisites for hooks (which enforce conventions) and MCP (which extends Claude's capabilities). Without Day 2's mental model, hooks and MCP are just configuration files.</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Day 3 → Day 4:</strong> Technical depth in the product (Days 1–3) gives you the credibility to handle security objections, architecture questions, and competitive positioning. You can't answer a CISO's questions about sandboxing if you've never configured a hook.</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Day 4 → Day 5:</strong> The capstone integrates everything. You receive a blind brief and must install, configure, build, and present — drawing on every prior day. Day 4's customer conversation practice gives you the presentation and objection-handling skills the capstone requires.</p>

        <h3 style={h2Style}>Competency Milestones</h3>
        <p style={pStyle}>The program tracks progress through two systems:</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Credentials (10 total):</strong> Earned by completing module exercises. Examples include CLI Navigation, Prompt Architecture, MCP Integration, Competitive Positioning, and Live Demo Delivery. These are visible on the hub page as collectible badges.</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Knowledge Checkpoints:</strong> Two reflection questions per module that test recall and application. Self-scored with expandable hints.</p>
        <p style={pStyle}>The credential system provides a sense of progression and makes competency gaps visible. A learner who has all Day 1–3 badges but is missing Competitive Positioning knows exactly what to review before a customer conversation.</p>
      </div>

      {/* ─── 2. AUDIENCE DIFFERENTIATION ─── */}
      <div style={sectionStyle}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 8 }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: 42, color: C.blue, lineHeight: 1, opacity: 0.25 }}>02</span>
          <h2 style={h1Style}>Audience Differentiation</h2>
        </div>
        <div style={accentLine(C.blue)} />
        <p style={pStyle}>Basecamp serves four roles with significantly different customer touchpoints, technical depths, and success metrics. The curriculum handles this through a shared-foundation / role-specific-breakout model.</p>

        <h3 style={h2Style}>Shared Sessions (Days 1–3)</h3>
        <p style={pStyle}>Days 1–3 are shared across all roles. Every participant builds the same technical foundation on Claude Code — install, CLAUDE.md, prompt craft, hooks, MCP, and composed workflows. This is intentional:</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Credibility requires depth.</strong> A Pre-Sales PE who can't explain hooks loses the room when a customer asks about guardrails. An SA who has never written a CLAUDE.md can't design an adoption strategy. Shared technical foundations ensure everyone can go deep when the conversation demands it.</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Cross-role learning.</strong> When a Pre-Sales PE and a Post-Sales PE work through the same lab, they develop shared vocabulary and see each other's perspectives. The Pre-Sales PE learns what the handoff looks like; the Post-Sales PE learns what was promised.</p>

        <h3 style={h2Style}>Role-Specific Differentiation</h3>
        <p style={pStyle}>Differentiation happens in three ways:</p>

        <h3 style={h3Style}>1. Role-specific competency outcomes (all modules)</h3>
        <p style={pStyle}>Every module defines a different competency target for each role. For example, Day 2 (Prompt Craft):</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>PE Pre-Sales:</strong> Write a CLAUDE.md for a prospect's repo during a live evaluation, showing how context transforms output quality.</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>PE Post-Sales:</strong> Pair-program with a customer engineering team to author CLAUDE.md files tailored to their codebase and CI/CD pipeline.</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Solutions Architect:</strong> Design a CLAUDE.md strategy for a multi-team engineering org — root-level standards, team-level overrides, integration patterns.</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Applied Research:</strong> Evaluate how CLAUDE.md content affects model reasoning quality and build evaluation harnesses to measure impact.</p>
        <p style={pStyle}>The same exercise (writing a CLAUDE.md) produces different competency outcomes depending on what the learner focuses on.</p>

        <h3 style={h3Style}>2. Role-specific breakouts (Day 4)</h3>
        <p style={pStyle}>Day 4 is the primary role-divergence day. The three customer scenarios (security CISO, VP of Engineering, Copilot skeptic) are weighted differently by role:</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>PE Pre-Sales:</strong> Focus on the competitive positioning scenario. Practice the honest differentiation pitch.</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>PE Post-Sales:</strong> Focus on the deployment architecture scenario. Practice scoping and estimating real implementations.</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Solutions Architects:</strong> All three scenarios equally weighted. Practice the full customer conversation spectrum.</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Applied Research:</strong> Focus on the technical depth of what Claude Code can and can't do. Practice honest capability assessment.</p>

        <h3 style={h3Style}>3. Capstone brief selection (Day 5)</h3>
        <p style={pStyle}>Capstone briefs are matched to role. A Pre-Sales PE receives a brief that requires a compelling demo and clear next-steps ask. A Post-Sales PE receives a brief that requires a working implementation and handoff documentation. An SA receives a brief that requires an adoption strategy with architecture diagrams and ROI estimates.</p>

        <h3 style={h2Style}>Handling Varying Technical Depth</h3>
        <p style={pStyle}>The cohort will include people who write code daily (Applied Research) and people who haven't opened a terminal in months (some Pre-Sales PEs). Three design choices address this:</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Simplify toggle:</strong> Every content page has a "Simplify" button that swaps technical language for plain-English explanations. This lets less technical participants keep up without slowing down the room.</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Contextual exercises:</strong> Steps are tagged by context (terminal, VS Code, Claude, browser). Participants who are comfortable in the terminal can move faster; those who need more guidance can follow the explicit commands.</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Facilitator guide pacing notes:</strong> The facilitator guide for each module includes pacing advice for mixed-depth rooms — which steps to narrate slowly, which to skip for advanced groups, and when to pair technical with non-technical participants.</p>
      </div>

      {/* ─── 3. LEARNING MODALITIES ─── */}
      <div style={sectionStyle}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 8 }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: 42, color: C.green, lineHeight: 1, opacity: 0.25 }}>03</span>
          <h2 style={h1Style}>Learning Modalities</h2>
        </div>
        <div style={accentLine(C.green)} />
        <p style={pStyle}>Each module uses a deliberate mix of live instruction, hands-on labs, and self-paced materials. The ratio shifts across the week as learners build independence.</p>

        <h3 style={h2Style}>Modality Breakdown by Day</h3>
        <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${C.lightGray}`, margin: "16px 0 24px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.blue }}>
                {["Module", "Live", "Lab", "Self-Paced", "Total"].map(h => (
                  <th key={h} style={tableHeader}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modalityData.map((d, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? C.bg : C.cream }}>
                  <td style={{ ...tableCell, fontWeight: 600, color: C.dark }}>{d.mod}</td>
                  <td style={tableCell}>{d.live}</td>
                  <td style={tableCell}>{d.lab}</td>
                  <td style={tableCell}>{d.self}</td>
                  <td style={{ ...tableCell, fontWeight: 500 }}>{d.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 style={h2Style}>Live Instruction</h3>
        <p style={pStyle}>Live sessions are facilitator-led and focus on demonstration, narration, and discussion — never lecture. The facilitator guide for each module includes:</p>
        <p style={bulletStyle}><span style={dot}>•</span> Timed segments with narration scripts (what to say as you demo, word for word)</p>
        <p style={bulletStyle}><span style={dot}>•</span> Setup checklists (repos to clone, tools to pre-install, backup plans)</p>
        <p style={bulletStyle}><span style={dot}>•</span> Key moments to highlight (e.g., "When Claude self-corrects after a test failure — don't skip this, it's the most powerful demo moment")</p>
        <p style={bulletStyle}><span style={dot}>•</span> Pacing notes for mixed-depth rooms</p>
        <p style={pStyle}>Live sessions follow the "I do, we do, you do" progression: facilitator demos first, then the group works together on a guided exercise, then individuals tackle the lab independently.</p>

        <h3 style={h2Style}>Hands-On Labs</h3>
        <p style={pStyle}>Labs are structured as step-by-step walkthroughs embedded directly in the web application. Each step includes:</p>
        <p style={bulletStyle}><span style={dot}>•</span> A description of what to do and why</p>
        <p style={bulletStyle}><span style={dot}>•</span> Copy-pasteable commands (with a copy button for terminal commands)</p>
        <p style={bulletStyle}><span style={dot}>•</span> Expected output so learners can self-verify</p>
        <p style={bulletStyle}><span style={dot}>•</span> Tips for common pitfalls</p>
        <p style={bulletStyle}><span style={dot}>•</span> Material references that link to printable cheat sheets</p>
        <p style={pStyle}>Labs are framed through client scenarios. Day 1's lab isn't "install Claude Code" — it's "you're onboarding Meridian Health's backend team and delivering their first win." This situates every exercise in the context of a real customer engagement.</p>

        <h3 style={h2Style}>Leave-Behind Reference Materials</h3>
        <p style={pStyle}>The program includes 22 printable materials across three categories:</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Grab and Go (5 cards):</strong> The essential references for any sales meeting. Includes Claude Code at a Glance, How Claude Code Thinks, Security Objection Handler, Claude Code vs. Competition, and Cost & ROI Pocket Math.</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Module Worksheets (10 items):</strong> Companion materials for each module. CLAUDE.md Builder worksheet, Prompt Patterns cheat sheet, Integration Patterns architecture reference, Demo Planning worksheet, etc.</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Deep Reference (7 items):</strong> Deployment Path Finder, Enterprise Deployment talk track, Configuration & Customization reference, and others.</p>
        <p style={pStyle}>All materials are accessible from a centralized "Browse all materials" page and are printable as double-sided reference cards.</p>
      </div>

      {/* ─── 4. COMPETENCY OUTCOMES ─── */}
      <div style={sectionStyle}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 8 }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: 42, color: C.orange, lineHeight: 1, opacity: 0.25 }}>04</span>
          <h2 style={h1Style}>Competency Outcomes</h2>
        </div>
        <div style={accentLine(C.orange)} />
        <p style={pStyle}>These are what each role should be able to <em>do</em> — not just know — by the end of the program. Each outcome is tied to a specific day's module.</p>

        {[
          { role: "PE Pre-Sales", color: C.orange, outcomes: [
            { day: "Day 1", text: "Demo Claude Code's install and first-run experience to a prospect — narrate the agentic loop as it happens and explain why it matters vs. autocomplete." },
            { day: "Day 2", text: "Write a CLAUDE.md for a prospect's repo during a live evaluation, showing how context transforms output quality." },
            { day: "Day 3", text: "Architect a Claude Code integration pattern for a customer evaluation — hooks for guardrails, MCP for their internal tools, slash commands for team workflows." },
            { day: "Day 4", text: "Run a full technical evaluation against a real customer use case — build a reference architecture, handle objections on security and cost, position against Copilot/Cursor/Devin, and close with a next-steps demo plan." },
            { day: "Day 5", text: "Deliver a compelling, tailored Claude Code demo from a cold customer brief in under 2 hours — including architecture proposal, live demo, and a clear next-steps ask." },
          ]},
          { role: "PE Post-Sales", color: C.blue, outcomes: [
            { day: "Day 1", text: "Set up Claude Code in a customer's dev environment, troubleshoot common installation issues, and guide a developer through their first agentic task." },
            { day: "Day 2", text: "Pair-program with a customer engineering team to author CLAUDE.md files tailored to their codebase, conventions, and CI/CD pipeline." },
            { day: "Day 3", text: "Build and deploy custom MCP servers, hooks, and slash commands in a customer's environment — debugging integration issues live." },
            { day: "Day 4", text: "Navigate a live customer debugging session using Claude Code — diagnose a failing integration, fix it with the customer watching, and turn the save into a relationship-building moment." },
            { day: "Day 5", text: "Scope, build, and deliver a working Claude Code implementation from a customer brief — pair-program through the hard parts, leave behind documentation, and hand off a running system." },
          ]},
          { role: "Solutions Architects", color: C.green, outcomes: [
            { day: "Day 1", text: "Articulate the agentic coding value proposition to a technical audience and map it to common customer pain points." },
            { day: "Day 2", text: "Design a CLAUDE.md strategy for a multi-team engineering org — root-level standards, team-level overrides, and integration patterns with existing style guides." },
            { day: "Day 3", text: "Design a phased Claude Code adoption plan — from individual pilot to team-wide deployment — with integration patterns for the customer's existing toolchain." },
            { day: "Day 4", text: "Assess a customer's engineering org, identify the highest-leverage Claude Code insertion points, position honestly against competitors, and present a strategic adoption roadmap." },
            { day: "Day 5", text: "Present a complete Claude Code adoption strategy from a blind customer brief — architecture diagrams, phased rollout, integration patterns, ROI estimates, and honest risk assessment." },
          ]},
          { role: "Applied Research", color: C.muted, outcomes: [
            { day: "Day 1", text: "Analyze Claude Code's agentic loop behavior — tool calls, planning steps, error recovery — and identify areas where model capabilities could be extended." },
            { day: "Day 2", text: "Evaluate how CLAUDE.md content affects model reasoning quality, identify prompt patterns that improve code generation accuracy, and build evaluation harnesses." },
            { day: "Day 3", text: "Build custom tooling with the Agent SDK — automated code review pipelines, evaluation harnesses, and workflows that connect Claude Code to model training infrastructure." },
            { day: "Day 4", text: "Advise on Claude Code's capabilities and limitations for ML/training workflows — propose custom tooling workarounds and scope what's possible vs. what requires model-level changes." },
            { day: "Day 5", text: "Design and present a Claude Code-powered research workflow — custom Agent SDK tooling, evaluation metrics, integration with training pipelines — with a working prototype." },
          ]},
        ].map((group, gi) => (
          <div key={gi} style={{ margin: "28px 0" }}>
            <h3 style={{ ...h2Style, marginTop: gi === 0 ? 20 : 32 }}>
              <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: group.color, marginRight: 10, verticalAlign: "middle" }} />
              {group.role}
            </h3>
            {group.outcomes.map((o, oi) => (
              <div key={oi} style={{ display: "flex", gap: 12, marginBottom: 10, paddingLeft: 4 }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: group.color, flexShrink: 0, minWidth: 42, paddingTop: 2 }}>{o.day}</span>
                <p style={{ ...pStyle, margin: 0 }}>{o.text}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ─── 5. RATIONALE ─── */}
      <div style={sectionStyle}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 8 }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: 42, color: C.blue, lineHeight: 1, opacity: 0.25 }}>05</span>
          <h2 style={h1Style}>Rationale</h2>
        </div>
        <div style={accentLine(C.blue)} />

        <h3 style={h2Style}>Why This Sequence</h3>
        <p style={pStyle}>The five-day arc follows the Dreyfus model of skill acquisition: novice → advanced beginner → competent → proficient → expert.</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Days 1–2 (Novice → Advanced Beginner):</strong> Learners follow rules. Install Claude Code, learn the commands, write a CLAUDE.md by template. Success is defined by following the steps correctly.</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Day 3 (Competent):</strong> Learners make decisions. Which hooks to configure, which MCP servers to connect, how to compose them. Success requires judgment, not just execution.</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Day 4 (Proficient):</strong> Learners handle ambiguity. Customer objections don't follow scripts. The security conversation requires reading the room; the competitive conversation requires honest differentiation.</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Day 5 (Expert):</strong> Learners integrate everything under pressure. A blind brief, a time constraint, a live audience. This is as close as we can get to the real job without being in the field.</p>
        <p style={pStyle}>This progression also follows experiential learning theory (Kolb): concrete experience (do the task) → reflective observation (knowledge checkpoints) → abstract conceptualization (understand the pattern) → active experimentation (apply to a new scenario). Each module completes this cycle.</p>

        <h3 style={h2Style}>Key Trade-offs</h3>

        <div style={{ background: C.cream, borderRadius: 12, border: `1px solid ${C.lightGray}`, padding: "20px 24px", marginBottom: 16 }}>
          <h4 style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: C.dark, margin: "0 0 8px" }}>Shared Days 1–3 vs. earlier role divergence</h4>
          <p style={{ ...pStyle, margin: 0 }}>I chose shared sessions for the first three days despite the audience having different technical depths. The alternative — splitting into technical and non-technical tracks on Day 1 — would mean Pre-Sales PEs never build the hands-on depth needed to handle technical customer conversations. The "Simplify" toggle and facilitator pacing notes mitigate the mixed-depth challenge without sacrificing depth for anyone.</p>
        </div>
        <div style={{ background: C.cream, borderRadius: 12, border: `1px solid ${C.lightGray}`, padding: "20px 24px", marginBottom: 16 }}>
          <h4 style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: C.dark, margin: "0 0 8px" }}>Client scenarios as framing vs. abstract exercises</h4>
          <p style={{ ...pStyle, margin: 0 }}>Every module is framed through a realistic client scenario (Meridian Health, Lumen Logistics, Arcadia Financial, etc.) rather than abstract exercises. This costs development time — each scenario needs a believable company, industry context, and problem statement. The payoff: learners practice the actual cognitive work of a customer engagement rather than just learning features in isolation.</p>
        </div>
        <div style={{ background: C.cream, borderRadius: 12, border: `1px solid ${C.lightGray}`, padding: "20px 24px", marginBottom: 16 }}>
          <h4 style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: C.dark, margin: "0 0 8px" }}>Single-file React app vs. a more scalable architecture</h4>
          <p style={{ ...pStyle, margin: 0 }}>The application is built as a single App.jsx file. This was a deliberate choice for a portfolio piece that needs to be instantly understandable and deployable. For a production curriculum platform, I would split into components, add a proper router, and likely use a content management system for the curriculum data.</p>
        </div>
        <div style={{ background: C.cream, borderRadius: 12, border: `1px solid ${C.lightGray}`, padding: "20px 24px", marginBottom: 16 }}>
          <h4 style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: C.dark, margin: "0 0 8px" }}>Depth on Day 2 (CLAUDE.md) vs. distributing across days</h4>
          <p style={{ ...pStyle, margin: 0 }}>Day 2 is the deepest module (17 steps with facilitator narration scripts). I chose to invest heavily here because the CLAUDE.md before/after demo is the single most persuasive moment in the entire program. It's the demo every PE will run in their first customer conversation. Getting this day right has outsized impact on field readiness.</p>
        </div>

        <h3 style={h2Style}>What I'd Do Differently with More Time</h3>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Video walkthroughs:</strong> Pre-recorded facilitator demos for each module, so learners can watch the "ideal" run before attempting it themselves.</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Quantitative confidence measurement:</strong> Add a 1–5 confidence self-rating before and after each module. Currently the knowledge checkpoints are qualitative.</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Real MCP server for Day 3:</strong> The current lab uses a mock Jira server. With more time, I'd provision a real sandbox Jira instance.</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Alumni community and feedback loop:</strong> A Slack channel or Notion database where Basecamp graduates share field reports — what worked, what didn't, which customer scenarios came up that we didn't cover.</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Adaptive difficulty:</strong> Use the credential system to unlock advanced paths. Learners who complete all Day 1–3 badges with strong checkpoint scores could get an accelerated Day 4 with harder customer scenarios.</p>
        <p style={bulletStyle}><span style={dot}>•</span> <strong>Localization and async delivery:</strong> The current design assumes a facilitated, synchronous cohort. For global teams, I'd build an async-first version with video content, auto-graded exercises, and optional live office hours.</p>
      </div>
    </>
  );
}

// ─── COHORT 1 FEEDBACK CONTENT (extracted from FeedbackResponsePage) ───
function CohortFeedbackContent() {
  return (
    <>
      {/* Cohort 1 summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, margin: "0 0 40px", ...st.fadeUp, animationDelay: "0.1s" }}>
        {[
          { stat: "35", label: "NPS", sub: "n=17" },
          { stat: "4.1", label: "Met expectations", sub: "1–5 avg" },
          { stat: "31%", label: "Said \u201cToo fast\u201d", sub: "pacing" },
          { stat: "3.9", label: "Evals engagement", sub: "lowest session" },
          { stat: "flat", label: "Confidence trend", sub: "4.29→4.28→4.28" },
          { stat: "3.9", label: "Day 3 realism", sub: "work simulation" },
        ].map((s, i) => (
          <div key={i} style={{ background: C.cream, border: `1px solid ${C.lightGray}`, borderRadius: 10, padding: "16px 14px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22, color: s.stat === "flat" || parseFloat(s.stat) < 4.0 || s.stat === "31%" ? C.orange : C.green, lineHeight: 1.2 }}>{s.stat}</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 11, color: C.muted, marginTop: 4 }}>{s.label}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: C.faint, marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Q&A Sections */}
      {FEEDBACK_RESPONSE.map((section, si) => (
        <div key={section.id} style={{ marginBottom: 56, ...st.fadeUp, animationDelay: `${0.15 + si * 0.08}s` }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 20 }}>
            <span style={{ fontFamily: "var(--serif)", fontSize: 42, color: C.green, lineHeight: 1, opacity: 0.25, flexShrink: 0 }}>{section.number}</span>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 400, color: C.dark, margin: 0, lineHeight: 1.35 }}>{section.question}</h2>
          </div>
          <div style={{ marginBottom: 28, padding: "24px 24px", background: C.cream, borderRadius: 12, border: `1px solid ${C.lightGray}` }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: C.green, marginBottom: 16 }}>Analysis based on course best practices & data</div>
            {section.answer.map((block, bi) => {
              if (block.type === "heading") {
                return <h3 key={bi} style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: C.dark, margin: bi === 0 ? "0 0 8px" : "20px 0 8px", lineHeight: 1.4 }}>{block.text}</h3>;
              }
              return <p key={bi} style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: C.muted, lineHeight: 1.7, margin: "0 0 12px" }}>{block.text}</p>;
            })}
          </div>
          <div style={{ marginBottom: 8 }}>
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
          </div>
        </div>
      ))}

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${C.lightGray}`, paddingTop: 24, marginTop: 20, ...st.fadeUp, animationDelay: "0.5s" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: C.faint, marginBottom: 10 }}>Summary of feedback coverage</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {["Pacing / content overload", "Flat confidence (no ramp)", "Evals low engagement", "Day 3 realism drop", "Role-specific differentiation", "Setup friction", "Async/solo learner gap", "Build-first vs. abstract-first", "Interactive presentations", "Hands-on > lecture"].map((tag, i) => (
            <span key={i} style={{ fontFamily: "var(--mono)", fontSize: 9, padding: "4px 10px", borderRadius: 14, border: `1px solid ${C.green}30`, color: C.green, background: C.green + "08" }}>{tag}</span>
          ))}
        </div>
        <p style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.faint, marginTop: 16, lineHeight: 1.5 }}>
          Each tag above is addressed in at least one diagnosis, change, and measurement section. References point to specific lines, modules, and design decisions in the Claude Code Basecamp codebase.
        </p>
      </div>
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

      {/* Cohort 1 summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, margin: "36px 0 40px", ...st.fadeUp, animationDelay: "0.1s" }}>
        {[
          { stat: "35", label: "NPS", sub: "n=17" },
          { stat: "4.1", label: "Met expectations", sub: "1-5 avg" },
          { stat: "31%", label: "Said 'Too fast'", sub: "pacing" },
          { stat: "3.9", label: "Evals engagement", sub: "lowest session" },
          { stat: "flat", label: "Confidence trend", sub: "4.29→4.28→4.28" },
          { stat: "3.9", label: "Day 3 realism", sub: "work simulation" },
        ].map((s, i) => (
          <div key={i} style={{ background: C.cream, border: `1px solid ${C.lightGray}`, borderRadius: 10, padding: "16px 14px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22, color: s.stat === "flat" || parseFloat(s.stat) < 4.0 || s.stat === "31%" ? C.orange : C.green, lineHeight: 1.2 }}>{s.stat}</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 11, color: C.muted, marginTop: 4 }}>{s.label}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: C.faint, marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
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
              <div style={{ padding: "16px 20px", background: C.bg, borderRadius: 10, border: `1px solid ${C.lightGray}`, borderLeft: `3px solid ${C.orange}` }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: C.orange, marginBottom: 8 }}>What we changed</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 500, color: C.dark, marginBottom: 4 }}>{item.implementation.label}</div>
                <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.muted, lineHeight: 1.6, margin: 0 }}>{item.implementation.detail}</p>
              </div>
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
  const [simplified, setSimplified] = useState(false);
  const [facilitatorModule, setFacilitatorModule] = useState(null);
  const [subPage, setSubPage] = useState(-1); // -1 = main content, 0+ = pages index
  const [initialMaterialId, setInitialMaterialId] = useState(null); // for deep-linking into materials
  const [deliverableTab, setDeliverableTab] = useState("part1"); // "part1" or "cohort1"
  const contentRef = useRef(null);

  // Gamification state
  const [userName, setUserName] = useState(null);
  const [foundationSectionsViewed, setFoundationSectionsViewed] = useState([]);
  const [moduleSubProgress, setModuleSubProgress] = useState({});
  const [checkpointsCompleted, setCheckpointsCompleted] = useState([]);
  const [certificateEarnedDate, setCertificateEarnedDate] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);

  useEffect(() => {
    const data = loadProgress();
    if (data.foundationsDone) setFoundationsDone(true);
    if (data.path) setPath(data.path);
    if (data.completed?.length) setCompleted(new Set(data.completed));
    if (data.userName) setUserName(data.userName);
    if (data.foundationSectionsViewed?.length) setFoundationSectionsViewed(data.foundationSectionsViewed);
    if (data.moduleSubProgress) setModuleSubProgress(data.moduleSubProgress);
    if (data.checkpointsCompleted?.length) setCheckpointsCompleted(data.checkpointsCompleted);
    if (data.certificateEarnedDate) setCertificateEarnedDate(data.certificateEarnedDate);
    if (data.foundationsDone && data.path) setPhase("hub");
    else if (data.foundationsDone) setPhase("path-select");
    else setPhase("welcome");
  }, []);

  useEffect(() => {
    if (phase === "loading") return;
    saveProgress({
      foundationsDone, path, completed: [...completed],
      userName, foundationSectionsViewed, moduleSubProgress,
      checkpointsCompleted, certificateEarnedDate,
    });
  }, [foundationsDone, path, completed, phase, userName, foundationSectionsViewed, moduleSubProgress, checkpointsCompleted, certificateEarnedDate]);

  // Track foundation section views (including sub-pages)
  useEffect(() => {
    if (phase === "foundations" && !showMethodology) {
      const foundation = FOUNDATIONS[foundationStep];
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
  }, [phase, foundationStep, showMethodology, subPage]);

  // Track module sub-progress when opening a module
  useEffect(() => {
    if (phase === "module" && activeModule && !moduleSubProgress[activeModule] && !completed.has(activeModule)) {
      setModuleSubProgress(prev => ({ ...prev, [activeModule]: "started" }));
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

  // Bridge for inline material references in steps
  if (typeof window !== "undefined") {
    window.__openMaterial = (materialId) => {
      setInitialMaterialId(materialId);
      setPhase("materials");
    };
  }

  if (phase === "loading") return <div style={{ minHeight: "100vh", background: C.bg }} />;

  const progress = Math.round((completed.size / MODULES.length) * 100);
  const currentFoundation = FOUNDATIONS[foundationStep];

  return (
    <div style={st.page} ref={contentRef}>
      <ProgressIndicator foundationsDone={foundationsDone} foundationStep={foundationStep} totalFoundations={FOUNDATIONS.length} completedModules={completed.size} totalModules={MODULES.length} />

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
          <div style={{ ...st.quoteBlock, margin: "0 0 44px", ...st.fadeUp, animationDelay: "0.35s" }}>
            <p style={st.quoteText}>"The most powerful thing about Claude Code isn't what it can do alone — it's how it transforms the way engineering teams think about what's possible."</p>
          </div>
          <div style={{ ...st.fadeUp, animationDelay: "0.5s" }}>
            <button onClick={() => setPhase("foundations")} style={st.primaryBtn}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >Begin foundations →</button>
            <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: C.faint, marginTop: 12 }}>~20 min foundations · then 5 days of hands-on modules</p>
            <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
              <button onClick={() => setPhase("deliverables")} style={{ background: "none", border: "none", fontFamily: "var(--mono)", fontSize: 10, color: C.gray, cursor: "pointer", padding: 0, textDecoration: "underline", textUnderlineOffset: 3, opacity: 0.6 }}>Written deliverables →</button>
              <button onClick={() => setPhase("facilitator")} style={{ background: "none", border: "none", fontFamily: "var(--mono)", fontSize: 10, color: C.gray, cursor: "pointer", padding: 0, textDecoration: "underline", textUnderlineOffset: 3, opacity: 0.6 }}>Facilitator guide →</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ FOUNDATIONS ═══ */}
      {phase === "foundations" && (
        <>
          <div style={st.topBar}>
            <div style={st.topBarInner}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: C.faint, textTransform: "uppercase" }}>Foundations</div>
              <div style={{ display: "flex", gap: 3 }}>
                {FOUNDATIONS.map((_, i) => <div key={i} style={{ width: i === foundationStep ? 20 : 8, height: 3, borderRadius: 2, background: i <= foundationStep ? C.orange : C.lightGray, transition: "all 0.3s" }} />)}
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: C.faint }}>{foundationStep + 1}/{FOUNDATIONS.length}</div>
            </div>
            <div style={st.tabRow}>
              {FOUNDATIONS.map((f, i) => (
                <button key={f.id} onClick={() => { setShowMethodology(false); setFoundationStep(i); setSubPage(-1); }} style={{ ...st.tab, color: !showMethodology && i === foundationStep ? C.orange : C.faint, borderBottomColor: !showMethodology && i === foundationStep ? C.orange : "transparent", fontWeight: !showMethodology && i === foundationStep ? 500 : 400 }}>{f.label}</button>
              ))}
              <div style={{ flex: 1 }} />
              <button onClick={() => setShowMethodology(prev => !prev)} style={{ ...st.tab, color: showMethodology ? C.muted : C.gray, borderBottomColor: showMethodology ? C.gray : "transparent", fontWeight: 400, fontSize: 11, opacity: 0.7 }}>Methodology</button>
            </div>
            {currentFoundation.pages && !showMethodology && (
              <div style={{ display: "flex", gap: 0, borderTop: `1px solid ${C.lightGray}`, padding: "0 20px", background: C.cream }}>
                <button onClick={() => setSubPage(-1)} style={{ ...st.tab, fontSize: 11, padding: "8px 14px", color: subPage === -1 ? C.orange : C.faint, borderBottomColor: subPage === -1 ? C.orange : "transparent", fontWeight: subPage === -1 ? 500 : 400 }}>Overview</button>
                {currentFoundation.pages.map((p, pi) => (
                  <button key={p.id} onClick={() => setSubPage(pi)} style={{ ...st.tab, fontSize: 11, padding: "8px 14px", color: subPage === pi ? C.orange : C.faint, borderBottomColor: subPage === pi ? C.orange : "transparent", fontWeight: subPage === pi ? 500 : 400 }}>{p.label}</button>
                ))}
              </div>
            )}
          </div>
          {showMethodology ? (
            <div style={{ ...st.container, paddingTop: 116 }} key="methodology">
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
          ) : (
          <div style={{ ...st.container, paddingTop: currentFoundation.pages ? 148 : 116 }} key={currentFoundation.id + (subPage >= 0 ? '-' + subPage : '')}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", ...st.fadeUp }}>
              <h2 style={{ ...st.foundationTitle, margin: 0 }}>{subPage >= 0 && currentFoundation.pages ? currentFoundation.pages[subPage].title : currentFoundation.title}</h2>
              <button onClick={() => setSimplified(s => !s)} style={{ background: simplified ? C.blue + "12" : "transparent", border: `1px solid ${simplified ? C.blue + "40" : C.lightGray}`, borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontFamily: "var(--sans)", fontSize: 11, color: simplified ? C.blue : C.faint, transition: "all 0.2s", whiteSpace: "nowrap", flexShrink: 0 }}>{simplified ? "Simplified" : "Simplify"}</button>
            </div>
            <div style={{ height: 24 }} />
            {(subPage >= 0 && currentFoundation.pages ? currentFoundation.pages[subPage].content : currentFoundation.content).map((block, idx) => <ContentBlock key={idx} block={block} idx={idx} simplified={simplified} />)}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 36, paddingTop: 20, borderTop: `1px solid ${C.lightGray}` }}>
              {(foundationStep > 0 || subPage >= 0) ? (
                <button onClick={() => {
                  if (subPage > 0) { setSubPage(subPage - 1); }
                  else if (subPage === 0) { setSubPage(-1); }
                  else if (foundationStep > 0) {
                    setFoundationStep(foundationStep - 1);
                    const prev = FOUNDATIONS[foundationStep - 1];
                    if (prev.pages) { setSubPage(prev.pages.length - 1); } else { setSubPage(-1); }
                  }
                }} style={st.navBtn}>← Previous</button>
              ) : <div />}
              {foundationStep === FOUNDATIONS.length - 1 && (!currentFoundation.pages || subPage === currentFoundation.pages.length - 1) ? (
                <button onClick={() => { setFoundationsDone(true); setPhase("path-select"); }} style={st.primaryBtn}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.88"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >Choose your role →</button>
              ) : (
                <button onClick={() => {
                  if (currentFoundation.pages && subPage < currentFoundation.pages.length - 1) {
                    setSubPage(subPage + 1);
                  } else {
                    setFoundationStep(foundationStep + 1);
                    setSubPage(-1);
                  }
                }} style={st.primaryBtn}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.88"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >Continue →</button>
              )}
            </div>
          </div>
          )}
        </>
      )}

      {/* ═══ PATH SELECT ═══ */}
      {phase === "path-select" && (
        <PathSelectPage onSelect={(id) => { setPath(id); setTimeout(() => setPhase("hub"), 300); }} />
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
            <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.muted, lineHeight: 1.5, margin: "0 0 12px" }}>44-slide interactive deck covering all 5 days: agentic fundamentals, CLAUDE.md and prompt craft, hooks/MCP/integrations, customer scenarios, and the capstone format. Each slide includes facilitator speaker notes (press 'S' to open speaker view).</p>
            <a href={import.meta.env.BASE_URL + "slides/basecamp-deck.html"} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.blue, textDecoration: "none", border: `1px solid ${C.blue}30`, borderRadius: 6, padding: "6px 14px", display: "inline-block" }}>Open slide deck →</a>
          </div>
          {/* Feedback response link */}
          <div style={{ marginTop: 16, ...st.fadeUp, animationDelay: "0.65s" }}>
            <button onClick={() => setPhase("feedback-response")}
              style={{ ...st.pathCard, borderColor: C.green + "40" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.green; e.currentTarget.style.background = C.green + "04"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.green + "40"; e.currentTarget.style.background = C.bg; }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: C.green }}>Cohort 1</span>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 500, color: C.dark }}>Interview Questions</span>
                </div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.faint }}>Diagnosis, changes, and measurement plan based on program feedback data</div>
              </div>
              <span style={{ color: C.green, fontSize: 18, fontWeight: 300 }}>{"\u2192"}</span>
            </button>
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
        return (
          <div style={st.container}>
            <button onClick={() => { setActiveModule(null); setPhase("hub"); }} style={st.navBtn}>← All modules</button>
            <div style={{ ...st.fadeUp, marginTop: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 8 }}>
                <span style={{ fontFamily: "var(--serif)", fontSize: 52, color: mod.color, lineHeight: 1, opacity: 0.25 }}>{mod.number}</span>
                <div>
                  <div style={st.eyebrow}>{mod.day} · Module {mod.id} of 5</div>
                </div>
              </div>
              <h1 style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 400, color: C.dark, margin: "0 0 8px" }}>{mod.title}</h1>
              <p style={{ ...st.bodyText, maxWidth: 540, fontSize: 16, marginBottom: 28 }}>{mod.subtitle}</p>
            </div>

            {/* Modality breakdown */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", ...st.fadeUp, animationDelay: "0.08s" }}>
              {mod.modality.live && <span style={{ ...st.modalityTag, background: C.orange + "10", color: C.orange, borderColor: C.orange + "30" }}>🎤 Live: {mod.modality.live}</span>}
              {mod.modality.lab && mod.modality.lab !== "integrated" && <span style={{ ...st.modalityTag, background: C.green + "10", color: C.green, borderColor: C.green + "30" }}>🔬 Lab: {mod.modality.lab}</span>}
              {mod.modality.lab === "integrated" && <span style={{ ...st.modalityTag, background: C.green + "10", color: C.green, borderColor: C.green + "30" }}>🔬 Integrated lab</span>}
              {mod.modality.selfPaced && mod.modality.selfPaced !== "none" && <span style={{ ...st.modalityTag, background: C.blue + "10", color: C.blue, borderColor: C.blue + "30" }}>📖 Self-paced: {mod.modality.selfPaced}</span>}
            </div>

            {/* Role-specific competency */}
            {competency && (
              <div style={{ background: mod.color + "06", borderRadius: 10, padding: "16px 20px", border: `1px solid ${mod.color}20`, marginBottom: 20, ...st.fadeUp, animationDelay: "0.12s" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: mod.color, textTransform: "uppercase", marginBottom: 6 }}>Your outcome · {selectedPath?.short}</div>
                <p style={{ fontFamily: "var(--serif)", fontSize: 15, lineHeight: 1.6, color: C.dark, margin: 0, fontStyle: "italic" }}>{competency}</p>
              </div>
            )}

            <div style={{ marginBottom: 24, ...st.fadeUp, animationDelay: "0.16s" }}>
              <div style={st.statLabel}>Skills you'll build</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {mod.skills.map(sk => <span key={sk} style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 500, padding: "5px 12px", borderRadius: 16, border: `1px solid ${mod.color}40`, color: mod.color, background: mod.color + "08" }}>{sk}</span>)}
              </div>
            </div>

            {mod.clientScenario && (
              <div style={{ background: C.dark, borderRadius: 10, padding: "22px 24px", marginBottom: 20, ...st.fadeUp, animationDelay: "0.18s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: C.orange, textTransform: "uppercase" }}>Client scenario</div>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: C.gray, background: C.gray + "20", padding: "2px 8px", borderRadius: 10 }}>{mod.clientScenario.industry}</span>
                </div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 18, color: C.bg, marginBottom: 8 }}>{mod.clientScenario.company}</div>
                <p style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: C.gray, lineHeight: 1.65, margin: 0 }}>{mod.clientScenario.situation}</p>
              </div>
            )}

            <div style={{ background: C.cream, borderRadius: 10, padding: "22px 24px", borderLeft: `3px solid ${mod.color}`, marginBottom: 20, ...st.fadeUp, animationDelay: "0.22s" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: mod.color, textTransform: "uppercase", marginBottom: 8 }}>The challenge</div>
              <p style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.6, color: C.dark, margin: 0 }}>{mod.challenge}</p>
            </div>

            {mod.steps && (
              <div style={{ marginBottom: 24, ...st.fadeUp, animationDelay: "0.22s" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: mod.color, textTransform: "uppercase", marginBottom: 4 }}>Step-by-step walkthrough</div>
                <p style={{ fontFamily: "var(--sans)", fontSize: 12.5, color: C.faint, margin: "0 0 12px", lineHeight: 1.5 }}>Follow each step in order. Commands with a copy button can be pasted directly into your terminal.</p>
                <div style={{ border: `1px solid ${C.lightGray}`, borderRadius: 12, padding: "4px 20px", background: C.bg }}>
                  <ExerciseSteps steps={mod.steps} color={mod.color} />
                </div>
              </div>
            )}

            {mod.materials && mod.materials.length > 0 && (
              <div style={{ marginBottom: 24, ...st.fadeUp, animationDelay: "0.23s" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: mod.color, textTransform: "uppercase", marginBottom: 4 }}>Handouts & reference materials</div>
                <p style={{ fontFamily: "var(--sans)", fontSize: 12.5, color: C.faint, margin: "0 0 10px", lineHeight: 1.5 }}>Download or print these before starting. Click any material to view and print it.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {mod.materials.map(mat => (
                    <MaterialCallout
                      key={mat.id}
                      material={{ ...mat, format: MATERIAL_META[mat.id]?.format }}
                      color={mod.color}
                      onOpen={() => { setInitialMaterialId(mat.id); setPhase("materials"); }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div style={{ ...st.statCard, marginBottom: 20, ...st.fadeUp, animationDelay: "0.24s" }}>
              <div style={st.statLabel}>You'll produce</div>
              <div style={st.statValue}>{mod.output}</div>
            </div>

            {mod.deepDive && (
              <div style={{ background: C.blue + "06", borderRadius: 10, padding: "16px 20px", border: `1px solid ${C.blue}20`, marginBottom: 20, ...st.fadeUp, animationDelay: "0.28s" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, color: C.blue, textTransform: "uppercase", marginBottom: 6 }}>Deep dive module</div>
                <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.muted, lineHeight: 1.5, margin: 0 }}>This module has been fully built out with a slide deck, hands-on lab, and leave-behind reference. It's the session you'd experience live in Basecamp.</p>
              </div>
            )}

            {mod.gaps && (
              <div style={{ marginBottom: 20, ...st.fadeUp, animationDelay: "0.3s" }}>
                {mod.gaps.map((gap, gi) => (
                  <div key={gi} style={{ margin: "0 0 12px", padding: "18px 22px", background: C.blue + "06", borderRadius: 10, border: `1px dashed ${C.blue}40` }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1.5, color: C.blue, textTransform: "uppercase", marginBottom: 6 }}>Go deeper</div>
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

            {/* Knowledge checkpoint */}
            <KnowledgeCheckpoint
              moduleId={mod.id}
              color={mod.color}
              isCompleted={checkpointsCompleted.includes(mod.id)}
              onComplete={() => {
                if (!checkpointsCompleted.includes(mod.id)) {
                  setCheckpointsCompleted(prev => [...prev, mod.id]);
                  setModuleSubProgress(prev => ({ ...prev, [mod.id]: "checkpoint-done" }));
                }
              }}
            />

            <div style={{ display: "flex", gap: 12, ...st.fadeUp, animationDelay: "0.4s" }}>
              {!isComplete && (
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
              return (
                <div style={{ marginTop: 24, padding: "20px 24px", background: C.cream, borderRadius: 12, border: `1px solid ${C.lightGray}`, display: "flex", justifyContent: "space-between", alignItems: "center", ...st.fadeUp, animationDelay: "0.46s" }}>
                  <div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1.5, color: C.green, textTransform: "uppercase", marginBottom: 4 }}>
                      {nextMod ? "Up next" : "All days complete"}
                    </div>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 17, color: C.dark }}>
                      {nextMod ? `${nextMod.day}: ${nextMod.title}` : "Head back to see your progress and badges"}
                    </div>
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

          {/* Week progress bar */}
          <div style={{ display: "flex", gap: 3, marginBottom: 32, ...st.fadeUp, animationDelay: "0.1s" }}>
            {MODULES.map(mod => <div key={mod.id} style={{ flex: 1, height: 2, borderRadius: 1, background: completed.has(mod.id) ? mod.color : C.lightGray, transition: "background 0.5s" }} />)}
          </div>

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
                  style={{ ...st.chapterRow, ...st.fadeUp, animationDelay: `${0.2 + i * 0.06}s` }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.orange + "03"; e.currentTarget.querySelector("[data-arrow]").style.opacity = "1"; e.currentTarget.querySelector("[data-arrow]").style.transform = "translateX(4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.querySelector("[data-arrow]").style.opacity = "0.3"; e.currentTarget.querySelector("[data-arrow]").style.transform = "translateX(0)"; }}
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
                        {mod.deepDive && !done && !subProg && <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: C.blue, background: C.blue + "10", padding: "2px 8px", borderRadius: 10 }}>Deep dive</span>}
                      </div>
                      <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: C.faint, marginTop: 2 }}>{mod.skills.join(" · ")}</div>
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

          {/* Toolkit */}
          <div style={{ marginTop: 24, ...st.fadeUp, animationDelay: "0.65s" }}>
            <div style={st.eyebrow}>Your toolkit (earned artifacts)</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
              {MODULES.map(mod => <span key={mod.id} style={{ fontFamily: "var(--mono)", fontSize: 10, padding: "4px 10px", borderRadius: 4, background: completed.has(mod.id) ? mod.color + "10" : C.bg, color: completed.has(mod.id) ? mod.color : C.lightGray, border: `1px solid ${completed.has(mod.id) ? mod.color + "25" : C.lightGray}`, transition: "all 0.4s" }}>{mod.output.split("+")[0].trim()}</span>)}
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

          {/* Materials link */}
          <div style={{ marginTop: 32, textAlign: "center", ...st.fadeUp, animationDelay: "0.75s" }}>
            <button onClick={() => setPhase("materials")}
              style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500, color: C.bg, background: C.blue, border: "none", borderRadius: 8, padding: "12px 24px", cursor: "pointer", transition: "opacity 0.2s", letterSpacing: 0.3 }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >Browse all materials →</button>
          </div>

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
                  <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
                    {["Arc & Sequence", "Audience", "Modalities", "Outcomes", "Rationale"].map((label, i) => (
                      <span key={i} style={{ fontFamily: "var(--mono)", fontSize: 9, padding: "4px 10px", borderRadius: 14, border: `1px solid ${C.orange}30`, color: C.orange, background: C.orange + "08" }}>{label}</span>
                    ))}
                  </div>
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
                    A written analysis of Cohort 1 program feedback (NPS: 35, n=17). Each section presents the question asked, the answer grounded in learning science and the data provided, and how the current program design addresses the finding.
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
        <MaterialsView onBack={() => { setPhase("hub"); setInitialMaterialId(null); }} initialMaterialId={initialMaterialId} />
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
  bodyText: { fontFamily: "var(--sans)", fontSize: 14.5, lineHeight: 1.72, color: C.muted, margin: "0 0 16px" },
  sectionHeading: { fontFamily: "var(--serif)", fontSize: 20, fontWeight: 400, color: C.dark, margin: "28px 0 12px" },
  quoteBlock: { borderLeft: `2px solid ${C.lightGray}`, paddingLeft: 20 },
  quoteText: { fontFamily: "var(--serif)", fontSize: 15.5, fontStyle: "italic", lineHeight: 1.65, color: C.muted, margin: 0 },
  quoteAttr: { fontFamily: "var(--sans)", fontSize: 12, color: C.faint, marginTop: 8 },
  topBar: { position: "fixed", top: 3, left: 0, right: 0, background: C.bg, zIndex: 10, borderBottom: `1px solid ${C.lightGray}` },
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

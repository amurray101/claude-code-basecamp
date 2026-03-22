import { useState, useRef, useCallback } from "react";

// ─── MATERIAL COMPONENTS ───
import F1_WhoWeAre from "./foundations/F1_WhoWeAre";
import F2_AnthropicStack from "./foundations/F2_AnthropicStack";
import F3a_ClaudeCodeGlance from "./foundations/F3a_ClaudeCodeGlance";
import F3b_SixtySecondPitch from "./foundations/F3b_SixtySecondPitch";
import F4_HowItThinks from "./foundations/F4_HowItThinks";
import F5_Configuration from "./foundations/F5_Configuration";
import F6a_SecurityBattlecard from "./foundations/F6a_SecurityBattlecard";
import F6b_SecurityArchitecture from "./foundations/F6b_SecurityArchitecture";
import F7a_DeploymentPathFinder from "./foundations/F7a_DeploymentPathFinder";
import F7b_CostROI from "./foundations/F7b_CostROI";
import M1_InstallFirstRun from "./modules/M1_InstallFirstRun";
import M1b_CommandGlossary from "./modules/M1b_CommandGlossary";
import M1c_WhatIsClaudeCode from "./modules/M1c_WhatIsClaudeCode";
import M1d_HowClaudeCodeWorks from "./modules/M1d_HowClaudeCodeWorks";
import M2a_ClaudeMdBuilder from "./modules/M2a_ClaudeMdBuilder";
import M2b_PromptPatterns from "./modules/M2b_PromptPatterns";
import M2c_ClaudeMdConfig from "./modules/M2c_ClaudeMdConfig";
import M2d_PlanModeSessionTools from "./modules/M2d_PlanModeSessionTools";
import M3_IntegrationPatterns from "./modules/M3_IntegrationPatterns";
import M3b_CoreExtensions from "./modules/M3b_CoreExtensions";
import M3c_CICDAutomation from "./modules/M3c_CICDAutomation";
import M3d_AgentSDKMCP from "./modules/M3d_AgentSDKMCP";
import M3e_IDEIntegration from "./modules/M3e_IDEIntegration";
import M4a_CompetitiveBattlecard from "./modules/M4a_CompetitiveBattlecard";
import M4b_EnterpriseConversation from "./modules/M4b_EnterpriseConversation";
import M4c_DemoPlanning from "./modules/M4c_DemoPlanning";
import M5_CapstoneGuide from "./modules/M5_CapstoneGuide";
import P1_PreSalesPlaybook from "./paths/P1_PreSalesPlaybook";
import P2_PostSalesToolkit from "./paths/P2_PostSalesToolkit";
import P3_AdoptionFramework from "./paths/P3_AdoptionFramework";
import P4_AdvancedCapabilities from "./paths/P4_AdvancedCapabilities";

const MATERIAL_COMPONENTS = {
  F1: F1_WhoWeAre,
  F2: F2_AnthropicStack,
  F3a: F3a_ClaudeCodeGlance,
  F3b: F3b_SixtySecondPitch,
  F4: F4_HowItThinks,
  F5: F5_Configuration,
  F6a: F6a_SecurityBattlecard,
  F6b: F6b_SecurityArchitecture,
  F7a: F7a_DeploymentPathFinder,
  F7b: F7b_CostROI,
  M1: M1_InstallFirstRun,
  M1b: M1b_CommandGlossary,
  M1c: M1c_WhatIsClaudeCode,
  M1d: M1d_HowClaudeCodeWorks,
  M2a: M2a_ClaudeMdBuilder,
  M2b: M2b_PromptPatterns,
  M2c: M2c_ClaudeMdConfig,
  M2d: M2d_PlanModeSessionTools,
  M3: M3_IntegrationPatterns,
  M3b: M3b_CoreExtensions,
  M3c: M3c_CICDAutomation,
  M3d: M3d_AgentSDKMCP,
  M3e: M3e_IDEIntegration,
  M4a: M4a_CompetitiveBattlecard,
  M4b: M4b_EnterpriseConversation,
  M4c: M4c_DemoPlanning,
  M5: M5_CapstoneGuide,
  P1: P1_PreSalesPlaybook,
  P2: P2_PostSalesToolkit,
  P3: P3_AdoptionFramework,
  P4: P4_AdvancedCapabilities,
};

// ─── BRAND TOKENS ───
const C = {
  bg: "#faf9f5", dark: "#141413", orange: "#d97757", blue: "#6a9bcc",
  green: "#788c5d", gray: "#b0aea5", lightGray: "#e8e6dc", cream: "#f5f3ee",
  muted: "#6a685e", faint: "#b0aea5",
};

// ─── ANIMATION HELPERS ───
const fadeUp = {
  animation: "fadeUp 0.4s ease forwards",
  opacity: 0,
};

// ─── FORMAT TYPE COLORS ───
const FORMAT_COLORS = {
  "Pocket Guide": C.orange,
  "Quick Reference Card": C.blue,
  "Talk Track Script": C.green,
  "Cheat Sheet": C.orange,
  "Battlecard": "#a32d2d",
  "Architecture Reference": C.blue,
  "Decision Tree": C.green,
  "Worksheet": C.gray,
};

// ─── MATERIALS DATA ───
const MATERIALS = [
  // Foundations
  { id: "F1", title: "Who We Are", format: "Pocket Guide", pages: "4 panels", category: "Foundations" },
  { id: "F2", title: "The Anthropic Stack", format: "Quick Reference Card", pages: "1 front/back", category: "Foundations" },
  { id: "F3a", title: "Claude Code at a Glance", format: "Quick Reference Card", pages: "1 front/back", category: "Foundations" },
  { id: "F3b", title: "The 60-Second Pitch", format: "Talk Track Script", pages: "1 page", category: "Foundations" },
  { id: "F4", title: "How Claude Code Thinks", format: "Quick Reference Card", pages: "1 front/back", category: "Foundations" },
  { id: "F5", title: "Configuration & Customization", format: "Cheat Sheet", pages: "2 pages", category: "Foundations" },
  { id: "F6a", title: "Security Objection Handler", format: "Battlecard", pages: "1 front/back", category: "Foundations" },
  { id: "F6b", title: "Security Architecture Diagram", format: "Architecture Reference", pages: "1 page", category: "Foundations" },
  { id: "F7a", title: "Deployment Path Finder", format: "Decision Tree", pages: "1 page", category: "Foundations" },
  { id: "F7b", title: "Cost & ROI Pocket Math", format: "Quick Reference Card", pages: "1 front/back", category: "Foundations" },
  // Modules
  { id: "M1", title: "Install & First Run", format: "Cheat Sheet", pages: "2 pages", category: "Modules" },
  { id: "M1b", title: "Command Glossary", format: "Cheat Sheet", pages: "2 pages", category: "Modules" },
  { id: "M1c", title: "What is Claude Code", format: "Cheat Sheet", pages: "2 pages", category: "Modules" },
  { id: "M1d", title: "How Claude Code Works", format: "Quick Reference Card", pages: "1 front/back", category: "Modules" },
  { id: "M2a", title: "CLAUDE.md Builder", format: "Worksheet", pages: "2 pages", category: "Modules" },
  { id: "M2b", title: "Prompt Patterns for Agentic Coding", format: "Cheat Sheet", pages: "1 front/back", category: "Modules" },
  { id: "M2c", title: "Configuration Reference", format: "Cheat Sheet", pages: "2 pages", category: "Modules" },
  { id: "M2d", title: "Plan Mode & Session Tools", format: "Quick Reference Card", pages: "1 front/back", category: "Modules" },
  { id: "M3", title: "Integration Patterns", format: "Architecture Reference", pages: "2 pages", category: "Modules" },
  { id: "M3b", title: "Core Extensions", format: "Cheat Sheet", pages: "2 pages", category: "Modules" },
  { id: "M3c", title: "CI/CD & Headless Mode", format: "Quick Reference Card", pages: "1 front/back", category: "Modules" },
  { id: "M3d", title: "Agent SDK & MCP Servers", format: "Quick Reference Card", pages: "1 front/back", category: "Modules" },
  { id: "M3e", title: "IDE Integration", format: "Quick Reference Card", pages: "1 front/back", category: "Modules" },
  { id: "M4a", title: "Claude Code vs. Competition", format: "Battlecard", pages: "1 front/back", category: "Modules" },
  { id: "M4b", title: "Enterprise Deployment Conversation", format: "Talk Track Script", pages: "2 pages", category: "Modules" },
  { id: "M4c", title: "Demo Planning", format: "Worksheet", pages: "1 page", category: "Modules" },
  { id: "M5", title: "Capstone Presentation Guide", format: "Quick Reference Card", pages: "1 front/back", category: "Modules" },
  // Paths
  { id: "P1", title: "Technical Evaluation Playbook", format: "Talk Track Script", pages: "2 pages", category: "Paths", color: C.orange, tag: "PE Pre-Sales" },
  { id: "P2", title: "Customer Delivery Toolkit", format: "Cheat Sheet", pages: "2 pages", category: "Paths", color: C.blue, tag: "PE Post-Sales" },
  { id: "P3", title: "Adoption Assessment Framework", format: "Decision Tree", pages: "1 page", category: "Paths", color: C.green, tag: "Solutions Architect" },
  { id: "P4", title: "Advanced Capabilities & Agent SDK", format: "Cheat Sheet", pages: "2 pages", category: "Paths", color: C.gray, tag: "Applied Research" },
];

const GRAB_AND_GO_IDS = ["F3a", "F4", "F6a", "M4a", "F7b"];

const DISTRIBUTION_SCHEDULE = [
  { day: "Pre-work", ids: ["F1", "F2", "F3a", "F3b", "F4"] },
  { day: "Day 1", ids: ["M1c", "M1d", "M1b", "F5"] },
  { day: "Day 2", ids: ["M2c", "M2d", "M2a", "M2b"] },
  { day: "Day 3", ids: ["M3b", "M3e", "M3c", "M3d", "M3"] },
  { day: "Day 4", ids: ["F6a", "F6b", "F7a", "F7b", "M4a", "M4b", "M4c", "P1", "P2", "P3", "P4"] },
  { day: "Day 5", ids: ["M5"] },
];

const CATEGORIES = [
  { name: "Foundations", prefix: "F", color: C.orange, count: 10 },
  { name: "Modules", prefix: "M", color: C.blue, count: 17 },
  { name: "Paths", prefix: "P", color: C.green, count: 4 },
];

// ─── HELPERS ───
function getMaterial(id) {
  return MATERIALS.find(m => m.id === id);
}

function getCategoryColor(category) {
  const cat = CATEGORIES.find(c => c.name === category);
  return cat ? cat.color : C.muted;
}

// ─── PLACEHOLDER COMPONENT ───
function MaterialPlaceholder({ material, onBack }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: "32px 24px" }}>
      <button
        onClick={onBack}
        style={{
          fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500,
          color: C.muted, background: "transparent", border: `1px solid ${C.lightGray}`,
          borderRadius: 8, padding: "8px 18px", cursor: "pointer",
          marginBottom: 24, transition: "all 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.orange; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = C.lightGray; e.currentTarget.style.color = C.muted; }}
      >
        &larr; Back to Materials
      </button>
      <div style={{
        maxWidth: 800, margin: "0 auto", background: C.cream,
        border: `1px solid ${C.lightGray}`, borderRadius: 12,
        padding: "60px 40px", textAlign: "center",
      }}>
        <div style={{
          fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 2,
          color: getCategoryColor(material.category), textTransform: "uppercase",
          marginBottom: 8,
        }}>
          {material.id}
        </div>
        <h1 style={{
          fontFamily: "var(--serif)", fontSize: 28, fontWeight: 400,
          color: C.dark, marginBottom: 12,
        }}>
          {material.title}
        </h1>
        <div style={{
          fontFamily: "var(--sans)", fontSize: 14, color: C.muted, marginBottom: 24,
        }}>
          {material.format} &middot; {material.pages}
        </div>
        <div style={{
          fontFamily: "var(--sans)", fontSize: 14, color: C.faint,
          lineHeight: 1.7, maxWidth: 400, margin: "0 auto",
        }}>
          This material is being prepared. The full content will appear here once the component is ready.
        </div>
      </div>
    </div>
  );
}

// ─── MATERIAL CARD ───
function MaterialCard({ material, onClick, highlighted }) {
  const accentColor = material.color || getCategoryColor(material.category);
  const formatColor = FORMAT_COLORS[material.format] || C.muted;

  return (
    <div
      onClick={onClick}
      style={{
        background: highlighted ? C.orange + "06" : C.cream,
        border: `1px solid ${highlighted ? C.orange + "30" : C.lightGray}`,
        borderRadius: 10, padding: "18px 20px", cursor: "pointer",
        transition: "all 0.2s ease", position: "relative",
        borderLeft: `3px solid ${accentColor}`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = accentColor + "60";
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = highlighted ? C.orange + "30" : C.lightGray;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{
          fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1.5,
          color: accentColor, textTransform: "uppercase", fontWeight: 600,
        }}>
          {material.id}
        </span>
        {material.tag && (
          <span style={{
            fontFamily: "var(--mono)", fontSize: 9, color: material.color,
            background: material.color + "12", padding: "2px 8px",
            borderRadius: 10, letterSpacing: 0.5,
          }}>
            {material.tag}
          </span>
        )}
      </div>
      <div style={{
        fontFamily: "var(--sans)", fontSize: 14, fontWeight: 500,
        color: C.dark, lineHeight: 1.4, marginBottom: 10,
      }}>
        {material.title}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{
          fontFamily: "var(--mono)", fontSize: 10, color: formatColor,
          background: formatColor + "10", padding: "2px 8px",
          borderRadius: 10, letterSpacing: 0.3,
        }}>
          {material.format}
        </span>
        <span style={{
          fontFamily: "var(--mono)", fontSize: 10, color: C.faint,
        }}>
          {material.pages}
        </span>
      </div>
    </div>
  );
}

// ─── PRINT HELPERS ───
function handlePrint() {
  // In a full implementation this would trigger printing of the specific material.
  // For now, log and use window.print with a data attribute selector.
  window.print();
}

function handlePrintAll() {
  window.print();
}

// ─── MAIN COMPONENT ───
export default function MaterialsView({ onBack, initialMaterialId }) {
  const [activeMaterial, setActiveMaterial] = useState(() => {
    if (initialMaterialId) {
      return MATERIALS.find(m => m.id === initialMaterialId) || null;
    }
    return null;
  });
  const [activeCategory, setActiveCategory] = useState(null);
  const contentRef = useRef(null);

  const openMaterial = useCallback((material) => {
    setActiveMaterial(material);
    window.scrollTo({ top: 0 });
  }, []);

  const closeMaterial = useCallback(() => {
    if (initialMaterialId) {
      onBack();
    } else {
      setActiveMaterial(null);
    }
  }, [initialMaterialId, onBack]);

  // If viewing a single material full-screen
  if (activeMaterial) {
    const MaterialComponent = MATERIAL_COMPONENTS[activeMaterial.id];
    return (
      <div>
        {MaterialComponent ? (
          <div style={{ minHeight: "100vh", background: C.bg, padding: "32px 24px" }}>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
              <button
                onClick={closeMaterial}
                style={{
                  fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500,
                  color: C.muted, background: "transparent", border: `1px solid ${C.lightGray}`,
                  borderRadius: 8, padding: "8px 18px", cursor: "pointer",
                  marginBottom: 24, transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.orange; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.lightGray; e.currentTarget.style.color = C.muted; }}
                className="no-print"
              >
                &larr; {initialMaterialId ? "Back" : "Back to Materials"}
              </button>
              <MaterialComponent />
            </div>
          </div>
        ) : (
          <MaterialPlaceholder material={activeMaterial} onBack={closeMaterial} />
        )}
        {/* Print button for individual material */}
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 100,
        }}>
          <button
            onClick={() => handlePrint(activeMaterial.id)}
            style={{
              fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500,
              color: C.bg, background: C.dark, border: "none",
              borderRadius: 10, padding: "12px 22px", cursor: "pointer",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)", transition: "all 0.2s",
              display: "flex", alignItems: "center", gap: 8,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.orange; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.dark; }}
          >
            <PrintIcon size={14} />
            Print
          </button>
        </div>
      </div>
    );
  }

  const foundations = MATERIALS.filter(m => m.category === "Foundations");
  const modules = MATERIALS.filter(m => m.category === "Modules");
  const paths = MATERIALS.filter(m => m.category === "Paths");
  const grabAndGo = GRAB_AND_GO_IDS.map(getMaterial).filter(Boolean);

  return (
    <div style={{ minHeight: "100vh", background: C.bg }} ref={contentRef}>
      {/* ─── HEADER ─── */}
      <div style={{
        borderBottom: `1px solid ${C.lightGray}`, background: C.bg,
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{
          maxWidth: 960, margin: "0 auto", padding: "16px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={onBack}
              style={{
                fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500,
                color: C.muted, background: "transparent", border: `1px solid ${C.lightGray}`,
                borderRadius: 8, padding: "7px 16px", cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.orange; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.lightGray; e.currentTarget.style.color = C.muted; }}
            >
              &larr; Back
            </button>
            <div>
              <h1 style={{
                fontFamily: "var(--serif)", fontSize: 22, fontWeight: 400,
                color: C.dark, lineHeight: 1.2,
              }}>
                Basecamp Materials
              </h1>
              <div style={{
                fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1.5,
                color: C.faint, textTransform: "uppercase", marginTop: 2,
              }}>
                {MATERIALS.length} materials across {CATEGORIES.length} categories
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handlePrintAll}
              style={{
                fontFamily: "var(--sans)", fontSize: 12, fontWeight: 500,
                color: C.muted, background: C.cream, border: `1px solid ${C.lightGray}`,
                borderRadius: 8, padding: "7px 16px", cursor: "pointer",
                transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.dark; e.currentTarget.style.color = C.dark; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.lightGray; e.currentTarget.style.color = C.muted; }}
            >
              <PrintIcon size={12} />
              Print All
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>

        {/* ─── GRAB AND GO ─── */}
        <div style={{
          background: C.orange + "06", border: `1px solid ${C.orange}20`,
          borderRadius: 12, padding: "24px 28px", marginBottom: 36,
          ...fadeUp,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <BoltIcon />
            <h2 style={{
              fontFamily: "var(--serif)", fontSize: 18, fontWeight: 400,
              color: C.dark,
            }}>
              Grab and Go
            </h2>
          </div>
          <p style={{
            fontFamily: "var(--sans)", fontSize: 13, color: C.muted,
            marginBottom: 16, lineHeight: 1.6,
          }}>
            The 5 essential cards for any sales meeting. Print this stack and keep it in your bag.
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 10,
          }}>
            {grabAndGo.map((m) => (
              <MaterialCard
                key={m.id}
                material={m}
                onClick={() => openMaterial(m)}
                highlighted
              />
            ))}
          </div>
          <div style={{ marginTop: 14, textAlign: "right" }}>
            <button
              onClick={handlePrintAll}
              style={{
                fontFamily: "var(--sans)", fontSize: 11, fontWeight: 500,
                color: C.orange, background: "transparent",
                border: `1px solid ${C.orange}30`, borderRadius: 6,
                padding: "6px 14px", cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.orange; e.currentTarget.style.color = C.bg; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.orange; }}
            >
              Print Grab & Go Stack
            </button>
          </div>
        </div>

        {/* ─── CATEGORY FILTERS ─── */}
        <div style={{
          display: "flex", gap: 8, marginBottom: 28,
          ...fadeUp, animationDelay: "0.1s",
        }}>
          <button
            onClick={() => setActiveCategory(null)}
            style={{
              fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 0.5,
              color: activeCategory === null ? C.bg : C.muted,
              background: activeCategory === null ? C.dark : "transparent",
              border: `1px solid ${activeCategory === null ? C.dark : C.lightGray}`,
              borderRadius: 20, padding: "5px 14px", cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            All ({MATERIALS.length})
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name === activeCategory ? null : cat.name)}
              style={{
                fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 0.5,
                color: activeCategory === cat.name ? C.bg : cat.color,
                background: activeCategory === cat.name ? cat.color : "transparent",
                border: `1px solid ${activeCategory === cat.name ? cat.color : cat.color + "40"}`,
                borderRadius: 20, padding: "5px 14px", cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        {/* ─── FOUNDATIONS ─── */}
        {(!activeCategory || activeCategory === "Foundations") && (
          <CategorySection
            title="Foundations"
            subtitle="Core knowledge for every team member"
            color={C.orange}
            materials={foundations}
            onOpenMaterial={openMaterial}
            delay="0.15s"
          />
        )}

        {/* ─── MODULES ─── */}
        {(!activeCategory || activeCategory === "Modules") && (
          <CategorySection
            title="Modules"
            subtitle="Hands-on skill building materials"
            color={C.blue}
            materials={modules}
            onOpenMaterial={openMaterial}
            delay="0.2s"
          />
        )}

        {/* ─── PATHS ─── */}
        {(!activeCategory || activeCategory === "Paths") && (
          <CategorySection
            title="Paths"
            subtitle="Role-specific deep dives"
            color={C.green}
            materials={paths}
            onOpenMaterial={openMaterial}
            delay="0.25s"
          />
        )}

        {/* ─── DISTRIBUTION SCHEDULE ─── */}
        {!activeCategory && (
          <div style={{
            marginTop: 16, marginBottom: 48,
            ...fadeUp, animationDelay: "0.3s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <CalendarIcon />
              <h2 style={{
                fontFamily: "var(--serif)", fontSize: 18, fontWeight: 400,
                color: C.dark,
              }}>
                Distribution Schedule
              </h2>
            </div>
            <p style={{
              fontFamily: "var(--sans)", fontSize: 13, color: C.muted,
              marginBottom: 16, lineHeight: 1.6,
            }}>
              When each material is distributed during the Basecamp program.
            </p>
            <div style={{
              background: C.cream, border: `1px solid ${C.lightGray}`,
              borderRadius: 12, overflow: "hidden",
            }}>
              {DISTRIBUTION_SCHEDULE.map((slot, i) => (
                <div
                  key={slot.day}
                  style={{
                    padding: "16px 22px",
                    borderBottom: i < DISTRIBUTION_SCHEDULE.length - 1 ? `1px solid ${C.lightGray}` : "none",
                    display: "flex", gap: 20, alignItems: "flex-start",
                  }}
                >
                  <div style={{
                    fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600,
                    color: C.dark, minWidth: 72, paddingTop: 2,
                    letterSpacing: 0.5,
                  }}>
                    {slot.day}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1 }}>
                    {slot.ids.map(id => {
                      const mat = getMaterial(id);
                      if (!mat) return null;
                      const color = mat.color || getCategoryColor(mat.category);
                      return (
                        <button
                          key={id}
                          onClick={() => openMaterial(mat)}
                          style={{
                            fontFamily: "var(--mono)", fontSize: 10,
                            color: color, background: color + "10",
                            border: `1px solid ${color}20`,
                            borderRadius: 6, padding: "4px 10px",
                            cursor: "pointer", transition: "all 0.2s",
                            lineHeight: 1.4,
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = color + "20"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = color + "10"; }}
                          title={mat.title}
                        >
                          {id}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CATEGORY SECTION ───
function CategorySection({ title, subtitle, color, materials, onOpenMaterial, delay }) {
  return (
    <div style={{ marginBottom: 32, ...fadeUp, animationDelay: delay }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
        <h2 style={{
          fontFamily: "var(--serif)", fontSize: 18, fontWeight: 400,
          color: C.dark,
        }}>
          {title}
        </h2>
        <span style={{
          fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1,
          color: color, textTransform: "uppercase",
        }}>
          {materials.length} items
        </span>
      </div>
      <p style={{
        fontFamily: "var(--sans)", fontSize: 13, color: C.muted,
        marginBottom: 14,
      }}>
        {subtitle}
      </p>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
        gap: 10,
      }}>
        {materials.map(m => (
          <MaterialCard
            key={m.id}
            material={m}
            onClick={() => onOpenMaterial(m)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── ICONS ───
function PrintIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6V1h8v5" />
      <path d="M4 12H2V7h12v5h-2" />
      <rect x="4" y="10" width="8" height="5" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={C.orange} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 1L3 9h5l-1 6 6-8H8l1-6z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={C.muted} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="12" height="12" rx="1.5" />
      <path d="M5 1v3M11 1v3M2 7h12" />
    </svg>
  );
}

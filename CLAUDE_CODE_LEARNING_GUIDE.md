# Claude Code: Comprehensive Learning Guide

A structured, 5-day curriculum covering everything you need to go from zero to proficient with Claude Code. Days 1-3 form a common core for all participants; Days 4-5 branch into role-specific scenarios and a capstone project.

---

## 5-Day Curriculum Overview

```
Day 1: First Contact (Common Core)
  ├── What is Claude Code — agentic CLI, not autocomplete
  ├── Install, authenticate, verify
  ├── Core concepts: agentic loop, context window, tools, permissions
  └── Hands-on: complete your first agentic task

Day 2: Prompt Craft (Common Core)
  ├── CLAUDE.md deep dive — authoring, hierarchy, best practices
  ├── Settings files, CLI flags, plan mode, slash commands, shortcuts
  ├── Prompting patterns and common workflows
  └── Hands-on: write a CLAUDE.md, before/after demo, prompt practice

Day 3: Extend & Customize (Common Core)
  ├── Hooks, MCP servers, sub-agents, custom slash commands
  ├── IDE integration (VS Code, JetBrains)
  ├── CI/CD automation, headless mode, GitHub Actions
  ├── Agent SDK intro, building MCP servers
  └── Hands-on: build a hook, connect an MCP server, create a slash command

Day 4: Role-Specific Scenarios (Role Breakouts)
  ├── Content varies by role (PE Pre-Sales, PE Post-Sales, SA, Applied Research)
  ├── Security model & best practices — weighted by role
  ├── Competitive positioning, deployment architecture, objection handling
  └── Hands-on: tailored exercises and scenarios per role

Day 5: Capstone — Ship It (Role-Specific)
  ├── Blind brief matched to your role
  ├── Build a working demo/implementation from scratch
  ├── Present to peers with feedback
  └── Integrates all Days 1-4 skills
```

---

# Common Core

---

## Day 1: First Contact

*Goal: Install Claude Code, understand its core concepts, and complete your first agentic task.*

### 1.1 What Is Claude Code?
- Claude Code is Anthropic's **agentic CLI tool** — an AI coding assistant that runs in your terminal
- It's not autocomplete; it's an **autonomous agent** that can read files, write code, run commands, search the web, and iterate on its own work
- It operates in an **agentic loop**: receives your prompt → plans → takes actions (tool calls) → observes results → repeats until the task is done
- Available as a CLI (`claude`), a VS Code extension, and a JetBrains plugin

### 1.2 Installation
- **Requirements**: Node.js 18+, an Anthropic API key or Claude Pro/Max subscription
- **Install via npm**: `npm install -g @anthropic-ai/claude-code`
- **First run**: Type `claude` in your terminal — it will walk you through authentication
- **Verify**: `claude --version`
- **Update**: `npm update -g @anthropic-ai/claude-code`

### 1.3 First Interaction
- Launch with `claude` in any project directory
- Type a natural language prompt (e.g., "explain this codebase" or "fix the failing tests")
- Watch the agentic loop in action: Claude reads files, reasons, writes code, runs tests
- Use `Ctrl+C` to interrupt, `Enter` to send, `Escape` to cancel

### 1.4 The Agentic Loop
- Claude Code operates in a **plan → act → observe → repeat** cycle
- It has access to **tools**: file reading, file writing, terminal commands, web search, etc.
- Each iteration, it decides which tool to use, executes it, reads the result, and decides next steps
- It **self-corrects** — if a test fails or an error occurs, it reads the output and tries to fix it

### 1.5 Context Window and Memory
- Claude Code uses the model's context window (up to 200K tokens)
- As conversations get long, older messages are **automatically compressed** to stay within limits
- Each new `claude` session starts fresh — there is no persistent memory across sessions by default
- Use **CLAUDE.md files** (covered in Day 2) to give Claude persistent project context

### 1.6 Tool Use (What Claude Can Do)
Claude Code has access to these built-in tools:
| Tool | What It Does |
|------|-------------|
| **Read** | Read files from your filesystem |
| **Write** | Create new files |
| **Edit** | Make targeted edits to existing files (find-and-replace) |
| **Bash** | Run shell commands (build, test, git, etc.) |
| **Glob** | Search for files by name pattern |
| **Grep** | Search file contents with regex |
| **WebSearch** | Search the web for information |
| **WebFetch** | Fetch and read a webpage |
| **Agent** | Spawn sub-agents for parallel/complex tasks |
| **NotebookEdit** | Edit Jupyter notebook cells |
| **TodoWrite** | Track multi-step task progress |

### 1.7 Permission System
- Claude Code asks for permission before taking potentially dangerous actions
- **Three permission modes** (set at launch or in settings):
  - **Ask mode** (default): Asks before every tool use
  - **Auto-accept mode**: Automatically allows read-only operations, asks for writes/commands
  - **Full auto mode** (`--dangerously-skip-permissions`): No prompts — use only in sandboxed/CI environments
- You can configure **per-tool permissions** in `settings.json` (e.g., always allow `npm test`)
- Permission allowlists support glob patterns for commands

### Day 1 Hands-On
- Install Claude Code and authenticate
- Run `claude --version` to verify
- Launch an interactive session in a project directory
- Complete your first agentic task (e.g., "explain this codebase" or "find and fix a bug")

---

## Day 2: Prompt Craft

*Goal: Master configuration, learn the prompting patterns that get the best results, and practice common workflows.*

### 2.1 CLAUDE.md Files (Project Memory)
This is the **single most impactful feature** to learn — it dramatically improves output quality.

- **What**: Markdown files that give Claude persistent context about your project
- **Where they go** (loaded in order, all are additive):
  - `~/.claude/CLAUDE.md` — global, applies to all projects
  - `./CLAUDE.md` — project root, applies to the whole repo
  - `./src/CLAUDE.md` — directory-level, applies when working in that directory
  - `./.claude/CLAUDE.md` — alternative project location (can be gitignored)
- **What to include**:
  - Build/test/lint commands (`npm test`, `pytest`, etc.)
  - Code style conventions (naming, patterns, formatting)
  - Architecture overview (key directories, data flow)
  - Common gotchas and project-specific rules
  - Preferred libraries and frameworks
- **Pro tip**: Run `claude` and ask it to generate a CLAUDE.md for your project — then refine it

### 2.2 Settings Files
- **Global settings**: `~/.claude/settings.json`
- **Project settings**: `.claude/settings.json` (checked into git, shared with team)
- **Local project settings**: `.claude/settings.local.json` (gitignored, personal overrides)
- Key settings include:
  - `permissions` — tool-level allow/deny rules
  - `env` — environment variables to set
  - `model` — default model to use
  - `hooks` — lifecycle event handlers (see Day 3)

### 2.3 CLI Flags and Options
| Flag | Purpose |
|------|---------|
| `claude` | Start interactive session |
| `claude -p "prompt"` | One-shot mode (non-interactive) |
| `claude -c` | Continue the last conversation |
| `claude --model <model>` | Choose a specific model |
| `claude --allowedTools <tool>` | Pre-approve specific tools |
| `claude --output-format json` | Output as JSON (for scripting) |
| `claude --verbose` | Show detailed tool call information |
| `claude --dangerously-skip-permissions` | Full auto mode (CI/sandboxed only) |

### 2.4 Plan Mode
- Activated by pressing `Shift+Tab` to toggle between **Plan** and **Act** modes
- **Plan mode**: Claude researches and creates a plan but does NOT write code or run commands
- **Act mode** (default): Claude executes — writes files, runs commands, etc.
- Workflow: Start in Plan mode to align on approach → switch to Act mode to implement
- Useful for complex tasks where you want to review the strategy before execution

### 2.5 Slash Commands
Type these during an interactive session:

| Command | What It Does |
|---------|-------------|
| `/help` | Show help and available commands |
| `/clear` | Clear conversation history and start fresh |
| `/compact` | Compress conversation to free up context window |
| `/model` | Switch the active model mid-conversation |
| `/cost` | Show token usage and cost for the session |
| `/permissions` | View and manage tool permissions |
| `/config` | View/modify settings |
| `/doctor` | Diagnose installation and configuration issues |
| `/review` | Review code changes (like a code review) |
| `/pr-comments` | Address PR review comments |
| `/init` | Generate a CLAUDE.md for the current project |
| `/memory` | Edit your CLAUDE.md files |
| `/mcp` | View connected MCP servers |
| `/fast` | Toggle fast mode (same model, faster output) |

### 2.6 Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Escape` | Cancel current input / go back |
| `Ctrl+C` | Interrupt Claude's current action |
| `Shift+Tab` | Toggle Plan/Act mode |
| `Up Arrow` | Cycle through prompt history |
| `Tab` | Autocomplete file paths in your prompt |
| `@filename` | Reference a specific file in your prompt |

### 2.7 Session Management
- Use `/compact` proactively to free up context window space before it fills up
- Use `/clear` to start a fresh conversation within the same session
- Use `/cost` to monitor token usage and spending
- Use `claude -c` to continue your most recent conversation from a new terminal

### 2.8 Effective Prompting Patterns
- **Be specific**: "Add input validation to the signup form that checks email format and password strength" > "improve the form"
- **Reference files**: Use `@filename` to point Claude at specific files
- **Iterate**: Start broad, then refine — "explain this codebase" → "now focus on the auth module" → "refactor the token refresh logic"
- **Use constraints**: "Don't change the public API" or "Keep backward compatibility"
- **Show examples**: "Format it like the UserService class" or "Follow the pattern in tests/example.test.js"

### 2.9 Common Workflows
| Workflow | How to Approach It |
|----------|-------------------|
| **Bug fixing** | Paste the error, let Claude investigate, have it fix and verify with tests |
| **New feature** | Use Plan mode first, agree on approach, then switch to Act mode |
| **Code review** | Use `/review` or ask Claude to review your changes |
| **Refactoring** | Describe the goal, let Claude handle the mechanics, verify tests pass |
| **Understanding code** | "Explain how [feature] works" — Claude reads the code and explains |
| **Test writing** | "Write tests for [module]" — Claude reads the code, writes tests, runs them |
| **Migration** | Break into phases, use Plan mode, execute incrementally |
| **Documentation** | Ask Claude to document functions, APIs, or architecture |

### 2.10 Working on Large Codebases
- Start every session with context: "This is a [language] [framework] app that does [X]"
- Use CLAUDE.md to front-load architecture knowledge
- Break large tasks into smaller, sequential prompts
- Use `/compact` when the context window fills up
- Point Claude at specific files rather than asking it to search the whole repo

### Day 2 Hands-On
- Write a CLAUDE.md file for your project (or use `/init` and refine it)
- Before/after demo: try a task without CLAUDE.md, then with it — compare results
- Practice prompting patterns: specific vs. vague, Plan mode then Act mode, iterative refinement

---

## Day 3: Extend & Customize

*Goal: Unlock Claude Code's extensibility — hooks, MCP, custom commands, IDE integration, CI/CD, and the Agent SDK.*

### 3.1 Hooks
Hooks let you run custom shell commands in response to Claude Code lifecycle events.

- **Configured in**: `settings.json` under the `"hooks"` key
- **Available hook events**:
  - `PreToolUse` — runs before a tool is executed (can block it)
  - `PostToolUse` — runs after a tool finishes
  - `Notification` — runs when Claude sends a notification
  - `Stop` — runs when Claude finishes its turn
  - `SubagentStop` — runs when a sub-agent completes
- **Use cases**:
  - Auto-format code after every file write
  - Block certain commands from running
  - Log all tool usage for auditing
  - Run linters automatically after edits
  - Send notifications to Slack/Teams when tasks complete
- Hook commands receive event data via stdin (JSON) and can return JSON to modify behavior

### 3.2 MCP Servers (Model Context Protocol)
MCP lets you extend Claude Code with custom tools and data sources.

- **What**: A protocol for connecting Claude to external services (databases, APIs, internal tools)
- **Configure in**: `settings.json` under `"mcpServers"`
- **How it works**: You point Claude Code at an MCP server, and it gains new tools from that server
- **Common MCP servers**:
  - Database access (query your DB directly)
  - Jira/Linear integration (read/create tickets)
  - Slack integration (read/send messages)
  - Custom internal APIs
  - File system servers for remote access
- **Setup**: Specify the server command, args, and optional env vars in settings
- **Building your own**: MCP servers can be written in any language — they communicate via stdio using JSON-RPC

### 3.3 Sub-Agents
- Claude Code can spawn **sub-agents** to handle tasks in parallel
- Sub-agents get their own context window — prevents the main conversation from getting bloated
- Useful for: researching multiple files simultaneously, running independent tasks in parallel
- Types: `general-purpose`, `Explore` (fast codebase search), `Plan` (architecture), and more
- Sub-agents can optionally run in **isolated git worktrees** for safe experimentation

### 3.4 Custom Slash Commands
- Create your own slash commands by adding markdown files to `.claude/commands/`
- File name becomes the command name (e.g., `.claude/commands/review.md` → `/project:review`)
- The file content becomes the prompt template
- Use `$ARGUMENTS` placeholder to accept parameters
- Great for standardizing team workflows (e.g., `/project:deploy`, `/project:test-suite`)

### 3.5 VS Code Extension
- Install "Claude Code" from the VS Code marketplace
- Opens Claude Code in a panel within VS Code
- Claude can see your open files, selections, and diagnostics
- Use `Cmd+Shift+P` → "Claude Code" to access commands
- Supports inline diff view for proposed changes

### 3.6 JetBrains Plugin
- Available for IntelliJ, WebStorm, PyCharm, and other JetBrains IDEs
- Similar integration — Claude Code runs in a tool window
- Access via the tool window or keyboard shortcuts

### 3.7 Non-Interactive / Headless Mode
- Use `claude -p "prompt"` for scripting and CI pipelines
- Combine with `--output-format json` for machine-readable output
- Use `--dangerously-skip-permissions` in sandboxed CI environments only
- Pipe input: `echo "fix lint errors" | claude -p -`
- Chain with other tools: `claude -p "generate a changelog" --output-format text > CHANGELOG.md`

### 3.8 GitHub Actions Integration
- Use Claude Code in GitHub Actions for automated code review, PR generation, issue triage
- Anthropic provides official GitHub Actions workflows
- Set `ANTHROPIC_API_KEY` as a repository secret

### 3.9 Git Integration
- Claude Code understands git natively — it can stage, commit, create branches, handle merges
- Ask it to "commit my changes" and it will write a good commit message based on the diff
- It can create pull requests using the `gh` CLI
- It can review PRs, address review comments, and resolve merge conflicts
- Always review Claude's proposed git operations before approving push/force-push

### 3.10 Agent SDK (Claude Agent SDK)
- Build your own agents powered by Claude, using the same tool infrastructure
- Available in Python (`claude_agent_sdk`) and TypeScript (`@anthropic-ai/claude-code`)
- Use Claude Code as a **subprocess** in your own applications
- Build custom workflows: automated code review bots, deployment assistants, monitoring agents

### 3.11 Building MCP Servers
- Write custom MCP servers to give Claude access to your internal tools
- Servers communicate via stdio using JSON-RPC
- Can be built in Python, TypeScript, or any language
- Register in `settings.json` and they appear as new tools in Claude Code

### Day 3 Hands-On
- Build a hook (e.g., auto-format code after every file write)
- Connect an MCP server (e.g., a database or Jira integration)
- Create a custom slash command for a team workflow

---

# Role-Specific

---

## Day 4: Role-Specific Scenarios

*Goal: Apply Claude Code skills to your specific role — with tailored exercises, security considerations, and real-world scenarios.*

Content for Day 4 varies by role. Each track covers security and best practices weighted to the role's needs, along with role-specific exercises.

### 4.1 Security Model
- Claude Code runs commands **on your machine** — treat it like a junior developer with terminal access
- Always review commands before approving, especially: `rm`, `git push`, database operations
- Use permission allowlists to pre-approve safe commands, block dangerous ones
- Sensitive files (`.env`, credentials) — Claude can read them; use `.gitignore` and be careful
- In CI: use `--dangerously-skip-permissions` only in sandboxed, disposable environments

### 4.2 Best Practices
- **Start with CLAUDE.md**: 10 minutes of setup saves hours of correction
- **Use Plan mode for big tasks**: Align on approach before Claude starts writing code
- **Review diffs**: Always review what Claude changed before committing
- **Commit frequently**: Make small commits so you can easily revert if needed
- **Use version control**: Never run Claude Code on uncommitted work without a safety net
- **Be specific**: Vague prompts produce vague results
- **Iterate, don't restart**: Refine within a session rather than starting over
- **Use `/compact` proactively**: Don't wait for context window issues

### 4.3 Role Tracks

**PE Pre-Sales**
- Competitive positioning: how Claude Code compares, key differentiators
- Live demo techniques: setting up impressive, reproducible demos
- Customer objection handling: latency, cost, security, accuracy concerns
- Deployment architecture: API-key management, team rollouts, enterprise patterns

**PE Post-Sales**
- Customer onboarding workflows: getting teams productive quickly
- Troubleshooting common issues: authentication, permissions, context limits
- Advanced configuration for customer environments
- Measuring and reporting adoption metrics

**Solutions Architect**
- Deployment architecture deep dive: network, auth, data residency
- Integration patterns: MCP servers, hooks, CI/CD for enterprise environments
- Security review: permission model, data flow, compliance considerations
- Scalability: managing Claude Code across large teams and monorepos

**Applied Research**
- Agent SDK deep dive: building custom agents and toolchains
- Advanced MCP server development
- Benchmarking and evaluating agent performance
- Pushing the boundaries: novel workflows and experimental patterns

### Day 4 Hands-On
- Exercises and scenarios tailored to your role track (see role track details above)

---

## Day 5: Capstone — Ship It

*Goal: Prove mastery by building something real, under pressure, and presenting it to peers.*

### 5.1 Format
- You receive a **blind brief** matched to your role — you will not see it in advance
- You have a fixed time window to build a **working demo or implementation** from scratch
- The brief is designed to exercise skills from all four prior days:
  - Day 1: core CLI usage and understanding the agentic loop
  - Day 2: effective prompting, CLAUDE.md, configuration
  - Day 3: extensibility — hooks, MCP, custom commands, CI/CD, SDK
  - Day 4: role-specific knowledge and scenario handling

### 5.2 Deliverables
- A working demo or implementation that solves the brief
- A brief walkthrough/presentation to your peers
- Peer feedback and discussion

### 5.3 Evaluation Criteria
- Does the solution work end to end?
- Effective use of Claude Code features (CLAUDE.md, Plan mode, hooks, MCP, etc.)
- Prompting quality and workflow efficiency
- Role-appropriate depth (e.g., security for SAs, demo polish for PE Pre-Sales)

---

## Quick Reference Card

```
claude                    # Start interactive session
claude -p "prompt"        # One-shot mode
claude -c                 # Continue last session
/help                     # Show commands
/compact                  # Free up context
/init                     # Generate CLAUDE.md
/model                    # Switch model
/cost                     # Show usage stats
Shift+Tab                 # Toggle Plan/Act mode
Ctrl+C                    # Interrupt current action
@filename                 # Reference a file in prompt
```

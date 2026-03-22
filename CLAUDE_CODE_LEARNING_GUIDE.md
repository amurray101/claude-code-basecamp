# Claude Code: Comprehensive Learning Guide

A structured, logical roadmap covering everything you need to learn to go from zero to proficient with Claude Code.

---

## Phase 1: Foundations — What It Is and Getting Started

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

---

## Phase 2: Core Concepts — How It Works

### 2.1 The Agentic Loop
- Claude Code operates in a **plan → act → observe → repeat** cycle
- It has access to **tools**: file reading, file writing, terminal commands, web search, etc.
- Each iteration, it decides which tool to use, executes it, reads the result, and decides next steps
- It **self-corrects** — if a test fails or an error occurs, it reads the output and tries to fix it

### 2.2 Context Window and Memory
- Claude Code uses the model's context window (up to 200K tokens)
- As conversations get long, older messages are **automatically compressed** to stay within limits
- Each new `claude` session starts fresh — there is no persistent memory across sessions by default
- Use **CLAUDE.md files** (covered in Phase 3) to give Claude persistent project context

### 2.3 Tool Use (What Claude Can Do)
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

### 2.4 Permission System
- Claude Code asks for permission before taking potentially dangerous actions
- **Three permission modes** (set at launch or in settings):
  - **Ask mode** (default): Asks before every tool use
  - **Auto-accept mode**: Automatically allows read-only operations, asks for writes/commands
  - **Full auto mode** (`--dangerously-skip-permissions`): No prompts — use only in sandboxed/CI environments
- You can configure **per-tool permissions** in `settings.json` (e.g., always allow `npm test`)
- Permission allowlists support glob patterns for commands

---

## Phase 3: Configuration and Customization

### 3.1 CLAUDE.md Files (Project Memory)
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

### 3.2 Settings Files
- **Global settings**: `~/.claude/settings.json`
- **Project settings**: `.claude/settings.json` (checked into git, shared with team)
- **Local project settings**: `.claude/settings.local.json` (gitignored, personal overrides)
- Key settings include:
  - `permissions` — tool-level allow/deny rules
  - `env` — environment variables to set
  - `model` — default model to use
  - `hooks` — lifecycle event handlers (see Phase 4)

### 3.3 CLI Flags and Options
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

---

## Phase 4: Intermediate Features

### 4.1 Slash Commands
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

### 4.2 Plan Mode
- Activated by pressing `Shift+Tab` to toggle between **Plan** and **Act** modes
- **Plan mode**: Claude researches and creates a plan but does NOT write code or run commands
- **Act mode** (default): Claude executes — writes files, runs commands, etc.
- Workflow: Start in Plan mode to align on approach → switch to Act mode to implement
- Useful for complex tasks where you want to review the strategy before execution

### 4.3 Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Escape` | Cancel current input / go back |
| `Ctrl+C` | Interrupt Claude's current action |
| `Shift+Tab` | Toggle Plan/Act mode |
| `Up Arrow` | Cycle through prompt history |
| `Tab` | Autocomplete file paths in your prompt |
| `@filename` | Reference a specific file in your prompt |

### 4.4 Git Integration
- Claude Code understands git natively — it can stage, commit, create branches, handle merges
- Ask it to "commit my changes" and it will write a good commit message based on the diff
- It can create pull requests using the `gh` CLI
- It can review PRs, address review comments, and resolve merge conflicts
- Always review Claude's proposed git operations before approving push/force-push

---

## Phase 5: Advanced Features

### 5.1 Hooks
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

### 5.2 MCP Servers (Model Context Protocol)
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

### 5.3 Sub-Agents
- Claude Code can spawn **sub-agents** to handle tasks in parallel
- Sub-agents get their own context window — prevents the main conversation from getting bloated
- Useful for: researching multiple files simultaneously, running independent tasks in parallel
- Types: `general-purpose`, `Explore` (fast codebase search), `Plan` (architecture), and more
- Sub-agents can optionally run in **isolated git worktrees** for safe experimentation

### 5.4 Custom Slash Commands
- Create your own slash commands by adding markdown files to `.claude/commands/`
- File name becomes the command name (e.g., `.claude/commands/review.md` → `/project:review`)
- The file content becomes the prompt template
- Use `$ARGUMENTS` placeholder to accept parameters
- Great for standardizing team workflows (e.g., `/project:deploy`, `/project:test-suite`)

---

## Phase 6: IDE Integration

### 6.1 VS Code Extension
- Install "Claude Code" from the VS Code marketplace
- Opens Claude Code in a panel within VS Code
- Claude can see your open files, selections, and diagnostics
- Use `Cmd+Shift+P` → "Claude Code" to access commands
- Supports inline diff view for proposed changes

### 6.2 JetBrains Plugin
- Available for IntelliJ, WebStorm, PyCharm, and other JetBrains IDEs
- Similar integration — Claude Code runs in a tool window
- Access via the tool window or keyboard shortcuts

---

## Phase 7: Workflows and Patterns

### 7.1 Effective Prompting Patterns
- **Be specific**: "Add input validation to the signup form that checks email format and password strength" > "improve the form"
- **Reference files**: Use `@filename` to point Claude at specific files
- **Iterate**: Start broad, then refine — "explain this codebase" → "now focus on the auth module" → "refactor the token refresh logic"
- **Use constraints**: "Don't change the public API" or "Keep backward compatibility"
- **Show examples**: "Format it like the UserService class" or "Follow the pattern in tests/example.test.js"

### 7.2 Common Workflows
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

### 7.3 Working on Large Codebases
- Start every session with context: "This is a [language] [framework] app that does [X]"
- Use CLAUDE.md to front-load architecture knowledge
- Break large tasks into smaller, sequential prompts
- Use `/compact` when the context window fills up
- Point Claude at specific files rather than asking it to search the whole repo

---

## Phase 8: CI/CD and Automation

### 8.1 Non-Interactive / Headless Mode
- Use `claude -p "prompt"` for scripting and CI pipelines
- Combine with `--output-format json` for machine-readable output
- Use `--dangerously-skip-permissions` in sandboxed CI environments only
- Pipe input: `echo "fix lint errors" | claude -p -`
- Chain with other tools: `claude -p "generate a changelog" --output-format text > CHANGELOG.md`

### 8.2 GitHub Actions Integration
- Use Claude Code in GitHub Actions for automated code review, PR generation, issue triage
- Anthropic provides official GitHub Actions workflows
- Set `ANTHROPIC_API_KEY` as a repository secret

---

## Phase 9: Security and Best Practices

### 9.1 Security Model
- Claude Code runs commands **on your machine** — treat it like a junior developer with terminal access
- Always review commands before approving, especially: `rm`, `git push`, database operations
- Use permission allowlists to pre-approve safe commands, block dangerous ones
- Sensitive files (`.env`, credentials) — Claude can read them; use `.gitignore` and be careful
- In CI: use `--dangerously-skip-permissions` only in sandboxed, disposable environments

### 9.2 Best Practices
- **Start with CLAUDE.md**: 10 minutes of setup saves hours of correction
- **Use Plan mode for big tasks**: Align on approach before Claude starts writing code
- **Review diffs**: Always review what Claude changed before committing
- **Commit frequently**: Make small commits so you can easily revert if needed
- **Use version control**: Never run Claude Code on uncommitted work without a safety net
- **Be specific**: Vague prompts produce vague results
- **Iterate, don't restart**: Refine within a session rather than starting over
- **Use `/compact` proactively**: Don't wait for context window issues

---

## Phase 10: Extending Claude Code

### 10.1 Agent SDK (Claude Agent SDK)
- Build your own agents powered by Claude, using the same tool infrastructure
- Available in Python (`claude_agent_sdk`) and TypeScript (`@anthropic-ai/claude-code`)
- Use Claude Code as a **subprocess** in your own applications
- Build custom workflows: automated code review bots, deployment assistants, monitoring agents

### 10.2 Building MCP Servers
- Write custom MCP servers to give Claude access to your internal tools
- Servers communicate via stdio using JSON-RPC
- Can be built in Python, TypeScript, or any language
- Register in `settings.json` and they appear as new tools in Claude Code

---

## Suggested Learning Order

For the fastest path to productivity, follow this sequence:

```
Week 1: Get Running
  ├── 1. Install Claude Code (Phase 1)
  ├── 2. Run your first few prompts interactively
  ├── 3. Understand the agentic loop (Phase 2)
  └── 4. Learn the permission system

Week 2: Get Effective
  ├── 5. Write your first CLAUDE.md (Phase 3) ← biggest ROI
  ├── 6. Learn slash commands and Plan mode (Phase 4)
  ├── 7. Practice prompting patterns (Phase 7)
  └── 8. Use git integration for real tasks

Week 3: Get Advanced
  ├── 9. Set up hooks (Phase 5)
  ├── 10. Connect an MCP server (Phase 5)
  ├── 11. Try IDE integration (Phase 6)
  └── 12. Explore CI/CD automation (Phase 8)

Week 4: Go Deep
  ├── 13. Build custom slash commands (Phase 5)
  ├── 14. Explore the Agent SDK (Phase 10)
  ├── 15. Build a custom MCP server (Phase 10)
  └── 16. Optimize your workflows and CLAUDE.md
```

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

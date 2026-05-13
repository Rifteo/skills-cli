# auditguard-skills

The CLI for the AuditGuard open agent skills ecosystem — install security and audit skills into 25+ coding agents including Claude Code, Gemini CLI, Cursor, GitHub Copilot, Windsurf, and more.

## Quickstart

```bash
git clone https://github.com/AuditGuard-Community/skills
cd skills
npm link
auditguard-skills add finding-writer
```

## Installation

Clone the repo and link it globally with npm:

```bash
git clone https://github.com/AuditGuard-Community/skills
cd skills
npm link
```

This registers `auditguard-skills` as a global command on your machine. You only need to do this once.

> `npm publish` coming soon — once released, `npx auditguard-skills` will work without cloning.

## Commands

```bash
# Install a skill into all detected agents
auditguard-skills add finding-writer

# Install into a specific agent
auditguard-skills add finding-writer --agent gemini-cli

# Install globally (user home directory)
auditguard-skills add finding-writer --global

# List all available skills from the registry
auditguard-skills available

# List installed skills
auditguard-skills list

# Show detected agents on this machine
auditguard-skills agents

# Remove a skill
auditguard-skills remove finding-writer

# Help
auditguard-skills help
```

## Options

| Flag | Description |
|---|---|
| `-a, --agent <name>` | Target a specific agent (default: all detected agents) |
| `-g, --global` | Install to user home directory instead of project level |

## What are agent skills?

Agent skills are reusable instruction sets that extend your coding agent's capabilities. Each skill lives in a `SKILL.md` file with YAML frontmatter and plain-text instructions the agent follows when the skill is active.

```markdown
---
name: finding-writer
description: Converts raw pentest notes into a structured audit finding
---

When the user provides raw notes or observations, produce a structured
audit finding with title, severity, evidence, impact, and recommendation...
```

Skills are stored in agent-specific directories and picked up automatically on the next session.

## Available skills

| Skill | What it does |
|---|---|
| `finding-writer` | Raw notes → structured audit finding |
| `risk-assessor` | Scores risks using likelihood × impact matrix |
| `control-tester` | Generates test procedures for any security control |
| `remediation-planner` | Finding → step-by-step remediation plan with effort estimates |
| `audit-checklist` | Generates framework-specific audit checklists |
| `scope-analyzer` | Proposes audit scope, boundaries, and key risk areas |
| `executive-brief-writer` | Findings → board-ready one-page executive summary |
| `compliance-gap-analyzer` | Identifies gaps against ISO, SOC2, NIST, PCI-DSS, GDPR, DORA |
| `audit-email-writer` | Drafts professional audit communication emails |
| `ai-act-classifier` | Classifies AI systems under EU AI Act risk tiers |

Browse and contribute skills → [github.com/AuditGuard-Community/agent-skills](https://github.com/AuditGuard-Community/agent-skills)

## Supported agents

54 agents supported. Use `auditguard-skills agents` to see which ones are detected on your machine.

| Agent | Flag |
|---|---|
| Claude Code | `claude-code` |
| Gemini CLI | `gemini-cli` |
| Cursor | `cursor` |
| GitHub Copilot | `github-copilot` |
| Windsurf | `windsurf` |
| Codex | `codex` |
| OpenCode | `opencode` |
| Cline | `cline` |
| Continue | `continue` |
| Roo Code | `roo` |
| Goose | `goose` |
| OpenHands | `openhands` |
| Devin | `devin` |
| Aider Desk | `aider-desk` |
| Augment | `augment` |
| Tabnine CLI | `tabnine-cli` |
| Kilo Code | `kilo` |
| Zencoder | `zencoder` |
| Trae | `trae` |
| Trae CN | `trae-cn` |
| Qwen Code | `qwen-code` |
| Mistral Vibe | `mistral-vibe` |
| Junie | `junie` |
| Amp | `amp` |
| Antigravity | `antigravity` |
| Bob (IBM) | `bob` |
| CodeArts Agent | `codearts-agent` |
| CodeBuddy | `codebuddy` |
| CodeMaker | `codemaker` |
| CodeStudio | `codestudio` |
| Command Code | `command-code` |
| Cortex (Snowflake) | `cortex` |
| Crush | `crush` |
| Deep Agents | `deepagents` |
| Droid (Factory) | `droid` |
| Firebender | `firebender` |
| ForgeCode | `forgecode` |
| Hermes Agent | `hermes-agent` |
| iFlow CLI | `iflow-cli` |
| Kimi CLI | `kimi-cli` |
| Kiro CLI | `kiro-cli` |
| Kode | `kode` |
| MCPJam | `mcpjam` |
| Mux | `mux` |
| Pi | `pi` |
| Qoder | `qoder` |
| Replit | `replit` |
| RovoDev | `rovodev` |
| Warp | `warp` |
| Neovate | `neovate` |
| Pochi | `pochi` |
| Adal | `adal` |
| Universal | `universal` |

## Creating a skill

1. Fork [github.com/AuditGuard-Community/agent-skills](https://github.com/AuditGuard-Community/agent-skills)
2. Create a folder named after your skill
3. Add a `SKILL.md` file

```
my-skill/
  SKILL.md
```

```markdown
---
name: my-skill
description: What this skill does and when to use it
---

# My Skill

Instructions for the agent to follow when this skill is activated.
```

4. Open a pull request — all skill submissions are welcome

## Part of AuditGuard

These skills work standalone with any agent and integrate natively with the [AuditGuard](https://github.com/AuditGuard-Community) pentest management platform.

## License

MIT

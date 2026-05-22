<div align="center">

# AuditGuard Skills CLI

The CLI for the AuditGuard open agent skills ecosystem — install security and audit skills into 54+ coding agents including Claude Code, Gemini CLI, Cursor, GitHub Copilot, Windsurf, and more.

[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![npm](https://img.shields.io/badge/npm-coming%20soon-lightgrey)](https://www.npmjs.com/package/auditguard-skills)
[![Issues](https://img.shields.io/github/issues/AuditGuard-Community/skills-cli)](https://github.com/AuditGuard-Community/skills-cli/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](https://github.com/AuditGuard-Community/skills-cli/pulls)

</div>

## Quickstart

```bash
git clone https://github.com/AuditGuard-Community/skills-cli
cd skills-cli
npm link
auditguard-skills add finding-writer
```

## Installation

Clone the repo and link it globally with npm:

```bash
git clone https://github.com/AuditGuard-Community/skills-cli
cd skills-cli
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

# Check which installed skills have a newer version available
auditguard-skills outdated

# Update all installed skills to their latest version
auditguard-skills update

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

## Keeping skills up to date

When a skill is updated in the registry, your local copy stays at the old version until you update it.

```bash
# See what's outdated
auditguard-skills outdated

#   Skill                        Agent              Installed    Latest
#   ----------------------------------------------------------------------
#   bugbounty-reporter           claude-code        1.0.0        1.1.0
#   hexstrike-forge              claude-code        1.1.0        1.2.0

# Update everything at once
auditguard-skills update

#   Updating "bugbounty-reporter"...
#   ✓  [claude-code] bugbounty-reporter 1.0.0 → 1.1.0
#   Updating "hexstrike-forge"...
#   ✓  [claude-code] hexstrike-forge 1.1.0 → 1.2.0
```

Version is read from the `version` field in each skill's YAML frontmatter. Only skills with a version mismatch are updated.

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

Browse and contribute skills → [github.com/AuditGuard-Community/skills](https://github.com/AuditGuard-Community/skills)

## Supported agents

54 agents supported. Use `auditguard-skills agents` to see which ones are detected on your machine.

| Agent | Flag |
|---|---|
| Claude Code | `claude-code` |
| Gemini CLI | `gemini-cli` |
| Codex | `codex` |
| Cursor | `cursor` |
| GitHub Copilot | `github-copilot` |
| Windsurf | `windsurf` |
| Cline | `cline` |
| Continue | `continue` |
| Aider Desk | `aider-desk` |
| Roo Code | `roo` |
| OpenHands | `openhands` |
| Goose | `goose` |
| Devin | `devin` |
| Augment | `augment` |
| Amp | `amp` |
| Warp | `warp` |
| Replit | `replit` |
| Tabnine CLI | `tabnine-cli` |
| Kilo Code | `kilo` |
| OpenCode | `opencode` |
| Zencoder | `zencoder` |
| Trae | `trae` |
| Trae CN | `trae-cn` |
| Qwen Code | `qwen-code` |
| Mistral Vibe | `mistral-vibe` |
| Junie | `junie` |
| Kimi CLI | `kimi-cli` |
| Kiro CLI | `kiro-cli` |
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
| Kode | `kode` |
| MCPJam | `mcpjam` |
| Mux | `mux` |
| Pi | `pi` |
| Qoder | `qoder` |
| RovoDev | `rovodev` |
| Neovate | `neovate` |
| Pochi | `pochi` |
| Adal | `adal` |
| Universal | `universal` |

## Creating a skill

1. Fork [github.com/AuditGuard-Community/askills](https://github.com/AuditGuard-Community/skills)
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

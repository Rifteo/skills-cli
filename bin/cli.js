#!/usr/bin/env node
import { installSkill, removeSkill, listInstalledSkills } from '../lib/install.js'
import { fetchAvailableSkills } from '../lib/fetch.js'
import { AGENTS, detectAgents, resolveSkillDir } from '../lib/agents.js'

const args = process.argv.slice(2)
const command = args[0]

const flags = {
  global: args.includes('--global') || args.includes('-g'),
  agent: (() => {
    const i = args.findIndex(a => a === '--agent' || a === '-a')
    return i !== -1 ? args[i + 1] : null
  })(),
}

function log(msg) { console.log(msg) }
function err(msg) { console.error(`\n  error  ${msg}\n`); process.exit(1) }
function ok(msg)  { console.log(`  ✓  ${msg}`) }

const HELP = `
  auditguard-skills — AuditGuard agent skills manager

  Usage:
    auditguard-skills add <skill>      Install a skill
    auditguard-skills remove <skill>   Remove an installed skill
    auditguard-skills list             List installed skills
    auditguard-skills available        List all available skills
    auditguard-skills agents           List detected agents on this machine
    auditguard-skills help             Show this help

  Options:
    --agent, -a <name>   Target a specific agent (default: all detected agents)
    --global, -g         Install/remove globally instead of project-level

  Examples:
    auditguard-skills add finding-writer
    auditguard-skills add finding-writer --agent gemini-cli
    auditguard-skills add risk-assessor --global
    auditguard-skills remove finding-writer
    auditguard-skills list
    auditguard-skills agents
`

// Resolve target agents — specific one or all detected
function resolveTargetAgents() {
  if (flags.agent) {
    if (!AGENTS[flags.agent]) err(`Unknown agent "${flags.agent}". Run "AuditGuard-Community-skills agents" to see detected agents.`)
    return [flags.agent]
  }
  const detected = detectAgents()
  if (detected.length === 0) {
    err('No agents detected on this machine.\n  Use --agent <name> to specify one manually.\n  Run "AuditGuard-Community-skills agents" to see all supported agents.')
  }
  return detected
}

switch (command) {
  case 'add': {
    const skillName = args[1]
    if (!skillName) err('Please provide a skill name.\n  Example: AuditGuard-Community-skills add finding-writer')

    const targets = resolveTargetAgents()
    log(`\n  Installing "${skillName}" into ${targets.length} agent(s)...\n`)

    installSkill(skillName, targets, flags.global)
      .then(results => {
        results.forEach(({ agent, skillFile }) => ok(`[${agent}] → ${skillFile}`))
        log('')
      })
      .catch(e => err(e.message))
    break
  }

  case 'remove': {
    const skillName = args[1]
    if (!skillName) err('Please provide a skill name.\n  Example: AuditGuard-Community-skills remove finding-writer')

    const targets = resolveTargetAgents()
    log(`\n  Removing "${skillName}" from ${targets.length} agent(s)...\n`)

    Promise.allSettled(
      targets.map(agent =>
        removeSkill(skillName, agent, flags.global)
          .then(({ skillFile }) => ok(`[${agent}] removed → ${skillFile}`))
          .catch(() => log(`  -  [${agent}] not installed, skipping`))
      )
    ).then(() => log(''))
    break
  }

  case 'list': {
    const targets = resolveTargetAgents()
    log('')
    targets.forEach(agent => {
      const installed = listInstalledSkills(agent, flags.global)
      if (installed.length === 0) {
        log(`  [${agent}] no skills installed`)
      } else {
        log(`  [${agent}]`)
        installed.forEach(s => log(`    • ${s}`))
      }
    })
    log('')
    break
  }

  case 'agents': {
    const detected = detectAgents()
    log(`\n  Detected agents on this machine:\n`)
    if (detected.length === 0) {
      log('  None detected. Use --agent <name> to target one manually.')
    } else {
      detected.forEach(a => log(`    • ${a}`))
    }
    log(`\n  All supported agents: ${Object.keys(AGENTS).join(', ')}\n`)
    break
  }

  case 'available': {
    log('\n  Fetching available skills...')
    fetchAvailableSkills()
      .then(skills => {
        log(`\n  Available skills:\n`)
        skills.forEach(s => log(`    • ${s}`))
        log(`\n  Install with: AuditGuard-Community-skills add <skill-name>\n`)
      })
      .catch(e => err(e.message))
    break
  }

  case 'help':
  case '--help':
  case '-h':
  case undefined:
    log(HELP)
    break

  default:
    err(`Unknown command "${command}". Run "AuditGuard-Community-skills help" for usage.`)
}

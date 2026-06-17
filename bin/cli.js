#!/usr/bin/env node
import readline from 'readline'
import { installSkill, removeSkill, listInstalledSkills, getInstalledVersion } from '../lib/install.js'
import { fetchAvailableSkills, fetchSkillVersion } from '../lib/fetch.js'
import { AGENTS, detectAgents, resolveSkillDir } from '../lib/agents.js'
import { readPrefs, writePrefs } from '../lib/prefs.js'
import { installCommands } from '../lib/commands.js'

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => rl.question(question, answer => { rl.close(); resolve(answer.trim()) }))
}

async function promptCommands() {
  const prefs = readPrefs()
  if (prefs.commands === 'never') return
  if (!process.stdin.isTTY) return

  const answer = await ask('\n  Install Rifteo slash commands for Claude Code? [Y/n/never] ')
  const normalized = answer.toLowerCase()

  if (normalized === '' || normalized === 'y') {
    try {
      const installed = await installCommands()
      installed.forEach(f => ok(`[commands] /rifteo:${f.replace('.md', '')}`))
    } catch (e) {
      log(`  ! Could not install commands: ${e.message}`)
    }
  } else if (normalized === 'never') {
    writePrefs({ ...prefs, commands: 'never' })
    log('  Commands will not be suggested again.')
  }
  // 'n' = skip silently, ask again next install
}

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
  rifteo-skills — Rifteo agent skills manager

  Usage:
    rifteo-skills add <skill>      Install a skill
    rifteo-skills remove <skill>   Remove an installed skill
    rifteo-skills update           Update all installed skills to latest version
    rifteo-skills outdated         Show which installed skills have a newer version
    rifteo-skills list             List installed skills
    rifteo-skills available        List all available skills
    rifteo-skills agents           List detected agents on this machine
    rifteo-skills help             Show this help

  Options:
    --agent, -a <name>   Target a specific agent (default: all detected agents)
    --global, -g         Install/remove globally instead of project-level

  Examples:
    rifteo-skills add finding-writer
    rifteo-skills add finding-writer --agent gemini-cli
    rifteo-skills add risk-assessor --global
    rifteo-skills remove finding-writer
    rifteo-skills list
    rifteo-skills agents
`

// Resolve target agents — specific one or all detected
function resolveTargetAgents() {
  if (flags.agent) {
    if (!AGENTS[flags.agent]) err(`Unknown agent "${flags.agent}". Run "rifteo-skills agents" to see detected agents.`)
    return [flags.agent]
  }
  const detected = detectAgents()
  if (detected.length === 0) {
    err('No agents detected on this machine.\n  Use --agent <name> to specify one manually.\n  Run "rifteo-skills agents" to see all supported agents.')
  }
  return detected
}

switch (command) {
  case 'add': {
    const skillName = args[1]
    if (!skillName) err('Please provide a skill name.\n  Example: rifteo-skills add finding-writer')

    const targets = resolveTargetAgents()
    log(`\n  Installing "${skillName}" into ${targets.length} agent(s)...\n`)

    installSkill(skillName, targets, flags.global)
      .then(async results => {
        results.forEach(({ agent, skillFile }) => ok(`[${agent}] → ${skillFile}`))
        log('')
        if (targets.includes('claude-code')) await promptCommands()
      })
      .catch(e => err(e.message))
    break
  }

  case 'remove': {
    const skillName = args[1]
    if (!skillName) err('Please provide a skill name.\n  Example: rifteo-skills remove finding-writer')

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
        log(`\n  Install with: rifteo-skills add <skill-name>\n`)
      })
      .catch(e => err(e.message))
    break
  }

  case 'outdated': {
    const targets = resolveTargetAgents()
    log('\n  Checking for updates...\n')

    const rows = []
    for (const agent of targets) {
      const skills = listInstalledSkills(agent, flags.global)
      for (const skillName of skills) {
        const local = getInstalledVersion(skillName, agent, flags.global)
        const remote = await fetchSkillVersion(skillName).catch(() => null)
        if (remote && remote !== local) {
          rows.push({ agent, skillName, local: local ?? 'unknown', remote })
        }
      }
    }

    if (rows.length === 0) {
      log('  All skills are up to date.\n')
    } else {
      log(`  ${'Skill'.padEnd(28)} ${'Agent'.padEnd(18)} ${'Installed'.padEnd(12)} Latest`)
      log(`  ${''.padEnd(70, '-')}`)
      rows.forEach(({ agent, skillName, local, remote }) =>
        log(`  ${skillName.padEnd(28)} ${agent.padEnd(18)} ${local.padEnd(12)} ${remote}`)
      )
      log(`\n  Run "rifteo-skills update" to update all.\n`)
    }
    break
  }

  case 'update': {
    const targets = resolveTargetAgents()
    log('\n  Checking for updates...\n')

    const toUpdate = []
    for (const agent of targets) {
      const skills = listInstalledSkills(agent, flags.global)
      for (const skillName of skills) {
        const local = getInstalledVersion(skillName, agent, flags.global)
        const remote = await fetchSkillVersion(skillName).catch(() => null)
        if (remote && remote !== local) {
          toUpdate.push({ agent, skillName, local: local ?? 'unknown', remote })
        }
      }
    }

    if (toUpdate.length === 0) {
      log('  All skills are up to date.\n')
      break
    }

    const uniqueSkills = [...new Set(toUpdate.map(r => r.skillName))]
    for (const skillName of uniqueSkills) {
      const agents = toUpdate.filter(r => r.skillName === skillName).map(r => r.agent)
      log(`  Updating "${skillName}"...`)
      try {
        const results = await installSkill(skillName, agents, flags.global)
        results.forEach(({ agent }) => {
          const { local, remote } = toUpdate.find(r => r.skillName === skillName && r.agent === agent)
          ok(`[${agent}] ${skillName} ${local} → ${remote}`)
        })
      } catch (e) {
        log(`  ! Failed to update "${skillName}": ${e.message}`)
      }
    }
    log('')
    break
  }

  case 'help':
  case '--help':
  case '-h':
  case undefined:
    log(HELP)
    break

  default:
    err(`Unknown command "${command}". Run "rifteo-skills help" for usage.`)
}

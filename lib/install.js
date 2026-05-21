import fs from 'fs'
import path from 'path'
import { fetchSkillFiles } from './fetch.js'
import { resolveSkillDir } from './agents.js'

export async function installSkill(skillName, agents, isGlobal = false) {
  const files = await fetchSkillFiles(skillName)

  return agents.map(agent => {
    const skillDir = resolveSkillDir(agent, isGlobal)
    const skillFolder = path.join(skillDir, skillName)

    for (const { relativePath, content } of files) {
      const filePath = path.join(skillFolder, relativePath)
      fs.mkdirSync(path.dirname(filePath), { recursive: true })
      fs.writeFileSync(filePath, content, 'utf8')
    }

    return { agent, skillFile: skillFolder }
  })
}

export async function removeSkill(skillName, agent, isGlobal = false) {
  const skillDir = resolveSkillDir(agent, isGlobal)
  const skillFolder = path.join(skillDir, skillName)

  if (!fs.existsSync(skillFolder)) {
    throw new Error(`Skill "${skillName}" is not installed for ${agent}.`)
  }

  fs.rmSync(skillFolder, { recursive: true, force: true })
  return { skillFile: skillFolder }
}

export function getInstalledVersion(skillName, agent, isGlobal = false) {
  const skillDir = resolveSkillDir(agent, isGlobal)
  const skillMd = path.join(skillDir, skillName, 'SKILL.md')
  if (!fs.existsSync(skillMd)) return null
  const content = fs.readFileSync(skillMd, 'utf8')
  const match = content.match(/version:\s*["']?([^"'\n]+)["']?/)
  return match ? match[1].trim() : null
}

export function listInstalledSkills(agent, isGlobal = false) {
  const skillDir = resolveSkillDir(agent, isGlobal)
  if (!fs.existsSync(skillDir)) return []
  return fs.readdirSync(skillDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
}

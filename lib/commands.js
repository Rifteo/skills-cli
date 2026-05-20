import fs from 'fs'
import path from 'path'
import os from 'os'
import { fetchSkillFiles } from './fetch.js'

const COMMANDS_DIR = path.join(os.homedir(), '.claude', 'commands', 'auditguard')

export async function installCommands() {
  const files = (await fetchSkillFiles('_commands')).filter(f => f.relativePath !== 'README.md')
  fs.mkdirSync(COMMANDS_DIR, { recursive: true })
  for (const { relativePath, content } of files) {
    const filePath = path.join(COMMANDS_DIR, relativePath)
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, content, 'utf8')
  }
  return files.map(f => f.relativePath)
}

import fs from 'fs'
import path from 'path'
import os from 'os'

const PREFS_FILE = path.join(os.homedir(), '.auditguard', 'prefs.json')

export function readPrefs() {
  try {
    return JSON.parse(fs.readFileSync(PREFS_FILE, 'utf8'))
  } catch {
    return {}
  }
}

export function writePrefs(prefs) {
  fs.mkdirSync(path.dirname(PREFS_FILE), { recursive: true })
  fs.writeFileSync(PREFS_FILE, JSON.stringify(prefs, null, 2), 'utf8')
}

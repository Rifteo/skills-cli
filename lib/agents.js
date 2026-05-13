import path from 'path'
import os from 'os'
import fs from 'fs'

const HOME = os.homedir()
const XDG = process.env.XDG_CONFIG_HOME || path.join(HOME, '.config')

export const AGENTS = {
  'claude-code':      { project: '.claude/skills',          global: path.join(HOME, '.claude', 'skills') },
  'gemini-cli':       { project: '.agents/skills',          global: path.join(HOME, '.gemini', 'skills') },
  'cursor':           { project: '.agents/skills',          global: path.join(HOME, '.cursor', 'skills') },
  'codex':            { project: '.agents/skills',          global: path.join(XDG, 'codex', 'skills') },
  'opencode':         { project: '.agents/skills',          global: path.join(XDG, 'opencode', 'skills') },
  'github-copilot':   { project: '.agents/skills',          global: path.join(HOME, '.copilot', 'skills') },
  'windsurf':         { project: '.windsurf/skills',        global: path.join(HOME, '.codeium', 'windsurf', 'skills') },
  'cline':            { project: '.agents/skills',          global: path.join(HOME, '.agents', 'skills') },
  'continue':         { project: '.continue/skills',        global: path.join(HOME, '.continue', 'skills') },
  'roo':              { project: '.roo/skills',             global: path.join(HOME, '.roo', 'skills') },
  'goose':            { project: '.goose/skills',           global: path.join(XDG, 'goose', 'skills') },
  'openhands':        { project: '.openhands/skills',       global: path.join(HOME, '.openhands', 'skills') },
  'devin':            { project: '.devin/skills',           global: path.join(XDG, 'devin', 'skills') },
  'aider-desk':       { project: '.aider-desk/skills',      global: path.join(HOME, '.aider-desk', 'skills') },
  'augment':          { project: '.augment/skills',         global: path.join(HOME, '.augment', 'skills') },
  'tabnine-cli':      { project: '.tabnine/agent/skills',   global: path.join(HOME, '.tabnine', 'agent', 'skills') },
  'kilo':             { project: '.kilocode/skills',        global: path.join(HOME, '.kilocode', 'skills') },
  'zencoder':         { project: '.zencoder/skills',        global: path.join(HOME, '.zencoder', 'skills') },
  'trae':             { project: '.trae/skills',            global: path.join(HOME, '.trae', 'skills') },
  'trae-cn':          { project: '.trae/skills',            global: path.join(HOME, '.trae-cn', 'skills') },
  'qwen-code':        { project: '.qwen/skills',            global: path.join(HOME, '.qwen', 'skills') },
  'mistral-vibe':     { project: '.vibe/skills',            global: path.join(HOME, '.vibe', 'skills') },
  'junie':            { project: '.junie/skills',           global: path.join(HOME, '.junie', 'skills') },
  'amp':              { project: '.agents/skills',          global: path.join(XDG, 'agents', 'skills') },
  'antigravity':      { project: '.agents/skills',          global: path.join(HOME, '.gemini', 'antigravity', 'skills') },
  'bob':              { project: '.bob/skills',             global: path.join(HOME, '.bob', 'skills') },
  'codearts-agent':   { project: '.codeartsdoer/skills',    global: path.join(HOME, '.codeartsdoer', 'skills') },
  'codebuddy':        { project: '.codebuddy/skills',       global: path.join(HOME, '.codebuddy', 'skills') },
  'codemaker':        { project: '.codemaker/skills',       global: path.join(HOME, '.codemaker', 'skills') },
  'codestudio':       { project: '.codestudio/skills',      global: path.join(HOME, '.codestudio', 'skills') },
  'command-code':     { project: '.commandcode/skills',     global: path.join(HOME, '.commandcode', 'skills') },
  'cortex':           { project: '.cortex/skills',          global: path.join(HOME, '.snowflake', 'cortex', 'skills') },
  'crush':            { project: '.crush/skills',           global: path.join(XDG, 'crush', 'skills') },
  'deepagents':       { project: '.agents/skills',          global: path.join(HOME, '.deepagents', 'agent', 'skills') },
  'droid':            { project: '.factory/skills',         global: path.join(HOME, '.factory', 'skills') },
  'firebender':       { project: '.agents/skills',          global: path.join(HOME, '.firebender', 'skills') },
  'forgecode':        { project: '.forge/skills',           global: path.join(HOME, '.forge', 'skills') },
  'hermes-agent':     { project: '.hermes/skills',          global: path.join(HOME, '.hermes', 'skills') },
  'iflow-cli':        { project: '.iflow/skills',           global: path.join(HOME, '.iflow', 'skills') },
  'kimi-cli':         { project: '.agents/skills',          global: path.join(XDG, 'agents', 'skills') },
  'kiro-cli':         { project: '.kiro/skills',            global: path.join(HOME, '.kiro', 'skills') },
  'kode':             { project: '.kode/skills',            global: path.join(HOME, '.kode', 'skills') },
  'mcpjam':           { project: '.mcpjam/skills',          global: path.join(HOME, '.mcpjam', 'skills') },
  'mux':              { project: '.mux/skills',             global: path.join(HOME, '.mux', 'skills') },
  'pi':               { project: '.pi/skills',              global: path.join(HOME, '.pi', 'agent', 'skills') },
  'qoder':            { project: '.qoder/skills',           global: path.join(HOME, '.qoder', 'skills') },
  'replit':           { project: '.agents/skills',          global: path.join(XDG, 'agents', 'skills') },
  'rovodev':          { project: '.rovodev/skills',         global: path.join(HOME, '.rovodev', 'skills') },
  'warp':             { project: '.agents/skills',          global: path.join(HOME, '.agents', 'skills') },
  'neovate':          { project: '.neovate/skills',         global: path.join(HOME, '.neovate', 'skills') },
  'pochi':            { project: '.pochi/skills',           global: path.join(HOME, '.pochi', 'skills') },
  'adal':             { project: '.adal/skills',            global: path.join(HOME, '.adal', 'skills') },
  'universal':        { project: '.agents/skills',          global: path.join(XDG, 'agents', 'skills') },
}

// Auto-detect which agents are installed on this machine
export function detectAgents() {
  return Object.entries(AGENTS)
    .filter(([, entry]) => fs.existsSync(path.dirname(entry.global)))
    .map(([name]) => name)
}

export function resolveSkillDir(agent, isGlobal = false) {
  const entry = AGENTS[agent]
  if (!entry) {
    throw new Error(`Unknown agent "${agent}".\n  Available: ${Object.keys(AGENTS).join(', ')}`)
  }
  return isGlobal ? entry.global : path.join(process.cwd(), entry.project)
}

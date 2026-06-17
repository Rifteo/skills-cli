import https from 'https'

const OWNER = 'rifteo'
const REPO = 'skills'
const API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}/contents`

function get(url) {
  return new Promise((resolve, reject) => {
    const options = { headers: { 'User-Agent': 'rifteo-skills-cli' } }
    https.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(get(res.headers.location))
      }
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve({ status: res.statusCode, body: data }))
    }).on('error', reject)
  })
}

async function fetchDir(listing) {
  const items = JSON.parse(listing.body)
  const files = []

  for (const item of items) {
    if (item.type === 'file') {
      if (item.name === 'BENCHMARK.md') continue
      const res = await get(item.url)
      const json = JSON.parse(res.body)
      files.push({
        relativePath: item.name,
        content: Buffer.from(json.content, 'base64').toString('utf8')
      })
    } else if (item.type === 'dir') {
      if (item.name.startsWith('_')) continue
      const res = await get(item.url)
      const subFiles = await fetchDir(res)
      subFiles.forEach(f => files.push({
        relativePath: `${item.name}/${f.relativePath}`,
        content: f.content
      }))
    }
  }

  return files
}

export async function fetchSkillFiles(skillName) {
  const url = `${API_BASE}/${skillName}`
  const res = await get(url)

  if (res.status === 404) {
    throw new Error(`Skill "${skillName}" not found. Run "rifteo-skills available" to see available skills.`)
  }
  if (res.status !== 200) {
    throw new Error(`Failed to fetch skill "${skillName}" (HTTP ${res.status})`)
  }

  return fetchDir(res)
}

function parseVersion(content) {
  const match = content.match(/version:\s*["']?([^"'\n]+)["']?/)
  return match ? match[1].trim() : null
}

export async function fetchSkillVersion(skillName) {
  const url = `${API_BASE}/${skillName}/SKILL.md`
  const res = await get(url)
  if (res.status === 404) return null
  if (res.status !== 200) throw new Error(`Failed to fetch version for "${skillName}" (HTTP ${res.status})`)
  const json = JSON.parse(res.body)
  const content = Buffer.from(json.content, 'base64').toString('utf8')
  return parseVersion(content)
}

export async function fetchAvailableSkills() {
  const url = `${API_BASE}`
  const res = await get(url)

  if (res.status !== 200) {
    throw new Error(`Failed to fetch skills registry (HTTP ${res.status})`)
  }

  const items = JSON.parse(res.body)
  return items
    .filter(item => item.type === 'dir')
    .filter(item => !item.name.startsWith('_'))
    .map(item => item.name)
}

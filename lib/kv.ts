import { kv } from '@vercel/kv'

export interface Agent {
  name: string
  assistantId: string
  createdAt: string
}

const RESERVED_NAMES = ['admin', 'api', 'auth', 'login', 'logout', '_next', 'public']

export function validateAgentName(name: string): string | null {
  if (!name) return 'Agent name is required'
  if (!/^[a-z0-9-]+$/.test(name)) return 'Agent name must be lowercase letters, numbers, and hyphens only'
  if (name.length < 2) return 'Agent name must be at least 2 characters'
  if (name.length > 50) return 'Agent name must be less than 50 characters'
  if (RESERVED_NAMES.includes(name)) return 'This agent name is reserved'
  if (name.startsWith('-') || name.endsWith('-')) return 'Agent name cannot start or end with a hyphen'
  return null
}

export async function createAgent(name: string, assistantId: string): Promise<Agent> {
  const validationError = validateAgentName(name)
  if (validationError) throw new Error(validationError)
  if (!assistantId.trim()) throw new Error('Assistant ID is required')

  const existing = await kv.get(`agent:${name}`)
  if (existing) throw new Error('Agent with this name already exists')

  const agent: Agent = {
    name,
    assistantId: assistantId.trim(),
    createdAt: new Date().toISOString()
  }

  await kv.set(`agent:${name}`, agent)
  return agent
}

export async function getAgent(name: string): Promise<Agent | null> {
  try {
    const agent = await kv.get<Agent>(`agent:${name}`)
    return agent
  } catch (error) {
    console.error('KV error in getAgent:', error)
    return null
  }
}

export async function getAllAgents(): Promise<Agent[]> {
  try {
    const keys = await kv.keys('agent:*')
    if (keys.length === 0) return []

    const agents = await kv.mget<Agent[]>(...keys)
    return agents.filter(Boolean).sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
  } catch (error) {
    console.error('KV error in getAllAgents:', error)
    return []
  }
}

export async function updateAgent(name: string, assistantId: string): Promise<Agent> {
  if (!assistantId.trim()) throw new Error('Assistant ID is required')

  const existing = await kv.get<Agent>(`agent:${name}`)
  if (!existing) throw new Error('Agent not found')

  const updatedAgent: Agent = {
    ...existing,
    assistantId: assistantId.trim()
  }

  await kv.set(`agent:${name}`, updatedAgent)
  return updatedAgent
}

export async function deleteAgent(name: string): Promise<boolean> {
  const existing = await kv.get(`agent:${name}`)
  if (!existing) return false

  await kv.del(`agent:${name}`)
  return true
}
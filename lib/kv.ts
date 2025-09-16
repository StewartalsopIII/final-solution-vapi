import { createClient } from 'redis'

export interface Agent {
  name: string
  assistantId: string
  createdAt: string
}

// Create Redis client singleton
let redis: ReturnType<typeof createClient> | null = null

async function getRedisClient() {
  if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL environment variable is not set')
  }

  if (!redis) {
    redis = createClient({
      url: process.env.REDIS_URL
    })

    redis.on('error', (err) => console.error('Redis Client Error', err))
    await redis.connect()
  }

  return redis
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

  try {
    const client = await getRedisClient()
    const existing = await client.get(`agent:${name}`)
    if (existing) throw new Error('Agent with this name already exists')

    const agent: Agent = {
      name,
      assistantId: assistantId.trim(),
      createdAt: new Date().toISOString()
    }

    await client.set(`agent:${name}`, JSON.stringify(agent))
    return agent
  } catch (error) {
    console.error('Error creating agent:', error)
    throw error
  }
}

export async function getAgent(name: string): Promise<Agent | null> {
  try {
    const client = await getRedisClient()
    const result = await client.get(`agent:${name}`)
    return result ? JSON.parse(result) : null
  } catch (error) {
    console.error('Redis error in getAgent:', error)
    return null
  }
}

export async function getAllAgents(): Promise<Agent[]> {
  try {
    const client = await getRedisClient()
    const keys = await client.keys('agent:*')
    if (keys.length === 0) return []

    const results = await client.mGet(keys)
    const agents = results
      .filter(Boolean)
      .map(result => JSON.parse(result as string) as Agent)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

    return agents
  } catch (error) {
    console.error('Redis error in getAllAgents:', error)
    return []
  }
}

export async function updateAgent(name: string, assistantId: string): Promise<Agent> {
  if (!assistantId.trim()) throw new Error('Assistant ID is required')

  try {
    const client = await getRedisClient()
    const existingStr = await client.get(`agent:${name}`)
    if (!existingStr) throw new Error('Agent not found')

    const existing = JSON.parse(existingStr) as Agent
    const updatedAgent: Agent = {
      ...existing,
      assistantId: assistantId.trim()
    }

    await client.set(`agent:${name}`, JSON.stringify(updatedAgent))
    return updatedAgent
  } catch (error) {
    console.error('Error updating agent:', error)
    throw error
  }
}

export async function deleteAgent(name: string): Promise<boolean> {
  try {
    const client = await getRedisClient()
    const existing = await client.get(`agent:${name}`)
    if (!existing) return false

    await client.del(`agent:${name}`)
    return true
  } catch (error) {
    console.error('Error deleting agent:', error)
    return false
  }
}
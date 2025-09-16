import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { createAgent, getAllAgents, updateAgent, deleteAgent } from '@/lib/kv'

export async function GET() {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const agents = await getAllAgents()
    return NextResponse.json({ agents })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, assistantId } = await req.json()

    if (!name || !assistantId) {
      return NextResponse.json({ error: 'Name and assistant ID are required' }, { status: 400 })
    }

    const agent = await createAgent(name.toLowerCase().trim(), assistantId.trim())
    return NextResponse.json({ agent }, { status: 201 })
  } catch (error) {
    console.error('Error creating agent:', error)
    const message = error instanceof Error ? error.message : 'Failed to create agent'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, assistantId } = await req.json()

    if (!name || !assistantId) {
      return NextResponse.json({ error: 'Name and assistant ID are required' }, { status: 400 })
    }

    const agent = await updateAgent(name, assistantId.trim())
    return NextResponse.json({ agent })
  } catch (error) {
    console.error('Error updating agent:', error)
    const message = error instanceof Error ? error.message : 'Failed to update agent'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name } = await req.json()

    if (!name) {
      return NextResponse.json({ error: 'Agent name is required' }, { status: 400 })
    }

    const deleted = await deleteAgent(name)
    if (!deleted) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting agent:', error)
    return NextResponse.json({ error: 'Failed to delete agent' }, { status: 500 })
  }
}
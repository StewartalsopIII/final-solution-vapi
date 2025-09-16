'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Agent } from '@/lib/kv'

export default function AdminDashboard() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [formData, setFormData] = useState({ name: '', assistantId: '' })
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const router = useRouter()

  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch('/api/agents')
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      if (!res.ok) throw new Error('Failed to fetch agents')

      const data = await res.json()
      setAgents(data.agents || [])
    } catch (err) {
      console.error('Error fetching agents:', err)
      setError('Failed to load agents')
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' })
      })
      router.push('/admin/login')
      router.refresh()
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const resetForm = () => {
    setFormData({ name: '', assistantId: '' })
    setFormError('')
    setShowAddForm(false)
    setEditingAgent(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError('')

    try {
      const isEdit = !!editingAgent
      const res = await fetch('/api/agents', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.toLowerCase().trim(),
          assistantId: formData.assistantId.trim()
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Operation failed')
      }

      resetForm()
      fetchAgents()
    } catch (err) {
      console.error('Form submission error:', err)
      setFormError(err instanceof Error ? err.message : 'Operation failed')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent)
    setFormData({ name: agent.name, assistantId: agent.assistantId })
    setShowAddForm(true)
    setFormError('')
  }

  const handleDelete = async (name: string) => {
    if (!confirm(`Are you sure you want to delete agent "${name}"?`)) return

    try {
      const res = await fetch('/api/agents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Delete failed')
      }

      fetchAgents()
    } catch (err) {
      console.error('Delete error:', err)
      alert('Failed to delete agent: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  useEffect(() => {
    fetchAgents()
  }, [fetchAgents])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">VAPI Agent Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {showAddForm ? 'Cancel' : 'Add New Agent'}
          </button>
        </div>

        {showAddForm && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border">
            <h2 className="text-xl font-semibold text-black mb-4">
              {editingAgent ? 'Edit Agent' : 'Add New Agent'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                  Agent Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., spanish, support, sales"
                  required
                  disabled={!!editingAgent}
                />
                <p className="mt-1 text-sm text-gray-600">
                  Lowercase letters, numbers, and hyphens only
                </p>
              </div>

              <div>
                <label htmlFor="assistantId" className="block text-sm font-medium text-black mb-2">
                  VAPI Assistant ID
                </label>
                <input
                  id="assistantId"
                  type="text"
                  value={formData.assistantId}
                  onChange={(e) => setFormData({ ...formData, assistantId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your VAPI assistant ID"
                  required
                />
              </div>

              {formError && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                  {formError}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {formLoading ? 'Saving...' : (editingAgent ? 'Update Agent' : 'Create Agent')}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-black">Agents ({agents.length})</h2>
          </div>

          {agents.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500">No agents created yet. Add your first agent above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Assistant ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Agent URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {agents.map((agent) => (
                    <tr key={agent.name}>
                      <td className="px-6 py-4 text-sm font-medium text-black">
                        {agent.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                        {agent.assistantId}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <a
                          href={`/agent/${agent.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-mono"
                        >
                          /agent/{agent.name} ↗
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(agent.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(agent)}
                            className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(agent.name)}
                            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
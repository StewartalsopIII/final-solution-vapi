import { getAllAgents } from '@/lib/kv'

export default async function Home() {
  const agents = await getAllAgents()

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">
            VAPI Multi-Agent Voice Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create and manage voice AI agents with unique URLs for easy sharing
          </p>

          <div className="flex justify-center gap-4">
            <a
              href="/admin"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Admin Panel
            </a>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-black mb-6">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg border">
              <div className="text-2xl mb-3">🔧</div>
              <h3 className="text-lg font-semibold text-black mb-2">1. Create Agents</h3>
              <p className="text-gray-600">
                Use the admin panel to add VAPI agents with custom names and assistant IDs
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border">
              <div className="text-2xl mb-3">🔗</div>
              <h3 className="text-lg font-semibold text-black mb-2">2. Get Unique URLs</h3>
              <p className="text-gray-600">
                Each agent gets its own URL like /agent/spanish or /agent/support
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border">
              <div className="text-2xl mb-3">🎤</div>
              <h3 className="text-lg font-semibold text-black mb-2">3. Start Conversations</h3>
              <p className="text-gray-600">
                Visitors can start voice calls instantly with just one click
              </p>
            </div>
          </div>
        </div>

        {agents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-black mb-6">Available Agents</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((agent) => (
                <div key={agent.name} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300">
                  <h3 className="text-lg font-semibold text-black mb-2 capitalize">
                    {agent.name.replace(/-/g, ' ')}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 font-mono">
                    /agent/{agent.name}
                  </p>
                  <a
                    href={`/agent/${agent.name}`}
                    className="inline-flex px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
                  >
                    Start Voice Call →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center bg-gray-50 rounded-lg p-8">
          <h2 className="text-xl font-semibold text-black mb-4">Features</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <span className="text-green-600">✓</span>
              <span className="text-gray-700">Redis-based storage with Vercel KV</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600">✓</span>
              <span className="text-gray-700">Password-protected admin panel</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600">✓</span>
              <span className="text-gray-700">Real-time voice conversations</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600">✓</span>
              <span className="text-gray-700">Unique URLs for each agent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

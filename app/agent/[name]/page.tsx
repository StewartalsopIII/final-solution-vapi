import { notFound, redirect } from 'next/navigation'
import { getAgent } from '@/lib/kv'
import VapiWidget from '@/components/VapiWidget'
import Link from 'next/link'

interface AgentPageProps {
  params: Promise<{ name: string }>
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { name } = await params

  if (!name || typeof name !== 'string') {
    redirect('/')
  }

  const agent = await getAgent(name)

  if (!agent) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-black mb-2 capitalize">
            {agent.name.replace(/-/g, ' ')}
          </h1>
          <p className="text-gray-600">Voice Agent</p>
        </div>

        <div className="py-8">
          <VapiWidget assistantId={agent.assistantId} agentName={agent.name} />
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: AgentPageProps) {
  const { name } = await params
  const agent = await getAgent(name)

  if (!agent) {
    return {
      title: 'Agent Not Found'
    }
  }

  const displayName = agent.name.replace(/-/g, ' ')
  const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1)

  return {
    title: `${capitalizedName} Voice Agent`,
    description: `Start a voice conversation with the ${capitalizedName} agent`
  }
}
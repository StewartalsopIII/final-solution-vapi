'use client'

import { useState, useEffect } from 'react'

interface VapiWidgetProps {
  assistantId: string
  agentName: string
}

export default function VapiWidget({ assistantId, agentName }: VapiWidgetProps) {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [vapi, setVapi] = useState<unknown>(null)

  useEffect(() => {
    const initVapi = async () => {
      try {
        const { default: Vapi } = await import('@vapi-ai/web')
        const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!)

        vapiInstance.on('call-start', () => {
          setIsCallActive(true)
          setIsLoading(false)
          setError('')
        })

        vapiInstance.on('call-end', () => {
          setIsCallActive(false)
          setIsLoading(false)
        })

        vapiInstance.on('error', (error: unknown) => {
          console.error('VAPI error:', error)
          setError('Call failed. Please try again.')
          setIsCallActive(false)
          setIsLoading(false)
        })

        setVapi(vapiInstance)
      } catch (err) {
        console.error('Failed to initialize VAPI:', err)
        setError('Failed to initialize voice system')
      }
    }

    if (process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY) {
      initVapi()
    } else {
      setError('VAPI not configured')
    }
  }, [])

  const startCall = async () => {
    if (!vapi || !assistantId) return

    setIsLoading(true)
    setError('')

    try {
      await (vapi as { start: (config: { assistantId: string; metadata: { agentName: string; timestamp: string } }) => Promise<void> }).start({
        assistantId,
        metadata: {
          agentName,
          timestamp: new Date().toISOString()
        }
      })
    } catch (err) {
      console.error('Failed to start call:', err)
      setError('Failed to start call. Please check your connection.')
      setIsLoading(false)
    }
  }

  const stopCall = async () => {
    if (!vapi) return

    setIsLoading(true)
    try {
      (vapi as { stop: () => void }).stop()
    } catch (err) {
      console.error('Failed to stop call:', err)
      setError('Failed to stop call')
    }
    setIsLoading(false)
  }

  const handleToggleCall = () => {
    if (isCallActive) {
      stopCall()
    } else {
      startCall()
    }
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
        >
          Refresh Page
        </button>
      </div>
    )
  }

  if (!vapi) {
    return (
      <div className="text-center">
        <div className="px-6 py-3 bg-gray-100 text-black rounded-lg">
          Loading voice system...
        </div>
      </div>
    )
  }

  return (
    <div className="text-center">
      <button
        onClick={handleToggleCall}
        disabled={isLoading}
        className={`px-8 py-4 rounded-lg font-semibold text-lg transition-colors ${
          isCallActive
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-green-600 hover:bg-green-700 text-white'
        } disabled:bg-gray-400 disabled:cursor-not-allowed`}
      >
        {isLoading
          ? 'Please wait...'
          : isCallActive
            ? 'Stop Call'
            : 'Start Call'
        }
      </button>

      {isCallActive && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700 font-medium">Call is active</p>
          <p className="text-sm text-green-600">Speak naturally to interact with the agent</p>
        </div>
      )}
    </div>
  )
}
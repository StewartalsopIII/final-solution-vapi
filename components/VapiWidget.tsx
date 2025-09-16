'use client'

import { useEffect, useRef } from 'react'

interface VapiWidgetProps {
  assistantId: string
  agentName: string
}

export default function VapiWidget({ assistantId, agentName }: VapiWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load VAPI widget script
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js'
    script.async = true
    script.type = 'text/javascript'

    script.onload = () => {
      console.log('VAPI widget script loaded')
    }

    script.onerror = () => {
      console.error('Failed to load VAPI widget script')
    }

    document.head.appendChild(script)

    return () => {
      // Cleanup script when component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return (
    <div className="text-center" ref={widgetRef}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-black mb-2">
          Talk to {agentName.replace(/-/g, ' ')} Assistant
        </h3>
        <p className="text-gray-600 text-sm">
          Click the voice button below to start your conversation
        </p>
      </div>

      {/* VAPI Widget Embed */}
      <vapi-widget
        assistant-id={assistantId}
        public-key={process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY}
      ></vapi-widget>
    </div>
  )
}
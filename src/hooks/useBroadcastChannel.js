import { useEffect, useRef } from 'react'

const CHANNEL_NAME = 'dermabridge'

export function useBroadcastChannel(onMessage) {
  const channelRef = useRef(null)

  useEffect(() => {
    channelRef.current = new BroadcastChannel(CHANNEL_NAME)
    channelRef.current.onmessage = (e) => onMessage(e.data)

    return () => {
      channelRef.current?.close()
    }
  }, [])

  const send = (data) => {
    channelRef.current?.postMessage(data)
  }

  return { send }
}
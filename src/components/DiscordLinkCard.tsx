import { useEffect, useRef, useState } from 'react'
import ApiClient from '../utils/apiClient'
import { toast } from 'react-toastify'

type Props = {
  onLinked?: (discordId: string) => void
}

export default function DiscordLinkCard({ onLinked }: Props) {
  const [generatingLink, setGeneratingLink] = useState(false)
  const [linkCode, setLinkCode] = useState<string | null>(null)
  const [linkExpiresAt, setLinkExpiresAt] = useState<string | null>(null)
  const [linkError, setLinkError] = useState<string | null>(null)
  const [linkedDiscordId, setLinkedDiscordId] = useState<string | null>(null)
  const pollRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current)
    }
  }, [])

  const startPollingForLink = (_code: string) => {
    // keep code referenced to satisfy linters
    void _code
    // Poll /users/me until discordId is present
    if (pollRef.current) window.clearInterval(pollRef.current)
    pollRef.current = window.setInterval(async () => {
      try {
        const profile = await ApiClient.get<Record<string, any>>('/users/me')
        if (profile?.discordId || profile?.discord) {
          const id = profile.discordId || profile.discord
          setLinkedDiscordId(id)
          if (pollRef.current) {
            window.clearInterval(pollRef.current)
            pollRef.current = null
          }
          if (onLinked) onLinked(id)
          // Show floating success toast with the Discord tag (if available)
          try {
            const tag = id
            if (typeof tag === 'string') {
              toast.success(`Linked to ${tag}`)
            }
          } catch {
            // ignore toast failures
          }
        }
      } catch {
        // ignore polling errors
      }
    }, 3000)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">Discord linking</div>
          <div className="text-sm text-gray-600">Generate a one-time 6-character code to link your RiseReady account with the Discord bot. Copy it and run <code className="bg-gray-100 px-1 rounded">/link code: YOUR_CODE</code> in Discord.</div>
        </div>
        <div className="text-right">
          <button
            onClick={async () => {
              setGeneratingLink(true)
              setLinkError(null)
              setLinkCode(null)
              setLinkExpiresAt(null)
              setLinkedDiscordId(null)
              try {
                const res = await ApiClient.post<{ code: string; expiresAt: string }>('/bots/link-code', { expiresInMinutes: 10 })
                setLinkCode(res.code)
                setLinkExpiresAt(res.expiresAt)
                startPollingForLink(res.code)
              } catch (err) {
                console.error('Failed to generate link code', err)
                if (err instanceof Error) setLinkError(err.message)
                else setLinkError(String(err))
              } finally {
                setGeneratingLink(false)
              }
            }}
            className="px-4 py-2 rounded-lg bg-[#37A6FF] text-white font-semibold disabled:opacity-50"
            disabled={generatingLink}
          >
            {generatingLink ? 'Generating...' : 'Generate Link Code'}
          </button>
        </div>
      </div>

      {linkError && <div className="mt-3 text-sm text-red-600">{linkError}</div>}

      {linkedDiscordId && (
        <div className="mt-3 bg-green-50 p-3 rounded-lg border border-green-100">
          <div className="font-semibold text-green-800">Linked</div>
          <div className="text-sm text-green-700">
            Your RiseReady account is now linked to Discord: 
            {linkedDiscordId.includes('#') ? (
              <code className="bg-white px-1 rounded">{linkedDiscordId}</code>
            ) : (
              <code className="bg-white px-1 rounded">{linkedDiscordId}</code>
            )}
          </div>
        </div>
      )}

      {linkCode && !linkedDiscordId && (
        <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-gray-500">Copy this code into Discord</div>
              <div className="mt-1 font-mono text-lg text-[#1F4E79]">{linkCode}</div>
              {linkExpiresAt && <div className="text-xs text-gray-500">Expires: {new Date(linkExpiresAt).toLocaleString()}</div>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { navigator.clipboard?.writeText(linkCode || '') }} className="px-3 py-1.5 rounded bg-white border">Copy</button>
              <a href="https://discord.com/channels/@me" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded bg-white border">Open Discord</a>
            </div>
          </div>
          <div className="text-xs text-gray-600 mt-2">Then run <code className="bg-white px-1 rounded">/link code: {linkCode}</code> in any server or DM where the RiseReady bot is available.</div>
        </div>
      )}
    </div>
  )
}

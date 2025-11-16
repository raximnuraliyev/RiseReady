import { useEffect, useRef, useState } from 'react'
import ApiClient from '../utils/apiClient'
import { toast } from 'react-toastify'

type Props = {
  onLinked?: (telegramId: string) => void
}

export default function TelegramLinkCard({ onLinked }: Props) {
  const [generatingLink, setGeneratingLink] = useState(false)
  const [linkCode, setLinkCode] = useState<string | null>(null)
  const [linkExpiresAt, setLinkExpiresAt] = useState<string | null>(null)
  const [linkError, setLinkError] = useState<string | null>(null)
  const [linkedTelegramId, setLinkedTelegramId] = useState<string | null>(null)
  const pollRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current)
    }
  }, [])

  const startPollingForLink = (_code: string) => {
    void _code
    if (pollRef.current) window.clearInterval(pollRef.current)
    pollRef.current = window.setInterval(async () => {
      try {
        const profile = await ApiClient.get<Record<string, unknown>>('/users/me')
        // Check for telegramId or telegram username field
        if (profile?.telegramId || profile?.telegram) {
          const id = profile.telegramId || profile.telegram
          setLinkedTelegramId(String(id))
          if (pollRef.current) { window.clearInterval(pollRef.current); pollRef.current = null }
          if (onLinked) onLinked(String(id))
          try { toast.success(`Linked to ${id}`) } catch (e) { console.warn('toast failed', e) }
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
          <div className="font-semibold">Telegram linking</div>
          <div className="text-sm text-gray-600">Generate a one-time 6-character code to link your RiseReady account with the Telegram bot. Copy it and run <code className="bg-gray-100 px-1 rounded">/link YOUR_CODE</code> in Telegram with the RiseReady bot.</div>
        </div>
        <div className="text-right">
          <button
            onClick={async () => {
              setGeneratingLink(true)
              setLinkError(null)
              setLinkCode(null)
              setLinkExpiresAt(null)
              setLinkedTelegramId(null)
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

      {linkedTelegramId && (
        <div className="mt-3 bg-green-50 p-3 rounded-lg border border-green-100">
          <div className="font-semibold text-green-800">Linked</div>
          <div className="text-sm text-green-700">Your RiseReady account is now linked to Telegram: <code className="bg-white px-1 rounded">{linkedTelegramId}</code></div>
        </div>
      )}

      {linkCode && !linkedTelegramId && (
        <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-gray-500">Copy this code into Telegram</div>
              <div className="mt-1 font-mono text-lg text-[#1F4E79]">{linkCode}</div>
              {linkExpiresAt && <div className="text-xs text-gray-500">Expires: {new Date(linkExpiresAt).toLocaleString()}</div>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { navigator.clipboard?.writeText(linkCode || '') }} className="px-3 py-1.5 rounded bg-white border">Copy</button>
              <a href="https://t.me/" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded bg-white border">Open Telegram</a>
            </div>
          </div>
          <div className="text-xs text-gray-600 mt-2">Then open a chat with the RiseReady bot and run <code className="bg-white px-1 rounded">/link {linkCode}</code>.</div>
        </div>
      )}
    </div>
  )
}

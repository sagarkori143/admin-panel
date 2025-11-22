"use client"

import { useState } from "react"
import type { Quota } from "@/lib/db"
import { Save, AlertCircle } from "lucide-react"

interface QuotaEditorProps {
  userId: string
  quota: Quota
  onSave: () => void
}

export function QuotaEditor({ userId, quota: initialQuota, onSave }: QuotaEditorProps) {
  const [quota, setQuota] = useState(initialQuota)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSave() {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/quotas/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokens_per_minute: quota.tokens_per_minute,
          tokens_per_day: quota.tokens_per_day,
          requests_per_minute: quota.requests_per_minute,
          concurrent_requests: quota.concurrent_requests,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update quota")
      }

      setSuccess(true)
      onSave()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof Quota, value: number) => {
    if (value <= 0) {
      setError("値は0より大きい必要があります")
      return
    }
    setQuota({ ...quota, [field]: value })
    setError(null)
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex gap-3 p-4 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-lg">
          クォータが正常に更新されました
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">トークン/分</label>
          <input
            type="number"
            min="1"
            value={quota.tokens_per_minute}
            onChange={(e) => handleChange("tokens_per_minute", Number.parseInt(e.target.value) || 1)}
            className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground mt-1">デフォルト: 10,000</p>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">トークン/日</label>
          <input
            type="number"
            min="1"
            value={quota.tokens_per_day}
            onChange={(e) => handleChange("tokens_per_day", Number.parseInt(e.target.value) || 1)}
            className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground mt-1">デフォルト: 100,000</p>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">リクエスト/分</label>
          <input
            type="number"
            min="1"
            value={quota.requests_per_minute}
            onChange={(e) => handleChange("requests_per_minute", Number.parseInt(e.target.value) || 1)}
            className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground mt-1">デフォルト: 10</p>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">同時リクエスト数</label>
          <input
            type="number"
            min="1"
            value={quota.concurrent_requests}
            onChange={(e) => handleChange("concurrent_requests", Number.parseInt(e.target.value) || 1)}
            className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground mt-1">デフォルト: 2</p>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        <Save className="w-4 h-4" />
        {loading ? "保存中..." : "保存"}
      </button>
    </div>
  )
}

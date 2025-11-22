"use client"

import type React from "react"

import { useState } from "react"
import { X, Plus, AlertCircle } from "lucide-react"

interface NewUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { email: string; oidc_sub: string; is_active: boolean }) => Promise<void>
}

export function NewUserDialog({ open, onOpenChange, onSubmit }: NewUserDialogProps) {
  const [email, setEmail] = useState("")
  const [oidcSub, setOidcSub] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !oidcSub) {
      setError("メールアドレスとOIDC Subは必須です")
      return
    }

    setLoading(true)
    setError(null)

    try {
      await onSubmit({ email, oidc_sub: oidcSub, is_active: isActive })
      setEmail("")
      setOidcSub("")
      setIsActive(true)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg border border-border p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">新規ユーザー作成</h2>
          <button onClick={() => onOpenChange(false)} className="p-1 hover:bg-muted rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex gap-3 p-3 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">OIDC Subject</label>
            <input
              type="text"
              value={oidcSub}
              onChange={(e) => setOidcSub(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="oidc_sub_identifier"
            />
          </div>

          <div className="bg-muted p-3 rounded-lg flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">デフォルト状態</label>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`px-2 py-1 rounded text-xs font-medium ${
                isActive
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
              }`}
            >
              {isActive ? "有効" : "無効"}
            </button>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 px-4 py-2 rounded-lg border border-input text-foreground hover:bg-muted transition-colors font-medium"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {loading ? "作成中..." : "作成"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

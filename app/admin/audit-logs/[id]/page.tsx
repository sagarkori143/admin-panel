"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { JsonViewer } from "@/components/json-viewer"
import type { AuditLog } from "@/lib/db"
import { ArrowLeft, Copy, Check } from "lucide-react"

export default function AuditLogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [id, setId] = useState<string>("")
  const [log, setLog] = useState<AuditLog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { id } = await params
      setId(id)
    })()
  }, [params])

  useEffect(() => {
    if (!id) return
    fetchLog()
  }, [id])

  async function fetchLog() {
    setLoading(true)
    try {
      const response = await fetch(`/api/audit-logs/${id}`)
      if (!response.ok) throw new Error("ログが見つかりません")
      setLog(await response.json())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  const handleCopyJson = () => {
    if (!log) return
    navigator.clipboard.writeText(JSON.stringify(log, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        <main className="ml-64 flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">読み込み中...</p>
        </main>
      </div>
    )
  }

  if (error || !log) {
    return (
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        <main className="ml-64 flex-1 overflow-auto">
          <div className="p-8">
            <div className="max-w-6xl mx-auto">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 mb-6 text-primary hover:text-primary/80 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                戻る
              </button>
              <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 p-4 rounded-lg">{error}</div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64 flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 mb-6 text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              戻る
            </button>

            {/* Header */}
            <div className="bg-card rounded-lg border border-border p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">{log.action}</h1>
                  <p className="text-sm text-muted-foreground">{new Date(log.timestamp).toLocaleString("ja-JP")}</p>
                </div>
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      コピー完了
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      JSONコピー
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">ステータス</p>
                  <p className="text-sm font-medium text-foreground mt-1">{log.status}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">トークン使用</p>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {log.tokens_used?.toLocaleString() || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">レスポンス時間</p>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {log.response_time ? `${log.response_time.toFixed(2)}ms` : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ユーザーID</p>
                  <p className="text-xs font-mono text-foreground mt-1">{log.user_id?.substring(0, 12) || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              {log.prompt && <JsonViewer data={log.prompt} label="プロンプト" />}

              {log.user_request && <JsonViewer data={log.user_request} label="ユーザーリクエスト" />}

              {log.server_computation && <JsonViewer data={log.server_computation} label="サーバー処理" />}

              {log.model_response && <JsonViewer data={log.model_response} label="モデルレスポンス" />}

              {log.metadata && <JsonViewer data={log.metadata} label="メタデータ" />}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

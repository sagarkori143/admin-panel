"use client"

import { useState } from "react"
import type { Policy } from "@/lib/db"
import { Save, Plus, X, AlertCircle } from "lucide-react"

const AVAILABLE_TOOLS = ["code", "file", "search", "analysis", "execute"]

interface PolicyEditorProps {
  userId: string
  policy: Policy
  onSave: () => void
}

export function PolicyEditor({ userId, policy: initialPolicy, onSave }: PolicyEditorProps) {
  const [policy, setPolicy] = useState(initialPolicy)
  const [mcpInput, setMcpInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSave() {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/policies/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mcp_whitelist: policy.mcp_whitelist,
          web_search_enabled: policy.web_search_enabled,
          allowed_tools: policy.allowed_tools,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update policy")
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

  const addMcpEndpoint = () => {
    if (!mcpInput.trim()) return
    if (!policy.mcp_whitelist.includes(mcpInput)) {
      setPolicy({
        ...policy,
        mcp_whitelist: [...policy.mcp_whitelist, mcpInput],
      })
      setMcpInput("")
    }
  }

  const removeMcpEndpoint = (endpoint: string) => {
    setPolicy({
      ...policy,
      mcp_whitelist: policy.mcp_whitelist.filter((e) => e !== endpoint),
    })
  }

  const toggleTool = (tool: string) => {
    if (policy.allowed_tools.includes(tool)) {
      setPolicy({
        ...policy,
        allowed_tools: policy.allowed_tools.filter((t) => t !== tool),
      })
    } else {
      setPolicy({
        ...policy,
        allowed_tools: [...policy.allowed_tools, tool],
      })
    }
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
          ポリシーが正常に更新されました
        </div>
      )}

      {/* Webサーチ切り替え */}
      <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-foreground">Webサーチを許可</label>
          <p className="text-xs text-muted-foreground mt-1">このユーザーがWebサーチを使用できるようにします</p>
        </div>
        <button
          onClick={() => setPolicy({ ...policy, web_search_enabled: !policy.web_search_enabled })}
          className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
            policy.web_search_enabled
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
          }`}
        >
          {policy.web_search_enabled ? "ON" : "OFF"}
        </button>
      </div>

      {/* 許可するツール */}
      <div>
        <label className="text-sm font-medium text-foreground mb-3 block">許可するツール</label>
        <div className="space-y-2">
          {AVAILABLE_TOOLS.map((tool) => (
            <button
              key={tool}
              onClick={() => toggleTool(tool)}
              className={`w-full p-3 rounded-lg border text-left transition-colors ${
                policy.allowed_tools.includes(tool)
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded border ${
                    policy.allowed_tools.includes(tool) ? "bg-primary border-primary" : "border-input"
                  }`}
                />
                <span className="capitalize font-medium">{tool}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* MCPホワイトリスト */}
      <div>
        <label className="text-sm font-medium text-foreground mb-3 block">MCPホワイトリスト</label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={mcpInput}
              onChange={(e) => setMcpInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addMcpEndpoint()}
              placeholder="MCPエンドポイントを入力..."
              className="flex-1 px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={addMcpEndpoint}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {policy.mcp_whitelist.length > 0 && (
            <div className="space-y-2 bg-muted p-3 rounded-lg">
              {policy.mcp_whitelist.map((endpoint) => (
                <div
                  key={endpoint}
                  className="flex items-center justify-between p-2 bg-background rounded border border-border"
                >
                  <span className="text-sm text-foreground font-mono">{endpoint}</span>
                  <button
                    onClick={() => removeMcpEndpoint(endpoint)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
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

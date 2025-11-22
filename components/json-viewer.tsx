"use client"

import { formatJsonPretty } from "@/lib/utils"

interface JsonViewerProps {
  data: unknown
  label?: string
}

export function JsonViewer({ data, label }: JsonViewerProps) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <pre className="bg-card p-4 rounded-lg border border-border overflow-x-auto text-xs font-mono text-foreground">
        {formatJsonPretty(data)}
      </pre>
    </div>
  )
}

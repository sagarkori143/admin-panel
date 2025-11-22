"use client"
import Link from "next/link"
import { formatDate, getStatusBadgeColor } from "@/lib/utils"
import type { AuditLog } from "@/lib/db"
import { ChevronRight } from "lucide-react"

interface AuditLogsTableProps {
  logs: AuditLog[]
  total: number
  limit: number
  offset: number
  onPageChange: (offset: number) => void
}

export function AuditLogsTable({ logs, total, limit, offset, onPageChange }: AuditLogsTableProps) {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left font-medium text-foreground">タイムスタンプ</th>
              <th className="px-6 py-4 text-left font-medium text-foreground">ユーザー</th>
              <th className="px-6 py-4 text-left font-medium text-foreground">アクション</th>
              <th className="px-6 py-4 text-left font-medium text-foreground">ステータス</th>
              <th className="px-6 py-4 text-left font-medium text-foreground">トークン使用</th>
              <th className="px-6 py-4 text-left font-medium text-foreground">レスポンス時間</th>
              <th className="px-6 py-4 text-right font-medium text-foreground">詳細</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 text-foreground text-xs">{formatDate(log.timestamp)}</td>
                <td className="px-6 py-4 text-foreground font-mono text-xs">
                  {log.user_id ? log.user_id.substring(0, 8) : "N/A"}
                </td>
                <td className="px-6 py-4 text-foreground font-medium">{log.action}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(log.status)}`}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-foreground">{log.tokens_used?.toLocaleString() || "-"}</td>
                <td className="px-6 py-4 text-foreground">
                  {log.response_time ? `${log.response_time.toFixed(2)}ms` : "-"}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/audit-logs/${log.id}`}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-xs font-medium"
                  >
                    表示
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-border flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          全 {total} ログ中 {offset + 1}-{Math.min(offset + limit, total)}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(Math.max(0, offset - limit))}
            disabled={offset === 0}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
          >
            前へ
          </button>
          <button
            onClick={() => onPageChange(offset + limit)}
            disabled={offset + limit >= total}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
          >
            次へ
          </button>
        </div>
      </div>
    </div>
  )
}

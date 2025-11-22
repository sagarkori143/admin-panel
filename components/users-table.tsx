"use client"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import type { User } from "@/lib/db"
import { ChevronRight } from "lucide-react"

interface UsersTableProps {
  initialUsers: User[]
  total: number
  limit: number
  offset: number
  onPageChange: (offset: number) => void
}

export function UsersTable({ initialUsers, total, limit, offset, onPageChange }: UsersTableProps) {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left font-medium text-foreground">メール</th>
              <th className="px-6 py-4 text-left font-medium text-foreground">OIDC Sub</th>
              <th className="px-6 py-4 text-left font-medium text-foreground">状態</th>
              <th className="px-6 py-4 text-left font-medium text-foreground">作成日</th>
              <th className="px-6 py-4 text-right font-medium text-foreground">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {initialUsers.map((user) => (
              <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">{user.email}</td>
                <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                  {user.oidc_sub.substring(0, 12)}...
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                      user.is_active
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                    }`}
                  >
                    {user.is_active ? "有効" : "無効"}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{formatDate(user.created_at)}</td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-xs font-medium"
                  >
                    編集
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
          全 {total} ユーザー中 {offset + 1}-{Math.min(offset + limit, total)}
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

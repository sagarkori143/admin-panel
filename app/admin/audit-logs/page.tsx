"use client"

import { useEffect, useState } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AuditLogsTable } from "@/components/audit-logs-table"
import { useLanguage } from "@/contexts/language-context"
import type { AuditLog } from "@/lib/db"
import { Filter, Download } from "lucide-react"

export default function AuditLogsPage() {
  const { t } = useLanguage()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [offset, setOffset] = useState(0)
  const [total, setTotal] = useState(0)
  const limit = 20

  // Filters
  const [status, setStatus] = useState("")
  const [action, setAction] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  useEffect(() => {
    fetchLogs()
  }, [offset, status, action, fromDate, toDate])

  async function fetchLogs() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (status) params.append("status", status)
      if (action) params.append("action", action)
      if (fromDate) params.append("from_date", fromDate)
      if (toDate) params.append("to_date", toDate)
      params.append("limit", limit.toString())
      params.append("offset", offset.toString())

      const response = await fetch(`/api/audit-logs?${params}`)
      if (!response.ok) throw new Error(t("auditLogsTitle"))

      const data = await response.json()
      setLogs(data.logs)
      setTotal(data.total)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("loading"))
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    const csv = [
      [t("responseTime"), "User ID", t("actionLabel"), t("statusLabel"), "Token Usage", t("responseTime")],
      ...logs.map((log) => [
        log.timestamp,
        log.user_id || "",
        log.action,
        log.status,
        log.tokens_used || "",
        log.response_time || "",
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64 flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">{t("auditLogsTitle")}</h1>
                <p className="text-muted-foreground">{t("monitorActivity")}</p>
              </div>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <Download className="w-5 h-5" />
                {t("exportCSV")}
              </button>
            </div>

            {/* Filters */}
            <div className="bg-card rounded-lg border border-border p-6 mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                {t("filtersLabel")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">{t("statusLabel")}</label>
                  <select
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value)
                      setOffset(0)
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">{t("allStatuses")}</option>
                    <option value="success">{t("successStatus")}</option>
                    <option value="error">{t("errorStatus")}</option>
                    <option value="blocked">{t("blockedStatus")}</option>
                    <option value="rate_limited">{t("rateLimitedStatus")}</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">{t("actionLabel")}</label>
                  <input
                    type="text"
                    placeholder={t("actionPlaceholder")}
                    value={action}
                    onChange={(e) => {
                      setAction(e.target.value)
                      setOffset(0)
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">{t("fromDateLabel")}</label>
                  <input
                    type="datetime-local"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value)
                      setOffset(0)
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">{t("toDateLabel")}</label>
                  <input
                    type="datetime-local"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value)
                      setOffset(0)
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t("loading")}</p>
              </div>
            ) : error ? (
              <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 p-4 rounded-lg">{error}</div>
            ) : logs.length === 0 ? (
              <div className="bg-card rounded-lg border border-border p-12 text-center">
                <p className="text-muted-foreground">{t("noLogsFound")}</p>
              </div>
            ) : (
              <AuditLogsTable logs={logs} total={total} limit={limit} offset={offset} onPageChange={setOffset} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

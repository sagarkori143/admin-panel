"use client"

import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { useLanguage } from "@/contexts/language-context"
import { t } from "@/lib/translations"

export default function AdminDashboard() {
  const { language } = useLanguage()

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64 flex-1 overflow-auto pt-16">
        <AdminHeader />
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-2">{t("dashboard", language)}</h1>
            <p className="text-muted-foreground mb-8">{t("welcome", language)}</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[
                { labelKey: "activeUsers", color: "bg-blue-100 dark:bg-blue-900" },
                { labelKey: "requestsToday", color: "bg-green-100 dark:bg-green-900" },
                { labelKey: "tokenUsage", color: "bg-orange-100 dark:bg-orange-900" },
                { labelKey: "errorRate", color: "bg-red-100 dark:bg-red-900" },
              ].map((stat) => (
                <div key={stat.labelKey} className={`${stat.color} rounded-lg p-6 border border-border`}>
                  <p className="text-sm font-medium text-muted-foreground mb-2">{t(stat.labelKey as any, language)}</p>
                  <p className="text-2xl font-bold text-foreground">--</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-lg border border-border p-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">{t("quickActions", language)}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href="/admin/users" className="p-4 border border-border rounded-lg hover:bg-muted transition-colors">
                  <h3 className="font-medium text-foreground mb-1">{t("userManagement", language)}</h3>
                  <p className="text-sm text-muted-foreground">{t("userManagementDesc", language)}</p>
                </a>
                <a
                  href="/admin/audit-logs"
                  className="p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <h3 className="font-medium text-foreground mb-1">{t("auditLogs", language)}</h3>
                  <p className="text-sm text-muted-foreground">{t("viewAuditLogs", language)}</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

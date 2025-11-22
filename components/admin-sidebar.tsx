"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Settings, LogOut, BarChart3 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const navItems = [
  { key: "dashboard", href: "/admin", icon: LayoutDashboard },
  { key: "users", href: "/admin/users", icon: Users },
  { key: "auditLogs", href: "/admin/audit-logs", icon: BarChart3 },
  { key: "settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { t, language } = useLanguage()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold text-lg">C</span>
          </div>
          <div>
            <h1 className="font-bold text-sidebar-foreground">{t("closedCode")}</h1>
            <p className="text-xs text-sidebar-accent-foreground">{t("adminPanel")}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{t(item.key as any)}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <button className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-sm">
          <LogOut className="w-5 h-5" />
          <span>{t("logout")}</span>
        </button>
      </div>
    </aside>
  )
}

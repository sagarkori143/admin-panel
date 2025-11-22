"use client"

import { useEffect, useState } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { UsersTable } from "@/components/users-table"
import { NewUserDialog } from "@/components/new-user-dialog"
import { useLanguage } from "@/contexts/language-context"
import type { User } from "@/lib/db"
import { Plus, Search } from "lucide-react"

export default function UsersPage() {
  const { t } = useLanguage()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchEmail, setSearchEmail] = useState("")
  const [filterActive, setFilterActive] = useState<string>("")
  const [offset, setOffset] = useState(0)
  const [total, setTotal] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const limit = 10

  useEffect(() => {
    fetchUsers()
  }, [searchEmail, filterActive, offset])

  async function fetchUsers() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchEmail) params.append("email", searchEmail)
      if (filterActive) params.append("is_active", filterActive)
      params.append("limit", limit.toString())
      params.append("offset", offset.toString())

      const response = await fetch(`/api/users?${params}`)
      if (!response.ok) throw new Error(t("userManagementTitle"))

      const data = await response.json()
      setUsers(data.users)
      setTotal(data.total)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("loading"))
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateUser(data: {
    email: string
    oidc_sub: string
    is_active: boolean
  }) {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || t("userManagementTitle"))
    }

    setOffset(0)
    await fetchUsers()
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64 flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">{t("userManagementTitle")}</h1>
                <p className="text-muted-foreground">{t("manageUsers")}</p>
              </div>
              <button
                onClick={() => setDialogOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                {t("addNewUser")}
              </button>
            </div>

            {/* Filters */}
            <div className="bg-card rounded-lg border border-border p-4 mb-6 space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground mb-2 block">{t("searchByEmail")}</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={t("emailSearch")}
                      value={searchEmail}
                      onChange={(e) => {
                        setSearchEmail(e.target.value)
                        setOffset(0)
                      }}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">{t("statusFilter")}</label>
                  <select
                    value={filterActive}
                    onChange={(e) => {
                      setFilterActive(e.target.value)
                      setOffset(0)
                    }}
                    className="px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">{t("allStatuses")}</option>
                    <option value="true">{t("active")}</option>
                    <option value="false">{t("inactive")}</option>
                  </select>
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
            ) : (
              <UsersTable initialUsers={users} total={total} limit={limit} offset={offset} onPageChange={setOffset} />
            )}

            {/* New User Dialog */}
            <NewUserDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleCreateUser} />
          </div>
        </div>
      </main>
    </div>
  )
}

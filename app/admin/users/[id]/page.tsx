"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { QuotaEditor } from "./quota-editor"
import { PolicyEditor } from "./policy-editor"
import type { User, Quota, Policy } from "@/lib/db"
import { ArrowLeft } from "lucide-react"

interface UserDetail {
  user: User
  quota: Quota | null
  policy: Policy | null
}

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [userId, setUserId] = useState<string>("")
  const [data, setData] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"overview" | "quota" | "policy">("overview")
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { id } = await params
      setUserId(id)
    })()
  }, [params])

  useEffect(() => {
    if (!userId) return
    fetchUserDetail()
  }, [userId])

  async function fetchUserDetail() {
    setLoading(true)
    try {
      const response = await fetch(`/api/users/${userId}`)
      if (!response.ok) throw new Error("ユーザーが見つかりません")
      setData(await response.json())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  async function toggleUserStatus() {
    if (!data) return
    setToggling(true)
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !data.user.is_active }),
      })

      if (!response.ok) throw new Error("ステータス更新に失敗しました")
      const updated = await response.json()
      setData({ ...data, user: updated })
    } catch (err) {
      console.error(err)
    } finally {
      setToggling(false)
    }
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

  if (error || !data) {
    return (
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        <main className="ml-64 flex-1 overflow-auto">
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
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
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 mb-6 text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              戻る
            </button>

            {/* User Info Card */}
            <div className="bg-card rounded-lg border border-border p-6 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-1">{data.user.email}</h1>
                  <p className="text-sm text-muted-foreground mb-4">ID: {data.user.id}</p>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="text-muted-foreground">作成日: </span>
                      <span className="text-foreground">{data.user.created_at}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">更新日: </span>
                      <span className="text-foreground">{data.user.updated_at}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={toggleUserStatus}
                  disabled={toggling}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    data.user.is_active
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
                  } disabled:opacity-50`}
                >
                  {data.user.is_active ? "有効" : "無効"}
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-border">
              {(["overview", "quota", "policy"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "overview" ? "概要" : tab === "quota" ? "クォータ" : "ポリシー"}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="bg-card rounded-lg border border-border p-6">
              {activeTab === "overview" && (
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">ユーザー情報</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground">メールアドレス</label>
                      <p className="text-foreground">{data.user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">OIDC Subject</label>
                      <p className="text-foreground font-mono text-sm">{data.user.oidc_sub}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">ステータス</label>
                      <p className="text-foreground">{data.user.is_active ? "有効" : "無効"}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "quota" && data.quota && (
                <QuotaEditor userId={userId} quota={data.quota} onSave={fetchUserDetail} />
              )}

              {activeTab === "policy" && data.policy && (
                <PolicyEditor userId={userId} policy={data.policy} onSave={fetchUserDetail} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

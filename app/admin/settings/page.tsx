"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useLanguage } from "@/contexts/language-context"
import { AlertCircle, Save } from "lucide-react"

export default function SettingsPage() {
  const { t } = useLanguage()
  const [auditLoggingEnabled, setAuditLoggingEnabled] = useState(true)
  const [retentionDays, setRetentionDays] = useState(30)
  const [logLevel, setLogLevel] = useState("info")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      // Save to config/environment
      // This would typically go to a config service or KV store
      setTimeout(() => {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
        setSaving(false)
      }, 500)
    } catch (error) {
      console.error(error)
      setSaving(false)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64 flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-2">{t("settingsTitle")}</h1>
            <p className="text-muted-foreground mb-8">{t("gatewayConfiguration")}</p>

            <div className="space-y-6">
              {/* Audit Logging Section */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">{t("auditLoggingConfig")}</h2>

                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-foreground">{t("enableAuditLogging")}</label>
                      <p className="text-xs text-muted-foreground mt-1">{t("recordAllActivity")}</p>
                    </div>
                    <button
                      onClick={() => setAuditLoggingEnabled(!auditLoggingEnabled)}
                      className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                        auditLoggingEnabled
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }`}
                    >
                      {auditLoggingEnabled ? t("on") : t("off")}
                    </button>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">{t("logRetention")}</label>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={retentionDays}
                      onChange={(e) => setRetentionDays(Number.parseInt(e.target.value) || 30)}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <p className="text-xs text-muted-foreground mt-2">{t("logRetentionDesc")}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">{t("logLevelLabel")}</label>
                    <select
                      value={logLevel}
                      onChange={(e) => setLogLevel(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="debug">{t("debugLevel")}</option>
                      <option value="info">{t("infoLevel")}</option>
                      <option value="warn">{t("warnLevel")}</option>
                      <option value="error">{t("errorLevel")}</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-2">{t("logLevelDesc")}</p>
                  </div>
                </div>
              </div>

              {/* System Info */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">{t("systemInfo")}</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("version")}</span>
                    <span className="text-foreground font-medium">v1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("environment")}</span>
                    <span className="text-foreground font-medium">{t("production")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("database")}</span>
                    <span className="text-foreground font-medium">{t("postgresql")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("deployment")}</span>
                    <span className="text-foreground font-medium">{t("gcpCloudRun")}</span>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-100 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {t("dangerZone")}
                </h2>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                  {t("deleteAllLogs")}
                </button>
              </div>

              {/* Save Button */}
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  <Save className="w-4 h-4" />
                  {saving ? t("saving") : t("saveSettings")}
                </button>
                {saved && (
                  <div className="px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-lg">
                    {t("settingsSaved")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

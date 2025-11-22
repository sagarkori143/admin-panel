"use client"

import { useLanguage } from "@/contexts/language-context"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

export default function LoginPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleOIDCLogin = async () => {
    setIsLoading(true)
    // Simulate OIDC flow
    await new Promise((resolve) => setTimeout(resolve, 1500))
    // Redirect to admin panel
    router.push("/admin")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border-2 border-border/50 rounded-xl shadow-xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="text-4xl font-black text-primary">C</div>
            <h1 className="text-2xl font-bold text-foreground">{t("secureAuth")}</h1>
            <p className="text-sm text-muted-foreground">{t("fastAndSecure")}</p>
          </div>

          {/* OIDC Login Button */}
          <button
            onClick={handleOIDCLogin}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-gradient-to-r from-primary to-orange-600 text-primary-foreground rounded-lg font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                {t("redirecting")}
              </>
            ) : (
              <>
                <span>🔐</span>
                {t("oidcLogin")}
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-card text-muted-foreground">OR</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t("email")}</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 bg-background border-2 border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-foreground">{t("password")}</label>
                <a href="#" className="text-xs text-primary hover:underline">
                  {t("forgotPassword")}
                </a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-background border-2 border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded" />
              <label htmlFor="remember" className="ml-2 text-sm text-muted-foreground">
                {t("rememberMe")}
              </label>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-2 bg-card border-2 border-primary/40 text-foreground rounded-lg font-bold hover:bg-primary/5 transition-all duration-300 mt-6"
            >
              {t("signIn")}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {t("noAccount")}{" "}
              <a href="#" className="text-primary hover:underline font-medium">
                {t("signUp")}
              </a>
            </span>
          </div>

          {/* Back to Home */}
          <div className="border-t border-border/50 pt-6">
            <Link href="/" className="text-sm text-primary hover:underline text-center block">
              ← {t("backToHome")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

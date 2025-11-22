"use client"

import { useLanguage } from "@/contexts/language-context"
import { LanguageToggle } from "./language-toggle"
import { ThemeToggle } from "./theme-toggle"
import Link from "next/link"

export function LandingHeader() {
  const { language, t } = useLanguage()

  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border/40 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg">
            C
          </div>
          <span className="text-foreground font-bold text-lg hidden sm:inline">Closed Code</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t("features")}
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t("pricing")}
          </a>
          <a href="#docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t("docs")}
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageToggle />
          <ThemeToggle />
          <Link
            href="/admin"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {t("auth")}
          </Link>
        </div>
      </div>
    </header>
  )
}

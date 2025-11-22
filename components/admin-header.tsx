"use client"

import { LanguageToggle } from "./language-toggle"
import { ThemeToggle } from "./theme-toggle"

export function AdminHeader() {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-background border-b border-border flex items-center justify-between px-6 z-40">
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  )
}

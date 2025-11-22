"use client"

import { Moon, Sun } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function ThemeToggle() {
  const { isDark, setIsDark } = useLanguage()

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-lg hover:bg-muted transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}

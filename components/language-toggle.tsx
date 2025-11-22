"use client"

import { useLanguage } from "@/contexts/language-context"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex gap-2 bg-muted p-1 rounded-lg">
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1 rounded transition-colors text-sm font-medium ${
          language === "en" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("ja")}
        className={`px-3 py-1 rounded transition-colors text-sm font-medium ${
          language === "ja" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        JA
      </button>
    </div>
  )
}

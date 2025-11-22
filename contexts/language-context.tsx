"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { t as translateFn, type Language } from "@/lib/translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  isDark: boolean
  setIsDark: (dark: boolean) => void
  t: (key: Parameters<typeof translateFn>[0]) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [isDark, setIsDarkState] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Initialize from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const savedLang = localStorage.getItem("language") as Language | null
    const savedDark = localStorage.getItem("darkMode") === "true"

    if (savedLang && (savedLang === "en" || savedLang === "ja")) {
      setLanguageState(savedLang)
    }
    setIsDarkState(savedDark)

    // Apply dark mode to document
    if (savedDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const setIsDark = (dark: boolean) => {
    setIsDarkState(dark)
    localStorage.setItem("darkMode", String(dark))
    if (dark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const t = (key: Parameters<typeof translateFn>[0]) => {
    return translateFn(key, language)
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isDark, setIsDark, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}

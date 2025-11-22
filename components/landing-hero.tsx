"use client"

import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"

export function LandingHero() {
  const { t, isDark } = useLanguage()

  return (
    <section className="min-h-screen bg-gradient-to-b from-background to-secondary/10 pt-32 px-4 sm:px-6 lg:px-8 flex items-center justify-center border-b border-border/40 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isDark
              ? "linear-gradient(90deg, rgb(255, 140, 0) 1px, transparent 1px), linear-gradient(0deg, rgb(255, 140, 0) 1px, transparent 1px)"
              : "linear-gradient(90deg, rgb(20, 20, 20) 1px, transparent 1px), linear-gradient(0deg, rgb(20, 20, 20) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/30">
          <span className="text-xs font-semibold text-primary animate-pulse">⚡ Powered by Vertex AI & Qwen 2.5</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-foreground leading-tight text-balance">{t("hero")}</h1>

        <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-balance font-light">
          {t("heroSubtitle")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link
            href="/login"
            className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {t("authenticate")}
          </Link>
          <button className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-bold hover:bg-primary/5 transition-all duration-300">
            {t("watchDemo")}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-8 pt-16 text-sm">
          <div>
            <div className="text-3xl font-black text-primary">100ms</div>
            <div className="text-muted-foreground font-medium">{t("responseTime")}</div>
          </div>
          <div>
            <div className="text-3xl font-black text-primary">99.9%</div>
            <div className="text-muted-foreground font-medium">{t("uptime")}</div>
          </div>
          <div>
            <div className="text-3xl font-black text-primary">∞</div>
            <div className="text-muted-foreground font-medium">{t("scalable")}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

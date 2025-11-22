"use client"

import { useLanguage } from "@/contexts/language-context"

export function LandingFeatures() {
  const { t } = useLanguage()

  const features = [
    {
      title: t("aiPowered"),
      description: t("aiPoweredDesc"),
      icon: "🧠",
      gradient: "from-orange-500/20 to-orange-600/20",
    },
    {
      title: t("fastAuth"),
      description: t("fastAuthDesc"),
      icon: "⚡",
      gradient: "from-orange-500/20 to-orange-600/20",
    },
    {
      title: t("quotaManagement"),
      description: t("quotaManagementDesc"),
      icon: "📊",
      gradient: "from-primary/20 to-primary/20",
    },
    {
      title: t("auditTrail"),
      description: t("auditTrailDesc"),
      icon: "📝",
      gradient: "from-primary/20 to-primary/20",
    },
    {
      title: t("redisCache"),
      description: t("redisCacheDesc"),
      icon: "⚙️",
      gradient: "from-orange-500/20 to-orange-600/20",
    },
    {
      title: t("realtime"),
      description: t("realtimeDesc"),
      icon: "🔄",
      gradient: "from-primary/20 to-primary/20",
    },
  ]

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-background border-b border-border/40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black text-foreground mb-4">{t("features")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">{t("architectureDesc")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`group p-8 bg-gradient-to-br ${feature.gradient} border-2 border-border/50 rounded-xl hover:border-primary/60 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 backdrop-blur-sm`}
            >
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

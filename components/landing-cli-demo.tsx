"use client"

import { useLanguage } from "@/contexts/language-context"

export function LandingCliDemo() {
  const { t } = useLanguage()

  const commands = [
    {
      cmd: t("authCmd"),
      desc: t("authCmdDesc"),
      example: "closed-code auth --key YOUR_API_KEY",
    },
    {
      cmd: t("helpCmd"),
      desc: t("helpCmdDesc"),
      example: "closed-code help --file app.ts",
    },
    {
      cmd: t("generateCmd"),
      desc: t("generateCmdDesc"),
      example: "closed-code generate --prompt 'auth middleware'",
    },
    {
      cmd: t("editCmd"),
      desc: t("editCmdDesc"),
      example: "closed-code edit --file utils.ts --fix bugs",
    },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4">{t("cliCommands")}</h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto font-light">{t("cliDesc")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {commands.map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-black/30 border border-primary/30 rounded-lg font-mono text-sm hover:border-primary/60 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="text-primary font-bold mb-2">$ {item.cmd}</div>
              <div className="text-white/60 text-xs mb-3">{item.desc}</div>
              <div className="text-white/40 text-xs border-t border-primary/20 pt-3 mt-3">{item.example}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

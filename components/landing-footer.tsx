"use client"

import { useLanguage } from "@/contexts/language-context"

export function LandingFooter() {
  const { t, language } = useLanguage()

  return (
    <footer className="bg-secondary text-white border-t border-primary/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center text-white font-black">
                C
              </div>
              <span className="font-bold text-lg">Closed Code</span>
            </div>
            <p className="text-white/60 text-sm">
              {language === "en" ? "CLI-powered AI code editor" : "AI駆動のCLIコードエディタ"}
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">{language === "en" ? "Product" : "製品"}</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a href="#features" className="hover:text-primary transition-colors">
                  {t("features")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {language === "en" ? "Pricing" : "価格"}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {language === "en" ? "Documentation" : "ドキュメント"}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">{language === "en" ? "Connect" : "接続"}</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/60">
            © 2025 Closed Code. {language === "en" ? "All rights reserved." : "すべての権利を保有しています。"}
          </p>
          <div className="flex items-center gap-6 text-sm text-white/60">
            <a href="#" className="hover:text-primary transition-colors">
              {language === "en" ? "Privacy" : "プライバシー"}
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              {language === "en" ? "Terms" : "利用規約"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

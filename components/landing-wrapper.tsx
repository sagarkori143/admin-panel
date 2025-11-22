"use client"

import { useEffect, useState } from "react"
import { LandingHeader } from "./landing-header"
import { LandingHero } from "./landing-hero"
import { LandingFeatures } from "./landing-features"
import { LandingCliDemo } from "./landing-cli-demo"
import { LandingFooter } from "./landing-footer"

export function LandingWrapper() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <LandingHeader />
      <LandingHero />
      <LandingFeatures />
      <LandingCliDemo />
      <LandingFooter />
    </>
  )
}

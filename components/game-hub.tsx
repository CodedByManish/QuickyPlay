"use client"

import { useState, useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import GameCardSection from "@/components/game-card-section"
import Footer from "@/components/footer"

export default function GameHub() {
  const [mounted, setMounted] = useState(false)

  // Ensure theme is only rendered on client-side
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <div className="min-h-screen bg-gradient-to-b from-background to-background/90 transition-colors duration-300">
        <Navbar />
        <main>
          <HeroSection />
          <GameCardSection />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

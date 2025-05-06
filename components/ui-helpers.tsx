// New file with UI helper components
"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { motion } from "framer-motion"

/**
 * A back button component that appears in the corner of pages
 * with smooth animation and transitions back to the home page.
 */
export function BackButton() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  // Animate the button to appear after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  const goBack = () => {
    // Using smooth animation before navigation
    setIsVisible(false)
    setTimeout(() => {
      router.push("/")
    }, 200)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
      transition={{ duration: 0.2 }}
      className="fixed top-20 right-4 z-10"
    >
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full hover:bg-primary/10 bg-background/80 backdrop-blur-sm border border-primary/20 shadow-lg"
        onClick={goBack}
      >
        <X className="h-5 w-5" />
      </Button>
    </motion.div>
  )
}

/**
 * A text component with gradient styling
 */
export function GradientText({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span className={`bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 ${className}`}>
      {children}
    </span>
  )
}

/**
 * Page transition wrapper for smooth page transitions
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

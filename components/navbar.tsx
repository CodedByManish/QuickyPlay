"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Menu, X, Gamepad2, Search } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import type { Game } from "./game-card-section"

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Game[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Ensure theme toggle is only rendered on client-side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Set active tab based on current path
  const getActiveTab = () => {
    if (pathname === "/") return "home"
    if (pathname === "/popular") return "popular"
    if (pathname === "/new") return "new"
    if (pathname === "/categories") return "categories"
    return ""
  }

  const [activeTab, setActiveTab] = useState(getActiveTab())

  // Update active tab when pathname changes
  useEffect(() => {
    setActiveTab(getActiveTab())
  }, [pathname])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) {
      setSearchQuery("")
      setSearchResults([])
    }
  }

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Sample game data for search
  const allGames: Game[] = [
    {
      id: 1,
      title: "Duet Game",
      category: "Reflex",
      gameType: "Arcade",
      type: "Reflex/Coordination",
      stressLevel: "High",
      addictionHook: "Smooth rhythm, intense concentration required.",
      rating: 4.7,
      image: "/placeholder.svg?height=400&width=600&text=Duet+Game",
      difficulty: "Medium",
      playTime: "5-10 min",
    },
    {
      id: 2,
      title: "Flappy Bird",
      category: "Reflex",
      gameType: "Casual",
      type: "Tap & Fly",
      stressLevel: "Very High",
      addictionHook: "Instant retry, pixel-perfect navigation.",
      rating: 4.8,
      image: "/placeholder.svg?height=400&width=600&text=Flappy+Bird",
      difficulty: "Hard",
      playTime: "1-5 min",
    },
    {
      id: 3,
      title: "2048",
      category: "Puzzle",
      gameType: "Puzzle",
      type: "Puzzle/Logic",
      stressLevel: "Medium-High",
      addictionHook: "Easy to play, hard to win — merges give dopamine hits.",
      rating: 4.9,
      image: "/placeholder.svg?height=400&width=600&text=2048",
      difficulty: "Medium",
      playTime: "5-15 min",
    },
    {
      id: 7,
      title: "Geometry Rush",
      category: "Rhythm",
      gameType: "Action",
      type: "Rhythm/Platformer",
      stressLevel: "Very High",
      addictionHook: "Music-based jumps, one mistake = restart, keeps you coming back.",
      rating: 4.9,
      image: "/placeholder.svg?height=400&width=600&text=Geometry+Rush",
      difficulty: "Hard",
      playTime: "3-10 min",
    },
    {
      id: 15,
      title: "Sudoku",
      category: "Puzzle",
      gameType: "Puzzle",
      type: "Number Puzzle",
      stressLevel: "Low",
      addictionHook: "Brain teaser, completionist satisfaction, endless variations.",
      rating: 4.7,
      image: "/placeholder.svg?height=400&width=600&text=Sudoku",
      difficulty: "Medium",
      playTime: "10-30 min",
    },
    {
      id: 101,
      title: "Target Shooter",
      category: "Precision",
      gameType: "Action",
      type: "Shooting/Precision",
      stressLevel: "Medium",
      addictionHook: "Quick reflexes, satisfying hits, score chasing.",
      rating: 4.6,
      image: "/placeholder.svg?height=400&width=600&text=Target+Shooter",
      difficulty: "Medium",
      playTime: "3-10 min",
    },
  ]

  // Handle search input
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim() === "") {
      setSearchResults([])
      return
    }

    // Filter games based on search query
    const results = allGames.filter(
      (game) =>
        game.title.toLowerCase().includes(query.toLowerCase()) ||
        game.category.toLowerCase().includes(query.toLowerCase()) ||
        game.gameType.toLowerCase().includes(query.toLowerCase()),
    )

    setSearchResults(results)
  }

  // Handle search result click
  const handleSearchResultClick = (gameId: number) => {
    setIsSearchOpen(false)
    router.push(`/games/${gameId}`)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setActiveTab("home")}>
          <Gamepad2 className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            QuickyPlay
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-sm font-medium relative group" onClick={() => setActiveTab("home")}>
            <span
              className={`transition-colors duration-300 ${activeTab === "home" ? "text-primary" : "hover:text-primary"}`}
            >
              Home
            </span>
            {activeTab === "home" ? (
              <motion.div
                layoutId="navIndicator"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            )}
          </Link>
          <Link href="/popular" className="text-sm font-medium relative group" onClick={() => setActiveTab("popular")}>
            <span
              className={`transition-colors duration-300 ${activeTab === "popular" ? "text-primary" : "hover:text-primary"}`}
            >
              Popular
            </span>
            {activeTab === "popular" ? (
              <motion.div
                layoutId="navIndicator"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            )}
          </Link>
          <Link href="/new" className="text-sm font-medium relative group" onClick={() => setActiveTab("new")}>
            <span
              className={`transition-colors duration-300 ${activeTab === "new" ? "text-primary" : "hover:text-primary"}`}
            >
              New
            </span>
            {activeTab === "new" ? (
              <motion.div
                layoutId="navIndicator"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            )}
          </Link>
          <Link
            href="/categories"
            className="text-sm font-medium relative group"
            onClick={() => setActiveTab("categories")}
          >
            <span
              className={`transition-colors duration-300 ${activeTab === "categories" ? "text-primary" : "hover:text-primary"}`}
            >
              Categories
            </span>
            {activeTab === "categories" ? (
              <motion.div
                layoutId="navIndicator"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            )}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {/* Animated Search Input */}
          <div ref={searchRef} className="relative">
            <div
              className={`flex items-center rounded-full border border-primary/30 bg-background/80 backdrop-blur-sm transition-all duration-700 overflow-hidden ${isSearchOpen ? "w-[250px] sm:w-[350px]" : "w-[40px]" } h-[40px]`} 
            >
              {/* Search Icon */}
              <div className="flex items-center justify-center w-[45px] h-[45px] rounded-full">
                <Search
                  className={`h-5 w-5 text-muted-foreground transition-transform duration-700 ${isSearchOpen ? "rotate-90" : ""}`}
                  onClick={toggleSearch}
                />
              </div>

              <motion.input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={handleSearchInput}
                className="border-none bg-transparent focus:outline-none focus:ring-0 flex-1 h-[38px]"
                initial={{ width: 0, opacity: 0 }}
                animate={{
                  width: isSearchOpen ? "100%" : 0,
                  opacity: isSearchOpen ? 1 : 0,
                }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
              />

              {isSearchOpen && (
                <motion.div
                  className="flex items-center justify-center w-[50px] h-[38px] cursor-pointer"
                  onClick={toggleSearch}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                </motion.div>
              )}
            </div>

            {/* Search results dropdown */}
            {isSearchOpen && searchQuery.trim() !== "" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5 }}
                className="absolute right-0 mt-2 w-[250px] sm:w-[350px] bg-background/95 backdrop-blur-md border border-primary/20 rounded-lg shadow-lg overflow-hidden z-50"
              >
                {searchResults.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto">
                    {searchResults.map((game) => (
                      <div
                        key={game.id}
                        className="flex items-center gap-3 p-2 hover:bg-primary/10 cursor-pointer"
                        onClick={() => handleSearchResultClick(game.id)}
                      >
                        <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                          <div
                            className="absolute inset-0 bg-center bg-cover"
                            style={{ backgroundImage: `url(${game.image})` }}
                          ></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{game.title}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {game.category} • {game.gameType}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-yellow-500">★</span>
                          <span>{game.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">No games found</div>
                )}
              </motion.div>
            )}
          </div>

          {/* Sign In Button */}
          <Button className="hidden md:flex bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300">
            Sign In
          </Button>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="container md:hidden py-4 pb-6 border-b">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${activeTab === "home" ? "text-primary" : "hover:text-primary"}`}
              onClick={() => {
                setActiveTab("home")
                setIsMenuOpen(false)
              }}
            >
              Home
            </Link>
            <Link
              href="/popular"
              className={`text-sm font-medium transition-colors ${activeTab === "popular" ? "text-primary" : "hover:text-primary"}`}
              onClick={() => {
                setActiveTab("popular")
                setIsMenuOpen(false)
              }}
            >
              Popular
            </Link>
            <Link
              href="/new"
              className={`text-sm font-medium transition-colors ${activeTab === "new" ? "text-primary" : "hover:text-primary"}`}
              onClick={() => {
                setActiveTab("new")
                setIsMenuOpen(false)
              }}
            >
              New
            </Link>
            <Link
              href="/categories"
              className={`text-sm font-medium transition-colors ${activeTab === "categories" ? "text-primary" : "hover:text-primary"}`}
              onClick={() => {
                setActiveTab("categories")
                setIsMenuOpen(false)
              }}
            >
              Categories
            </Link>

            {/* Mobile Search */}
            <div className="pt-2">
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={handleSearchInput}
                className="w-full px-3 py-2 rounded-md border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
              />

              {searchResults.length > 0 && (
                <div className="mt-2 max-h-60 overflow-y-auto border border-border rounded-lg">
                  {searchResults.map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center gap-3 p-2 hover:bg-primary/10 cursor-pointer"
                      onClick={() => {
                        handleSearchResultClick(game.id)
                        setIsMenuOpen(false)
                      }}
                    >
                      <div className="relative w-8 h-8 rounded overflow-hidden flex-shrink-0">
                        <div
                          className="absolute inset-0 bg-center bg-cover"
                          style={{ backgroundImage: `url(${game.image})` }}
                        ></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{game.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{game.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button className="w-full bg-gradient-to-r from-primary to-purple-600" onClick={() => setIsMenuOpen(false)}>
              Sign In
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}

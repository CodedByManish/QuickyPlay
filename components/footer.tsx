import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Gamepad2, Twitter, Instagram, Youtube, DiscIcon as Discord, ChevronRight } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Gamepad2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                QuickyPlay
              </span>
            </Link>
            <p className="text-muted-foreground mb-4">
              Discover your next gaming adventure with QuickyPlay - the ultimate gaming hub for players worldwide.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Discord className="h-5 w-5" />
                <span className="sr-only">Discord</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Games
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  New Releases
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Top Rated
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Upcoming
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Deals & Promotions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Join Our Newsletter</h3>
            <p className="text-muted-foreground mb-4">
              Stay updated with the latest games, features, and exclusive offers.
            </p>
            <div className="flex gap-2 mb-4">
              <Input placeholder="Enter your email" className="max-w-[220px]" />
              <Button size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} QuickyPlay. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Discord CTA */}
      <div className="bg-primary/10 dark:bg-primary/5 border-t border-primary/20">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Discord className="h-8 w-8 text-primary" />
            <div>
              <h4 className="font-bold">Join Our Discord Community</h4>
              <p className="text-sm text-muted-foreground">
                Connect with gamers, get support, and participate in events
              </p>
            </div>
          </div>
          <Button className="bg-[#5865F2] hover:bg-[#4752c4] text-white">
            <Discord className="h-5 w-5 mr-2" />
            Join Discord
          </Button>
        </div>
      </div>
    </footer>
  )
}

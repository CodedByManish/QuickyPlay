import PopularGamesPage from "@/components/popular-games-page"
import { PageTransition } from "@/components/ui-helpers"

export default function PopularPage() {
  return (
    <PageTransition>
      <PopularGamesPage />
    </PageTransition>
  )
}

import NewGamesPage from "@/components/new-games-page"
import { PageTransition } from "@/components/ui-helpers"

export default function NewPage() {
  return (
    <PageTransition>
      <NewGamesPage />
    </PageTransition>
  )
}

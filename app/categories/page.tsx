import CategoriesPage from "@/components/categories-page"
import { PageTransition } from "@/components/ui-helpers"

export default function Categories() {
  return (
    <PageTransition>
      <CategoriesPage />
    </PageTransition>
  )
}

import CategoryAddDialog from "../../components/category/category-add-dialog";
import CategoryCard from "../../components/category/category-card";
import { EmptyState, LoadError } from "../../components/empty-state";
import { PageHeader } from "../../components/page-header";
import { Skeleton } from "../../components/ui/skeleton";
import useCategories from "../../hooks/category/useCategories";

export default function CategoriesPage() {
  const {
    data: categories = [],
    isLoading,
    isError,
    refetch,
  } = useCategories();
  return (
    <div className="page">
      <PageHeader
        title="A place for every book"
        description="Thoughtful categories help readers find their way."
      >
        <CategoryAddDialog />
      </PageHeader>
      <div className="page-content">
        {isError ? (
          <LoadError onRetry={() => void refetch()} />
        ) : isLoading ? (
          <div className="category-grid">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton className="h-40 w-full" key={i} />
            ))}
          </div>
        ) : categories.length ? (
          <>
            <p className="text-muted-foreground mb-5 text-xs">
              {categories.length}{" "}
              {categories.length === 1 ? "category" : "categories"} in the
              collection
            </p>
            <div className="category-grid">
              {categories.map((category) => (
                <CategoryCard key={category.id} cat={category} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            title="Give the collection a little structure"
            description="Create a category so the first books can find their shelves."
          >
            <CategoryAddDialog />
          </EmptyState>
        )}
      </div>
    </div>
  );
}

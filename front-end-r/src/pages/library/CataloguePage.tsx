import { ArrowRight, Search, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { BookCover } from "../../components/book-cover";
import { EmptyState, LoadError } from "../../components/empty-state";
import { LibraryPagination } from "../../components/library-pagination";
import { PageHeader } from "../../components/page-header";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Skeleton } from "../../components/ui/skeleton";
import { useCatalogue, usePublicCategories } from "../../hooks/useLibrary";
import useDebounce from "../../hooks/useDebounce";
import { useAuth } from "../../provider/AuthProvider";

export default function CataloguePage() {
  const [params, setParams] = useSearchParams();
  const { user } = useAuth();
  const query = params.get("q") ?? "";
  const debounced = useDebounce(query, 300);
  const apiParams = new URLSearchParams({
    page: params.get("page") || "1",
    per_page: "12",
  });
  if (debounced.trim()) apiParams.set("q", debounced.trim());
  if (params.get("category"))
    apiParams.set("category", params.get("category")!);
  if (params.get("status")) apiParams.set("status", params.get("status")!);
  const books = useCatalogue(apiParams);
  const categories = usePublicCategories();
  function change(name: string, value: string) {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value && value !== "all") next.set(name, value);
        else next.delete(name);
        if (name !== "page") next.delete("page");
        return next;
      },
      { replace: name === "q" },
    );
  }
  return (
    <div className="page catalogue-page">
      <PageHeader
        title="Book collection"
        description="Find a book to spend time with. There’s room for every reader here."
      />
      <div className="page-content">
        <div className="collection-toolbar catalogue-toolbar">
          <div className="collection-search">
            <Search size={17} />
            <Input
              aria-label="Search books and authors"
              placeholder="Find a title or an author…"
              value={query}
              maxLength={120}
              onChange={(e) => change("q", e.target.value)}
            />
            {query && (
              <button
                type="button"
                aria-label="Clear book search"
                onClick={() => change("q", "")}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <Select
            value={params.get("category") || "all"}
            onValueChange={(value) => change("category", value)}
          >
            <SelectTrigger aria-label="Filter by category">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.data?.map((category) => (
                <SelectItem value={String(category.id)} key={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={params.get("status") || "all"}
            onValueChange={(value) => change("status", value)}
          >
            <SelectTrigger aria-label="Filter by availability">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All books</SelectItem>
              <SelectItem value="available">Available to borrow</SelectItem>
              <SelectItem value="checked-out">On loan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {categories.isError && (
          <p className="text-muted-foreground mt-3 text-sm">
            Categories couldn’t load.{" "}
            <button
              className="text-primary underline"
              onClick={() => void categories.refetch()}
            >
              Try categories again
            </button>
          </p>
        )}
        <div className="collection-summary">
          <p aria-live="polite">
            {books.isLoading
              ? "Opening the shelves…"
              : books.isError
                ? "The collection is unavailable"
                : `${books.data?.meta.total ?? 0} ${books.data?.meta.total === 1 ? "book" : "books"}${query ? " found" : " in the collection"}`}
          </p>
          {!user && (
            <p className="catalogue-signup">
              Browse freely.{" "}
              <Link to="/register">
                Join to request a loan
                <ArrowRight size={13} />
              </Link>
            </p>
          )}
        </div>
        {books.isError ? (
          <LoadError onRetry={() => void books.refetch()} />
        ) : books.isLoading ? (
          <div className="book-grid">
            {[0, 1, 2, 3].map((key) => (
              <Skeleton key={key} className="h-80 w-full" />
            ))}
          </div>
        ) : books.data?.data.length ? (
          <>
            <div className="book-grid">
              {books.data.data.map((book) => (
                <article className="book-card catalogue-card" key={book.id}>
                  <div className="book-card-art">
                    <Link
                      to={`/books/${book.id}`}
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      <BookCover book={book} />
                    </Link>
                    <span
                      className={`status-label ${book.is_available ? "" : "gold"}`}
                    >
                      {book.is_available ? "Available" : "On loan"}
                    </span>
                  </div>
                  <div className="book-card-body">
                    <Link to={`/books/${book.id}`}>{book.title}</Link>
                    <p className="book-author">{book.author}</p>
                    <div className="book-meta">
                      <span>{book.category?.name ?? "General collection"}</span>
                    </div>
                    <div className="book-card-actions">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="px-0"
                        asChild
                      >
                        <Link to={`/books/${book.id}`}>
                          View book
                          <ArrowRight size={14} />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <LibraryPagination
              meta={books.data.meta}
              onPage={(page) => change("page", String(page))}
            />
          </>
        ) : (
          <EmptyState
            title={
              params.size
                ? "No matching books"
                : "The shelves are getting ready"
            }
            description={
              params.size
                ? "Try another title, author, or filter."
                : "The library team will add books here soon."
            }
          >
            {params.size > 0 && (
              <Button variant="outline" onClick={() => setParams({})}>
                Clear filters
              </Button>
            )}
          </EmptyState>
        )}
      </div>
    </div>
  );
}

import {
  ArrowLeft,
  ArrowRight,
  Grid2X2,
  List,
  Plus,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import BookCard, { BookSkeleton } from "../../components/BooksPage/BookCard";
import { columns } from "../../components/BooksPage/column";
import { DataTable } from "../../components/BooksPage/data-table";
import { EmptyState, LoadError } from "../../components/empty-state";
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
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import useBooks from "../../hooks/book/useBooks";
import useCategories from "../../hooks/category/useCategories";
import useDebounce from "../../hooks/useDebounce";
import { useAuth } from "../../provider/AuthProvider";

export default function BooksPage() {
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";
  const [view, setView] = useState("cards");
  const [search, setSearch] = useState(query);
  const [category, setCategory] = useState(params.get("category_id") ?? "all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  useEffect(() => {
    setSearch(query);
    setPage(1);
  }, [query]);
  const { data: categories } = useCategories();
  const debounced = useDebounce(search, 350);
  const {
    data: books,
    isLoading,
    isError,
    refetch,
  } = useBooks({ page, title: debounced, category, status });
  const filtered = Boolean(search || category !== "all" || status !== "all");
  const lastPage = Math.max(1, books?.last_page ?? 1);
  return (
    <div className="page">
      <PageHeader
        title="The book collection"
        description="Good books, shared generously. Find the next chapter."
      >
        {user?.role === "admin" && (
          <Button asChild>
            <Link to="/admin/books/add">
              <Plus size={16} />
              Add a book
            </Link>
          </Button>
        )}
      </PageHeader>
      <div className="page-content">
        <div className="collection-toolbar">
          <div className="collection-search">
            <Search size={17} aria-hidden="true" />
            <Input
              aria-label="Search books by title"
              placeholder="Search books by title…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(value);
              setPage(1);
            }}
          >
            <SelectTrigger aria-label="Filter by category">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories?.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger aria-label="Filter by availability">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All availability</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="checked-out">On loan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="collection-summary">
          <p aria-live="polite">
            {isLoading
              ? "Finding your books…"
              : `${(books?.total ?? 0).toLocaleString()} ${(books?.total ?? 0) === 1 ? "book" : "books"}${filtered ? " found" : " in the collection"}`}
          </p>
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(value) => value && setView(value)}
            aria-label="Collection view"
          >
            <ToggleGroupItem value="cards" aria-label="Card view">
              <Grid2X2 size={16} />
            </ToggleGroupItem>
            <ToggleGroupItem value="table" aria-label="Table view">
              <List size={16} />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        {isError ? (
          <LoadError onRetry={() => void refetch()} />
        ) : isLoading ? (
          <div className="book-grid">
            {Array.from({ length: 6 }, (_, index) => (
              <BookSkeleton key={index} />
            ))}
          </div>
        ) : books?.data.length ? (
          <>
            {view === "cards" ? (
              <div className="book-grid">
                {books.data.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <DataTable columns={columns} data={books.data} />
            )}
            <nav aria-label="Book collection pages" className="pagination">
              <p>
                {books.from ?? 0}–{books.to ?? books.data.length} of{" "}
                {books.total.toLocaleString()} books
              </p>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((value) => value - 1)}
                  disabled={page <= 1}
                >
                  <ArrowLeft size={14} />
                  Previous
                </Button>
                <span>
                  {page} / {lastPage}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((value) => value + 1)}
                  disabled={page >= lastPage}
                >
                  Next
                  <ArrowRight size={14} />
                </Button>
              </div>
            </nav>
          </>
        ) : (
          <EmptyState
            title={
              filtered
                ? "No books match just yet"
                : "Make space for the first story"
            }
            description={
              filtered
                ? "Try another title or a different category. Your next read may be nearby."
                : "Add a book to start building a collection your community can share."
            }
          >
            {filtered ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                  setStatus("all");
                  setPage(1);
                }}
              >
                Clear filters
              </Button>
            ) : user?.role === "admin" ? (
              <Button asChild>
                <Link to="/admin/books/add">
                  <Plus size={16} />
                  Add the first book
                </Link>
              </Button>
            ) : null}
          </EmptyState>
        )}
      </div>
    </div>
  );
}

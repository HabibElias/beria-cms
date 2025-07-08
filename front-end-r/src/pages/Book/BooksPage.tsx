import { BookOpen, Grid, List, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import BookCard, { BookSkeleton } from "../../components/BooksPage/BookCard";
import { columns } from "../../components/BooksPage/column";
import { DataTable } from "../../components/BooksPage/data-table";
import { PageHeader } from "../../components/page-header";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Skeleton } from "../../components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import useBooks from "../../hooks/book/useBooks";
import useCategories from "../../hooks/useCategories";
import useDebounce from "../../hooks/useDebounce";
type ViewMode = "table" | "cards";

export default function BooksPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data: categories, isLoading: catIsLoading } = useCategories();
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const { data: books, isLoading: booksIsLoading } = useBooks({
    page,
    title: debouncedSearchTerm,
    category: categoryFilter,
    status: statusFilter,
  });

  const handleNextPage = () => {
    if (books?.data)
      if (books?.data.length > 0) {
        setPage((prevPage) => prevPage + 1);
      }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Book Inventory"
        description="Manage your church library collection"
      >
        <div className="flex items-center space-x-2">
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) => value && setViewMode(value as ViewMode)}
          >
            <ToggleGroupItem value="table" aria-label="Table view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="cards" aria-label="Card view">
              <Grid className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Button asChild>
            <Link to="/books/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </Link>
          </Button>
        </div>
      </PageHeader>

      <div className="px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-6">
            {/* Search and Filters */}
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3/5 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search books by title, author, or ISBN..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => {
                    setPage(1);
                    setSearchTerm(e.target.value);
                  }}
                />
              </div>
              <div className="flex space-x-2 items-end">
                {!catIsLoading ? (
                  <Select
                    value={categoryFilter}
                    onValueChange={(value) => {
                      setPage(1);
                      setCategoryFilter(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="bg-neutral-800 w-35 rounded-md h-10"></div>
                )}
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setPage(1);
                    setStatusFilter(value);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="checked-out">Checked Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {booksIsLoading ? (
              viewMode === "cards" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <BookSkeleton key={index} />
                  ))}
                </div>
              ) : (
                <div className="w-full">
                  <div>
                    <Skeleton className="h-10 rounded mb-4" />
                    {Array.from({ length: 8 }).map((_, idx) => (
                      <Skeleton key={idx} className="h-8 rounded mb-2" />
                    ))}
                  </div>
                </div>
              )
            ) : (
              <>
                {/* Results count */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Showing from {books?.from ?? 0} to {books?.to ?? 0} of{" "}
                    {books?.total} books
                  </p>
                </div>

                {/* Table View */}
                {viewMode === "table" && (
                  <DataTable data={books?.data ?? []} columns={columns} />
                )}

                {/* Card View */}
                {viewMode === "cards" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {books?.data?.map((book) => (
                      <BookCard book={book} key={book.id} />
                    ))}
                  </div>
                )}

                {/* Empty state */}
                {books?.data?.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No books found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm ||
                      categoryFilter !== "all" ||
                      statusFilter !== "all"
                        ? "Try adjusting your search or filters"
                        : "Get started by adding your first book to the library"}
                    </p>
                    <Button asChild>
                      <Link to="/books/add">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Book
                      </Link>
                    </Button>
                  </div>
                )}

                {/* Pagination controls */}
                {books?.data && books?.data?.length > 0 && (
                  <div className="flex justify-between items-center mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {page} of{" "}
                      {Math.ceil((books?.total ?? 0) / (books?.per_page ?? 1))}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={
                        page >=
                        Math.ceil((books?.total ?? 0) / (books?.per_page ?? 1))
                      }
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

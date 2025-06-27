import { useState } from "react"
import { Search, Plus, Edit, Trash2, Grid, List, Eye, BookOpen } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { PageHeader } from "../components/page-header"
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group"
import { Link } from "react-router-dom"

const books = [
  {
    id: 1,
    title: "The Purpose Driven Life",
    author: "Rick Warren",
    isbn: "978-0310205715",
    category: "Christian Living",
    status: "Available",
    location: "A-12",
    dateAdded: "2024-01-15",
    description: "A spiritual journey that will transform your life and help you discover God's amazing plan for you.",
    pages: 334,
    publisher: "Zondervan",
    condition: "Excellent",
    image: "/placeholder.svg?height=200&width=150",
  },
  {
    id: 2,
    title: "Jesus Calling",
    author: "Sarah Young",
    isbn: "978-1591451884",
    category: "Devotional",
    status: "Checked Out",
    location: "B-05",
    dateAdded: "2024-02-03",
    description: "Daily devotions for a deeper relationship with Jesus Christ.",
    pages: 384,
    publisher: "Thomas Nelson",
    condition: "Good",
    image: "/placeholder.svg?height=200&width=150",
  },
  // ... other books
]

type ViewMode = "table" | "cards"

export default function BooksPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm)
    const matchesCategory =
      categoryFilter === "all" || book.category.toLowerCase().replace(/\s+/g, "-") === categoryFilter
    const matchesStatus = statusFilter === "all" || book.status.toLowerCase().replace(/\s+/g, "-") === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Book Inventory" description="Manage your church library collection">
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search books by title, author, or ISBN..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="christian-living">Christian Living</SelectItem>
                    <SelectItem value="devotional">Devotional</SelectItem>
                    <SelectItem value="apologetics">Apologetics</SelectItem>
                    <SelectItem value="christian-fiction">Christian Fiction</SelectItem>
                    <SelectItem value="theology">Theology</SelectItem>
                    <SelectItem value="biography">Biography</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="checked-out">Checked Out</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredBooks.length} of {books.length} books
              </p>
            </div>

            {/* Table View */}
            {viewMode === "table" && (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead className="hidden sm:table-cell">Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Location</TableHead>
                      <TableHead className="hidden lg:table-cell">Condition</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{book.title}</div>
                            <div className="text-sm text-gray-500 sm:hidden">{book.author}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{book.author}</TableCell>
                        <TableCell className="hidden sm:table-cell">{book.category}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              book.status === "Available"
                                ? "default"
                                : book.status === "Checked Out"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {book.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{book.location}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge
                            variant="outline"
                            className={
                              book.condition === "Excellent"
                                ? "text-green-700 border-green-200 dark:text-green-400 dark:border-green-800"
                                : book.condition === "Good"
                                  ? "text-blue-700 border-blue-200 dark:text-blue-400 dark:border-blue-800"
                                  : book.condition === "Fair"
                                    ? "text-yellow-700 border-yellow-200 dark:text-yellow-400 dark:border-yellow-800"
                                    : "text-red-700 border-red-200 dark:text-red-400 dark:border-red-800"
                            }
                          >
                            {book.condition}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" title="View details">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Edit book">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Delete book">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Card View */}
            {viewMode === "cards" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map((book) => (
                  <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-[3/4] relative bg-gray-100">
                      <img
                        src={book.image || "/placeholder.svg"}
                        alt={`Cover of ${book.title}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant={
                            book.status === "Available"
                              ? "default"
                              : book.status === "Checked Out"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {book.status}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg leading-tight line-clamp-2">{book.title}</h3>
                        <p className="text-sm text-gray-600">by {book.author}</p>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{book.category}</span>
                          <span>{book.pages} pages</span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Location: {book.location}</span>
                          <Badge
                            variant="outline"
                            className={
                              book.condition === "Excellent"
                                ? "text-green-700 border-green-200 dark:text-green-400 dark:border-green-800"
                                : book.condition === "Good"
                                  ? "text-blue-700 border-blue-200 dark:text-blue-400 dark:border-blue-800"
                                  : book.condition === "Fair"
                                    ? "text-yellow-700 border-yellow-200 dark:text-yellow-400 dark:border-yellow-800"
                                    : "text-red-700 border-red-200 dark:text-red-400 dark:border-red-800"
                            }
                          >
                            {book.condition}
                          </Badge>
                        </div>

                        {book.description && (
                          <p className="text-xs text-gray-600 line-clamp-2 mt-2">{book.description}</p>
                        )}

                        <div className="flex items-center justify-between pt-2">
                          <div className="text-xs text-gray-500">ISBN: {book.isbn}</div>
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent" title="View details">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button variant="ghost" size="sm" title="Edit book">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Delete book">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty state */}
            {filteredBooks.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Search, Plus, Calendar, User, BookOpen, Clock, Grid, List, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/page-header"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import Link from "next/link"

const checkouts = [
  {
    id: 1,
    memberName: "Sarah Johnson",
    memberEmail: "sarah.johnson@email.com",
    bookTitle: "The Purpose Driven Life",
    bookAuthor: "Rick Warren",
    bookImage: "/placeholder.svg?height=120&width=80",
    checkoutDate: "2024-06-15",
    dueDate: "2024-07-15",
    status: "Active",
    daysRemaining: 19,
    renewalCount: 0,
    maxRenewals: 2,
  },
  {
    id: 2,
    memberName: "Michael Davis",
    memberEmail: "michael.davis@email.com",
    bookTitle: "Jesus Calling",
    bookAuthor: "Sarah Young",
    bookImage: "/placeholder.svg?height=120&width=80",
    checkoutDate: "2024-06-20",
    dueDate: "2024-07-20",
    status: "Active",
    daysRemaining: 24,
    renewalCount: 1,
    maxRenewals: 2,
  },
  {
    id: 3,
    memberName: "David Brown",
    memberEmail: "david.brown@email.com",
    bookTitle: "Mere Christianity",
    bookAuthor: "C.S. Lewis",
    bookImage: "/placeholder.svg?height=120&width=80",
    checkoutDate: "2024-06-10",
    dueDate: "2024-07-10",
    status: "Active",
    daysRemaining: 14,
    renewalCount: 0,
    maxRenewals: 2,
  },
  {
    id: 4,
    memberName: "Lisa Anderson",
    memberEmail: "lisa.anderson@email.com",
    bookTitle: "Crazy Love",
    bookAuthor: "Francis Chan",
    bookImage: "/placeholder.svg?height=120&width=80",
    checkoutDate: "2024-05-25",
    dueDate: "2024-06-25",
    status: "Overdue",
    daysRemaining: -1,
    renewalCount: 2,
    maxRenewals: 2,
  },
  {
    id: 5,
    memberName: "Emily Wilson",
    memberEmail: "emily.wilson@email.com",
    bookTitle: "The Case for Christ",
    bookAuthor: "Lee Strobel",
    bookImage: "/placeholder.svg?height=120&width=80",
    checkoutDate: "2024-06-18",
    dueDate: "2024-06-25",
    status: "Returned",
    returnDate: "2024-06-24",
    renewalCount: 0,
    maxRenewals: 2,
  },
  {
    id: 6,
    memberName: "James Wilson",
    memberEmail: "james.wilson@email.com",
    bookTitle: "The Screwtape Letters",
    bookAuthor: "C.S. Lewis",
    bookImage: "/placeholder.svg?height=120&width=80",
    checkoutDate: "2024-06-22",
    dueDate: "2024-07-22",
    status: "Active",
    daysRemaining: 26,
    renewalCount: 0,
    maxRenewals: 2,
  },
  {
    id: 7,
    memberName: "Maria Garcia",
    memberEmail: "maria.garcia@email.com",
    bookTitle: "Radical",
    bookAuthor: "David Platt",
    bookImage: "/placeholder.svg?height=120&width=80",
    checkoutDate: "2024-05-20",
    dueDate: "2024-06-20",
    status: "Overdue",
    daysRemaining: -6,
    renewalCount: 1,
    maxRenewals: 2,
  },
]

type ViewMode = "table" | "cards"

export default function CheckoutsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredCheckouts = checkouts.filter((checkout) => {
    const matchesSearch =
      checkout.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checkout.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checkout.bookAuthor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checkout.memberEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || checkout.status.toLowerCase().replace(/\s+/g, "-") === statusFilter

    return matchesSearch && matchesStatus
  })

  const getDaysRemainingColor = (daysRemaining: number, status: string) => {
    if (status === "Overdue") return "text-red-600 dark:text-red-400"
    if (daysRemaining <= 3) return "text-orange-600 dark:text-orange-400"
    if (daysRemaining <= 7) return "text-yellow-600 dark:text-yellow-400"
    return "text-green-600 dark:text-green-400"
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Book Check-outs" description="Manage book loans and returns">
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
            <Link href="/checkouts/new">
              <Plus className="h-4 w-4 mr-2" />
              New Check-out
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
                  placeholder="Search by member name, book title, or email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredCheckouts.length} of {checkouts.length} check-outs
              </p>
            </div>

            {/* Table View */}
            {viewMode === "table" && (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Book</TableHead>
                      <TableHead className="hidden sm:table-cell">Checkout Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Renewals</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCheckouts.map((checkout) => (
                      <TableRow key={checkout.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="font-medium truncate">{checkout.memberName}</div>
                              <div className="text-sm text-gray-500 truncate sm:hidden">{checkout.memberEmail}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="font-medium truncate">{checkout.bookTitle}</div>
                              <div className="text-sm text-gray-500 truncate">{checkout.bookAuthor}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            {new Date(checkout.checkoutDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                            <div>
                              {checkout.status === "Returned"
                                ? `Returned ${new Date(checkout.returnDate!).toLocaleDateString()}`
                                : new Date(checkout.dueDate).toLocaleDateString()}
                              {checkout.status !== "Returned" && (
                                <div
                                  className={`text-xs ${getDaysRemainingColor(checkout.daysRemaining, checkout.status)}`}
                                >
                                  {checkout.status === "Overdue"
                                    ? `${Math.abs(checkout.daysRemaining)} days overdue`
                                    : `${checkout.daysRemaining} days left`}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              checkout.status === "Active"
                                ? "default"
                                : checkout.status === "Overdue"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {checkout.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="text-sm text-gray-600">
                            {checkout.renewalCount}/{checkout.maxRenewals}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {checkout.status === "Active" || checkout.status === "Overdue" ? (
                              <>
                                <Button variant="outline" size="sm">
                                  Return
                                </Button>
                                {checkout.renewalCount < checkout.maxRenewals && (
                                  <Button variant="ghost" size="sm">
                                    Renew
                                  </Button>
                                )}
                              </>
                            ) : (
                              <span className="text-sm text-gray-500">Completed</span>
                            )}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCheckouts.map((checkout) => (
                  <Card key={checkout.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex space-x-4">
                        {/* Book Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={checkout.bookImage || "/placeholder.svg"}
                            alt={`Cover of ${checkout.bookTitle}`}
                            className="w-16 h-20 object-cover rounded"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-sm leading-tight line-clamp-2">{checkout.bookTitle}</h3>
                              <p className="text-xs text-gray-600">by {checkout.bookAuthor}</p>
                            </div>
                            <Badge
                              variant={
                                checkout.status === "Active"
                                  ? "default"
                                  : checkout.status === "Overdue"
                                    ? "destructive"
                                    : "secondary"
                              }
                              className="ml-2 flex-shrink-0"
                            >
                              {checkout.status}
                            </Badge>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center text-xs text-gray-600">
                              <User className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{checkout.memberName}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <span className="truncate">{checkout.memberEmail}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dates and Status */}
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Checked out:</span>
                          <span>{new Date(checkout.checkoutDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Due date:</span>
                          <span>
                            {checkout.status === "Returned"
                              ? `Returned ${new Date(checkout.returnDate!).toLocaleDateString()}`
                              : new Date(checkout.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        {checkout.status !== "Returned" && (
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Time remaining:</span>
                            <span className={getDaysRemainingColor(checkout.daysRemaining, checkout.status)}>
                              {checkout.status === "Overdue"
                                ? `${Math.abs(checkout.daysRemaining)} days overdue`
                                : `${checkout.daysRemaining} days left`}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Renewals:</span>
                          <span>
                            {checkout.renewalCount}/{checkout.maxRenewals}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex space-x-2">
                        {checkout.status === "Active" || checkout.status === "Overdue" ? (
                          <>
                            <Button variant="outline" size="sm" className="flex-1">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Return
                            </Button>
                            {checkout.renewalCount < checkout.maxRenewals && (
                              <Button variant="ghost" size="sm">
                                Renew
                              </Button>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center justify-center w-full py-2 text-sm text-gray-500">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Completed
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty state */}
            {filteredCheckouts.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No check-outs found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "No books are currently checked out"}
                </p>
                <Button asChild>
                  <Link href="/checkouts/new">
                    <Plus className="h-4 w-4 mr-2" />
                    New Check-out
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

import {
  BookOpen,
  Calendar,
  Clock,
  Grid,
  List,
  Loader2Icon,
  Mail,
  Phone,
  Plus,
  Search,
  User,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "../../components/page-header";
import { Badge } from "../../components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import useCheckouts from "../../hooks/checkout/useCheckouts";
import type Checkout from "../../models/Checkout";
import { CheckoutBookDialog } from "../../components/sidebar";
import useDeleteCheckout from "../../hooks/checkout/useDeleteCheckout";
import DeleteCheckout from "../../components/BooksPage/DeleteCheckout";
import CheckoutCard from "../../components/BooksPage/CheckoutCard";

type ViewMode = "table" | "cards";

export default function CheckoutsPage() {
  const { data: checkouts, isLoading } = useCheckouts();
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { mutate, isPending } = useDeleteCheckout();

  const getDaysRemainingColor = (daysRemaining: number) => {
    if (daysRemaining <= 0) return "text-red-600 dark:text-red-400";
    if (daysRemaining <= 3) return "text-orange-600 dark:text-orange-400";
    if (daysRemaining <= 7) return "text-yellow-600 dark:text-yellow-400";
    return "text-green-600 dark:text-green-400";
  };

  const getDaysRemaining = (checkout: Checkout) => {
    const now = new Date();
    const returnDate = checkout.return_date
      ? new Date(checkout.return_date)
      : null;
    const daysRemaining = returnDate
      ? Math.ceil(
          (returnDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;

    return daysRemaining;
  };

  const filteredCheckouts = checkouts?.filter((checkout) => {
    const daysRemaining = getDaysRemaining(checkout);

    const matchesSearch =
      checkout.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checkout.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checkout.book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checkout.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      daysRemaining <= 0 === (statusFilter === "false");

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <PageHeader
        title="Book Check-outs"
        description="Manage book loans and returns"
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
          <CheckoutBookDialog
            childButton={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Check-out
              </Button>
            }
          />
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
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredCheckouts?.length} of {checkouts?.length}{" "}
                check-outs
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
                      <TableHead className="hidden sm:table-cell">
                        Checkout Date
                      </TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Renewals
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCheckouts?.map((checkout) => {
                      const daysRemaining = getDaysRemaining(checkout);

                      return (
                        <TableRow key={checkout.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                              <div className="min-w-0">
                                <div className="font-medium truncate">
                                  {checkout.user.name}
                                </div>
                                <div className="text-sm flex items-center gap-2 text-gray-500 truncate ">
                                  <Mail size={15} />
                                  {checkout.user.email}
                                </div>
                                <div className="text-sm flex items-center gap-2 text-gray-500 truncate">
                                  <Phone size={15} />
                                  {checkout.user.phone}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                              <div className="min-w-0">
                                <div className="font-medium truncate">
                                  {checkout.book.title}
                                </div>
                                <div className="text-sm text-gray-500 truncate">
                                  {checkout.book.title}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              {new Date(
                                checkout.created_at
                              ).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                              <div>
                                {(() => {
                                  return (
                                    <div
                                      className={`text-xs ${getDaysRemainingColor(
                                        daysRemaining
                                      )}`}
                                    >
                                      {daysRemaining <= 0
                                        ? `${Math.abs(
                                            daysRemaining
                                          )} days overdue`
                                        : `${daysRemaining} days left`}
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                !(daysRemaining <= 0)
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {!(daysRemaining <= 0) ? "Active" : "Overdue"}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <span className="text-sm text-gray-600">
                              {checkout.renewal_number}/3
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {
                                <>
                                  <Button
                                    onClick={() => {
                                      mutate({ id: checkout.id });
                                    }}
                                    variant="outline"
                                    disabled={isPending}
                                    size="sm"
                                    asChild
                                  >
                                    <DeleteCheckout
                                      isOnMenu
                                      checkout={checkout}
                                    />
                                  </Button>
                                  {checkout.renewal_number < 3 ? (
                                    <Button variant="ghost" size="sm">
                                      Renew
                                    </Button>
                                  ) : (
                                    <span className="text-sm text-gray-500">
                                      Completed
                                    </span>
                                  )}
                                </>
                              }
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Card View */}
            {viewMode === "cards" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCheckouts?.map((checkout) => (
                  <CheckoutCard key={checkout.id} checkout={checkout} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {filteredCheckouts?.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No check-outs found
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "No books are currently checked out"}
                </p>
                <CheckoutBookDialog
                  childButton={
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Check-out
                    </Button>
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

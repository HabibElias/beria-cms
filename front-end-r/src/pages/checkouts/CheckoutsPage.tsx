import { Grid2X2, List, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CheckoutCard from "../../components/BooksPage/CheckoutCard";
import CheckoutRow from "../../components/checkout/CheckoutRow";
import { EmptyState, LoadError } from "../../components/empty-state";
import { PageHeader } from "../../components/page-header";
import { CheckoutBookDialog } from "../../components/sidebar";
import { Input } from "../../components/ui/input";
import { Skeleton } from "../../components/ui/skeleton";
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
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import useCheckouts from "../../hooks/checkout/useCheckouts";
import { useCompactLayout } from "../../hooks/useCompactLayout";
import type Checkout from "../../models/Checkout";

const daysUntilReturn = (checkout: Checkout) =>
  Math.ceil(
    (new Date(checkout.return_date).getTime() - Date.now()) / 86_400_000,
  );

export default function CheckoutsPage() {
  const { data: checkouts = [], isLoading, isError, refetch } = useCheckouts();
  const [params] = useSearchParams();
  const overdue = params.get("filter") === "overdue";
  const [filter, setFilter] = useState(overdue ? "overdue" : "all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("table");
  const compact = useCompactLayout();
  useEffect(() => {
    setFilter(overdue ? "overdue" : "all");
  }, [overdue]);
  const filtered = checkouts.filter(
    (checkout) =>
      `${checkout.user.name} ${checkout.user.email} ${checkout.book.title} ${checkout.book.author}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filter === "all" ||
        (filter === "overdue"
          ? daysUntilReturn(checkout) <= 0
          : daysUntilReturn(checkout) > 0)),
  );
  return (
    <div className="page">
      <PageHeader
        title="Checkouts & returns"
        description="Keep good books moving, and help them find their way home."
      >
        <CheckoutBookDialog />
      </PageHeader>
      <div className="page-content">
        <div className="collection-toolbar">
          <div className="collection-search">
            <Search size={17} />
            <Input
              aria-label="Search checkouts"
              placeholder="Find a book or a reader…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger aria-label="Filter checkouts">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All checkouts</SelectItem>
              <SelectItem value="active">On loan</SelectItem>
              <SelectItem value="overdue">Due & overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="collection-summary">
          <p aria-live="polite">
            {isLoading
              ? "Checking the circulation desk…"
              : `${filtered.length} ${filtered.length === 1 ? "checkout" : "checkouts"} on this page`}
          </p>
          {!compact && (
            <ToggleGroup
              type="single"
              value={view}
              onValueChange={(value) => value && setView(value)}
            >
              <ToggleGroupItem value="table" aria-label="Table view">
                <List size={16} />
              </ToggleGroupItem>
              <ToggleGroupItem value="cards" aria-label="Card view">
                <Grid2X2 size={16} />
              </ToggleGroupItem>
            </ToggleGroup>
          )}
        </div>
        {isError ? (
          <LoadError onRetry={() => void refetch()} />
        ) : isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : filtered.length ? (
          compact || view === "cards" ? (
            <div className="category-grid">
              {filtered.map((checkout) => (
                <CheckoutCard key={checkout.id} checkout={checkout} />
              ))}
            </div>
          ) : (
            <div className="table-frame">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reader</TableHead>
                    <TableHead>Book</TableHead>
                    <TableHead>Return by</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden text-right lg:table-cell">
                      Renewals
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((checkout) => (
                    <CheckoutRow
                      key={checkout.id}
                      checkout={checkout}
                      daysRemaining={daysUntilReturn(checkout)}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )
        ) : (
          <EmptyState
            title={
              search || filter !== "all"
                ? "No matching checkouts"
                : "All books are home"
            }
            description={
              search || filter !== "all"
                ? "Try another reader, title, or checkout filter."
                : "When a reader borrows a book, record its journey here."
            }
          >
            <CheckoutBookDialog />
          </EmptyState>
        )}
      </div>
    </div>
  );
}

import { Check, Loader2, Search, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BookCover } from "../../components/book-cover";
import { EmptyState, LoadError } from "../../components/empty-state";
import { LibraryPagination } from "../../components/library-pagination";
import { PageHeader } from "../../components/page-header";
import { RequestStatusLabel } from "../../components/request-status";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Skeleton } from "../../components/ui/skeleton";
import { Textarea } from "../../components/ui/textarea";
import useDebounce from "../../hooks/useDebounce";
import { useLoanAction, useLoanRequests } from "../../hooks/useLibrary";
import type { LoanRequest } from "../../models/Library";

const futureDate = (days: number) =>
  new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);

export default function LoanRequestsPage() {
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const query = useDebounce(search, 300);
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ page: String(page), q: query });
  if (filter !== "all") params.set("status", filter);
  const requests = useLoanRequests({ admin: true, params });
  const [review, setReview] = useState<{
    request: LoanRequest;
    approve: boolean;
  } | null>(null);
  const [date, setDate] = useState(futureDate(14));
  const [note, setNote] = useState("");
  const action = useLoanAction();
  function choose(request: LoanRequest, approve: boolean) {
    setReview({ request, approve });
    setNote("");
    setDate(futureDate(14));
  }
  return (
    <div className="page">
      <PageHeader
        title="Loan requests"
        description="Help a reader find their next chapter. Review requests before issuing a book."
      />
      <div className="page-content">
        <div className="collection-toolbar">
          <div className="collection-search">
            <Search size={17} />
            <Input
              aria-label="Search loan requests"
              placeholder="Find a book, name, or email…"
              value={search}
              maxLength={120}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={filter}
            onValueChange={(value) => {
              setFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger aria-label="Filter loan requests">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Awaiting review</SelectItem>
              <SelectItem value="all">All requests</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="collection-summary">
          <p aria-live="polite">
            {requests.isLoading
              ? "Checking the request desk…"
              : requests.isError
                ? "Requests are unavailable"
                : `${requests.data?.meta.total ?? 0} ${requests.data?.meta.total === 1 ? "request" : "requests"}${filter === "pending" ? " awaiting review" : " in this view"}`}
          </p>
        </div>
        {requests.isError ? (
          <LoadError onRetry={() => void requests.refetch()} />
        ) : requests.isLoading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((key) => (
              <Skeleton key={key} className="h-36 w-full" />
            ))}
          </div>
        ) : requests.data?.data.length ? (
          <>
            <div className="admin-request-list">
              {requests.data.data.map((request) => (
                <article className="admin-request" key={request.id}>
                  <div className="admin-request-book">
                    <BookCover book={request.book} small />
                    <div>
                      <Link to={`/admin/books/${request.book.id}`}>
                        {request.book.title}
                      </Link>
                      <p>{request.book.author}</p>
                    </div>
                    <RequestStatusLabel request={request} />
                  </div>
                  <div className="admin-request-reader">
                    <strong>{request.user?.name ?? "Library reader"}</strong>
                    <span>{request.user?.email}</span>
                    <span>{request.user?.phone}</span>
                    <small>
                      Requested{" "}
                      {new Date(request.created_at).toLocaleDateString(
                        undefined,
                        { month: "short", day: "numeric", year: "numeric" },
                      )}
                    </small>
                  </div>
                  {request.message && (
                    <p className="request-message">
                      <strong>Reader’s note</strong>
                      {request.message}
                    </p>
                  )}
                  {request.admin_note && (
                    <p className="request-message">
                      <strong>Library response</strong>
                      {request.admin_note}
                    </p>
                  )}
                  {request.status === "pending" && (
                    <div className="admin-request-actions">
                      <p>
                        {request.book.is_available
                          ? "Copy available · approval creates a checkout."
                          : "This copy is on loan. Approve after it returns."}
                      </p>
                      <div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => choose(request, false)}
                          aria-label={`Decline request from ${request.user?.name} for ${request.book.title}`}
                        >
                          <X size={15} />
                          Decline
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!request.book.is_available}
                          onClick={() => choose(request, true)}
                          aria-label={`Approve request from ${request.user?.name} for ${request.book.title}`}
                        >
                          <Check size={15} />
                          Approve
                        </Button>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
            <LibraryPagination meta={requests.data.meta} onPage={setPage} />
          </>
        ) : (
          <EmptyState
            title={
              filter === "pending" && !search
                ? "The request desk is clear"
                : "No matching requests"
            }
            description={
              filter === "pending" && !search
                ? "When a reader requests a book, you can review it here."
                : "Try another search or request status."
            }
          />
        )}
      </div>
      <Dialog
        open={!!review}
        onOpenChange={(open) => {
          if (!open && !action.isPending) setReview(null);
        }}
      >
        <DialogContent showCloseButton={!action.isPending}>
          <DialogHeader>
            <DialogTitle>
              {review?.approve
                ? "Approve and check out this book?"
                : "Decline this loan request?"}
            </DialogTitle>
            <DialogDescription>
              {review?.request.user?.name} requested “
              {review?.request.book.title}”.{" "}
              {review?.approve
                ? "Approval starts the loan and makes the copy unavailable to other readers."
                : "The reader will see your decision and any note below."}
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              if (!review) return;
              action.mutate(
                {
                  path: `/admin/loan-requests/${review.request.id}/${review.approve ? "approve" : "decline"}`,
                  data: {
                    admin_note: note.trim() || null,
                    ...(review.approve ? { return_date: date } : {}),
                  },
                  success: review.approve
                    ? "Request approved. The book is now checked out."
                    : "The request has been declined.",
                },
                { onSuccess: () => setReview(null) },
              );
            }}
          >
            {review?.approve && (
              <div className="field">
                <Label htmlFor="approval-return-date">Return by</Label>
                <Input
                  id="approval-return-date"
                  type="date"
                  required
                  min={futureDate(8)}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </div>
            )}
            <div className="field">
              <Label htmlFor="review-note">Note to the reader (optional)</Label>
              <Textarea
                id="review-note"
                value={note}
                maxLength={400}
                rows={3}
                onChange={(event) => setNote(event.target.value)}
                placeholder={
                  review?.approve
                    ? "When and where can they collect the book?"
                    : "Help the reader understand the decision."
                }
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={action.isPending}
                onClick={() => setReview(null)}
              >
                Keep reviewing
              </Button>
              <Button
                type="submit"
                variant={review?.approve ? "default" : "destructive"}
                disabled={action.isPending}
              >
                {action.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : review?.approve ? (
                  "Approve & check out"
                ) : (
                  "Decline request"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

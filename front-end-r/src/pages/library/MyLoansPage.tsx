import { ArrowRight, CalendarDays, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BookCover } from "../../components/book-cover";
import { EmptyState, LoadError } from "../../components/empty-state";
import { LibraryPagination } from "../../components/library-pagination";
import { PageHeader } from "../../components/page-header";
import { RequestStatusLabel } from "../../components/request-status";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Skeleton } from "../../components/ui/skeleton";
import {
  useLoanAction,
  useLoanRequests,
  useReaderLoans,
} from "../../hooks/useLibrary";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function MyLoansPage() {
  const loans = useReaderLoans();
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [cancelId, setCancelId] = useState<number | null>(null);
  const params = new URLSearchParams({ page: String(page) });
  if (filter !== "all") params.set("status", filter);
  const requests = useLoanRequests({ params });
  const cancel = useLoanAction();
  return (
    <div className="page">
      <PageHeader
        title="My loans & requests"
        description="Books you’re spending time with, and chapters still to come."
      >
        <Button variant="outline" asChild>
          <Link to="/books">
            Browse books
            <ArrowRight size={16} />
          </Link>
        </Button>
      </PageHeader>
      <div className="page-content reader-account-content">
        <section aria-labelledby="my-current-loans">
          <div className="section-title">
            <div>
              <h2 id="my-current-loans">With you right now</h2>
              <p>Return books to the library team by their due date.</p>
            </div>
          </div>
          {loans.isError ? (
            <LoadError
              message="We couldn’t load your current loans."
              onRetry={() => void loans.refetch()}
            />
          ) : loans.isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : loans.data?.length ? (
            <div className="reader-loans-grid">
              {loans.data.map((loan) => {
                const overdue =
                  new Date(loan.return_date).getTime() <
                  new Date().setHours(0, 0, 0, 0);
                return (
                  <article className="reader-loan" key={loan.id}>
                    <BookCover book={loan.book} small />
                    <div>
                      <Link to={`/books/${loan.book.id}`}>
                        {loan.book.title}
                      </Link>
                      <p>{loan.book.author}</p>
                      <span
                        className={`loan-due ${overdue ? "is-overdue" : ""}`}
                      >
                        <CalendarDays size={14} />
                        {overdue ? "Overdue · " : "Due "}
                        {formatDate(loan.return_date)}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="quiet-empty">
              <p>No books on loan yet. Find something you’d like to read.</p>
              <Link to="/books">
                Explore the collection
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </section>
        <section aria-labelledby="my-request-history">
          <div className="section-title">
            <div>
              <h2 id="my-request-history">Your requests</h2>
              <p>
                You can have up to three current loans and pending requests.
              </p>
            </div>
            <Select
              value={filter}
              onValueChange={(value) => {
                setFilter(value);
                setPage(1);
                setCancelId(null);
              }}
            >
              <SelectTrigger aria-label="Filter my requests" className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All requests</SelectItem>
                <SelectItem value="pending">Awaiting review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {requests.isError ? (
            <LoadError
              message="We couldn’t load your requests."
              onRetry={() => void requests.refetch()}
            />
          ) : requests.isLoading ? (
            <div className="space-y-4">
              {[0, 1].map((key) => (
                <Skeleton key={key} className="h-28 w-full" />
              ))}
            </div>
          ) : requests.data?.data.length ? (
            <>
              <div className="request-history">
                {requests.data.data.map((request) => (
                  <article className="reader-request" key={request.id}>
                    <div className="request-identity">
                      <BookCover book={request.book} small />
                      <div>
                        <Link to={`/books/${request.book.id}`}>
                          {request.book.title}
                        </Link>
                        <p>Requested {formatDate(request.created_at)}</p>
                      </div>
                      <RequestStatusLabel request={request} />
                    </div>
                    {request.message && (
                      <p className="request-message">
                        <strong>Your note</strong>
                        {request.message}
                      </p>
                    )}
                    {request.admin_note && (
                      <p className="request-message">
                        <strong>From the library</strong>
                        {request.admin_note}
                      </p>
                    )}
                    {request.status === "pending" && (
                      <div className="request-cancel">
                        {cancelId === request.id ? (
                          <>
                            <span>Cancel this request?</span>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={cancel.isPending}
                              onClick={() => setCancelId(null)}
                            >
                              Keep request
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={cancel.isPending}
                              onClick={() =>
                                cancel.mutate(
                                  {
                                    method: "delete",
                                    path: `/loan-requests/${request.id}`,
                                    success: "Your request has been cancelled.",
                                  },
                                  { onSuccess: () => setCancelId(null) },
                                )
                              }
                            >
                              {cancel.isPending ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                "Confirm cancellation"
                              )}
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCancelId(request.id)}
                            aria-label={`Cancel request for ${request.book.title}`}
                          >
                            Cancel request
                          </Button>
                        )}
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
                filter === "all"
                  ? "Your next chapter starts on the shelves"
                  : "No requests in this view"
              }
              description={
                filter === "all"
                  ? "Choose an available book and send the library team a loan request."
                  : "Change the filter to see your other requests."
              }
            >
              {filter === "all" ? (
                <Button variant="outline" asChild>
                  <Link to="/books">Find a book</Link>
                </Button>
              ) : (
                <Button variant="outline" onClick={() => setFilter("all")}>
                  Show all requests
                </Button>
              )}
            </EmptyState>
          )}
        </section>
      </div>
    </div>
  );
}

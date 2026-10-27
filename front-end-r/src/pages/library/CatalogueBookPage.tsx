import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { isAxiosError } from "axios";
import { BookCover } from "../../components/book-cover";
import { LoadError } from "../../components/empty-state";
import NotFound from "../../components/not-found";
import { PageHeader } from "../../components/page-header";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Skeleton } from "../../components/ui/skeleton";
import { Textarea } from "../../components/ui/textarea";
import {
  useCatalogueBook,
  useLoanAction,
  useLoanRequests,
} from "../../hooks/useLibrary";
import { useAuth } from "../../provider/AuthProvider";

export default function CatalogueBookPage() {
  const { id = "" } = useParams();
  const bookQuery = useCatalogueBook(id);
  const { user, fetchState } = useAuth();
  const requests = useLoanRequests({
    params: new URLSearchParams({ book_id: id, status: "pending" }),
    enabled: !!user && user.role !== "admin",
  });
  const action = useLoanAction();
  const [message, setMessage] = useState("");
  const pending = requests.data?.data[0];
  if (isAxiosError(bookQuery.error) && bookQuery.error.response?.status === 404)
    return <NotFound />;
  return (
    <div className="page">
      <PageHeader
        title={bookQuery.data?.title ?? "Book details"}
        description={
          bookQuery.data?.author
            ? `By ${bookQuery.data.author}`
            : "A closer look at the collection."
        }
      >
        <Button asChild variant="outline">
          <Link to="/books">
            <ArrowLeft size={15} />
            Back to books
          </Link>
        </Button>
      </PageHeader>
      <div className="page-content">
        {bookQuery.isError ? (
          <LoadError onRetry={() => void bookQuery.refetch()} />
        ) : bookQuery.isLoading ? (
          <div className="reader-book-detail">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        ) : bookQuery.data ? (
          <div className="reader-book-detail">
            <div className="book-detail-art">
              <BookCover book={bookQuery.data} />
            </div>
            <div className="reader-book-information">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`status-label ${bookQuery.data.is_available ? "" : "gold"}`}
                >
                  {bookQuery.data.is_available
                    ? "Available to borrow"
                    : "Currently on loan"}
                </span>
                <span className="text-muted-foreground text-sm">
                  {bookQuery.data.category?.name ?? "General collection"}
                </span>
              </div>
              <h2>About this book</h2>
              <p className="reader-description">
                {bookQuery.data.description ||
                  "Ask the library team for more about this title."}
              </p>
              <dl className="reader-book-metadata">
                <div>
                  <dt>Publisher</dt>
                  <dd>{bookQuery.data.publisher || "—"}</dd>
                </div>
                <div>
                  <dt>Edition year</dt>
                  <dd>{bookQuery.data.published_year || "—"}</dd>
                </div>
                <div>
                  <dt>Pages</dt>
                  <dd>{bookQuery.data.pages || "—"}</dd>
                </div>
              </dl>
              <section className="borrow-panel" aria-labelledby="borrow-title">
                <h2 id="borrow-title">Take the next chapter home</h2>
                {fetchState === "notReady" ? (
                  <Skeleton className="mt-4 h-16 w-full" />
                ) : user?.role === "admin" ? (
                  <>
                    <p>
                      Manage this title or record a checkout in the admin
                      workspace.
                    </p>
                    <Button asChild className="mt-4">
                      <Link to={`/admin/books/${id}`}>
                        Manage book
                        <ArrowRight size={16} />
                      </Link>
                    </Button>
                  </>
                ) : pending ? (
                  <div className="request-sent">
                    <Check size={18} />
                    <div>
                      <strong>Request sent</strong>
                      <p>
                        The library team will review it. You can follow the
                        decision in your requests.
                      </p>
                      <Link to="/my-loans">
                        View my requests
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                ) : !bookQuery.data.is_available ? (
                  <p>
                    This copy is with another reader. Please check back after it
                    returns.
                  </p>
                ) : !user ? (
                  <>
                    <p>
                      Sign in or create an account to request this book. The
                      library team will confirm your loan.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Button asChild>
                        <Link
                          to={`/login?next=${encodeURIComponent(`/books/${id}`)}`}
                        >
                          Sign in to request
                          <ArrowRight size={15} />
                        </Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link
                          to={`/register?next=${encodeURIComponent(`/books/${id}`)}`}
                        >
                          Create an account
                        </Link>
                      </Button>
                    </div>
                  </>
                ) : requests.isError ? (
                  <LoadError
                    message="We couldn’t check your existing requests."
                    onRetry={() => void requests.refetch()}
                  />
                ) : requests.isLoading ? (
                  <Skeleton className="mt-4 h-16 w-full" />
                ) : (
                  <form
                    className="loan-request-form"
                    onSubmit={(event) => {
                      event.preventDefault();
                      action.mutate({
                        path: "/loan-requests",
                        data: {
                          book_id: Number(id),
                          message: message.trim() || null,
                        },
                        success: "Your loan request has been sent.",
                      });
                    }}
                  >
                    <p>
                      The library team reviews each request before confirming a
                      loan. Requests don’t reserve a copy.
                    </p>
                    <div className="field">
                      <Label htmlFor="loan-message">
                        A note for the library (optional)
                      </Label>
                      <Textarea
                        id="loan-message"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        maxLength={400}
                        rows={2}
                        placeholder="Anything you’d like the team to know?"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={
                        action.isPending ||
                        (action.isSuccess && requests.isFetching)
                      }
                      aria-busy={action.isPending}
                    >
                      {action.isPending ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Sending request…
                        </>
                      ) : (
                        <>
                          Request a loan
                          <ArrowRight size={16} />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </section>
            </div>
          </div>
        ) : (
          <NotFound />
        )}
      </div>
    </div>
  );
}

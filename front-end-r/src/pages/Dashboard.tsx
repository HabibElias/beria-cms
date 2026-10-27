import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { BookCover } from "../components/book-cover";
import { EmptyState, LoadError } from "../components/empty-state";
import { PageHeader } from "../components/page-header";
import { CheckoutBookDialog } from "../components/sidebar";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import useAnalytics from "../hooks/useAnalytics";
import { useAuth } from "../provider/AuthProvider";

function timeAgo(value: string) {
  const minutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(value).getTime()) / 60_000),
  );
  if (!Number.isFinite(minutes)) return "";
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} hr ago`;
  const days = Math.floor(minutes / 1440);
  return days === 1
    ? "Yesterday"
    : days < 7
      ? `${days} days ago`
      : new Date(value).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
}

export default function Dashboard() {
  const { data, isLoading, isError, isFetching, refetch } = useAnalytics();
  const { user } = useAuth();
  const books = data?.total_books ?? 0;
  const loans = data?.total_checkouts ?? 0;
  const available = Math.max(0, books - loans);
  const popular = (data?.popular_books ?? [])
    .filter((row) => row.book)
    .slice(0, 5);
  const maxBorrows = Math.max(1, ...popular.map((row) => row.borrow_count));
  const metrics = [
    {
      label: "Books in the collection",
      value: books,
      link: "/books",
      action: "Explore the shelves",
    },
    {
      label: "Library members",
      value: data?.total_members ?? 0,
      link: "/members",
      action: "Meet your readers",
    },
    {
      label: "Books on loan",
      value: loans,
      link: "/checkouts",
      action: "See current checkouts",
    },
    {
      label: "Overdue books",
      value: data?.overdue_books ?? 0,
      link: "/checkouts?filter=overdue",
      action: "Review returns",
    },
  ];
  return (
    <div className="page">
      <PageHeader
        title="Library overview"
        description={`Good to see you${user?.name ? `, ${user.name.split(" ")[0]}` : ""}. Here’s how the library is doing.`}
      >
        <CheckoutBookDialog />
      </PageHeader>
      <div className="page-content">
        {isError ? (
          <LoadError onRetry={() => void refetch()} />
        ) : (
          <>
            <dl className="metric-strip">
              {metrics.map((metric) => (
                <div className="metric" key={metric.label}>
                  <dt>{metric.label}</dt>
                  <dd>
                    {isLoading ? (
                      <Skeleton className="h-9 w-12" />
                    ) : (
                      metric.value.toLocaleString()
                    )}
                  </dd>
                  <Link to={metric.link}>
                    {metric.action}
                    <ArrowUpRight size={12} />
                  </Link>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex items-center justify-between gap-3">
              <p className="page-date">
                {new Date().toLocaleDateString("en", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => void refetch()}
                disabled={isFetching}
                aria-label="Refresh library overview"
              >
                <RefreshCw
                  size={14}
                  className={isFetching ? "animate-spin" : ""}
                />
                Refresh
              </Button>
            </div>
            {!isLoading && (data?.overdue_books ?? 0) > 0 && (
              <div className="attention-note mt-4">
                <CalendarClock size={18} />
                <p>
                  {data!.overdue_books}{" "}
                  {data!.overdue_books === 1 ? "book is" : "books are"} ready
                  for a return reminder.
                </p>
                <Link to="/checkouts?filter=overdue">
                  Review overdue
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
            <div className="dashboard-grid">
              <section aria-labelledby="recent-activity">
                <div className="section-title">
                  <div>
                    <h2 id="recent-activity">Around the library</h2>
                    <p>Recent checkouts and books welcomed home.</p>
                  </div>
                  <Link to="/checkouts">
                    View all
                    <ArrowRight size={14} />
                  </Link>
                </div>
                {isLoading ? (
                  <div className="space-y-6">
                    {Array.from({ length: 4 }, (_, i) => (
                      <Skeleton className="h-12 w-full" key={i} />
                    ))}
                  </div>
                ) : data?.recent_activities?.length ? (
                  <div className="activity-list">
                    {data.recent_activities.map((activity, index) => (
                      <div
                        className="activity-row"
                        key={`${activity.type}-${activity.id}-${index}`}
                      >
                        <span className="activity-symbol">
                          {activity.type === "return" ? (
                            <ArrowDownLeft size={20} strokeWidth={1.5} />
                          ) : (
                            <ArrowUpRight size={20} strokeWidth={1.5} />
                          )}
                        </span>
                        <div>
                          <p>
                            {activity.book ? (
                              <Link to={`/books/${activity.book.id}`}>
                                {activity.book.title}
                              </Link>
                            ) : (
                              "Book no longer in the collection"
                            )}
                          </p>
                          <small>
                            {activity.user?.name ?? "Former library member"} ·{" "}
                            {timeAgo(activity.created_at)}
                          </small>
                        </div>
                        <span
                          className={`status-label ${activity.type === "checkout" ? "gold" : ""}`}
                        >
                          {activity.type === "return"
                            ? "Returned"
                            : "Checked out"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="Every story starts somewhere"
                    description="The next checkout or return will appear here."
                  >
                    <CheckoutBookDialog
                      childButton={
                        <Button variant="outline" size="sm">
                          <Plus size={14} />
                          Record a checkout
                        </Button>
                      }
                    />
                  </EmptyState>
                )}
              </section>
              <aside className="dashboard-aside">
                <section>
                  <div className="section-title">
                    <div>
                      <h2>Reader favourites</h2>
                      <p>Most returned books this month.</p>
                    </div>
                  </div>
                  {isLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }, (_, i) => (
                        <Skeleton className="h-12 w-full" key={i} />
                      ))}
                    </div>
                  ) : popular.length ? (
                    <div className="popular-list">
                      {popular.map(({ book, borrow_count }) => (
                        <Link
                          className="popular-book"
                          to={`/books/${book.id}`}
                          key={book.id}
                        >
                          <BookCover book={book} small />
                          <div>
                            <strong>{book.title}</strong>
                            <small>{book.author}</small>
                            <div className="popular-bar">
                              <span
                                style={{
                                  width: `${(borrow_count / maxBorrows) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                          <span title={`${borrow_count} returns this month`}>
                            {borrow_count}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm leading-7">
                      As books are borrowed and returned, your community’s
                      favourites will find their place here.
                    </p>
                  )}
                </section>
                <section className="shelf-summary">
                  <h2>Room for another reader</h2>
                  <p>
                    {isLoading
                      ? "Checking the shelves…"
                      : books
                        ? `${available.toLocaleString()} ${available === 1 ? "book is" : "books are"} available to borrow.`
                        : "Your collection is ready for its first book."}
                  </p>
                  <div
                    className="shelf-track"
                    role="img"
                    aria-label={
                      books
                        ? `${available} available books and ${loans} books on loan`
                        : "No books in the collection"
                    }
                  >
                    <span
                      className="shelf-available"
                      style={{
                        width: `${books ? (available / books) * 100 : 0}%`,
                      }}
                    />
                    <span
                      className="shelf-loaned"
                      style={{ width: `${books ? (loans / books) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="shelf-legend">
                    <span>
                      <i />
                      On the shelves
                    </span>
                    <span>
                      <i />
                      With a reader
                    </span>
                  </div>
                  <Button
                    asChild
                    variant="link"
                    className="mt-3 h-auto p-0 text-xs"
                  >
                    <Link
                      to={
                        books || user?.role !== "admin"
                          ? "/books"
                          : "/books/add"
                      }
                    >
                      {books ? "Find the next read" : "Build the collection"}
                      <ArrowRight size={14} />
                    </Link>
                  </Button>
                </section>
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

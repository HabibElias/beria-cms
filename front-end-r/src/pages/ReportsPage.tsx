import { ArrowUpRight, Download, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { BookCover } from "../components/book-cover";
import { EmptyState, LoadError } from "../components/empty-state";
import { PageHeader } from "../components/page-header";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import useAnalytics from "../hooks/useAnalytics";

function csvCell(value: string | number) {
  const text = String(value);
  // Keep titles and author names as text when opened in spreadsheet software.
  const safe = /^\s*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}

export default function ReportsPage() {
  const { data, isLoading, isError, isFetching, refetch, dataUpdatedAt } =
    useAnalytics();
  const books = data?.total_books ?? 0;
  const loans = data?.total_checkouts ?? 0;
  const available = Math.max(0, books - loans);
  const popular = (data?.popular_books ?? []).filter((row) => row.book);
  const metrics = [
    { label: "Books in the collection", value: books, link: "/admin/books" },
    {
      label: "Library members",
      value: data?.total_members ?? 0,
      link: "/admin/members",
    },
    { label: "Books on loan", value: loans, link: "/admin/checkouts" },
    {
      label: "Overdue books",
      value: data?.overdue_books ?? 0,
      link: "/admin/checkouts?filter=overdue",
    },
  ];

  function exportSummary() {
    if (!data || isError) return;
    const rows: (string | number)[][] = [
      ["Berea library summary", new Date(dataUpdatedAt).toISOString()],
      ["Measure", "Count"],
      ...metrics.map(({ label, value }) => [label, value]),
      ["Books available", available],
      [],
      ["Most returned books this month"],
      ["Title", "Author", "Returns"],
      ...popular.map(({ book, borrow_count }) => [
        book.title,
        book.author,
        borrow_count,
      ]),
    ];
    const blob = new Blob(
      ["\uFEFF", rows.map((row) => row.map(csvCell).join(",")).join("\r\n")],
      { type: "text/csv;charset=utf-8;" },
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `berea-library-summary-${new Date(dataUpdatedAt).toISOString().slice(0, 10)}.csv`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("Library summary downloaded.");
  }

  return (
    <div className="page">
      <PageHeader
        title="Library reports"
        description="A clear picture of the collection, ready to share."
      >
        <Button
          onClick={exportSummary}
          disabled={!data || isLoading || isError}
        >
          <Download size={16} />
          Export summary
        </Button>
      </PageHeader>
      <div className="page-content">
        {isError ? (
          <LoadError onRetry={() => void refetch()} />
        ) : (
          <>
            <dl className="metric-strip">
              {metrics.map(({ label, value, link }) => (
                <div className="metric" key={label}>
                  <dt>{label}</dt>
                  <dd>
                    {isLoading ? (
                      <Skeleton className="h-9 w-12" />
                    ) : (
                      value.toLocaleString()
                    )}
                  </dd>
                  <Link to={link}>
                    View records
                    <ArrowUpRight size={12} />
                  </Link>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="page-date">
                {dataUpdatedAt
                  ? `Snapshot updated ${new Date(dataUpdatedAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}`
                  : "Preparing your library summary…"}
              </p>
              <Button
                variant="ghost"
                size="sm"
                disabled={isFetching}
                onClick={() => void refetch()}
              >
                <RefreshCw
                  size={14}
                  className={isFetching ? "animate-spin" : ""}
                />
                Refresh summary
              </Button>
            </div>
            <div className="dashboard-grid">
              <section aria-labelledby="returned-books">
                <div className="section-title">
                  <div>
                    <h2 id="returned-books">Reader favourites</h2>
                    <p>Most returned books this month.</p>
                  </div>
                </div>
                {isLoading ? (
                  <div className="space-y-5">
                    {[0, 1, 2].map((key) => (
                      <Skeleton key={key} className="h-14 w-full" />
                    ))}
                  </div>
                ) : popular.length ? (
                  <div className="activity-list">
                    {popular.map(({ book, borrow_count }) => (
                      <div className="activity-row" key={book.id}>
                        <BookCover book={book} small />
                        <div>
                          <p>
                            <Link to={`/admin/books/${book.id}`}>{book.title}</Link>
                          </p>
                          <small>{book.author}</small>
                        </div>
                        <span className="text-muted-foreground text-right text-sm tabular-nums">
                          {Number(borrow_count).toLocaleString()}{" "}
                          {Number(borrow_count) === 1 ? "return" : "returns"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="A new chapter for the shelves"
                    description="Books returned this month will appear in this report."
                  />
                )}
              </section>
              <aside className="dashboard-aside">
                <section>
                  <div className="section-title">
                    <div>
                      <h2>On the shelves</h2>
                      <p>The collection’s availability right now.</p>
                    </div>
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-24 w-full" />
                  ) : (
                    <>
                      <div
                        className="shelf-track"
                        role="img"
                        aria-label={`${available} books available, ${loans} on loan`}
                      >
                        <span
                          className="shelf-available"
                          style={{
                            width: `${books ? (available / books) * 100 : 0}%`,
                          }}
                        />
                        <span
                          className="shelf-loaned"
                          style={{
                            width: `${books ? (loans / books) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <div className="shelf-legend">
                        <span>
                          <i />
                          {available.toLocaleString()} available
                        </span>
                        <span>
                          <i />
                          {loans.toLocaleString()} on loan
                        </span>
                      </div>
                    </>
                  )}
                </section>
                <p className="text-muted-foreground mt-8 text-sm leading-7">
                  The export contains these current totals and this month’s
                  recorded returns. Historical monthly trends are not available
                  yet.
                </p>
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
